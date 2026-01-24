import { prisma } from '@/lib/prisma';
import ContractList from './ContractList';
import styles from './page.module.css';
<<<<<<< HEAD
<<<<<<< HEAD
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
            OR: [
                { userId: user.id },
                { userId: null }
            ]
        },
        select: {
            id: true,
            status: true,
            dateSent: true,
            documentPath: true,
            documentName: true,
            // Exclude documentContent
            updatedAt: true,
            createdAt: true,
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
=======
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e

export default async function ContractsPage() {
    const contracts = await prisma.contract.findMany({
        include: {
            client: true,
            deal: true
<<<<<<< HEAD
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
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
