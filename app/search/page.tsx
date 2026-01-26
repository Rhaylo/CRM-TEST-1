import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import styles from './page.module.css';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q: string }>;
}) {
    const user = await getCurrentUser();
    if (!user) {
        redirect('/login');
    }

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

    const isPostgres = !!process.env.POSTGRES_PRISMA_URL;
    const mode = isPostgres ? 'insensitive' : undefined;

    const clients = await prisma.client.findMany({
        where: {
            AND: [
                {
                    OR: [{ userId: user.id }, { userId: null }],
                },
                {
                    OR: [
                        { companyName: { contains: query, mode: mode as any } },
                        { contactName: { contains: query, mode: mode as any } },
                        { email: { contains: query, mode: mode as any } },
                        { phone: { contains: query, mode: mode as any } },
                        { address: { contains: query, mode: mode as any } },
                    ],
                },
            ],
        },
    });

    return (
        <div className={styles.container}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className={styles.title}>Search Results for "{query}"</h1>
                <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: 'white',
                        border: '1px solid #cbd5e1',
                        color: '#475569',
                        textDecoration: 'none',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                    }}
                >
                    📍 Open in Google Maps
                </a>
            </div>

            {clients.length === 0 ? (
                <div className={styles.noResults}>
                    <p style={{ marginBottom: '1.5rem' }}>No clients found matching "{query}".</p>
                    <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.75rem 1.5rem',
                            backgroundColor: '#2563eb',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '0.375rem',
                            fontWeight: '500',
                            transition: 'background-color 0.2s',
                        }}
                    >
                        🔍 Search "{query}" on Google Maps
                    </a>
                </div>
            ) : (
                <div className={styles.results}>
                    {clients.map((client) => (
                        <div key={client.id} className={styles.card}>
                            <div className={styles.cardHeader}>
                                <h3>{client.contactName || client.companyName}</h3>
                                <Link href={`/clients/${client.id}`} className={styles.viewLink}>
                                    View
                                </Link>
                            </div>
                            <div className={styles.cardDetails}>
                                <p><strong>Email:</strong> {client.email || '-'}</p>
                                <p><strong>Phone:</strong> {client.phone || '-'}</p>
                                <p><strong>Address:</strong> {client.address || '-'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
