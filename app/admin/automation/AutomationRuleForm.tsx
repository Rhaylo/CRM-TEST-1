'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createAutomationRule, updateAutomationRule } from './actions';
import styles from '../admin.module.css';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface AutomationRuleFormProps {
    initialData?: any;
    isEditing?: boolean;
}

type ActionOption = {
    type: string;
    label: string;
    description: string;
};

export default function AutomationRuleForm({ initialData, isEditing = false }: AutomationRuleFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        description: initialData?.description || '',
        triggerType: initialData?.triggerType || 'task_created',
        conditions: initialData?.conditions || '{}',
        actions: initialData?.actions || '[]',
    });

    const actionOptions: ActionOption[] = [
        {
            type: 'create_task',
            label: 'Create Task',
            description: 'Automatically create a follow-up task',
        },
        {
            type: 'update_deal_stage',
            label: 'Update Deal Stage',
            description: 'Move a deal to a new stage',
        },
        {
            type: 'send_notification',
            label: 'Send Notification',
            description: 'Create an in-app notification note',
        },
        {
            type: 'send_email',
            label: 'Send Email',
            description: 'Send an email to a recipient',
        },
    ];

    const parseActions = () => {
        try {
            const parsed = JSON.parse(formData.actions);
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            return [];
        }
    };

    const actions = parseActions();
    const currentAction = actions[0] || null;
    const currentActionType = currentAction?.type || '';

    const setActionType = (type: string) => {
        let newAction: any = { type };

        if (type === 'create_task') {
            newAction = {
                type,
                title: currentAction?.title || 'New Automated Task',
                priority: currentAction?.priority || 'Medium',
            };
        }

        if (type === 'update_deal_stage') {
            newAction = {
                type,
                stage: currentAction?.stage || 'Negotiation',
            };
        }

        if (type === 'send_notification') {
            newAction = {
                type,
                message: currentAction?.message || 'Automation triggered!',
            };
        }

        if (type === 'send_email') {
            newAction = {
                type,
                recipient: currentAction?.recipient || 'info@xyreholdings.com',
                subject: currentAction?.subject || 'Automation Notification',
            };
        }

        setFormData({ ...formData, actions: JSON.stringify([newAction]) });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEditing && initialData?.id) {
                await updateAutomationRule(initialData.id, formData);
            } else {
                await createAutomationRule(formData);
            }
            router.push('/admin/automation');
            router.refresh();
        } catch (error) {
            alert('Failed to save rule');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.formLayout}>
            <section className={styles.formCard}>
                <div className={styles.formCardHeader}>
                    <h2 className={styles.formCardTitle}>{isEditing ? 'Edit Rule' : 'Create New Rule'}</h2>
                    <p className={styles.formCardDescription}>Define what happens and when it triggers.</p>
                </div>
                <div className={styles.formGrid}>
                    <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>Rule Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={styles.inputField}
                            placeholder="e.g., Auto-assign high priority tasks"
                        />
                        <span className={styles.fieldHint}>Keep it short and action-oriented.</span>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className={styles.textareaField}
                            placeholder="Describe what this rule does..."
                        />
                    </div>
                </div>
            </section>

            <section className={styles.formCard}>
                <div className={styles.formCardHeader}>
                    <h2 className={styles.formCardTitle}>Step 1: Trigger</h2>
                    <p className={styles.formCardDescription}>Choose when this automation runs.</p>
                </div>
                <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Trigger Type</label>
                    <select
                        value={formData.triggerType}
                        onChange={(e) => setFormData({ ...formData, triggerType: e.target.value })}
                        className={styles.selectFieldAlt}
                    >
                        <optgroup label="Tasks">
                            <option value="task_created">Task Created</option>
                            <option value="task_completed">Task Completed</option>
                            <option value="task_overdue">Task Overdue</option>
                        </optgroup>
                        <optgroup label="Deals">
                            <option value="deal_stage_change">Deal Stage Changed</option>
                        </optgroup>
                        <optgroup label="Clients">
                            <option value="client_added">Client Added</option>
                        </optgroup>
                    </select>
                    <span className={styles.fieldHint}>Tip: pick the event that starts the workflow.</span>
                </div>

                <details className={styles.jsonDetails}>
                    <summary>Advanced conditions (JSON)</summary>
                    <textarea
                        value={formData.conditions}
                        onChange={(e) => setFormData({ ...formData, conditions: e.target.value })}
                        className={styles.jsonTextarea}
                        spellCheck={false}
                    />
                    <span className={styles.helperText}>Example: {"{\"status\":\"High\"}"}</span>
                </details>
            </section>

            <section className={styles.formCard}>
                <div className={styles.formCardHeader}>
                    <h2 className={styles.formCardTitle}>Step 2: Action</h2>
                    <p className={styles.formCardDescription}>Choose what happens automatically.</p>
                </div>

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
                    {!currentAction ? (
                        <div className={styles.helperText}>Select an action to configure details.</div>
                    ) : null}

                    {currentAction?.type === 'create_task' && (
                        <div className={styles.formGrid}>
                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Task Title</label>
                                <input
                                    type="text"
                                    value={currentAction.title || ''}
                                    onChange={(e) => {
                                        const newAction = { ...currentAction, title: e.target.value };
                                        setFormData({ ...formData, actions: JSON.stringify([newAction]) });
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
                                        setFormData({ ...formData, actions: JSON.stringify([newAction]) });
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

                    {currentAction?.type === 'update_deal_stage' && (
                        <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>New Stage</label>
                            <select
                                value={currentAction.stage || ''}
                                onChange={(e) => {
                                    const newAction = { ...currentAction, stage: e.target.value };
                                    setFormData({ ...formData, actions: JSON.stringify([newAction]) });
                                }}
                                className={styles.selectFieldAlt}
                            >
                                <option value="Lead">Lead</option>
                                <option value="Contact Made">Contact Made</option>
                                <option value="Analyzing">Analyzing</option>
                                <option value="Offer Sent">Offer Sent</option>
                                <option value="Negotiation">Negotiation</option>
                                <option value="Under Contract">Under Contract</option>
                                <option value="Contract Out">Contract Out</option>
                                <option value="Closed">Closed</option>
                            </select>
                        </div>
                    )}

                    {currentAction?.type === 'send_notification' && (
                        <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>Message</label>
                            <input
                                type="text"
                                value={currentAction.message || ''}
                                onChange={(e) => {
                                    const newAction = { ...currentAction, message: e.target.value };
                                    setFormData({ ...formData, actions: JSON.stringify([newAction]) });
                                }}
                                className={styles.inputField}
                            />
                        </div>
                    )}

                    {currentAction?.type === 'send_email' && (
                        <div className={styles.formGrid}>
                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Recipient Email</label>
                                <input
                                    type="email"
                                    value={currentAction.recipient || ''}
                                    onChange={(e) => {
                                        const newAction = { ...currentAction, recipient: e.target.value };
                                        setFormData({ ...formData, actions: JSON.stringify([newAction]) });
                                    }}
                                    className={styles.inputField}
                                />
                            </div>
                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Subject</label>
                                <input
                                    type="text"
                                    value={currentAction.subject || ''}
                                    onChange={(e) => {
                                        const newAction = { ...currentAction, subject: e.target.value };
                                        setFormData({ ...formData, actions: JSON.stringify([newAction]) });
                                    }}
                                    className={styles.inputField}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <details className={styles.jsonDetails}>
                    <summary>Advanced action JSON</summary>
                    <textarea
                        value={formData.actions}
                        onChange={(e) => setFormData({ ...formData, actions: e.target.value })}
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
                    {loading ? 'Saving...' : 'Save Rule'}
                </button>
                <Link href="/admin/automation">
                    <button type="button" className={styles.btnSecondary} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ArrowLeft size={18} />
                        Cancel
                    </button>
                </Link>
            </div>
        </form>
    );
}
