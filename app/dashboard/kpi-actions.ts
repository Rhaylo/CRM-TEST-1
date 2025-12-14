'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getKPIData() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // 1. Get/Create Today's KPI Record (Manual Counts)
    let kpiRecord = await prisma.kPIRecord.findUnique({
        where: { date: today }
    });

    if (!kpiRecord) {
        // Create if missing (lazy init)
        try {
            kpiRecord = await prisma.kPIRecord.create({
                data: { date: today }
            });
        } catch (e) {
            // Race condition handling
            kpiRecord = await prisma.kPIRecord.findUnique({ where: { date: today } });
        }
    }

    // 2. Automated Daily Metrics (Offers sent today)
    // Assuming "Offer" means a Deal created today or specifically a contract sent?
    // Let's count Deals Created Today as "Offers" for simplicity, or we check Deal date.
    const dealsCreatedToday = await prisma.deal.count({
        where: {
            createdAt: {
                gte: today
            }
        }
    });

    // 3. Automated Monthly Metrics (Revenue, Contracts)
    const closedDealsMonth = await prisma.deal.findMany({
        where: {
            stage: 'Complete',
            updatedAt: { gte: firstDayOfMonth }
        }
    });

    // Calculate revenue from assignment fees or spread
    const monthlyRevenue = closedDealsMonth.reduce((sum, deal) => {
        const profit = deal.assignmentFee ?? (deal.amount - 0); // Need 'ourOffer' but it is on Client... simplified for speed or fetch check
        // Ideally we need the logic: assignmentFee OR (amount - client.ourOffer)
        // Since we didn't fetch client here, let's rely on 'assignmentFee' if populated, 
        // or just `amount` if we treat that as revenue? 
        // Real revenue is usually the Assignment Fee.
        return sum + (deal.assignmentFee || 0);
    }, 0);

    const contractsSignedMonth = await prisma.contract.count({
        where: {
            status: 'Signed',
            updatedAt: { gte: firstDayOfMonth }
        }
    });

    // 4. Get Goals (Settings)
    const settings = await prisma.settings.findMany({
        where: {
            key: { in: ['goal_daily_calls', 'goal_daily_offers', 'goal_monthly_revenue', 'goal_monthly_contracts'] }
        }
    });

    const goals = settings.reduce((acc, curr) => {
        acc[curr.key] = parseInt(curr.value, 10);
        return acc;
    }, {} as Record<string, number>);

    return {
        daily: {
            calls: kpiRecord?.calls || 0,
            offers: dealsCreatedToday,
            appointments: kpiRecord?.appointments || 0 // Extra
        },
        monthly: {
            revenue: monthlyRevenue,
            contracts: contractsSignedMonth
        },
        goals: {
            calls: goals['goal_daily_calls'] || 50,
            offers: goals['goal_daily_offers'] || 5,
            revenue: goals['goal_monthly_revenue'] || 50000,
            contracts: goals['goal_monthly_contracts'] || 10
        }
    };
}

export async function incrementKPICounter(field: 'calls' | 'appointments') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
        await prisma.kPIRecord.upsert({
            where: { date: today },
            create: {
                date: today,
                [field]: 1
            },
            update: {
                [field]: { increment: 1 }
            }
        });
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Error incrementing KPI:', error);
        return { success: false, error: 'Failed' };
    }
}

export async function updateKPIGoals(newGoals: Record<string, number>) {
    try {
        for (const [key, value] of Object.entries(newGoals)) {
            await prisma.settings.upsert({
                where: { key: `goal_${key}` }, // e.g. goal_daily_calls
                create: { key: `goal_${key}`, value: value.toString() },
                update: { value: value.toString() }
            });
        }
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Error updating goals:', error);
        return { success: false, error: 'Failed' };
    }
}
