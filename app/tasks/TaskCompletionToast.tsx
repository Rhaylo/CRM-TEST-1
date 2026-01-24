'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import AddTaskModal from './AddTaskModal';

export default function TaskCompletionToast({ clientName, clientId, onDismiss }: { clientName: string; clientId: number; onDismiss: () => void }) {
    const [showAddTask, setShowAddTask] = useState(false);
    const [clients, setClients] = useState<any[]>([]);

    useEffect(() => {
        // Auto-dismiss after 10 seconds
        const timer = setTimeout(() => {
            onDismiss();
        }, 10000);

        // Fetch clients for the modal
        fetch('/api/clients')
            .then(res => res.json())
            .then(data => setClients(data))
            .catch(() => { });

        return () => clearTimeout(timer);
    }, [onDismiss]);

    const handleAddTask = () => {
        setShowAddTask(true);
    };

    const handleCloseModal = () => {
        setShowAddTask(false);
        onDismiss();
    };

    return (
        <>
            <div style={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                maxWidth: '400px',
                zIndex: 999,
                border: '2px solid #10b981',
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '1.5rem' }}>✓</span>
                            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '600', color: '#166534' }}>
                                Task Completed!
                            </h3>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569' }}>
                            Task completed for <strong>{clientName}</strong>. Would you like to add a new task for this client?
                        </p>
                    </div>
                    <button
                        onClick={onDismiss}
                        style={{
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            padding: '0.25rem',
                            color: '#94a3b8',
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                        onClick={onDismiss}
                        style={{
                            flex: 1,
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
                        Dismiss
                    </button>
                    <button
                        onClick={handleAddTask}
                        style={{
                            flex: 1,
                            padding: '0.5rem 1rem',
                            backgroundColor: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                        }}
                    >
                        Add New Task
                    </button>
                </div>
            </div>

            {showAddTask && clients.length > 0 && (
                <AddTaskModal
                    clients={clients}
                    onClose={handleCloseModal}
                    preSelectedClientId={clientId}
                />
            )}
        </>
    );
}
