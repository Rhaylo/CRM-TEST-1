'use client';

import { useState } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import { markTaskComplete, deleteTask } from './actions';
import { getTaskState, formatDueDate, getStateColor, getPriorityColor } from './utils';
import { Pencil, Trash2, CheckCircle } from 'lucide-react';
import EditTaskModal from './EditTaskModal';
import TaskCompletionToast from './TaskCompletionToast';

export default function TaskTable({ tasks, clients }: { tasks: any[]; clients: any[] }) {
    const [editingTask, setEditingTask] = useState<any>(null);
    const [completedTask, setCompletedTask] = useState<any>(null);

    const handleMarkComplete = async (task: any) => {
        const updatedTask = await markTaskComplete(task.id);
        setCompletedTask(updatedTask);
    };

    const handleDelete = async (taskId: number) => {
        if (confirm('Are you sure you want to delete this task?')) {
            await deleteTask(taskId);
        }
    };

    if (tasks.length === 0) {
        return (
            <div className={styles.emptyState}>
                <p>No tasks found. Create your first task to get started!</p>
            </div>
        );
    }

    return (
        <>
<<<<<<< HEAD
<<<<<<< HEAD
            <div className={styles.cardsGrid}>
                {tasks.map((task) => {
                    const state = getTaskState(new Date(task.dueDate), task.status);
                    const stateColors = getStateColor(state);
                    const priorityColor = getPriorityColor(task.priority);
                    const stateClass = state === 'Overdue'
                        ? styles.cardOverdue
                        : state === 'Due Today'
                            ? styles.cardDueToday
                            : styles.cardUpcoming;

                    return (
                        <div key={task.id} className={`${styles.taskCard} ${stateClass}`}>
                            <div className={styles.cardHeader}>
                                <div>
                                    <div className={styles.cardTitle}>{task.title}</div>
                                    {task.description && (
                                        <div className={styles.cardDescription}>{task.description}</div>
                                    )}
                                </div>
                                <div className={styles.actions}>
                                    {task.status !== 'Completed' && (
                                        <button
                                            onClick={() => handleMarkComplete(task)}
                                            className={`${styles.actionButton} ${styles.completeButton}`}
                                            title="Mark as complete"
                                        >
                                            <CheckCircle size={14} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setEditingTask(task)}
                                        className={styles.actionButton}
                                        title="Edit task"
                                    >
                                        <Pencil size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(task.id)}
                                        className={`${styles.actionButton} ${styles.deleteButton}`}
                                        title="Delete task"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            <div className={styles.cardMetaRow}>
                                <div className={styles.metaItem}>
                                    <span className={styles.metaLabel}>Client</span>
                                    <Link href={`/clients/${task.client.id}`} className={styles.link}>
                                        {task.client.contactName}
                                    </Link>
                                </div>
                                <div className={styles.metaItem}>
                                    <span className={styles.metaLabel}>Due Date</span>
                                    <span className={styles.metaValue}>
                                        {formatDueDate(new Date(task.dueDate), task.dueTime)}
                                    </span>
                                </div>
                                <div className={styles.metaItem}>
                                    <span className={styles.metaLabel}>State</span>
                                    <span
                                        className={styles.stateBadge}
                                        style={{
                                            backgroundColor: stateColors.bg,
                                            color: stateColors.text,
                                            border: `1px solid ${stateColors.border}`,
                                        }}
                                    >
                                        {state}
                                    </span>
                                </div>
                                <div className={styles.metaItem}>
                                    <span className={styles.metaLabel}>Status</span>
                                    <span
                                        className={styles.statusBadge}
                                        style={{
=======
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.th}>Task Title</th>
                            <th className={styles.th}>Client</th>
                            <th className={styles.th}>Due Date</th>
                            <th className={styles.th}>State</th>
                            <th className={styles.th}>Status</th>
                            <th className={styles.th}>Priority</th>
                            <th className={styles.th}>Notes</th>
                            <th className={styles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task) => {
                            const state = getTaskState(new Date(task.dueDate), task.status);
                            const stateColors = getStateColor(state);
                            const priorityColor = getPriorityColor(task.priority);
                            const rowClass = state === 'Overdue' ? styles.overdueRow :
                                state === 'Due Today' ? styles.dueTodayRow : styles.tr;

                            return (
                                <tr key={task.id} className={rowClass}>
                                    <td className={styles.td}>
                                        <div className={styles.taskTitle}>{task.title}</div>
                                        {task.description && (
                                            <div className={styles.taskDescription}>{task.description}</div>
                                        )}
                                    </td>
                                    <td className={styles.td}>
                                        <Link href={`/clients/${task.client.id}`} className={styles.link}>
                                            {task.client.contactName}
                                        </Link>
                                    </td>
                                    <td className={styles.td}>
                                        {formatDueDate(new Date(task.dueDate), task.dueTime)}
                                    </td>
                                    <td className={styles.td}>
                                        <span
                                            className={styles.stateBadge}
                                            style={{
                                                backgroundColor: stateColors.bg,
                                                color: stateColors.text,
                                                border: `1px solid ${stateColors.border}`,
                                            }}
                                        >
                                            {state}
                                        </span>
                                    </td>
                                    <td className={styles.td}>
                                        <span className={styles.statusBadge} style={{
<<<<<<< HEAD
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
                                            backgroundColor: task.status === 'Completed' ? '#dcfce7' :
                                                task.status === 'In Progress' ? '#dbeafe' : '#f1f5f9',
                                            color: task.status === 'Completed' ? '#166534' :
                                                task.status === 'In Progress' ? '#1e40af' : '#64748b',
<<<<<<< HEAD
<<<<<<< HEAD
                                        }}
                                    >
                                        {task.status}
                                    </span>
                                </div>
                                <div className={styles.metaItem}>
                                    <span className={styles.metaLabel}>Priority</span>
                                    <span
                                        className={styles.priorityBadge}
                                        style={{ backgroundColor: priorityColor }}
                                    >
                                        {task.priority}
                                    </span>
                                </div>
                                <div className={styles.metaItem}>
                                    <span className={styles.metaLabel}>Notes</span>
                                    <span className={styles.notesBadge}>
                                        {task.notes?.length || 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
=======
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
                                        }}>
                                            {task.status}
                                        </span>
                                    </td>
                                    <td className={styles.td}>
                                        <span
                                            className={styles.priorityBadge}
                                            style={{ backgroundColor: priorityColor }}
                                        >
                                            {task.priority}
                                        </span>
                                    </td>
                                    <td className={styles.td}>
                                        <span className={styles.notesBadge} style={{
                                            backgroundColor: task.notes?.length > 0 ? '#f3e8ff' : '#f1f5f9',
                                            color: task.notes?.length > 0 ? '#7c3aed' : '#64748b',
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '0.375rem',
                                            fontSize: '0.75rem',
                                            fontWeight: '500',
                                        }}>
                                            📝 {task.notes?.length || 0}
                                        </span>
                                    </td>
                                    <td className={styles.td}>
                                        <div className={styles.actions}>
                                            {task.status !== 'Completed' && (
                                                <button
                                                    onClick={() => handleMarkComplete(task)}
                                                    className={`${styles.actionButton} ${styles.completeButton}`}
                                                    title="Mark as complete"
                                                >
                                                    <CheckCircle size={14} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => setEditingTask(task)}
                                                className={styles.actionButton}
                                                title="Edit task"
                                            >
                                                <Pencil size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(task.id)}
                                                className={`${styles.actionButton} ${styles.deleteButton}`}
                                                title="Delete task"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
<<<<<<< HEAD
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
            </div>

            {editingTask && (
                <EditTaskModal
                    task={editingTask}
                    clients={clients}
                    onClose={() => setEditingTask(null)}
                />
            )}

            {completedTask && (
                <TaskCompletionToast
                    clientName={completedTask.client.contactName}
                    clientId={completedTask.clientId}
                    onDismiss={() => setCompletedTask(null)}
                />
            )}
        </>
    );
}
