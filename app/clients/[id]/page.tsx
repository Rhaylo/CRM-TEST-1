import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import styles from './page.module.css';
import ClientTabs from './ClientTabs';
import ClientInfo from './ClientInfo';
import ClientNavigation from './ClientNavigation';

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

    // Get all client IDs for navigation
    const allClients = await prisma.client.findMany({
        select: { id: true },
        orderBy: { createdAt: 'desc' },
    });

    const currentIndex = allClients.findIndex(c => c.id === client.id);
    const prevClientId = currentIndex > 0 ? allClients[currentIndex - 1].id : null;
    const nextClientId = currentIndex < allClients.length - 1 ? allClients[currentIndex + 1].id : null;

    return (
        <div className={styles.container}>
            <ClientNavigation
                prevClientId={prevClientId}
                nextClientId={nextClientId}
                currentIndex={currentIndex + 1}
                totalClients={allClients.length}
            />
            <ClientInfo client={client} />
            <ClientTabs client={client} />
        </div>
    );
}
