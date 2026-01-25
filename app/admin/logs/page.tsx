import { prisma } from '@/lib/prisma';
import styles from '../admin.module.css';
import { Search } from 'lucide-react';

export default async function ExecutionLogsPage(props: { searchParams: Promise<{ q?: string; status?: string }> }) {
    const searchParams = await props.searchParams;
    const query = searchParams.q || '';
    const status = searchParams.status || '';

    const where: any = {};
    if (status) where.status = status;
    if (query) {
        where.OR = [
            { rule: { name: { contains: query } } },
            { error: { contains: query } }
        ];
    }

    const logs = await prisma.automationExecution.findMany({
        where,
        include: { rule: true },
        orderBy: { startedAt: 'desc' },
        take: 50,
    });

    return (
        <div>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>
                        Execution Logs
                        <span className={styles.countBadge}>{logs.length}</span>
                    </h1>
                    <p className={styles.pageDescription}>History of all automation runs</p>
                </div>
            </div>

            <div className={styles.card}>
                <form className={styles.filterBar}>
                    <div className={styles.searchWrap}>
                        <Search size={18} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            type="text"
                            name="q"
                            placeholder="Search logs..."
                            defaultValue={query}
                            className={styles.searchInput}
                        />
                    </div>
                    <select name="status" defaultValue={status} className={styles.selectField}>
                        <option value="">All Statuses</option>
                        <option value="success">Success</option>
                        <option value="failed">Failed</option>
                        <option value="pending">Pending</option>
                    </select>
                    <button type="submit" className={styles.btn}>Apply</button>
                </form>

                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Status</th>
                            <th>Rule Name</th>
                            <th>Started At</th>
                            <th>Duration</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log) => {
                            const duration = log.completedAt
                                ? Math.round((new Date(log.completedAt).getTime() - new Date(log.startedAt).getTime()))
                                : null;

                            return (
                                <tr key={log.id}>
                                    <td>
                                        <span className={`${styles.badge} ${log.status === 'success' ? styles.badgeSuccess :
                                            log.status === 'failed' ? styles.badgeDanger :
                                                styles.badgeWarning
                                            }`}>
                                            {log.status}
                                        </span>
                                    </td>
                                    <td>
                                        {log.rule?.name || (
                                            <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>
                                                {log.metadata?.includes('taskId') ? 'Scheduled Task' : 'System Action'}
                                            </span>
                                        )}
                                    </td>
                                    <td>{new Date(log.startedAt).toLocaleString()}</td>
                                    <td>{duration ? `${duration}ms` : '-'}</td>
                                    <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#94a3b8' }}>
                                        {log.error || log.metadata || '-'}
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
