import { prisma } from '@/lib/prisma';
import styles from '../admin.module.css';
import { Search, Filter, Trash2 } from 'lucide-react';

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
                <h1 className={styles.pageTitle}>Execution Logs</h1>
                <p className={styles.pageDescription}>History of all automation runs</p>
            </div>

            <div className={styles.card}>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            type="text"
                            placeholder="Search logs..."
                            defaultValue={query}
                            style={{
                                width: '100%',
                                padding: '0.75rem 0.75rem 0.75rem 3rem',
                                borderRadius: '0.5rem',
                                border: '1px solid #334155',
                                backgroundColor: '#0f172a',
                                color: 'white'
                            }}
                        />
                    </div>
                    <select
                        defaultValue={status}
                        style={{
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            border: '1px solid #334155',
                            backgroundColor: '#0f172a',
                            color: 'white'
                        }}
                    >
                        <option value="">All Statuses</option>
                        <option value="success">Success</option>
                        <option value="failed">Failed</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>

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
