'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth';

// Helper to get local date string YYYY-MM-DD
function getLocalDateString(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export type VISUALIZATION_RANGE = '7d' | '30d' | 'thisMonth' | 'lastMonth' | 'thisYear' | 'lastYear';

// Helper to safely get (and repair duplicates) the global KPI record
async function getOrRepairGlobalRecord(date: Date) {
    // 1. Find ALL matches
    const records = await prisma.kPIRecord.findMany({
        where: { date, userId: null }
    });

    if (records.length === 0) {
        // Create new
        return await prisma.kPIRecord.create({
            data: { date, userId: null }
        });
    }

    if (records.length === 1) {
        return records[0];
    }

    // 2. Handle Duplicates (Self-Heal)
    // Reduce to max values
    console.log(`Fixing ${records.length} duplicate KPI records for ${date.toISOString()}`);

    // Sort by latest update to pick a "primary" to keep
    const sorted = records.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    const primary = sorted[0];
    const others = sorted.slice(1);

    const mergedData = {
        calls: 0, offers: 0, leads: 0, appointments: 0, conversations: 0
    };

    records.forEach(r => {
        mergedData.calls = Math.max(mergedData.calls, r.calls);
        mergedData.offers = Math.max(mergedData.offers, r.offers);
        mergedData.leads = Math.max(mergedData.leads, r.leads);
        mergedData.appointments = Math.max(mergedData.appointments, r.appointments);
        mergedData.conversations = Math.max(mergedData.conversations, r.conversations);
    });

    // Update primary
    const updated = await prisma.kPIRecord.update({
        where: { id: primary.id },
        data: mergedData
    });

    // Delete others
    for (const r of others) {
        await prisma.kPIRecord.delete({ where: { id: r.id } }).catch(e => console.error(e));
    }

    return updated;
}

// userId argument is deprecated but kept for compatibility. We perform global lookups (userId: null).
export async function getKPIData(range: VISUALIZATION_RANGE = '30d', userId?: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Calculate Date Range for History
    let startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    let endDate = new Date(); // Defaults to today/now
    endDate.setHours(23, 59, 59, 999);

    switch (range) {
        case '7d': startDate.setDate(today.getDate() - 7); break;
        case '30d': startDate.setDate(today.getDate() - 30); break;
        case 'thisMonth': startDate = new Date(today.getFullYear(), today.getMonth(), 1); break;
        case 'lastMonth':
            startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            endDate = new Date(today.getFullYear(), today.getMonth(), 0);
            break;
        case 'thisYear': startDate = new Date(today.getFullYear(), 0, 1); break;
        case 'lastYear':
            startDate = new Date(today.getFullYear() - 1, 0, 1);
            endDate = new Date(today.getFullYear() - 1, 11, 31);
            break;
    }

    // Prepare all promises
    // Use repair for today's record to ensure validity
    const kpiRecordPromise = getOrRepairGlobalRecord(today);

    const leadsCreatedTodayPromise = prisma.client.count({
        where: {
            createdAt: { gte: today },
            // userId: null // REMOVED: Count ALL clients as leads
        }
    });

    // Monthly Metrics
    const closedDealsMonthPromise = prisma.deal.findMany({
        where: {
            stage: 'Complete',
            updatedAt: { gte: firstDayOfMonth },
        },
        select: { assignmentFee: true }
    });
    const contractsSignedMonthPromise = prisma.contract.count({
        where: {
            status: 'Signed',
            updatedAt: { gte: firstDayOfMonth },
        }
    });

    // History
    const kpiHistoryPromise = prisma.kPIRecord.findMany({
        where: {
            date: { gte: startDate, lte: endDate },
            userId: null // Enforce Global
        },
        orderBy: { date: 'desc' }
    });
    const clientHistoryPromise = prisma.client.findMany({
        where: {
            createdAt: { gte: startDate, lte: endDate },
        },
        select: { createdAt: true }
    });
    const contractHistoryPromise = prisma.contract.findMany({
        where: {
            createdAt: { gte: startDate, lte: endDate },
        },
        select: { createdAt: true }
    });

    // Goals
    const goalsPromise = prisma.settings.findMany({
        where: {
            key: { in: ['goal_daily_calls', 'goal_daily_offers', 'goal_daily_leads', 'goal_monthly_revenue', 'goal_monthly_contracts', 'goal_daily_conversations'] },
            userId: null
        }
    });

    // EXECUTE ALL PARALLEL
    const [
        kpiRecordResult,
        leadsCreatedToday,
        closedDealsMonth,
        contractsSignedMonth,
        kpiHistory,
        clientHistory,
        contractHistory,
        settings
    ] = await Promise.all([
        kpiRecordPromise,
        leadsCreatedTodayPromise,
        closedDealsMonthPromise,
        contractsSignedMonthPromise,
        kpiHistoryPromise,
        clientHistoryPromise,
        contractHistoryPromise,
        goalsPromise
    ]);

    // kpiRecordResult is now guaranteed to be a single Valid record (or created)
    let kpiRecord = kpiRecordResult;

    // Process Data
    const monthlyRevenue = closedDealsMonth.reduce((sum, deal) => sum + (deal.assignmentFee || 0), 0);

    // Map History
    const leadsByDate = new Map<string, number>();
    clientHistory.forEach(c => {
        const d = getLocalDateString(c.createdAt);
        leadsByDate.set(d, (leadsByDate.get(d) || 0) + 1);
    });

    const contractsByDate = new Map<string, number>();
    contractHistory.forEach(c => {
        const d = getLocalDateString(c.createdAt);
        contractsByDate.set(d, (contractsByDate.get(d) || 0) + 1);
    });

    const historyMap = new Map<string, { date: string, calls: number, offers: number, leads: number, contracts: number, conversations: number }>();

    kpiHistory.forEach(r => {
        const d = getLocalDateString(r.date);
        historyMap.set(d, {
            date: d,
            calls: r.calls,
            offers: r.offers,
            leads: leadsByDate.get(d) || 0,
            contracts: contractsByDate.get(d) || 0,
            conversations: r.conversations || 0
        });
    });

    // Ensure Today is in History (for first load of the day)
    if (kpiRecord) {
        const todayStr = getLocalDateString(kpiRecord.date);
        if (!historyMap.has(todayStr)) {
            historyMap.set(todayStr, {
                date: todayStr,
                calls: kpiRecord.calls,
                offers: kpiRecord.offers,
                leads: leadsByDate.get(todayStr) || 0,
                contracts: contractsByDate.get(todayStr) || 0,
                conversations: kpiRecord.conversations || 0
            });
        } else {
            // Update it to match our live repair
            const existing = historyMap.get(todayStr)!;
            historyMap.set(todayStr, {
                ...existing,
                calls: kpiRecord.calls,
                offers: kpiRecord.offers,
                conversations: kpiRecord.conversations || 0
            });
        }
    }

    // Backfill Map
    const ensureDate = (date: string) => {
        if (!historyMap.has(date)) {
            historyMap.set(date, {
                date,
                calls: 0, offers: 0, leads: leadsByDate.get(date) || 0,
                contracts: contractsByDate.get(date) || 0, conversations: 0
            });
        }
    };
    leadsByDate.forEach((_, date) => ensureDate(date));
    contractsByDate.forEach((_, date) => ensureDate(date));

    const history = Array.from(historyMap.values()).sort((a, b) => b.date.localeCompare(a.date));

    // Goals
    const goals = settings.reduce((acc, curr) => {
        acc[curr.key] = parseInt(curr.value, 10);
        return acc;
    }, {} as Record<string, number>);

    return {
        daily: {
            calls: Math.max(0, kpiRecord?.calls || 0),
            offers: Math.max(0, kpiRecord?.offers || 0),
            leads: leadsCreatedToday,
            appointments: Math.max(0, kpiRecord?.appointments || 0),
            conversations: Math.max(0, kpiRecord?.conversations || 0)
        },
        monthly: {
            revenue: monthlyRevenue,
            contracts: contractsSignedMonth
        },
        goals: {
            calls: goals['goal_daily_calls'] || 50,
            offers: goals['goal_daily_offers'] || 5,
            leads: goals['goal_daily_leads'] || 10,
            revenue: goals['goal_monthly_revenue'] || 50000,
            contracts: goals['goal_monthly_contracts'] || 10,
            conversations: goals['goal_daily_conversations'] || 20
        },
        history
    };
}

export async function incrementKPICounter(field: 'calls' | 'offers' | 'appointments' | 'conversations', amount: number = 1, dateOverride?: string) {
    const user = await getCurrentUser();
    // const userId = user?.id || null; // Unused for global

    let today = new Date();

    if (dateOverride) {
        // Parse YYYY-MM-DD safely to simple Date at midnight
        const [y, m, d] = dateOverride.split('-').map(Number);
        today = new Date(y, m - 1, d);
    }

    today.setHours(0, 0, 0, 0);

    try {
        await prisma.$transaction(async (tx) => {
            // Find ALL global records for repair/update logic inside a transaction?
            // Since we can't easily reuse the helper inside $transaction without passing tx...
            // Let's implement robust logic here directly.

            const records = await tx.kPIRecord.findMany({
                where: { date: today, userId: null }
            });

            let record;
            if (records.length === 0) {
                record = await tx.kPIRecord.create({
                    data: { date: today, userId: null }
                });
            } else if (records.length === 1) {
                record = records[0];
            } else {
                // Healed
                records.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
                record = records[0]; // Logic simplified for transaction speed: pick first
                // (We assume getKPIData heals properly on load, here we just want to write to *one* of them)
                // actually we should probably delete others to avoid drift
                const others = records.slice(1);
                for (const r of others) {
                    await tx.kPIRecord.delete({ where: { id: r.id } });
                }
            }

            // @ts-ignore
            const current = record[field] || 0;
            const newValue = Math.max(0, current + amount);

            await tx.kPIRecord.update({
                where: { id: record.id },
                data: { [field]: newValue }
            });
        });

        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Error incrementing KPI:', error);
        return { success: false, error: 'Failed' };
    }
}

export async function updateDailyMetric(dateStr: string, field: 'calls' | 'offers' | 'leads' | 'conversations', value: number) {
    if (field !== 'calls' && field !== 'offers' && field !== 'conversations') {
        return { success: false, error: 'Cannot edit auto-tracked metrics manually yet.' };
    }
    // const userId = user?.id || null; 

    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);

    try {
        // Robust update
        const records = await prisma.kPIRecord.findMany({
            where: { date, userId: null }
        });

        let record;
        if (records.length === 0) {
            record = await prisma.kPIRecord.create({
                data: { date, userId: null, [field]: value }
            });
        } else {
            // Pick first, heal others if multiple
            if (records.length > 1) {
                records.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
                const others = records.slice(1);
                for (const r of others) {
                    await prisma.kPIRecord.delete({ where: { id: r.id } });
                }
            }
            record = records[0];

            await prisma.kPIRecord.update({
                where: { id: record.id },
                data: { [field]: value }
            });
        }

        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Error updating KPI:', error);
        return { success: false, error: 'Failed' };
    }
}

export async function updateKPIGoals(newGoals: Record<string, number>) {
    // userId is ignored, we use global goals
    try {
        for (const [key, value] of Object.entries(newGoals)) {
            // Find existing GLOBAL setting
            const existing = await prisma.settings.findFirst({
                where: {
                    key: `goal_${key}`,
                    userId: null
                }
            });

            if (existing) {
                await prisma.settings.update({
                    where: { id: existing.id },
                    data: { value: value.toString() }
                });
            } else {
                await prisma.settings.create({
                    data: {
                        key: `goal_${key}`,
                        value: value.toString(),
                        userId: null
                    }
                });
            }
        }
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Error updating goals:', error);
        return { success: false, error: 'Failed' };
    }
}
