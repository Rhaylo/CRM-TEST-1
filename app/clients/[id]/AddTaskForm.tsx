'use client';

import { useState } from 'react';
import { createTask } from './taskActions';
import { Plus } from 'lucide-react';

export default function AddTaskForm({ clientId }: { clientId: number }) {
    const [showForm, setShowForm] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        await createTask(clientId, formData);
        setShowForm(false);
    };

    if (!showForm) {
        return (
            <button
                onClick={() => setShowForm(true)}
                style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                }}
            >
                <Plus size={16} />
                Add Task
            </button>
        );
    }

    return (
        <form action={handleSubmit} style={{
            padding: '1rem',
            backgroundColor: '#f8fafc',
            borderRadius: '0.5rem',
            border: '1px solid #e2e8f0',
        }}>
            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                    Task Title *
                </label>
                <input
                    name="title"
                    type="text"
                    required
                    style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                    }}
                    placeholder="e.g., Follow up with client"
                />
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                    Description
                </label>
                <textarea
                    name="description"
                    rows={2}
                    style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        resize: 'vertical',
                    }}
                    placeholder="Optional details..."
                />
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                    Due Date *
                </label>
                <input
                    name="dueDate"
                    type="datetime-local"
                    required
                    style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                    }}
                />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: 'white',
                        color: '#64748b',
                        border: '1px solid #cbd5e1',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                    }}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                    }}
                >
                    Create Task
                </button>
            </div>
        </form>
    );
}
