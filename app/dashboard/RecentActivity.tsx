import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function RecentActivity() {
    const recentDeals = await prisma.deal.findMany({
        take: 5,
        orderBy: { updatedAt: 'desc' },
        include: { client: true },
    });

    return (
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e293b' }}>Recent Activity</h3>
                <Link href="/deals" style={{ fontSize: '0.875rem', color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}>View All</Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {recentDeals.length === 0 ? (
                    <p style={{ color: '#64748b', textAlign: 'center', padding: '1rem' }}>No recent activity</p>
                ) : (
                    recentDeals.map((deal) => (
                        <div key={deal.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                            <div>
                                <p style={{ margin: 0, fontWeight: '500', color: '#1e293b' }}>
                                    Deal updated for {deal.client.companyName}
                                </p>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>
                                    Stage: {deal.stage} • Amount: ${deal.amount.toLocaleString()}
                                </p>
                            </div>
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                {new Date(deal.updatedAt).toLocaleDateString()}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
