'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createScheduledTask } from '../actions';
import styles from '../../admin.module.css';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewScheduledTaskPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        schedule: '0 9 * * *', // Default: Daily at 9 AM
        action: '{}',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await createScheduledTask(formData);
            router.push('/admin/scheduler');
            router.refresh();
        } catch (error) {
            alert('Failed to create task');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Create Scheduled Task</h1>
                <p className={styles.pageDescription}>Define a recurring task schedule</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.card}>
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Task Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '0.5rem',
                                border: '1px solid #334155',
                                backgroundColor: '#0f172a',
                                color: 'white'
                            }}
                            placeholder="e.g., Daily Report"
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '0.5rem',
                                border: '1px solid #334155',
                                backgroundColor: '#0f172a',
                                color: 'white',
                                minHeight: '80px'
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                            Step 1: Choose Schedule Type
                        </label>
                        <select
                            value={
                                formData.schedule === '0 9 * * *' && formData.action.includes('check_lead_age') ? 'lead_aging' :
                                    formData.schedule === '0 * * * *' && formData.action.includes('check_task_due') ? 'task_due' :
                                        'custom_cron'
                            }
                            onChange={(e) => {
                                if (e.target.value === 'lead_aging') {
                                    setFormData({
                                        ...formData,
                                        schedule: '0 9 * * *', // Daily at 9 AM
                                        action: JSON.stringify({ type: 'check_lead_age', days: 7 })
                                    });
                                } else if (e.target.value === 'task_due') {
                                    setFormData({
                                        ...formData,
                                        schedule: '0 * * * *', // Hourly
                                        action: JSON.stringify({ type: 'check_task_due', hoursBefore: 24 })
                                    });
                                } else {
                                    setFormData({
                                        ...formData,
                                        schedule: '0 9 * * *',
                                        action: '{}'
                                    });
                                }
                            }}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '0.5rem',
                                border: '1px solid #334155',
                                backgroundColor: '#0f172a',
                                color: 'white',
                                marginBottom: '1rem'
                            }}
                        >
                            <option value="custom_cron">Recurring Schedule (Cron)</option>
                            <option value="lead_aging">Lead Aging (Smart Trigger)</option>
                            <option value="task_due">Task Due Soon (Smart Trigger)</option>
                        </select>

                        {/* Show Cron Input only if Custom */}
                        {!(formData.action.includes('check_lead_age') || formData.action.includes('check_task_due')) && (
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                                    Cron Schedule
                                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginLeft: '0.5rem' }}>
                                        (min hour day month day-of-week)
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.schedule}
                                    onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '0.5rem',
                                        border: '1px solid #334155',
                                        backgroundColor: '#0f172a',
                                        color: '#a78bfa',
                                        fontFamily: 'monospace'
                                    }}
                                    placeholder="* * * * *"
                                />
                                <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
                                    Examples: "0 9 * * *" (Daily 9am), "0 0 * * 1" (Weekly Mon)
                                </p>
                            </div>
                        )}

                        {/* Show Days Input if Lead Aging */}
                        {(formData.action.includes('check_lead_age')) && (
                            <div style={{ padding: '1rem', background: '#1e293b', borderRadius: '0.5rem', border: '1px solid #334155' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                                    Trigger when Lead is older than (days):
                                </label>
                                <input
                                    type="number"
                                    value={(() => {
                                        try { return JSON.parse(formData.action).days || 7 } catch { return 7 }
                                    })()}
                                    onChange={(e) => {
                                        const days = parseInt(e.target.value);
                                        setFormData({
                                            ...formData,
                                            action: JSON.stringify({ type: 'check_lead_age', days })
                                        });
                                    }}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '0.5rem',
                                        border: '1px solid #334155',
                                        backgroundColor: '#0f172a',
                                        color: 'white'
                                    }}
                                />
                                <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                                    This will run daily at 9:00 AM and create a follow-up task for any lead older than {(() => { try { return JSON.parse(formData.action).days || 7 } catch { return 7 } })()} days.
                                </p>
                            </div>
                        )}

                        {/* Show Hours Input if Task Due */}
                        {(formData.action.includes('check_task_due')) && (
                            <div style={{ padding: '1rem', background: '#1e293b', borderRadius: '0.5rem', border: '1px solid #334155' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                                    Notify before due date (hours):
                                </label>
                                <input
                                    type="number"
                                    value={(() => {
                                        try { return JSON.parse(formData.action).hoursBefore || 24 } catch { return 24 }
                                    })()}
                                    onChange={(e) => {
                                        const hoursBefore = parseInt(e.target.value);
                                        setFormData({
                                            ...formData,
                                            action: JSON.stringify({ type: 'check_task_due', hoursBefore })
                                        });
                                    }}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '0.5rem',
                                        border: '1px solid #334155',
                                        backgroundColor: '#0f172a',
                                        color: 'white'
                                    }}
                                />
                                <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                                    This will run hourly and add a reminder note to any task due within the next {(() => { try { return JSON.parse(formData.action).hoursBefore || 24 } catch { return 24 } })()} hours.
                                </p>
                            </div>
                        )}
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                            Step 2: Assign an Action
                        </label>

                        <div style={{
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            border: '1px solid #334155',
                            backgroundColor: '#1e293b'
                        }}>
                            {/* If Lead Aging or Task Due is selected, show a read-only message or specific config */}
                            {formData.action.includes('check_lead_age') ? (
                                <div style={{ color: '#94a3b8', fontStyle: 'italic' }}>
                                    Action is automatically set to: <strong>Create Follow-up Tasks</strong> for identified leads.
                                </div>
                            ) : formData.action.includes('check_task_due') ? (
                                <div style={{ color: '#94a3b8', fontStyle: 'italic' }}>
                                    Action is automatically set to: <strong>Add Reminder Note</strong> to tasks due soon.
                                </div>
                            ) : (
                                <>
                                    <select
                                        value={(() => {
                                            try {
                                                return JSON.parse(formData.action).type || '';
                                            } catch {
                                                return '';
                                            }
                                        })()}
                                        onChange={(e) => {
                                            const type = e.target.value;
                                            let newAction: any = { type };
                                            if (type === 'create_task') newAction = { type, title: 'New Scheduled Task', priority: 'Medium' };
                                            if (type === 'send_summary_report') newAction = { type, recipients: 'admin@crm.com' };
                                            if (type === 'cleanup_logs') newAction = { type, daysToKeep: 30 };

                                            setFormData({ ...formData, action: JSON.stringify(newAction) });
                                        }}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '0.5rem',
                                            border: '1px solid #334155',
                                            backgroundColor: '#0f172a',
                                            color: 'white',
                                            marginBottom: '1rem'
                                        }}
                                    >
                                        <option value="">Select an action...</option>
                                        <option value="create_task">Create a Task</option>
                                        <option value="send_summary_report">Send Summary Report</option>
                                        <option value="cleanup_logs">Cleanup Old Logs</option>
                                    </select>

                                    {/* Dynamic Fields based on Action Type */}
                                    {(() => {
                                        try {
                                            const action = JSON.parse(formData.action);
                                            if (!action || !action.type) return null;

                                            if (action.type === 'create_task') {
                                                return (
                                                    <div style={{ display: 'grid', gap: '1rem' }}>
                                                        <div>
                                                            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Task Title</label>
                                                            <input
                                                                type="text"
                                                                value={action.title || ''}
                                                                onChange={(e) => {
                                                                    const newAction = { ...action, title: e.target.value };
                                                                    setFormData({ ...formData, action: JSON.stringify(newAction) });
                                                                }}
                                                                style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #334155', background: '#0f172a', color: 'white' }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Priority</label>
                                                            <select
                                                                value={action.priority || 'Medium'}
                                                                onChange={(e) => {
                                                                    const newAction = { ...action, priority: e.target.value };
                                                                    setFormData({ ...formData, action: JSON.stringify(newAction) });
                                                                }}
                                                                style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #334155', background: '#0f172a', color: 'white' }}
                                                            >
                                                                <option value="Low">Low</option>
                                                                <option value="Medium">Medium</option>
                                                                <option value="High">High</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                );
                                            }

                                            if (action.type === 'send_summary_report') {
                                                return (
                                                    <div>
                                                        <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Recipients</label>
                                                        <input
                                                            type="text"
                                                            value={action.recipients || ''}
                                                            onChange={(e) => {
                                                                const newAction = { ...action, recipients: e.target.value };
                                                                setFormData({ ...formData, action: JSON.stringify(newAction) });
                                                            }}
                                                            style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #334155', background: '#0f172a', color: 'white' }}
                                                            placeholder="email@example.com"
                                                        />
                                                    </div>
                                                );
                                            }

                                            if (action.type === 'cleanup_logs') {
                                                return (
                                                    <div>
                                                        <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Days to Keep</label>
                                                        <input
                                                            type="number"
                                                            value={action.daysToKeep || 30}
                                                            onChange={(e) => {
                                                                const newAction = { ...action, daysToKeep: parseInt(e.target.value) };
                                                                setFormData({ ...formData, action: JSON.stringify(newAction) });
                                                            }}
                                                            style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #334155', background: '#0f172a', color: 'white' }}
                                                        />
                                                    </div>
                                                );
                                            }
                                        } catch (e) {
                                            return <div style={{ color: '#ef4444' }}>Error parsing action data</div>;
                                        }
                                    })()}
                                </>
                            )}
                        </div>

                        {/* Hidden textarea to maintain compatibility if needed, or just for debug */}
                        <details style={{ marginTop: '0.5rem' }}>
                            <summary style={{ fontSize: '0.75rem', color: '#64748b', cursor: 'pointer' }}>Advanced: View JSON</summary>
                            <textarea
                                value={formData.action}
                                onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    marginTop: '0.5rem',
                                    borderRadius: '0.5rem',
                                    border: '1px solid #334155',
                                    backgroundColor: '#0f172a',
                                    color: '#a78bfa',
                                    fontFamily: 'monospace',
                                    minHeight: '80px',
                                    fontSize: '0.75rem'
                                }}
                            />
                        </details>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button
                            type="submit"
                            disabled={loading}
                            className={styles.btn}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <Save size={18} />
                            {loading ? 'Saving...' : 'Create Task'}
                        </button>
                        <Link href="/admin/scheduler">
                            <button type="button" className={styles.btnSecondary} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <ArrowLeft size={18} />
                                Cancel
                            </button>
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
}
