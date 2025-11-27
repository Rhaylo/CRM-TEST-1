import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import styles from './page.module.css';

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q: string }>;
}) {
    const { q } = await searchParams;
    const query = q || '';

    if (!query) {
        return (
            <div className={styles.container}>
                <h1 className={styles.title}>Search</h1>
                <div className={styles.noResults}>Please enter a search term.</div>
            </div>
        );
    }

    const clients = await prisma.client.findMany({
        where: {
            OR: [
                { companyName: { contains: query } },
                { contactName: { contains: query } },
                { email: { contains: query } },
                { phone: { contains: query } },
                { address: { contains: query } },
            ],
        },
    });

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Search Results for "{query}"</h1>

            {clients.length === 0 ? (
                <div className={styles.noResults}>No clients found matching "{query}".</div>
            ) : (
                <div className={styles.results}>
                    {clients.map((client) => (
                        <div key={client.id} className={styles.card}>
                            <div className={styles.cardHeader}>
                                <Link href={`/clients/${client.id}`} className={styles.companyName}>
                                    {client.companyName}
                                </Link>
                                <span className={styles.matchType}>Client</span>
                            </div>
                            <div className={styles.details}>
                                <div>👤 {client.contactName}</div>
                                <div>📧 {client.email}</div>
                                <div>📞 {client.phone}</div>
                                <div>📍 {client.address}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
