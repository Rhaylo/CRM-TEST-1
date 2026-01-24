import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Plus, Play, Edit, Trash2, Clock } from 'lucide-react';
import styles from '../admin.module.css';
import { toggleScheduledTask, deleteScheduledTask, runScheduledTask } from './actions';

export const dynamic = 'force-dynamic';
export default async function SchedulerPage() {
    const tasks = await prisma.scheduledTask.findMany({
        orderBy: { createdAt: 'desc' }
    });

    async function toggleTask(id: number, currentState: boolean) {
        'use server';
        await toggleScheduledTask(id, !currentState);
    }

    async function deleteTask(id: number) {
        'use server';
        await deleteScheduledTask(id);
    }

    async function runTask(id: number) {
        'use server';
        await runScheduledTask(id);
    }

    return (
        <div>
            <div className={styles.pageHeader}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className={styles.pageTitle}>Task Scheduler</h1>
                        <p className={styles.pageDescription}>Manage recurring automated tasks (Cron jobs)</p>
                    </div>
                    <Link href="/admin/scheduler/new">
                        <button className={styles.btn}>
                            <Plus size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                            Create Schedule
                        </button>
                    </Link>
                </div>
            </div>

            <div className={styles.card}>
                {tasks.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyStateIcon}>⏰</div>
                        <h3>No scheduled tasks</h3>
                        <p>Create a task to run on a specific schedule.</p>
                    </div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Name</th>
                                <th>Schedule (Cron)</th>
                                <th>Last Run</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map((task) => (
                                <tr key={task.id}>
                                    <td>
                                        <form action={toggleTask.bind(null, task.id, task.enabled)}>
                                            <button
                                                type="submit"
                                                className={styles.toggle}
                                                style={{ background: 'none', border: 'none', padding: 0 }}
                                            >
                                                <div style={{
                                                    width: '40px',
                                                    height: '20px',
                                                    backgroundColor: task.enabled ? '#10b981' : '#cbd5e1',
                                                    borderRadius: '20px',
                                                    position: 'relative'
                                                }}>
                                                    <div style={{
                                                        width: '16px',
                                                        height: '16px',
                                                        backgroundColor: 'white',
                                                        borderRadius: '50%',
                                                        position: 'absolute',
                                                        top: '2px',
                                                        left: task.enabled ? '22px' : '2px'
                                                    }} />
                                                </div>
                                            </button>
                                        </form>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 600 }}>{task.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{task.description}</div>
                                    </td>
                                    <td>
                                        <span className={styles.badgeInfo} style={{ fontFamily: 'monospace' }}>
                                            {task.schedule}
                                        </span>
                                    </td>
                                    <td>
                                        {task.lastRun ? new Date(task.lastRun).toLocaleString() : '-'}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <form action={runTask.bind(null, task.id)}>
                                                <button type="submit" className={styles.btnSecondary} title="Run Now" style={{ padding: '0.25rem 0.5rem' }}>
                                                    <Play size={14} />
                                                </button>
                                            </form>
                                            <form action={deleteTask.bind(null, task.id)}>
                                                <button type="submit" className={styles.btnDanger} title="Delete" style={{ padding: '0.25rem 0.5rem' }}>
                                                    <Trash2 size={14} />
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
