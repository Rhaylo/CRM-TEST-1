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
        redirect('/auth');
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
                    in: ['business_name', 'welcome_message', 'revenue_data']
                },
                userId
            }
        }),
        // KPIData fetching likely needs updating too, but we pass userId to it if we modify it
        import('./dashboard/kpi-actions').then(mod => mod.getKPIData('30d', userId))
    ]);

    const businessName = settings.find(s => s.key === 'business_name')?.value || 'Xyre Holdings';
    const welcomeMessage = settings.find(s => s.key === 'welcome_message')?.value || "Welcome back! Here's what's happening today.";

    // Get revenue data from settings or use defaults
    const revenueSettings = settings.find(s => s.key === 'revenue_data');

    const revenueData = revenueSettings?.value
        ? JSON.parse(revenueSettings.value)
        : [
            { month: 'Jan', revenue: 12000 },
            { month: 'Feb', revenue: 19000 },
            { month: 'Mar', revenue: 15000 },
            { month: 'Apr', revenue: 22000 },
            { month: 'May', revenue: 28000 },
            { month: 'Jun', revenue: 35000 },
        ];


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
                <div className={`${styles.reveal} ${styles.revealDelay1}`}>
                    <DashboardHeader
                        initialBusinessName={businessName}
                        initialWelcomeMessage={welcomeMessage}
                    />
                </div>

                <div className={`${styles.reveal} ${styles.revealDelay2}`}>
                    <DashboardHighlights
                        totalRevenue={totalRevenue._sum.amount || 0}
                        activeDeals={activeDealsCount}
                        totalClients={totalClients}
                        dealsWon={dealsWon}
                        kpiData={kpiData}
                    />
                </div>

                <div className={`${styles.reveal} ${styles.revealDelay3}`}>
                    <KPIBoard initialData={kpiData} dealsWon={dealsWon} />
                </div>

                <div className={`${styles.reveal} ${styles.revealDelay4}`}>
                    <KPICards
                        totalRevenue={totalRevenue._sum.amount || 0}
                        activeDeals={activeDealsCount}
                        totalClients={totalClients}
                        dealsWon={dealsWon}
                    />
                </div>

                <div className={`${styles.chartsGrid} ${styles.sectionDivider} ${styles.reveal} ${styles.revealDelay5}`}>
                    <RevenueChart data={revenueData} />
                    <DealPipeline data={pipelineData} />
                </div>

                <div className={`${styles.activityGrid} ${styles.sectionDivider} ${styles.reveal} ${styles.revealDelay6}`}>
                    <RecentActivity />
                </div>
            </div>
        </div>
    );
}
