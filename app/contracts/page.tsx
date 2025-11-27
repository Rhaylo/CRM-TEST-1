import { prisma } from '@/lib/prisma';
import ContractList from './ContractList';
import styles from './page.module.css';

export default async function ContractsPage() {
    const contracts = await prisma.contract.findMany({
        include: {
            client: true,
            deal: true
        },
        orderBy: { updatedAt: 'desc' },
    });

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Contracts</h1>
            </div>
            <ContractList contracts={contracts} />
        </div>
    );
}
