import { prisma } from '@/lib/prisma';
<<<<<<< HEAD
<<<<<<< HEAD
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Manrope, Sora } from 'next/font/google';
import KPICards from './dashboard/KPICards';
import KPIBoard from './dashboard/KPIBoard';
=======
import KPICards from './dashboard/KPICards';
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
import KPICards from './dashboard/KPICards';
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
import RevenueChart from './dashboard/RevenueChart';
import DealPipeline from './dashboard/DealPipeline';
import RecentActivity from './dashboard/RecentActivity';
import DashboardHeader from './dashboard/DashboardHeader';
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e

export default async function DashboardPage() {
    // Fetch data for KPIs
    const [totalRevenue, activeDealsCount, totalClients, dealsWon, dealsByStage, settings] = await Promise.all([
        prisma.deal.aggregate({
            _sum: { amount: true },
            where: { stage: 'Closed Won' }
        }),
        prisma.deal.count({
            where: { stage: { notIn: ['Closed Won', 'Closed Lost'] } }
        }),
        prisma.client.count(),
        prisma.deal.count({
            where: { stage: 'Closed Won' }
        }),
        prisma.deal.groupBy({
            by: ['stage'],
            _count: { id: true }
<<<<<<< HEAD
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
        }),
        prisma.settings.findMany({
            where: {
                key: {
<<<<<<< HEAD
<<<<<<< HEAD
                    in: ['business_name', 'welcome_message', 'revenue_data']
                },
                userId
            }
        }),
        // KPIData fetching likely needs updating too, but we pass userId to it if we modify it
        import('./dashboard/kpi-actions').then(mod => mod.getKPIData('30d', userId))
=======
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
                    in: ['business_name', 'welcome_message']
                }
            }
        })
<<<<<<< HEAD
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
    ]);

    const businessName = settings.find(s => s.key === 'business_name')?.value || 'Xyre Holdings';
    const welcomeMessage = settings.find(s => s.key === 'welcome_message')?.value || "Welcome back! Here's what's happening today.";

    // Get revenue data from settings or use defaults
<<<<<<< HEAD
<<<<<<< HEAD
    const revenueSettings = settings.find(s => s.key === 'revenue_data');
=======
    const revenueSettings = await prisma.settings.findUnique({
        where: { key: 'revenue_data' }
    });
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
    const revenueSettings = await prisma.settings.findUnique({
        where: { key: 'revenue_data' }
    });
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e

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
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
        'Lead': '#94a3b8',
        'Contact Made': '#60a5fa',
        'Proposal Sent': '#818cf8',
        'Negotiation': '#c084fc',
        'Under Contract': '#f472b6',
        'Closed Won': '#34d399',
<<<<<<< HEAD
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
        'Closed Lost': '#f87171',
    };

    const pipelineData = dealsByStage.map(item => ({
        name: item.stage,
        value: item._count.id,
        color: pipelineColors[item.stage] || '#cbd5e1'
    }));

    return (
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
            <DashboardHeader
                initialBusinessName={businessName}
                initialWelcomeMessage={welcomeMessage}
            />

            <KPICards
                totalRevenue={totalRevenue._sum.amount || 0}
                activeDeals={activeDealsCount}
                totalClients={totalClients}
                dealsWon={dealsWon}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <RevenueChart data={revenueData} />
                <DealPipeline data={pipelineData} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                <RecentActivity />
<<<<<<< HEAD
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
            </div>
        </div>
    );
}
