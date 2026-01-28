import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Manrope, Sora } from 'next/font/google';
import KPICards from './dashboard/KPICards';
import KPIBoard from './dashboard/KPIBoard';
import RevenueChart from './dashboard/RevenueChart';
import DealPipeline from './dashboard/DealPipeline';
import RecentActivity from './dashboard/RecentActivity';
import DashboardHeader from './dashboard/DashboardHeader';
import DashboardHighlights from './dashboard/DashboardHighlights';
import CalendarWidget from './dashboard/CalendarWidget';

import styles from './dashboard/Dashboard.module.css';

const sora = Sora({ subsets: ['latin'], variable: '--font-sora' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    // ... (data fetching logic remains unchanged) ...
    // Fetch data for KPIs
    // Fetch data for KPIs
    // Get current user
    const user = await getCurrentUser();

    if (!user) {
        redirect('/login');
    }

    const userId = user.id;

    // Fetch data for KPIs
    const [totalRevenue, activeDealsCount, totalClients, dealsWon, dealsByStage, settings, kpiData] = await Promise.all([
        prisma.deal.aggregate({
            _sum: { amount: true },
            where: { stage: 'Closed Won', userId }
        }),
        prisma.deal.count({
            where: { stage: { notIn: ['Closed Won', 'Closed Lost'] }, userId }
        }),
        prisma.client.count({ where: { userId } }),
        prisma.deal.count({
            where: { stage: 'Closed Won', userId }
        }),
        prisma.deal.groupBy({
            by: ['stage'],
            _count: { id: true },
            where: { userId }
        }),
        prisma.settings.findMany({
            where: {
                key: {
                    in: ['business_name', 'welcome_message', 'revenue_data', 'revenue_adjustments']
                },
                userId
            }
        }),
        // KPIData fetching likely needs updating too, but we pass userId to it if we modify it
        import('./dashboard/kpi-actions').then(mod => mod.getKPIData('30d', userId))
    ]);

    const businessName = settings.find(s => s.key === 'business_name')?.value || 'Xyre Holdings';
    const welcomeMessage = settings.find(s => s.key === 'welcome_message')?.value || "Welcome back! Here's what's happening today.";

    const revenueSettings = settings.find(s => s.key === 'revenue_data');
    const revenueAdjustmentsSettings = settings.find(s => s.key === 'revenue_adjustments');

    const fallbackRevenueData = revenueSettings?.value
        ? JSON.parse(revenueSettings.value)
        : [
            { month: 'Jan', revenue: 12000 },
            { month: 'Feb', revenue: 19000 },
            { month: 'Mar', revenue: 15000 },
            { month: 'Apr', revenue: 22000 },
            { month: 'May', revenue: 28000 },
            { month: 'Jun', revenue: 35000 },
        ];

    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const year = now.getFullYear();
    const monthWindow = monthLabels.map((label, index) => {
        const date = new Date(year, index, 1);
        const monthKey = `${year}-${String(index + 1).padStart(2, '0')}`;
        return { monthLabel: label, monthKey, date };
    });

    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year + 1, 0, 1);

    const closedWonDeals = await prisma.deal.findMany({
        where: {
            stage: 'Closed Won',
            userId,
            createdAt: {
                gte: startDate,
                lt: endDate,
            },
        },
        select: {
            amount: true,
            createdAt: true,
        }
    });

    const baseByMonthKey = new Map<string, number>();
    monthWindow.forEach((item) => baseByMonthKey.set(item.monthKey, 0));

    closedWonDeals.forEach((deal) => {
        const dealDate = deal.createdAt;
        const monthKey = `${dealDate.getFullYear()}-${String(dealDate.getMonth() + 1).padStart(2, '0')}`;
        if (!baseByMonthKey.has(monthKey)) return;
        const current = baseByMonthKey.get(monthKey) ?? 0;
        baseByMonthKey.set(monthKey, current + (deal.amount || 0));
    });

    const adjustmentsRaw = revenueAdjustmentsSettings?.value
        ? JSON.parse(revenueAdjustmentsSettings.value)
        : [];

    const adjustmentByMonthKey = new Map<string, number>();
    if (Array.isArray(adjustmentsRaw)) {
        adjustmentsRaw.forEach((entry) => {
            if (!entry?.monthKey) return;
            adjustmentByMonthKey.set(entry.monthKey, Number(entry.adjustment) || 0);
        });
    }

    const revenueData = monthWindow.map((item) => {
        const baseRevenue = baseByMonthKey.get(item.monthKey) ?? 0;
        const adjustment = adjustmentByMonthKey.get(item.monthKey) ?? 0;
        const total = baseRevenue + adjustment;
        return {
            month: item.monthLabel,
            monthKey: item.monthKey,
            baseRevenue,
            adjustment,
            revenue: total,
        };
    });

    const hasAutoRevenue = closedWonDeals.length > 0 || adjustmentByMonthKey.size > 0;
    const finalRevenueData = hasAutoRevenue
        ? revenueData
        : fallbackRevenueData.map((item: any) => ({
            month: item.month,
            monthKey: `${now.getFullYear()}-${String(monthLabels.indexOf(item.month) + 1).padStart(2, '0')}`,
            baseRevenue: item.revenue,
            adjustment: 0,
            revenue: item.revenue,
        }));


    // Process pipeline data
    const pipelineColors: Record<string, string> = {
        'Complete': '#22c55e',
        'Contract In': '#60a5fa',
        'Contract Out': '#3b82f6',
        'Pending': '#f59e0b',
        'Lead': '#93c5fd',
        'Contact Made': '#6366f1',
        'Proposal Sent': '#8b5cf6',
        'Negotiation': '#a855f7',
        'Under Contract': '#4ade80',
        'Closed Won': '#16a34a',
        'Closed Lost': '#f87171',
    };

    const pipelineData = dealsByStage.map(item => ({
        name: item.stage,
        value: item._count.id,
        color: pipelineColors[item.stage] || '#cbd5e1'
    }));

    return (
        <div className={`${styles.container} ${sora.variable} ${manrope.variable}`}>
            <div className={styles.containerInner}>
                <div className={styles.section}>
                    <DashboardHeader
                        initialBusinessName={businessName}
                        initialWelcomeMessage={welcomeMessage}
                    />
                </div>

                <div className={styles.section}>
                    <DashboardHighlights
                        totalRevenue={totalRevenue._sum.amount || 0}
                        activeDeals={activeDealsCount}
                        totalClients={totalClients}
                        dealsWon={dealsWon}
                        kpiData={kpiData}
                    />
                </div>

                <div className={styles.section}>
                    <KPIBoard initialData={kpiData} dealsWon={dealsWon} />
                </div>

                <div className={styles.section}>
                    <KPICards
                        totalRevenue={totalRevenue._sum.amount || 0}
                        activeDeals={activeDealsCount}
                        totalClients={totalClients}
                        dealsWon={dealsWon}
                    />
                </div>

                <div className={`${styles.chartsGrid} ${styles.sectionDivider}`}>
                    <RevenueChart data={finalRevenueData} />
                    <DealPipeline data={pipelineData} />
                </div>

                <div className={`${styles.activityGrid} ${styles.sectionDivider}`}>
                    <RecentActivity />
                    <CalendarWidget />
                </div>
            </div >
        </div >
    );
}
