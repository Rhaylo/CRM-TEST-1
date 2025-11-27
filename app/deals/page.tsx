import { prisma } from '@/lib/prisma';
import DealBoard from './DealBoard';
import styles from './page.module.css';

export default async function DealsPage() {
    const deals = await prisma.deal.findMany({
        include: { client: true },
        orderBy: { updatedAt: 'desc' },
    });

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Deals Pipeline</h1>
            </div>
            <DealBoard initialDeals={deals} />
        </div>
    );
}
