import { prisma } from '@/lib/prisma';
import AddInvestorModal from './AddInvestorModal';
import InvestorList from './InvestorList';
import styles from './Dispositions.module.css';

export const dynamic = 'force-dynamic';

export default async function DispositionsPage() {
    const investors = await prisma.investor.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            deals: true,
        },
    });

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>
                        Dispositions
                        <span className={styles.countBadge}>{investors.length}</span>
                    </h1>
                    <p className={styles.subtitle}>Manage your investor network</p>
                </div>
                <AddInvestorModal />
            </div>

            <InvestorList initialInvestors={investors} />
        </div>
    );
}
