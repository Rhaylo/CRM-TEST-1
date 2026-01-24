'use client';

import { useState } from 'react';
import { Pencil, Save, X } from 'lucide-react';
<<<<<<< HEAD
<<<<<<< HEAD
import styles from './Dashboard.module.css';
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e

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
<<<<<<< HEAD
<<<<<<< HEAD
        <div className={styles.header}>
            <div className={styles.headerContent}>
                {isEditing ? (
                    <div className={styles.headerEdit}>
=======
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
                {isEditing ? (
                    <>
<<<<<<< HEAD
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
                        <input
                            type="text"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
<<<<<<< HEAD
<<<<<<< HEAD
                            className={styles.headerInput}
=======
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
                            style={{
                                fontSize: '1.875rem',
                                fontWeight: 'bold',
                                color: '#1e293b',
                                marginBottom: '0.5rem',
                                border: '2px solid #3b82f6',
                                borderRadius: '0.375rem',
                                padding: '0.5rem',
                                width: '100%',
                                maxWidth: '500px'
                            }}
<<<<<<< HEAD
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
                        />
                        <textarea
                            value={welcomeMessage}
                            onChange={(e) => setWelcomeMessage(e.target.value)}
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
                            style={{
                                color: '#64748b',
                                border: '2px solid #3b82f6',
                                borderRadius: '0.375rem',
                                padding: '0.5rem',
                                width: '100%',
                                maxWidth: '500px',
                                resize: 'none'
                            }}
                            rows={2}
                        />
                    </>
                ) : (
                    <>
                        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>
                            {businessName}
                        </h1>
                        <p style={{ color: '#64748b' }}>{welcomeMessage}</p>
                    </>
                )}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
<<<<<<< HEAD
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
                {isEditing ? (
                    <>
                        <button
                            onClick={handleSave}
                            disabled={saving}
<<<<<<< HEAD
<<<<<<< HEAD
                            className={`${styles.actionButton} ${styles.primaryButton}`}
=======
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                padding: '0.5rem 1rem',
                                backgroundColor: saving ? '#9ca3af' : '#10b981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.375rem',
                                cursor: saving ? 'not-allowed' : 'pointer',
                                fontSize: '0.875rem',
                                fontWeight: '500'
                            }}
<<<<<<< HEAD
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
                        >
                            <Save size={16} />
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                        <button
                            onClick={handleCancel}
<<<<<<< HEAD
<<<<<<< HEAD
                            className={`${styles.actionButton} ${styles.dangerButton}`}
=======
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                padding: '0.5rem 1rem',
                                backgroundColor: '#ef4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.375rem',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                fontWeight: '500'
                            }}
<<<<<<< HEAD
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
                        >
                            <X size={16} />
                            Cancel
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => setIsEditing(true)}
<<<<<<< HEAD
<<<<<<< HEAD
                        className={`${styles.actionButton} ${styles.primaryButton}`}
=======
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            padding: '0.5rem 1rem',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: '500'
                        }}
<<<<<<< HEAD
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
                    >
                        <Pencil size={16} />
                        Edit
                    </button>
                )}
            </div>
        </div>
    );
}
