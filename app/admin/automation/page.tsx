<<<<<<< HEAD
export const dynamic = 'force-dynamic';
export const revalidate = 0;

=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Plus, Play, Edit, Trash2, Power } from 'lucide-react';
import styles from '../admin.module.css';
import { toggleAutomationRule, deleteAutomationRule, executeAutomationRule } from './actions';
import { revalidatePath } from 'next/cache';

export default async function AutomationRulesPage() {
    const rules = await prisma.automationRule.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { executions: true }
            }
        }
    });

    async function toggleRule(id: number, currentState: boolean) {
        'use server';
        await toggleAutomationRule(id, !currentState);
    }

    async function deleteRule(id: number) {
        'use server';
        await deleteAutomationRule(id);
    }

    async function runRule(id: number) {
        'use server';
        await executeAutomationRule(id, { triggeredBy: 'manual_admin' });
    }

    return (
        <div>
            <div className={styles.pageHeader}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className={styles.pageTitle}>Automation Rules</h1>
                        <p className={styles.pageDescription}>Manage automated workflows and triggers</p>
                    </div>
                    <Link href="/admin/automation/new">
                        <button className={styles.btn}>
                            <Plus size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                            Create Rule
                        </button>
                    </Link>
                </div>
            </div>

            <div className={styles.card}>
                {rules.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyStateIcon}>🤖</div>
                        <h3>No automation rules defined</h3>
                        <p>Create your first rule to automate tasks and deals.</p>
                    </div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Name</th>
                                <th>Trigger</th>
                                <th>Executions</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rules.map((rule) => (
                                <tr key={rule.id}>
                                    <td>
                                        <form action={toggleRule.bind(null, rule.id, rule.enabled)}>
                                            <button
                                                type="submit"
                                                className={styles.toggle}
                                                title={rule.enabled ? "Disable Rule" : "Enable Rule"}
                                                style={{ background: 'none', border: 'none', padding: 0 }}
                                            >
                                                <div style={{
                                                    width: '40px',
                                                    height: '20px',
                                                    backgroundColor: rule.enabled ? '#10b981' : '#cbd5e1',
                                                    borderRadius: '20px',
                                                    position: 'relative',
                                                    transition: 'background-color 0.2s',
                                                    cursor: 'pointer'
                                                }}>
                                                    <div style={{
                                                        width: '16px',
                                                        height: '16px',
                                                        backgroundColor: 'white',
                                                        borderRadius: '50%',
                                                        position: 'absolute',
                                                        top: '2px',
                                                        left: rule.enabled ? '22px' : '2px',
                                                        transition: 'left 0.2s',
                                                        boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                                                    }} />
                                                </div>
                                            </button>
                                        </form>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 600 }}>{rule.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{rule.description}</div>
                                    </td>
                                    <td>
                                        <span className={styles.badgeInfo}>{rule.triggerType}</span>
                                    </td>
                                    <td>{rule._count.executions}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <form action={runRule.bind(null, rule.id)}>
                                                <button type="submit" className={styles.btnSecondary} title="Run Now" style={{ padding: '0.25rem 0.5rem' }}>
                                                    <Play size={14} />
                                                </button>
                                            </form>
                                            <Link href={`/admin/automation/${rule.id}`}>
                                                <button className={styles.btnSecondary} title="Edit" style={{ padding: '0.25rem 0.5rem' }}>
                                                    <Edit size={14} />
                                                </button>
                                            </Link>
                                            <form action={deleteRule.bind(null, rule.id)}>
                                                <button
                                                    type="submit"
                                                    className={styles.btnDanger}
                                                    title="Delete"
                                                    style={{ padding: '0.25rem 0.5rem' }}
                                                // Note: In a real app we'd want a confirmation dialog here
                                                >
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
