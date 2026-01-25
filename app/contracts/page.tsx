import { prisma } from '@/lib/prisma';
import ContractList from './ContractList';
import styles from './page.module.css';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ContractsPage() {
    const user = await getCurrentUser();
    if (!user) {
        redirect('/auth');
    }

    const contracts = await prisma.contract.findMany({
        where: {
            OR: [{ userId: user.id }, { userId: null }],
        },
        select: {
            id: true,
            dealId: true,
            status: true,
            dateSent: true,
            documentPath: true,
            documentName: true,
            updatedAt: true,
            createdAt: true,
            client: {
                include: {
                    tasks: true,
                    notes: { orderBy: { createdAt: 'desc' }, take: 5 },
                },
            },
            deal: {
                include: {
                    notes: { orderBy: { createdAt: 'desc' }, take: 5 },
                },
            },
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
