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
            additionalSellers: true,
            titleCompany: true,
            escrowAgent: true,
        },
    });

    if (!client) notFound();

    await prisma.client.update({
        where: { id: client.id },
        data: { updatedAt: new Date() },
    });

    const titleCompanies = await prisma.titleCompany.findMany({
        include: { escrowAgents: true },
        orderBy: { name: 'asc' },
    });

    const allClients = await prisma.client.findMany({
        select: { id: true },
        orderBy: { createdAt: 'desc' },
    });

    const currentIndex = allClients.findIndex((item) => item.id === client.id);
    const prevClientId = currentIndex > 0 ? allClients[currentIndex - 1].id : null;
    const nextClientId = currentIndex < allClients.length - 1 ? allClients[currentIndex + 1].id : null;

    const clientAny = client as any;
    const serializedClient = {
        ...clientAny,
        contracts: clientAny.contracts.map((contract: any) => ({
            ...contract,
            documentContent: undefined,
        })),
        deals: clientAny.deals.map((deal: any) => ({
            ...deal,
            contracts: deal.contracts.map((contract: any) => ({
                ...contract,
                documentContent: undefined,
            })),
        })),
    };

    return (
        <div className={styles.container}>
            <ClientInfo
                client={serializedClient}
                titleCompanies={titleCompanies}
                prevClientId={prevClientId}
                nextClientId={nextClientId}
                currentIndex={currentIndex + 1}
                totalClients={allClients.length}
            />
            <ClientTabs client={serializedClient} />
        </div>
    );
}
