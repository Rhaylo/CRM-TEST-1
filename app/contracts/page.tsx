import { prisma } from '@/lib/prisma';
import ContractList from './ContractList';
import styles from './page.module.css';

export default async function ContractsPage() {
    const contracts = await prisma.contract.findMany({
        include: {
            client: {
                include: {
                    tasks: true,
                    notes: { orderBy: { createdAt: 'desc' }, take: 5 }
                }
            },
            deal: {
                include: {
                    notes: { orderBy: { createdAt: 'desc' }, take: 5 }
                }
            }
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
