import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import styles from './page.module.css';
import ClientTabs from './ClientTabs';
import ClientInfo from './ClientInfo';

export default async function ClientDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const client = await prisma.client.findUnique({
        where: { id: parseInt(id) },
        include: {
            deals: {
                include: { contracts: true },
                orderBy: { createdAt: 'desc' },
            },
            notes: {
                orderBy: { createdAt: 'desc' },
            },
            contracts: true,
            tasks: {
                include: {
                    notes: {
                        orderBy: { createdAt: 'desc' },
                    },
                },
                orderBy: { dueDate: 'asc' },
            },
        },
    });

    if (!client) notFound();

    return (
        <div className={styles.container}>
            <ClientInfo client={client} />
            <ClientTabs client={client} />
        </div>
    );
}
