'use client';

import { useState } from 'react';
import { createTask } from './taskActions';
import { Plus } from 'lucide-react';
import styles from './TaskSection.module.css';

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
                className={styles.addTaskButton}
            >
                <Plus size={16} />
                Add Task
            </button>
        );
    }

    return (
        <form action={handleSubmit} className={styles.taskForm}>
            <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                    Task Title *
                </label>
                <input
                    name="title"
                    type="text"
                    required
                    className={styles.formInput}
                    placeholder="e.g., Follow up with client"
                />
            </div>

            <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                    Description
                </label>
                <textarea
                    name="description"
                    rows={2}
                    className={styles.formTextarea}
                    placeholder="Optional details..."
                />
            </div>

            <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                    Due Date *
                </label>
                <input
                    name="dueDate"
                    type="datetime-local"
                    required
                    className={styles.formInput}
                />
            </div>

            <div className={styles.formActions}>
                <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className={styles.cancelButton}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className={styles.submitButton}
                >
                    Create Task
                </button>
            </div>
        </form>
    );
}
