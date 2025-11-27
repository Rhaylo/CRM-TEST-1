import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import styles from './ClientList.module.css';
import SortSelect from './SortSelect';
import ClientActions from './ClientActions';

export default async function ClientList({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const sort = typeof searchParams.sort === 'string' ? searchParams.sort : 'newest';

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'oldest') orderBy = { createdAt: 'asc' };
    if (sort === 'motivation') orderBy = { motivationScore: 'desc' };

    const clients = await prisma.client.findMany({
        orderBy,
        include: {
            deals: { orderBy: { createdAt: 'desc' } },
            tasks: true,
        },
    });

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>
                    Clients
                    <span style={{
                        fontSize: '1rem',
                        fontWeight: 'normal',
                        color: '#64748b',
                        marginLeft: '0.75rem',
                        backgroundColor: '#f1f5f9',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px'
                    }}>
                        {clients.length}
                    </span>
                </h1>
                <div className={styles.controls}>
                    <Link
                        href="/clients/new"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        + Add Client
                    </Link>
                    <SortSelect />
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.th}>Contact Name</th>
                            <th className={styles.th}>Email</th>
                            <th className={styles.th}>Phone</th>
                            <th className={styles.th}>Lead Age</th>
                            <th className={styles.th}>Deals</th>
                            <th className={styles.th}>Status</th>
                            <th className={styles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((client) => {
                            const leadAge = Math.floor(
                                (Date.now() - new Date(client.createdAt).getTime()) /
                                (1000 * 60 * 60 * 24),
                            );
                            const activeTasks = client.tasks?.filter((t: any) => t.completed !== true) || [];
                            const taskCount = activeTasks.length;

                            return (
                                <tr key={client.id} className={styles.tr}>
                                    <td className={styles.td}>
                                        <Link href={`/tasks?client=${client.id}`} className={styles.link}>
                                            <div className="font-medium">{client.contactName}</div>
                                        </Link>
                                        <div className="text-xs text-slate-500">{client.address}</div>
                                    </td>
                                    <td className={styles.td}>
                                        <div className="text-sm">{client.email || '-'}</div>
                                    </td>
                                    <td className={styles.td}>
                                        <div className="text-sm">{client.phone || '-'}</div>
                                    </td>
                                    <td className={styles.td}>{leadAge} days</td>
                                    <td className={styles.td}>{client.deals.length}</td>
                                    <td className={styles.td}>
                                        {client.deals && client.deals.length > 0 ? (
                                            <span
                                                style={{
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '0.375rem',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600',
                                                    textTransform: 'uppercase',
                                                    backgroundColor:
                                                        client.deals[0].stage === 'Complete'
                                                            ? '#dcfce7'
                                                            : client.deals[0].stage === 'Pending'
                                                                ? '#fef3c7'
                                                                : client.deals[0].stage === 'Contract In'
                                                                    ? '#dbeafe'
                                                                    : '#e0e7ff',
                                                    color:
                                                        client.deals[0].stage === 'Complete'
                                                            ? '#166534'
                                                            : client.deals[0].stage === 'Pending'
                                                                ? '#92400e'
                                                                : client.deals[0].stage === 'Contract In'
                                                                    ? '#1e40af'
                                                                    : '#4338ca',
                                                }}
                                            >
                                                {client.deals[0].stage}
                                            </span>
                                        ) : (
                                            <span
                                                style={{
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '0.375rem',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600',
                                                    color: '#94a3b8',
                                                }}
                                            >
                                                Working
                                            </span>
                                        )}
                                    </td>
                                    <td className={styles.td}>
                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            <ClientActions clientId={client.id} clientName={client.contactName} />
                                            <Link
                                                href={`/tasks?client=${client.id}`}
                                                className={styles.link}
                                                style={{ position: 'relative' }}
                                            >
                                                View Tasks
                                                {taskCount > 0 && (
                                                    <span
                                                        style={{
                                                            position: 'absolute',
                                                            top: '-8px',
                                                            right: '-8px',
                                                            backgroundColor: '#ef4444',
                                                            color: 'white',
                                                            borderRadius: '50%',
                                                            width: '18px',
                                                            height: '18px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '0.65rem',
                                                            fontWeight: '700',
                                                        }}
                                                    >
                                                        {taskCount}
                                                    </span>
                                                )}
                                            </Link>
                                            <Link href={`/clients/${client.id}`} className={styles.link}>
                                                View
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
