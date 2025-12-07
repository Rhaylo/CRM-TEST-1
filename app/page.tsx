import { prisma } from '@/lib/prisma';
import KPICards from './dashboard/KPICards';
import RevenueChart from './dashboard/RevenueChart';
import DealPipeline from './dashboard/DealPipeline';
import RecentActivity from './dashboard/RecentActivity';
import DashboardHeader from './dashboard/DashboardHeader';

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
        }),
        prisma.settings.findMany({
            where: {
                key: {
                    in: ['business_name', 'welcome_message']
                }
            }
        })
    ]);

    const businessName = settings.find(s => s.key === 'business_name')?.value || 'Xyre Holdings';
    const welcomeMessage = settings.find(s => s.key === 'welcome_message')?.value || "Welcome back! Here's what's happening today.";

    // Get revenue data from settings or use defaults
    const revenueSettings = await prisma.settings.findUnique({
        where: { key: 'revenue_data' }
    });

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
        'Complete': '#22c55e',       // Green
        'Contract In': '#8b5cf6',     // Purple
        'Contract Out': '#3b82f6',    // Blue
        'Pending': '#f59e0b',         // Amber/Orange
        'Lead': '#94a3b8',
        'Contact Made': '#60a5fa',
        'Proposal Sent': '#818cf8',
        'Negotiation': '#c084fc',
        'Under Contract': '#f472b6',
        'Closed Won': '#34d399',
        'Closed Lost': '#f87171',
    };

    const pipelineData = dealsByStage.map(item => ({
        name: item.stage,
        value: item._count.id,
        color: pipelineColors[item.stage] || '#cbd5e1'
    }));

    return (
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
            </div>
        </div>
    );
}
