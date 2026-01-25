import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Home, ListChecks, Eye } from 'lucide-react';
import styles from './ClientList.module.css';
import SortSelect from './SortSelect';
import ClientActions from './ClientActions';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ClientSearch from './ClientSearch';
import DealStageFilter from './DealStageFilter';

export default async function ClientList({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const user = await getCurrentUser();
    if (!user) {
        redirect('/auth');
    }

    const status = typeof searchParams.status === 'string' ? searchParams.status : 'Active';
    const hasSortParam = typeof searchParams.sort === 'string';
    const sort = hasSortParam ? (searchParams.sort as string) : 'newest';
    const hasDealStageParam = typeof searchParams.dealStage === 'string';
    const dealStage = hasDealStageParam ? (searchParams.dealStage as string) : 'all';
    const query = typeof searchParams.q === 'string' ? searchParams.q : undefined;

    const buildTabHref = (nextStatus: string) => {
        const params = new URLSearchParams();
        params.set('status', nextStatus);
        if (sort) params.set('sort', sort);
        if (query) params.set('q', query);
        if (dealStage !== 'all') params.set('dealStage', dealStage);
        return `/clients?${params.toString()}`;
    };

    let orderBy: any = { updatedAt: 'desc' };
    if (sort === 'oldest') orderBy = { createdAt: 'asc' };
    if (sort === 'motivation') orderBy = { motivationScore: 'desc' };

    const where: any = {
        OR: [{ userId: user.id }, { userId: null }],
        status: status === 'All' ? undefined : status,
    };

    if (dealStage !== 'all') {
        if (dealStage === 'none') {
            where.deals = { none: {} };
        } else {
            where.deals = { some: { stage: dealStage } };
        }
    }

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
                    <span className={styles.countBadge}>{clients.length}</span>
                </h1>
                <div className={styles.controls}>
                    <div className={styles.searchWrap}>
                        <ClientSearch />
                    </div>
                    <div className={styles.controlsRow}>
                        <Link href="/clients/new" className={styles.addButton}>
                            + Add Client
                        </Link>
                        <DealStageFilter
                            status={status}
                            sort={sort}
                            query={query}
                            dealStage={dealStage}
                            hasDealStageParam={hasDealStageParam}
                        />
                        <SortSelect
                            status={status}
                            dealStage={dealStage}
                            query={query}
                            sort={sort}
                            hasSortParam={hasSortParam}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.tabs}>
                <Link href={buildTabHref('Active')} className={`${styles.tab} ${status === 'Active' ? styles.activeTab : ''}`}>
                    Active
                </Link>
                <Link href={buildTabHref('Snoozed')} className={`${styles.tab} ${status === 'Snoozed' ? styles.activeTab : ''}`}>
                    Snoozed
                </Link>
                <Link href={buildTabHref('Archived')} className={`${styles.tab} ${status === 'Archived' ? styles.activeTab : ''}`}>
                    Archived
                </Link>
                <Link href={buildTabHref('Fall Through')} className={`${styles.tab} ${status === 'Fall Through' ? styles.activeTab : ''}`}>
                    Fall Through
                </Link>
            </div>

            <div className={styles.resultsWrap} key={status}>
                <div className={`${styles.tableContainer} ${styles.tableDesktop}`}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.th}>Contact Name</th>
                                <th className={styles.th}>Email</th>
                                <th className={styles.th}>Phone</th>
                                <th className={`${styles.th} ${styles.thCenter}`}>Lead Age</th>
                                <th className={`${styles.th} ${styles.thCenter}`}>Deals</th>
                                <th className={`${styles.th} ${styles.thCenter}`}>Status</th>
                                <th className={`${styles.th} ${styles.thCenter}`}>Actions</th>
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
                                const stage = client.deals?.[0]?.stage;
                                const stageClass = stage === 'Complete'
                                    ? styles.stageComplete
                                    : stage === 'Pending'
                                        ? styles.stagePending
                                        : stage === 'Contract In'
                                            ? styles.stageContract
                                            : stage
                                                ? styles.stageActive
                                                : styles.stageWorking;

                                return (
                                    <tr key={client.id} className={styles.tr}>
                                        <td className={styles.td}>
                                            <Link href={`/clients/${client.id}`} className={styles.link}>
                                                <div className="font-medium">{client.contactName}</div>
                                            </Link>
                                            <div className={styles.addressRow}>
                                                <div className={styles.addressText}>{client.address || '-'}</div>
                                                {client.address && (
                                                    <a
                                                        href={client.propertyLink || `https://www.zillow.com/homes/${encodeURIComponent(client.address)}_rb/`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={styles.propertyLink}
                                                    >
                                                        <Home size={12} />
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
                                        <td className={`${styles.td} ${styles.tdCenter}`}>{leadAge} days</td>
                                        <td className={`${styles.td} ${styles.tdCenter}`}>{client.deals.length}</td>
                                        <td className={`${styles.td} ${styles.tdCenter}`}>
                                            <span className={`${styles.statusBadge} ${stageClass}`}>
                                                {stage || 'Working'}
                                            </span>
                                        </td>
                                        <td className={`${styles.td} ${styles.tdCenter}`}>
                                            <div className={styles.actionGroup}>
                                                <ClientActions
                                                    clientId={client.id}
                                                    clientName={client.contactName}
                                                    status={client.status || 'Active'}
                                                />
                                                <Link href={`/tasks?client=${client.id}`} className={`${styles.actionButton} ${styles.actionButtonGhost}`}>
                                                    <ListChecks size={14} />
                                                    Tasks
                                                    {taskCount > 0 && (
                                                        <span className={styles.taskPill}>{taskCount}</span>
                                                    )}
                                                </Link>
                                                <Link href={`/clients/${client.id}`} className={`${styles.actionButton} ${styles.actionButtonGhost}`}>
                                                    <Eye size={14} />
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
                        const stage = client.deals?.[0]?.stage;
                        const stageClass = stage === 'Complete'
                            ? styles.stageComplete
                            : stage === 'Pending'
                                ? styles.stagePending
                                : stage === 'Contract In'
                                    ? styles.stageContract
                                    : stage
                                        ? styles.stageActive
                                        : styles.stageWorking;

                        return (
                            <div key={client.id} className={styles.clientCard}>
                                <div className={styles.cardHeaderRow}>
                                    <div>
                                        <Link href={`/clients/${client.id}`} className={styles.link}>
                                            <h3 className={styles.cardTitle}>{client.contactName}</h3>
                                        </Link>
                                        <p className={styles.cardSubtext}>{client.address || 'No address on file'}</p>
                                    </div>
                                    <span className={`${styles.statusBadge} ${stageClass}`}>
                                        {stage || 'Working'}
                                    </span>
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
                                        <Link href={`/tasks?client=${client.id}`} className={`${styles.actionButton} ${styles.actionButtonGhost}`}>
                                            <ListChecks size={14} />
                                            Tasks
                                            {taskCount > 0 && (
                                                <span className={styles.taskPill}>{taskCount}</span>
                                            )}
                                        </Link>
                                        <Link href={`/clients/${client.id}`} className={`${styles.actionButton} ${styles.actionButtonGhost}`}>
                                            <Eye size={14} />
                                            View
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
