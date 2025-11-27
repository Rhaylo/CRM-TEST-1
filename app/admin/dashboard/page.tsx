import { prisma } from '@/lib/prisma';
import { Activity, Zap, Clock, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import styles from '../admin.module.css';

export default async function AdminDashboard() {
    // Fetch statistics
    const [automationRules, scheduledTasks, recentExecutions] = await Promise.all([
        prisma.automationRule.findMany({
            include: { executions: { take: 5, orderBy: { startedAt: 'desc' } } }
        }),
        prisma.scheduledTask.findMany(),
        prisma.automationExecution.findMany({
            take: 10,
            orderBy: { startedAt: 'desc' },
            include: { rule: true }
        })
    ]);

    const activeRules = automationRules.filter(r => r.enabled).length;
    const activeTasks = scheduledTasks.filter(t => t.enabled).length;
    const successfulExecutions = recentExecutions.filter(e => e.status === 'success').length;

    return (
        <div>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Administrator Dashboard</h1>
                <p className={styles.pageDescription}>Monitor and manage all automation processes</p>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>
                        <Zap size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                        Active Automation Rules
                    </div>
                    <div className={styles.statValue}>{activeRules}</div>
                    <div className={styles.statChange}>of {automationRules.length} total</div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statLabel}>
                        <Clock size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                        Scheduled Tasks
                    </div>
                    <div className={styles.statValue}>{activeTasks}</div>
                    <div className={styles.statChange}>of {scheduledTasks.length} total</div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statLabel}>
                        <Activity size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                        Recent Executions
                    </div>
                    <div className={styles.statValue}>{recentExecutions.length}</div>
                    <div className={styles.statChange}>last 10 runs</div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statLabel}>
                        <TrendingUp size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                        Success Rate
                    </div>
                    <div className={styles.statValue}>
                        {recentExecutions.length > 0
                            ? Math.round((successfulExecutions / recentExecutions.length) * 100)
                            : 0}%
                    </div>
                    <div className={styles.statChange}>{successfulExecutions} successful</div>
                </div>
            </div>

            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>Recent Activity</h2>
                    <Link href="/admin/logs">
                        <button className={styles.btnSecondary}>View All →</button>
                    </Link>
                </div>

                {recentExecutions.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyStateIcon}>📊</div>
                        <p>No automation executions yet</p>
                    </div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Rule</th>
                                <th>Status</th>
                                <th>Started At</th>
                                <th>Duration</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentExecutions.map((execution) => {
                                const duration = execution.completedAt
                                    ? Math.round((new Date(execution.completedAt).getTime() - new Date(execution.startedAt).getTime()) / 1000)
                                    : null;

                                return (
                                    <tr key={execution.id}>
                                        <td>
                                            {execution.rule?.name || (
                                                <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>
                                                    {execution.metadata?.includes('taskId') ? 'Scheduled Task' : 'System Action'}
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            <span className={`${styles.badge} ${execution.status === 'success' ? styles.badgeSuccess :
                                                execution.status === 'failed' ? styles.badgeDanger :
                                                    styles.badgeWarning
                                                }`}>
                                                {execution.status}
                                            </span>
                                        </td>
                                        <td>{new Date(execution.startedAt).toLocaleString()}</td>
                                        <td>{duration ? `${duration}s` : '-'}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2 className={styles.cardTitle}>Quick Actions</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <Link href="/admin/automation/new">
                            <button className={styles.btn} style={{ width: '100%' }}>
                                + Create Automation Rule
                            </button>
                        </Link>
                        <Link href="/admin/scheduler/new">
                            <button className={styles.btn} style={{ width: '100%' }}>
                                + Create Scheduled Task
                            </button>
                        </Link>
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2 className={styles.cardTitle}>System Status</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Automation System</span>
                            <span className={styles.badgeSuccess}>✓ Active</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Database</span>
                            <span className={styles.badgeSuccess}>✓ Connected</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Scheduler</span>
                            <span className={styles.badgeSuccess}>✓ Running</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
