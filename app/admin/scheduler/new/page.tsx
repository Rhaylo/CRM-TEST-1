'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createScheduledTask } from '../actions';
import styles from '../../admin.module.css';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type SchedulePreset = {
    label: string;
    cron: string;
    description: string;
};

const cronPresets: SchedulePreset[] = [
    { label: 'Daily 9 AM', cron: '0 9 * * *', description: 'Every day at 9:00 AM' },
    { label: 'Hourly', cron: '0 * * * *', description: 'Every hour on the hour' },
    { label: 'Weekly Mon', cron: '0 0 * * 1', description: 'Every Monday at 12:00 AM' },
    { label: 'Monthly 1st', cron: '0 0 1 * *', description: '1st of every month' },
];

const scheduleTypes = [
    {
        value: 'custom_cron',
        label: 'Recurring Schedule',
        description: 'Run on a cron schedule',
    },
    {
        value: 'lead_aging',
        label: 'Lead Aging',
        description: 'Auto-followup on old leads',
    },
    {
        value: 'task_due',
        label: 'Task Due Soon',
        description: 'Remind on upcoming tasks',
    },
];

const actionOptions = [
    {
        type: 'create_task',
        label: 'Create Task',
        description: 'Create a new task on schedule',
    },
    {
        type: 'send_summary_report',
        label: 'Send Summary',
        description: 'Email a recurring summary',
    },
    {
        type: 'cleanup_logs',
        label: 'Cleanup Logs',
        description: 'Remove old activity entries',
    },
];

function getCronPreview(cron: string) {
    const trimmed = cron.trim();
    if (trimmed === '0 9 * * *') return 'Every day at 9:00 AM';
    if (trimmed === '0 * * * *') return 'Every hour';
    if (trimmed === '0 0 * * 1') return 'Every Monday at 12:00 AM';
    if (trimmed === '0 0 1 * *') return 'Monthly on day 1 at 12:00 AM';
    if (trimmed === '*/15 * * * *') return 'Every 15 minutes';
    return 'Custom schedule';
}

