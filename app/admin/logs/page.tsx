import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import styles from '../admin.module.css';
import { Search } from 'lucide-react';

const entityOptions = [
    'client',
    'deal',
    'task',
    'note',
    'contract',
    'investor',
    'additional_seller',
    'title_company',
    'escrow_agent',
    'automation',
    'scheduled_task',
    'system',
];

export default async function ActivityHistoryPage(props: { searchParams: Promise<{ q?: string; type?: string; action?: string }> }) {
    const searchParams = await props.searchParams;
    const query = searchParams.q || '';
    const type = searchParams.type || '';
    const action = searchParams.action || '';

    const where: any = {};
    if (type) where.entityType = type;
    if (action) where.action = action;
    if (query) {
        where.OR = [
            { summary: { contains: query } },
            { metadata: { contains: query } },
        ];
    }

    const canUseDelegate = typeof (prisma as any).activityLog?.findMany === 'function';

    const logs = canUseDelegate
        ? await prisma.activityLog.findMany({
            where,
            include: { user: true },
            orderBy: { createdAt: 'desc' },
            take: 100,
        })
        : await (async () => {
            const conditions: Prisma.Sql[] = [];
            if (type) conditions.push(Prisma.sql`l.entityType = ${type}`);
            if (action) conditions.push(Prisma.sql`l.action = ${action}`);
            if (query) {
                const like = `%${query}%`;
                conditions.push(Prisma.sql`(l.summary LIKE ${like} OR l.metadata LIKE ${like})`);
            }

            const whereSql = conditions.length
                ? Prisma.sql`WHERE ${Prisma.join(conditions, ' AND ')}`
                : Prisma.empty;

            const rows = await prisma.$queryRaw<
                Array<{
                    id: number;
                    userId: string | null;
                    action: string;
                    entityType: string;
                    entityId: number | null;
                    summary: string;
                    metadata: string | null;
                    createdAt: string;
                    userName: string | null;
                    userEmail: string | null;
                }>
            >(Prisma.sql`
                SELECT
                    l.id,
                    l.userId,
                    l.action,
                    l.entityType,
                    l.entityId,
                    l.summary,
                    l.metadata,
                    l.createdAt,
                    u.name AS userName,
                    u.email AS userEmail
                FROM ActivityLog l
                LEFT JOIN app_user u ON u.id = l.userId
                ${whereSql}
                ORDER BY l.createdAt DESC
                LIMIT 100
            `);

            return rows.map((row) => ({
                id: row.id,
                userId: row.userId,
                action: row.action,
                entityType: row.entityType,
                entityId: row.entityId,
                summary: row.summary,
                metadata: row.metadata,
                createdAt: row.createdAt,
                user: {
                    name: row.userName,
                    email: row.userEmail,
                },
            }));
        })();

    return (
        <div>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>
                        Activity History
                        <span className={styles.countBadge}>{logs.length}</span>
                    </h1>
                    <p className={styles.pageDescription}>Recent activity across your CRM</p>
                </div>
            </div>

            <div className={styles.card}>
                <form className={styles.filterBar}>
                    <div className={styles.searchWrap}>
                        <Search size={18} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            type="text"
                            name="q"
                            placeholder="Search activity..."
                            defaultValue={query}
                            className={styles.searchInput}
                        />
                    </div>
                    <select name="type" defaultValue={type} className={styles.selectField}>
                        <option value="">All Types</option>
                        {entityOptions.map((option) => (
                            <option key={option} value={option}>{option.replace('_', ' ')}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        name="action"
                        placeholder="Action (optional)"
                        defaultValue={action}
                        className={styles.searchInput}
                        style={{ maxWidth: '220px' }}
                    />
                    <button type="submit" className={styles.btn}>Apply</button>
                </form>

                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Action</th>
                            <th>Entity</th>
                            <th>Summary</th>
                            <th>User</th>
                            <th>When</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log) => {
                            const userLabel = log.user?.name || log.user?.email || (log.userId ? 'User' : 'System');
                            const entityLabel = log.entityId ? `${log.entityType} #${log.entityId}` : log.entityType;

                            return (
                                <tr key={log.id}>
                                    <td>
                                        <span className={`${styles.badge} ${styles.badgeInfo}`}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td>{entityLabel}</td>
                                    <td style={{ maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {log.summary}
                                    </td>
                                    <td>{userLabel}</td>
                                    <td>{new Date(log.createdAt).toLocaleString()}</td>
                                    <td style={{ maxWidth: '320px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#94a3b8' }}>
                                        {log.metadata || '-'}
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
