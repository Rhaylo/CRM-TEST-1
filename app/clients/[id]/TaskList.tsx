'use client';

import { useState } from 'react';
import { toggleTaskComplete, deleteTask } from './taskActions';
import { Trash2, CheckCircle, Circle } from 'lucide-react';
import styles from './TaskSection.module.css';

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
        <div className={styles.taskList}>
            <div className={styles.tabs}>
                <button
                    onClick={() => setActiveTab('due')}
                    className={`${styles.tabButton} ${activeTab === 'due' ? styles.tabActive : ''}`}
                >
                    Tasks Due ({dueTasks.length})
                </button>
                <button
                    onClick={() => setActiveTab('overdue')}
                    className={`${styles.tabButton} ${styles.tabOverdue} ${activeTab === 'overdue' ? styles.tabActive : ''}`}
                >
                    Tasks Overdue ({overdueTasks.length})
                </button>
            </div>

            {/* Task List */}
            <div className={styles.tasksList}>
                {displayedTasks.length === 0 ? (
                    <div className={styles.emptyState}>
                        No {activeTab === 'due' ? 'upcoming' : 'overdue'} tasks
                    </div>
                ) : (
                    displayedTasks.map((task) => {
                        const dueDate = new Date(task.dueDate);
                        const isOverdue = dueDate < now;

                        return (
                            <div
                                key={task.id}
                                className={`${styles.taskCard} ${isOverdue ? styles.taskCardOverdue : styles.taskCardDue}`}
                            >
                                <div style={{ flex: 1 }}>
                                    <div className={styles.taskTitleRow}>
                                        <button
                                            onClick={() => handleToggleComplete(task.id, task.completed)}
                                            className={styles.iconButton}
                                            style={{ color: task.completed ? '#10b981' : '#94a3b8' }}
                                        >
                                            {task.completed ? <CheckCircle size={20} /> : <Circle size={20} />}
                                        </button>
                                        <h4
                                            className={styles.taskTitle}
                                            style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
                                        >
                                            {task.title}
                                        </h4>
                                    </div>
                                    {task.description && (
                                        <p className={styles.taskDescription}>
                                            {task.description}
                                        </p>
                                    )}
                                    {task.notes && task.notes.length > 0 && (
                                        <div className={styles.taskNotesWrap}>
                                            <div className={styles.taskNotesHeader}>
                                                📝 {task.notes.length} {task.notes.length === 1 ? 'Note' : 'Notes'}
                                            </div>
                                            <div className={styles.taskNotesList}>
                                                {task.notes.map((note: any) => (
                                                    <div
                                                        key={note.id}
                                                        className={styles.taskNoteItem}
                                                    >
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                                                            <div style={{ flex: 1 }}>
                                                                <p className={styles.taskNoteText}>
                                                                    {note.content}
                                                                </p>
                                                                <span className={styles.taskNoteDate}>
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
                                                                className={`${styles.iconButton} ${styles.iconButtonDanger}`}
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
                                    <div
                                        className={`${styles.taskMeta} ${isOverdue ? styles.taskMetaOverdue : ''}`}
                                    >
                                        Due: {dueDate.toLocaleDateString()} {dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(task.id)}
                                    className={styles.iconButton}
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
