import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import styles from './page.module.css';
import ClientTabs from './ClientTabs';
import ClientInfo from './ClientInfo';
<<<<<<< HEAD
<<<<<<< HEAD
=======
import ClientNavigation from './ClientNavigation';
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
import ClientNavigation from './ClientNavigation';
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e

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
<<<<<<< HEAD
<<<<<<< HEAD
            additionalSellers: true, // Use proper relation now that schema is fixed
            titleCompany: true,
            escrowAgent: true,
        },
    });

    // "Touch" the client to update 'updatedAt' so they appear at the top of the list
    if (client) {
        await prisma.client.update({
            where: { id: client.id },
            data: { updatedAt: new Date() }
        });
    }

    // Fetch Title Companies for dropdowns
    const titleCompanies = await prisma.titleCompany.findMany({
        include: { escrowAgents: true },
        orderBy: { name: 'asc' }
    });

=======
        },
    });

>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
        },
    });

>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
    if (!client) notFound();

    // Get all client IDs for navigation
    const allClients = await prisma.client.findMany({
        select: { id: true },
        orderBy: { createdAt: 'desc' },
    });

    const currentIndex = allClients.findIndex(c => c.id === client.id);
    const prevClientId = currentIndex > 0 ? allClients[currentIndex - 1].id : null;
    const nextClientId = currentIndex < allClients.length - 1 ? allClients[currentIndex + 1].id : null;

<<<<<<< HEAD
<<<<<<< HEAD
    // Sanitize client object to remove Uint8Array (documentContent) before passing to Client Components
    const clientAny = client as any;
    const serializedClient = {
        ...clientAny,
        contracts: clientAny.contracts.map((c: any) => ({ ...c, documentContent: undefined })),
        deals: clientAny.deals.map((d: any) => ({
            ...d,
            contracts: d.contracts.map((c: any) => ({ ...c, documentContent: undefined }))
        }))
    };

    return (
        <div className={styles.container}>
            <ClientInfo
                client={serializedClient}
                titleCompanies={titleCompanies}
=======
    return (
        <div className={styles.container}>
            <ClientNavigation
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
    return (
        <div className={styles.container}>
            <ClientNavigation
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
                prevClientId={prevClientId}
                nextClientId={nextClientId}
                currentIndex={currentIndex + 1}
                totalClients={allClients.length}
            />
<<<<<<< HEAD
<<<<<<< HEAD
            <ClientTabs client={serializedClient} />
=======
            <ClientInfo client={client} />
            <ClientTabs client={client} />
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
            <ClientInfo client={client} />
            <ClientTabs client={client} />
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
        </div>
    );
}