export default function NewScheduledTaskPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        schedule: '0 9 * * *',
        action: '{}',
    });

    const setScheduleType = (type: string) => {
        if (type === 'lead_aging') {
            setFormData({
                ...formData,
                schedule: '0 9 * * *',
                action: JSON.stringify({ type: 'check_lead_age', days: 7 }),
            });
            return;
        }

        if (type === 'task_due') {
            setFormData({
                ...formData,
                schedule: '0 * * * *',
                action: JSON.stringify({ type: 'check_task_due', hoursBefore: 24 }),
            });
            return;
        }

        setFormData({
            ...formData,
            schedule: '0 9 * * *',
            action: '{}',
        });
    };

    const currentScheduleType = formData.action.includes('check_lead_age')
        ? 'lead_aging'
        : formData.action.includes('check_task_due')
            ? 'task_due'
            : 'custom_cron';

    const parseAction = () => {
        try {
            return JSON.parse(formData.action);
        } catch (error) {
            return {};
        }
    };

    const currentAction = parseAction();
    const currentActionType = currentAction?.type || '';

    const setActionType = (type: string) => {
        let newAction: any = { type };
        if (type === 'create_task') newAction = { type, title: 'New Scheduled Task', priority: 'Medium' };
        if (type === 'send_summary_report') newAction = { type, recipients: 'admin@crm.com' };
        if (type === 'cleanup_logs') newAction = { type, daysToKeep: 30 };

        setFormData({ ...formData, action: JSON.stringify(newAction) });
    };

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

            <form onSubmit={handleSubmit} className={styles.formLayout}>
                <section className={styles.formCard}>
                    <div className={styles.formCardHeader}>
                        <h2 className={styles.formCardTitle}>Basics</h2>
                        <p className={styles.formCardDescription}>Name your schedule and describe its purpose.</p>
                    </div>
                    <div className={styles.formGrid}>
                        <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>Task Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className={styles.inputField}
                                placeholder="e.g., Daily Report"
                            />
                            <span className={styles.fieldHint}>Keep it specific to the action.</span>
                        </div>

                        <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className={styles.textareaField}
                                placeholder="Describe what this task runs and who it affects."
                            />
                        </div>
                    </div>
                </section>

                <section className={styles.formCard}>
                    <div className={styles.formCardHeader}>
                        <h2 className={styles.formCardTitle}>Step 1: Schedule</h2>
                        <p className={styles.formCardDescription}>Choose a schedule type and timing.</p>
                    </div>

                    <div className={styles.actionGrid}>
                        {scheduleTypes.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                className={`${styles.actionCard} ${currentScheduleType === option.value ? styles.actionCardActive : ''}`}
                                onClick={() => setScheduleType(option.value)}
                            >
                                <div className={styles.actionCardTitle}>{option.label}</div>
                                <div className={styles.actionCardDesc}>{option.description}</div>
                            </button>
                        ))}
                    </div>

                    {currentScheduleType === 'custom_cron' && (
                        <div className={styles.actionFields}>
                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Cron Schedule</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.schedule}
                                    onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                                    className={styles.inputField}
                                    placeholder="* * * * *"
                                />
                                <span className={styles.fieldHint}>Format: min hour day month day-of-week</span>
                            </div>

                            <div className={styles.pillRow}>
                                {cronPresets.map((preset) => (
                                    <button
                                        type="button"
                                        key={preset.label}
                                        className={styles.pillButton}
                                        onClick={() => setFormData({ ...formData, schedule: preset.cron })}
                                    >
                                        {preset.label}
                                    </button>
                                ))}
                            </div>
                            <div className={styles.helperText}>Preview: {getCronPreview(formData.schedule)}</div>
                        </div>
                    )}

                    {currentScheduleType === 'lead_aging' && (
                        <div className={styles.actionFields}>
                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Trigger after (days)</label>
                                <input
                                    type="number"
                                    value={(() => {
                                        try {
                                            return parseAction().days || 7;
                                        } catch {
                                            return 7;
                                        }
                                    })()}
                                    onChange={(e) => {
                                        const days = parseInt(e.target.value);
                                        setFormData({
                                            ...formData,
                                            action: JSON.stringify({ type: 'check_lead_age', days }),
                                        });
                                    }}
                                    className={styles.inputField}
                                />
                                <span className={styles.fieldHint}>
                                    Runs daily at 9:00 AM and creates follow-up tasks for old leads.
                                </span>
                            </div>
                        </div>
                    )}

                    {currentScheduleType === 'task_due' && (
                        <div className={styles.actionFields}>
                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Notify before due (hours)</label>
                                <input
                                    type="number"
                                    value={(() => {
                                        try {
                                            return parseAction().hoursBefore || 24;
                                        } catch {
                                            return 24;
                                        }
                                    })()}
                                    onChange={(e) => {
                                        const hoursBefore = parseInt(e.target.value);
                                        setFormData({
                                            ...formData,
                                            action: JSON.stringify({ type: 'check_task_due', hoursBefore }),
                                        });
                                    }}
                                    className={styles.inputField}
                                />
                                <span className={styles.fieldHint}>
                                    Runs hourly and adds reminders to tasks due soon.
                                </span>
                            </div>
                        </div>
                    )}
                </section>

                <section className={styles.formCard}>
                    <div className={styles.formCardHeader}>
                        <h2 className={styles.formCardTitle}>Step 2: Action</h2>
                        <p className={styles.formCardDescription}>Define the action to run on schedule.</p>
                    </div>

                    {currentScheduleType !== 'custom_cron' ? (
                        <div className={styles.actionFields}>
                            <div className={styles.helperText}>
                                This schedule uses a built-in action automatically.
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className={styles.actionGrid}>
                                {actionOptions.map((option) => (
                                    <button
                                        key={option.type}
                                        type="button"
                                        className={`${styles.actionCard} ${currentActionType === option.type ? styles.actionCardActive : ''}`}
                                        onClick={() => setActionType(option.type)}
                                    >
                                        <div className={styles.actionCardTitle}>{option.label}</div>
                                        <div className={styles.actionCardDesc}>{option.description}</div>
                                    </button>
                                ))}
                            </div>

                            <select
                                value={currentActionType}
                                onChange={(e) => setActionType(e.target.value)}
                                className={styles.selectFieldAlt}
                                style={{ marginTop: '1rem' }}
                            >
                                <option value="">Select an action...</option>
                                {actionOptions.map((option) => (
                                    <option key={option.type} value={option.type}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>

                            <div className={styles.actionFields}>
                                {!currentActionType && (
                                    <div className={styles.helperText}>Select an action to configure details.</div>
                                )}

                                {currentActionType === 'create_task' && (
                                    <div className={styles.formGrid}>
                                        <div className={styles.fieldGroup}>
                                            <label className={styles.fieldLabel}>Task Title</label>
                                            <input
                                                type="text"
                                                value={currentAction.title || ''}
                                                onChange={(e) => {
                                                    const newAction = { ...currentAction, title: e.target.value };
                                                    setFormData({ ...formData, action: JSON.stringify(newAction) });
                                                }}
                                                className={styles.inputField}
                                            />
                                        </div>
                                        <div className={styles.fieldGroup}>
                                            <label className={styles.fieldLabel}>Priority</label>
                                            <select
                                                value={currentAction.priority || 'Medium'}
                                                onChange={(e) => {
                                                    const newAction = { ...currentAction, priority: e.target.value };
                                                    setFormData({ ...formData, action: JSON.stringify(newAction) });
                                                }}
                                                className={styles.selectFieldAlt}
                                            >
                                                <option value="Low">Low</option>
                                                <option value="Medium">Medium</option>
                                                <option value="High">High</option>
                                            </select>
                                        </div>
                                    </div>
                                )}

                                {currentActionType === 'send_summary_report' && (
                                    <div className={styles.fieldGroup}>
                                        <label className={styles.fieldLabel}>Recipients</label>
                                        <input
                                            type="text"
                                            value={currentAction.recipients || ''}
                                            onChange={(e) => {
                                                const newAction = { ...currentAction, recipients: e.target.value };
                                                setFormData({ ...formData, action: JSON.stringify(newAction) });
                                            }}
                                            className={styles.inputField}
                                            placeholder="email@example.com"
                                        />
                                    </div>
                                )}

                                {currentActionType === 'cleanup_logs' && (
                                    <div className={styles.fieldGroup}>
                                        <label className={styles.fieldLabel}>Days to Keep</label>
                                        <input
                                            type="number"
                                            value={currentAction.daysToKeep || 30}
                                            onChange={(e) => {
                                                const newAction = { ...currentAction, daysToKeep: parseInt(e.target.value) };
                                                setFormData({ ...formData, action: JSON.stringify(newAction) });
                                            }}
                                            className={styles.inputField}
                                        />
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    <details className={styles.jsonDetails}>
                        <summary>Advanced action JSON</summary>
                        <textarea
                            value={formData.action}
                            onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                            className={styles.jsonTextarea}
                            spellCheck={false}
                        />
                    </details>
                </section>

                <div className={styles.formFooter}>
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
            </form>
        </div>
    );
}
