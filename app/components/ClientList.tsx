import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import styles from './ClientList.module.css';
import SortSelect from './SortSelect';
import ClientActions from './ClientActions';
<<<<<<< HEAD
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ClientSearch from './ClientSearch';
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e

export default async function ClientList({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
<<<<<<< HEAD
    const user = await getCurrentUser();
    if (!user) {
        redirect('/auth');
    }

    const status = typeof searchParams.status === 'string' ? searchParams.status : 'Active';
    const sort = typeof searchParams.sort === 'string' ? searchParams.sort : 'newest';
    const query = typeof searchParams.q === 'string' ? searchParams.q : undefined;

    let orderBy: any = { updatedAt: 'desc' }; // Default to 'Recent Activity'
    if (sort === 'oldest') orderBy = { createdAt: 'asc' };
    if (sort === 'motivation') orderBy = { motivationScore: 'desc' };

    const where: any = {
        OR: [
            { userId: user.id },
            { userId: null }
        ],
        // @ts-ignore
        status: status === 'All' ? undefined : status, // Support 'All' or specific status
    };

    if (query) {
        where.AND = where.AND || [];
        where.AND.push({
            OR: [
                { contactName: { contains: query } },
                { email: { contains: query } },
                { phone: { contains: query } },
            ],
        });
    }

    const clients = await prisma.client.findMany({
        where,
=======
    const sort = typeof searchParams.sort === 'string' ? searchParams.sort : 'newest';

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'oldest') orderBy = { createdAt: 'asc' };
    if (sort === 'motivation') orderBy = { motivationScore: 'desc' };

    const clients = await prisma.client.findMany({
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
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
<<<<<<< HEAD
                    <span className={styles.countBadge}>{clients.length}</span>
                </h1>
                <div className={styles.controls}>
                    <div className={styles.searchWrap}>
                        <ClientSearch />
                    </div>
                    <Link href="/clients/new" className={styles.addButton}>
=======
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
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
                        + Add Client
                    </Link>
                    <SortSelect />
                </div>
            </div>

<<<<<<< HEAD
            <div className={styles.tabs}>
                <Link
                    href="/clients"
                    className={`${styles.tab} ${status === 'Active' ? styles.activeTab : ''}`}
                >
                    Active
                </Link>
                <Link
                    href="/clients?status=Snoozed"
                    className={`${styles.tab} ${status === 'Snoozed' ? styles.activeTab : ''}`}
                >
                    Snoozed
                </Link>
                <Link
                    href="/clients?status=Archived"
                    className={`${styles.tab} ${status === 'Archived' ? styles.activeTab : ''}`}
                >
                    Archived
                </Link>
            </div>

            <div className={styles.resultsWrap} key={status}>
                {/* Desktop Table View */}
                <div className={`${styles.tableContainer} ${styles.tableDesktop}`}>
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
                            {clients.map((client: any) => {
                                const leadAge = Math.floor(
                                    (Date.now() - new Date(client.createdAt).getTime()) /
                                    (1000 * 60 * 60 * 24),
                                );
                                const activeTasks = client.tasks?.filter((t: any) => t.completed !== true) || [];
                                const taskCount = activeTasks.length;

                                return (
                                    <tr key={client.id} className={styles.tr}>
                                        <td className={styles.td}>
                                        <Link href={`/clients/${client.id}`} className={styles.link}>
                                            <div className="font-medium">{client.contactName}</div>
                                        </Link>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                                                <div className="text-xs text-slate-500">{client.address || '-'}</div>
                                                {client.address && (
                                                    <a
                                                        href={client.propertyLink || `https://www.zillow.com/homes/${encodeURIComponent(client.address)}_rb/`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '0.25rem',
                                                            padding: '0.125rem 0.5rem',
                                                            backgroundColor: '#0074e4',
                                                            color: 'white',
                                                            textDecoration: 'none',
                                                            borderRadius: '0.25rem',
                                                            fontSize: '0.625rem',
                                                            fontWeight: '500',
                                                            whiteSpace: 'nowrap'
                                                        }}
                                                    >
                                                        🏠
                                                    </a>
                                                )}
                                            </div>
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
                                                <ClientActions
                                                    clientId={client.id}
                                                    clientName={client.contactName}
                                                    status={client.status || 'Active'}
                                                />
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
                                                            top: '-10px',
                                                            right: '-10px',
                                                            backgroundColor: '#ef4444',
                                                            color: '#fff',
                                                            borderRadius: '999px',
                                                            padding: '0.1rem 0.4rem',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '0.6rem',
                                                            fontWeight: '700',
                                                            border: '1px solid rgba(248, 113, 113, 0.6)'
=======
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
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                                            <div className="text-xs text-slate-500">{client.address || '-'}</div>
                                            {client.address && (
                                                <a
                                                    href={client.propertyLink || `https://www.zillow.com/homes/${encodeURIComponent(client.address)}_rb/`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '0.25rem',
                                                        padding: '0.125rem 0.5rem',
                                                        backgroundColor: '#0074e4',
                                                        color: 'white',
                                                        textDecoration: 'none',
                                                        borderRadius: '0.25rem',
                                                        fontSize: '0.625rem',
                                                        fontWeight: '500',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    🏠
                                                </a>
                                            )}
                                        </div>
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
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
                                                        }}
                                                    >
                                                        {taskCount}
                                                    </span>
                                                )}
<<<<<<< HEAD
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

                <div className={styles.cardsMobile}>
                    {clients.map((client: any) => {
                    const leadAge = Math.floor(
                        (Date.now() - new Date(client.createdAt).getTime()) /
                        (1000 * 60 * 60 * 24),
                    );
                    const activeTasks = client.tasks?.filter((t: any) => t.completed !== true) || [];
                    const taskCount = activeTasks.length;

                    return (
                        <div key={client.id} className={styles.clientCard}>
                            <div className={styles.cardHeaderRow}>
                                <div>
                                    <Link href={`/clients/${client.id}`} className={styles.link}>
                                        <h3 className={styles.cardTitle}>{client.contactName}</h3>
                                    </Link>
                                    <p className={styles.cardSubtext}>{client.address || 'No address on file'}</p>
                                </div>
                                {client.deals && client.deals.length > 0 ? (
                                    <span
                                        style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '0.5rem',
                                            fontSize: '0.7rem',
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
                                            borderRadius: '0.5rem',
                                            fontSize: '0.7rem',
                                            fontWeight: '600',
                                            color: '#94a3b8',
                                            background: '#f1f5f9',
                                        }}
                                    >
                                        Working
                                    </span>
                                )}
                            </div>

                            <div className={styles.cardGrid}>
                                <div>
                                    <div className={styles.cardLabel}>Email</div>
                                    <div className={styles.cardValue}>{client.email || '-'}</div>
                                </div>
                                <div>
                                    <div className={styles.cardLabel}>Phone</div>
                                    <div className={styles.cardValue}>{client.phone || '-'}</div>
                                </div>
                                <div>
                                    <div className={styles.cardLabel}>Lead age</div>
                                    <div className={styles.cardValue}>{leadAge} days</div>
                                </div>
                                <div>
                                    <div className={styles.cardLabel}>Deals</div>
                                    <div className={styles.cardValue}>{client.deals.length}</div>
                                </div>
                            </div>

                            <div className={styles.cardActions}>
                                <ClientActions
                                    clientId={client.id}
                                    clientName={client.contactName}
                                    status={client.status || 'Active'}
                                />
                                <div className={styles.cardLinks}>
                                    <Link href={`/tasks?client=${client.id}`} className={styles.link} style={{ position: 'relative' }}>
                                        View Tasks
                                        {taskCount > 0 && (
                                            <span
                                                style={{
                                                    position: 'absolute',
                                                    top: '-10px',
                                                    right: '-10px',
                                                    backgroundColor: '#ef4444',
                                                    color: '#fff',
                                                    borderRadius: '999px',
                                                    padding: '0.1rem 0.4rem',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '0.6rem',
                                                    fontWeight: '700',
                                                    border: '1px solid rgba(248, 113, 113, 0.6)'
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
                            </div>
                        </div>
                    );
                })}
                </div>
            </div>

=======
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
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
        </div>
    );
}
