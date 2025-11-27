'use client';

import { useState } from 'react';
import { toggleTaskComplete, deleteTask } from './taskActions';
import { Trash2, CheckCircle, Circle } from 'lucide-react';

export default function TaskList({ tasks, clientId }: { tasks: any[]; clientId: number }) {
    const [activeTab, setActiveTab] = useState<'due' | 'overdue'>('due');

    const now = new Date();
    const dueTasks = tasks.filter(t => !t.completed && new Date(t.dueDate) >= now);
    const overdueTasks = tasks.filter(t => !t.completed && new Date(t.dueDate) < now);

    const displayedTasks = activeTab === 'due' ? dueTasks : overdueTasks;

    const handleToggleComplete = async (taskId: number, completed: boolean) => {
        await toggleTaskComplete(taskId, !completed);
    };

    const handleDelete = async (taskId: number) => {
        if (confirm('Are you sure you want to delete this task?')) {
            await deleteTask(taskId);
        }
    };

    return (
        <div>
            {/* Tabs */}
            <div style={{
                display: 'flex',
                gap: '1rem',
                marginBottom: '1rem',
                borderBottom: '2px solid #e2e8f0',
            }}>
                <button
                    onClick={() => setActiveTab('due')}
                    style={{
                        padding: '0.5rem 1rem',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: activeTab === 'due' ? '#3b82f6' : '#64748b',
                        borderBottom: activeTab === 'due' ? '3px solid #3b82f6' : '3px solid transparent',
                        marginBottom: '-2px',
                        transition: 'all 0.2s',
                    }}
                >
                    Tasks Due ({dueTasks.length})
                </button>
                <button
                    onClick={() => setActiveTab('overdue')}
                    style={{
                        padding: '0.5rem 1rem',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: activeTab === 'overdue' ? '#ef4444' : '#64748b',
                        borderBottom: activeTab === 'overdue' ? '3px solid #ef4444' : '3px solid transparent',
                        marginBottom: '-2px',
                        transition: 'all 0.2s',
                    }}
                >
                    Tasks Overdue ({overdueTasks.length})
                </button>
            </div>

            {/* Task List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {displayedTasks.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '2rem',
                        color: '#94a3b8',
                        backgroundColor: '#f8fafc',
                        borderRadius: '0.5rem',
                    }}>
                        No {activeTab === 'due' ? 'upcoming' : 'overdue'} tasks
                    </div>
                ) : (
                    displayedTasks.map((task) => {
                        const dueDate = new Date(task.dueDate);
                        const isOverdue = dueDate < now;

                        return (
                            <div
                                key={task.id}
                                style={{
                                    padding: '1rem',
                                    backgroundColor: isOverdue ? '#fef2f2' : '#f8fafc',
                                    borderLeft: `4px solid ${isOverdue ? '#ef4444' : '#3b82f6'}`,
                                    borderRadius: '0.375rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                }}
                            >
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                        <button
                                            onClick={() => handleToggleComplete(task.id, task.completed)}
                                            style={{
                                                border: 'none',
                                                background: 'none',
                                                cursor: 'pointer',
                                                padding: 0,
                                                color: task.completed ? '#10b981' : '#94a3b8',
                                            }}
                                        >
                                            {task.completed ? <CheckCircle size={20} /> : <Circle size={20} />}
                                        </button>
                                        <h4 style={{
                                            margin: 0,
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            textDecoration: task.completed ? 'line-through' : 'none',
                                        }}>
                                            {task.title}
                                        </h4>
                                    </div>
                                    {task.description && (
                                        <p style={{
                                            margin: '0.25rem 0 0 1.75rem',
                                            fontSize: '0.75rem',
                                            color: '#64748b',
                                        }}>
                                            {task.description}
                                        </p>
                                    )}
                                    {task.notes && task.notes.length > 0 && (
                                        <div style={{
                                            marginTop: '0.5rem',
                                            marginLeft: '1.75rem',
                                            padding: '0.75rem',
                                            backgroundColor: 'white',
                                            borderRadius: '0.375rem',
                                            border: '1px solid #e2e8f0',
                                        }}>
                                            <div style={{
                                                fontSize: '0.7rem',
                                                fontWeight: '600',
                                                color: '#7c3aed',
                                                marginBottom: '0.5rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.25rem',
                                            }}>
                                                📝 {task.notes.length} {task.notes.length === 1 ? 'Note' : 'Notes'}
                                            </div>
                                            <div style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '0.5rem',
                                            }}>
                                                {task.notes.map((note: any) => (
                                                    <div
                                                        key={note.id}
                                                        style={{
                                                            padding: '0.5rem',
                                                            backgroundColor: '#f8fafc',
                                                            borderRadius: '0.25rem',
                                                            borderLeft: '2px solid #7c3aed',
                                                        }}
                                                    >
                                                        <div style={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'flex-start',
                                                            gap: '0.5rem',
                                                        }}>
                                                            <div style={{ flex: 1 }}>
                                                                <p style={{
                                                                    margin: '0 0 0.25rem 0',
                                                                    fontSize: '0.75rem',
                                                                    color: '#1e293b',
                                                                    lineHeight: '1.4',
                                                                }}>
                                                                    {note.content}
                                                                </p>
                                                                <span style={{
                                                                    fontSize: '0.65rem',
                                                                    color: '#94a3b8',
                                                                }}>
                                                                    {new Date(note.createdAt).toLocaleString()}
                                                                </span>
                                                            </div>
                                                            <button
                                                                onClick={async () => {
                                                                    if (confirm('Delete this note?')) {
                                                                        const { deleteTaskNote } = await import('./taskActions');
                                                                        await deleteTaskNote(note.id);
                                                                    }
                                                                }}
                                                                style={{
                                                                    border: 'none',
                                                                    background: 'none',
                                                                    cursor: 'pointer',
                                                                    color: '#ef4444',
                                                                    padding: '0.125rem',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                }}
                                                                title="Delete note"
                                                            >
                                                                <Trash2 size={12} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <div style={{
                                        marginTop: '0.5rem',
                                        marginLeft: '1.75rem',
                                        fontSize: '0.75rem',
                                        color: isOverdue ? '#dc2626' : '#64748b',
                                        fontWeight: isOverdue ? '600' : '400',
                                    }}>
                                        Due: {dueDate.toLocaleDateString()} {dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(task.id)}
                                    style={{
                                        padding: '0.25rem',
                                        border: 'none',
                                        background: 'none',
                                        cursor: 'pointer',
                                        color: '#94a3b8',
                                    }}
                                    title="Delete task"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
