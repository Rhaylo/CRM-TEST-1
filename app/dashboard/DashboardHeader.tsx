'use client';

import { useState } from 'react';
import { Pencil, Save, X } from 'lucide-react';
import styles from './Dashboard.module.css';

interface DashboardHeaderProps {
    initialBusinessName: string;
    initialWelcomeMessage: string;
}

export default function DashboardHeader({ initialBusinessName, initialWelcomeMessage }: DashboardHeaderProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [businessName, setBusinessName] = useState(initialBusinessName);
    const [welcomeMessage, setWelcomeMessage] = useState(initialWelcomeMessage);
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await fetch('/api/dashboard-settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ businessName, welcomeMessage }),
            });

            if (response.ok) {
                setIsEditing(false);
                window.location.reload();
            }
        } catch (error) {
            console.error('Error saving settings:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setBusinessName(initialBusinessName);
        setWelcomeMessage(initialWelcomeMessage);
        setIsEditing(false);
    };

    return (
        <div className={styles.header}>
            <div className={styles.headerContent}>
                {isEditing ? (
                    <div className={styles.headerEdit}>
                        <input
                            type="text"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            className={styles.headerInput}
                        />
                        <textarea
                            value={welcomeMessage}
                            onChange={(e) => setWelcomeMessage(e.target.value)}
                            className={styles.headerTextarea}
                            rows={2}
                        />
                    </div>
                ) : (
                    <>
                        <h1 className={styles.headerTitle}>{businessName}</h1>
                        <p className={styles.headerSubtitle}>{welcomeMessage}</p>
                    </>
                )}
            </div>
            <div className={styles.headerActions}>
                {isEditing ? (
                    <>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className={`${styles.actionButton} ${styles.primaryButton}`}
                        >
                            <Save size={16} />
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                        <button
                            onClick={handleCancel}
                            className={`${styles.actionButton} ${styles.dangerButton}`}
                        >
                            <X size={16} />
                            Cancel
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => setIsEditing(true)}
                        className={`${styles.actionButton} ${styles.primaryButton}`}
                    >
                        <Pencil size={16} />
                        Edit
                    </button>
                )}
            </div>
        </div>
    );
}
