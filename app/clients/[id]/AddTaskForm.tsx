'use client';

import { useState } from 'react';
import { createTask } from './taskActions';
import { Plus } from 'lucide-react';
<<<<<<< HEAD
<<<<<<< HEAD
import styles from './TaskSection.module.css';
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e

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
<<<<<<< HEAD
<<<<<<< HEAD
                className={styles.addTaskButton}
=======
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
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
<<<<<<< HEAD
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
            >
                <Plus size={16} />
                Add Task
            </button>
        );
    }

    return (
<<<<<<< HEAD
<<<<<<< HEAD
        <form action={handleSubmit} className={styles.taskForm}>
            <div className={styles.formGroup}>
                <label className={styles.formLabel}>
=======
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
        <form action={handleSubmit} style={{
            padding: '1rem',
            backgroundColor: '#f8fafc',
            borderRadius: '0.5rem',
            border: '1px solid #e2e8f0',
        }}>
            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
<<<<<<< HEAD
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
                    Task Title *
                </label>
                <input
                    name="title"
                    type="text"
                    required
<<<<<<< HEAD
<<<<<<< HEAD
                    className={styles.formInput}
=======
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
                    style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                    }}
<<<<<<< HEAD
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
                    placeholder="e.g., Follow up with client"
                />
            </div>

<<<<<<< HEAD
<<<<<<< HEAD
            <div className={styles.formGroup}>
                <label className={styles.formLabel}>
=======
            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
                    Description
                </label>
                <textarea
                    name="description"
                    rows={2}
<<<<<<< HEAD
<<<<<<< HEAD
                    className={styles.formTextarea}
=======
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
                    style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        resize: 'vertical',
                    }}
<<<<<<< HEAD
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
                    placeholder="Optional details..."
                />
            </div>

<<<<<<< HEAD
<<<<<<< HEAD
            <div className={styles.formGroup}>
                <label className={styles.formLabel}>
=======
            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
                    Due Date *
                </label>
                <input
                    name="dueDate"
                    type="datetime-local"
                    required
<<<<<<< HEAD
<<<<<<< HEAD
                    className={styles.formInput}
                />
            </div>

            <div className={styles.formActions}>
                <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className={styles.cancelButton}
=======
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
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
<<<<<<< HEAD
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
                >
                    Cancel
                </button>
                <button
                    type="submit"
<<<<<<< HEAD
<<<<<<< HEAD
                    className={styles.submitButton}
=======
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
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
<<<<<<< HEAD
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
                >
                    Create Task
                </button>
            </div>
        </form>
    );
}
