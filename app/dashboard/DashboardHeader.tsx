'use client';

import { useState } from 'react';
import { Pencil, Save, X } from 'lucide-react';

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
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
                {isEditing ? (
                    <>
                        <input
                            type="text"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
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
                        />
                        <textarea
                            value={welcomeMessage}
                            onChange={(e) => setWelcomeMessage(e.target.value)}
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
                {isEditing ? (
                    <>
                        <button
                            onClick={handleSave}
                            disabled={saving}
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
                        >
                            <Save size={16} />
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                        <button
                            onClick={handleCancel}
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
                        >
                            <X size={16} />
                            Cancel
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => setIsEditing(true)}
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
                    >
                        <Pencil size={16} />
                        Edit
                    </button>
                )}
            </div>
        </div>
    );
}
