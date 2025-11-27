'use client';

import { Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function DeleteButton({
    onDelete,
    itemType,
    itemName
}: {
    onDelete: () => void;
    itemType: string;
    itemName: string;
}) {
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = () => {
        onDelete();
    };

    if (showConfirm) {
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
            }}>
                <div style={{
                    backgroundColor: 'white',
                    padding: '2rem',
                    borderRadius: '0.75rem',
                    maxWidth: '400px',
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                        Delete {itemType}?
                    </h3>
                    <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
                        Are you sure you want to delete "{itemName}"? This action cannot be undone.
                    </p>
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                        <button
                            onClick={() => setShowConfirm(false)}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '0.375rem',
                                border: '1px solid #cbd5e1',
                                backgroundColor: 'white',
                                cursor: 'pointer',
                                fontWeight: '500',
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '0.375rem',
                                border: 'none',
                                backgroundColor: '#ef4444',
                                color: 'white',
                                cursor: 'pointer',
                                fontWeight: '500',
                            }}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <button
            onClick={() => setShowConfirm(true)}
            style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                border: '1px solid #fecaca',
                backgroundColor: '#fef2f2',
                color: '#dc2626',
                cursor: 'pointer',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
            }}
        >
            <Trash2 size={16} />
            Delete {itemType}
        </button>
    );
}
