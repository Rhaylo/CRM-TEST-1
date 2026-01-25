'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './ClientTabs.module.css';
import { updateMotivation } from './actions';
import TaskList from './TaskList';
import TaskLogSection from './TaskLogSection';
import AddTaskForm from './AddTaskForm';

export default function ClientTabs({ client }: { client: any }) {
    const [activeTab, setActiveTab] = useState('overview');
    const [motivationScore, setMotivationScore] = useState(client.motivationScore || 5);
    const [motivationNote, setMotivationNote] = useState(client.motivationNote || '');
    const [condition, setCondition] = useState(client.propertyCondition || '');
    const router = useRouter();

    const handleUpdateMotivation = async () => {
        try {
            await updateMotivation(
                client.id,
                parseInt(motivationScore.toString(), 10),
                motivationNote,
                condition
            );
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Failed to update.');
        }
    };

    return (
        <div className={styles.tabsContainer}>
            <div className={styles.tabsList}>
                {['overview', 'tasks', 'deals', 'contracts'].map((tab) => (
                    <button
                        key={tab}
                        className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab === 'tasks' ? 'Tasks & Notes' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            <div className={styles.tabContent}>
                {activeTab === 'overview' && (
                    <div className={`${styles.grid} ${styles.gridSingle}`}>
                        <div className={styles.sectionCard}>
                            <h3 className={styles.sectionTitle}>Seller Motivation</h3>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Motivation Score (1-10)</label>
                                <select
                                    className={styles.select}
                                    value={motivationScore}
                                    onChange={(e) => setMotivationScore(e.target.value)}
                                >
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                                        <option key={n} value={n}>{n}</option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Motivation Notes</label>
                                <textarea
                                    className={styles.textarea}
                                    value={motivationNote}
                                    onChange={(e) => setMotivationNote(e.target.value)}
                                    placeholder="Why is this score assigned?"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Property Condition</label>
                                <textarea
                                    className={styles.textarea}
                                    value={condition}
                                    onChange={(e) => setCondition(e.target.value)}
                                    placeholder="Describe the property condition..."
                                    rows={4}
                                />
                            </div>
                            <button className={styles.btn} onClick={handleUpdateMotivation}>Update Motivation</button>
                        </div>
                    </div>
                )}

                {activeTab === 'tasks' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                            <h3 className={styles.sectionTitle}>Active Tasks</h3>
                            <AddTaskForm clientId={client.id} />
                        </div>
                        <TaskList tasks={client.tasks || []} clientId={client.id} />

                        <div style={{ marginTop: '2rem', borderTop: '1px solid #e2e8f0', paddingTop: '2rem' }}>
                            <TaskLogSection client={client} />
                        </div>
                    </div>
                )}

                {activeTab === 'deals' && (
                    <div>
                        <h3 className={styles.sectionTitle}>Deal History</h3>
                        {client.deals.length === 0 ? (
                            <p className="text-slate-500">No deals found.</p>
                        ) : (
                            client.deals.map((deal: any) => (
                                <div key={deal.id} className={styles.dealItem}>
                                    <div>
                                        <div className="font-medium text-lg">${deal.amount.toLocaleString()}</div>
                                        <div className="text-sm text-slate-500">{deal.products}</div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className={styles.dealStage}>{deal.stage}</span>
                                        <span className="text-xs text-slate-400">{new Date(deal.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'contracts' && (
                    <div>
                        <h3 className={styles.sectionTitle}>Contract History</h3>
                        {client.contracts && client.contracts.length > 0 ? (
                            client.contracts.map((contract: any) => (
                                <div key={contract.id} className={styles.dealItem}>
                                    <div>
                                        <div className="font-medium">Contract #{contract.id}</div>
                                        <div className="text-sm text-slate-500">Deal #{contract.dealId}</div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className={styles.dealStage}>{contract.status}</span>
                                        <span className="text-xs text-slate-400">Sent: {contract.dateSent ? new Date(contract.dateSent).toLocaleDateString() : 'N/A'}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-500">No previous contracts found.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
