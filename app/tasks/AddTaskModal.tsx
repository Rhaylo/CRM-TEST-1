'use client';

import { useState } from 'react';
import { createTask } from './actions';
import { X } from 'lucide-react';

export default function AddTaskModal({ clients, onClose, preSelectedClientId }: { clients: any[]; onClose: () => void; preSelectedClientId?: number }) {
    const handleSubmit = async (formData: FormData) => {
        await createTask(formData);
        onClose();
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
        }} onClick={onClose}>
            <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '0.75rem',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '90vh',
                overflow: 'auto',
            }} onClick={(e) => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Add New Task</h2>
                    <button onClick={onClose} style={{ cursor: 'pointer', border: 'none', background: 'none', padding: '0.25rem' }}>
                        <X size={24} />
                    </button>
                </div>

                <form action={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
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
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                            Client *
                        </label>
                        <select
                            name="clientId"
                            required
                            defaultValue={preSelectedClientId || ''}
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                border: '1px solid #cbd5e1',
                                borderRadius: '0.375rem',
                                fontSize: '0.875rem',
                            }}
                        >
                            <option value="">Select a client...</option>
                            {clients.map((client) => (
                                <option key={client.id} value={client.id}>
                                    {client.contactName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                            Description
                        </label>
                        <textarea
                            name="description"
                            rows={3}
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                border: '1px solid #cbd5e1',
                                borderRadius: '0.375rem',
                                fontSize: '0.875rem',
                                resize: 'vertical',
                            }}
                            placeholder="Add task details..."
                        />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                            Initial Note (Optional)
                        </label>
                        <textarea
                            name="notes"
                            rows={2}
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                border: '1px solid #cbd5e1',
                                borderRadius: '0.375rem',
                                fontSize: '0.875rem',
                                resize: 'vertical',
                            }}
                            placeholder="Add an initial note to this task..."
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                                Due Date *
                            </label>
                            <input
                                name="dueDate"
                                type="date"
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
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                                Due Time
                            </label>
                            <input
                                name="dueTime"
                                type="time"
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    border: '1px solid #cbd5e1',
                                    borderRadius: '0.375rem',
                                    fontSize: '0.875rem',
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                                Priority
                            </label>
                            <select
                                name="priority"
                                defaultValue="Medium"
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    border: '1px solid #cbd5e1',
                                    borderRadius: '0.375rem',
                                    fontSize: '0.875rem',
                                }}
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                                Status
                            </label>
                            <select
                                name="status"
                                defaultValue="Not Started"
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    border: '1px solid #cbd5e1',
                                    borderRadius: '0.375rem',
                                    fontSize: '0.875rem',
                                }}
                            >
                                <option value="Not Started">Not Started</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                        <button
                            type="button"
                            onClick={onClose}
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
            </div>
        </div>
    );
}
