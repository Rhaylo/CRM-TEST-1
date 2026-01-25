import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import styles from './Dashboard.module.css';

export default async function RecentActivity() {
    const recentDeals = await prisma.deal.findMany({
        take: 5,
        orderBy: { updatedAt: 'desc' },
        include: { client: true },
    });

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Recent Activity</h3>
                <Link href="/deals" className={styles.cardLink}>View All</Link>
            </div>

            <div className={styles.activityList}>
                {recentDeals.length === 0 ? (
                    <p className={styles.emptyState}>No recent activity</p>
                ) : (
                    recentDeals.map((deal) => (
                        <div key={deal.id} className={styles.activityItem}>
                            <div className={styles.activityMain}>
                                <p className={styles.activityTitle}>
                                    Deal updated for {deal.client.companyName}
                                </p>
                                <p className={styles.activityMeta}>
                                    Stage: {deal.stage} • Amount: ${deal.amount.toLocaleString()}
                                </p>
                            </div>
                            <span className={styles.activityDate}>
                                {new Date(deal.updatedAt).toLocaleDateString()}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
