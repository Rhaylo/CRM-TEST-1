import { prisma } from '@/lib/prisma';
import DealBoard from './DealBoard';
import styles from './page.module.css';

<<<<<<< HEAD
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function DealsPage() {
    const user = await getCurrentUser();
    if (!user) {
        redirect('/auth');
    }

    const deals = await prisma.deal.findMany({
        where: {
            OR: [
                { userId: user.id },
                { userId: null }
            ]
        },
        include: { client: true, investor: true },
=======
export default async function DealsPage() {
    const deals = await prisma.deal.findMany({
        include: { client: true },
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
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
