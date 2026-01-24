'use client';

import { useState, useEffect } from 'react';
import { Pencil, Save, X, Plus, Trash2 } from 'lucide-react';

interface RevenueDataItem {
    month: string;
    revenue: number;
}

export default function RevenueDataEditor() {
    const [isEditing, setIsEditing] = useState(false);
    const [data, setData] = useState<RevenueDataItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('/api/revenue-data');
            const result = await response.json();
<<<<<<< HEAD

            if (Array.isArray(result)) {
                setData(result);
            } else {
                console.warn('Revenue data API returned unexpected format:', result);
                setData([]);
            }
=======
            setData(result);
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
        } catch (error) {
            console.error('Error fetching revenue data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await fetch('/api/revenue-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setIsEditing(false);
                window.location.reload();
            }
        } catch (error) {
            console.error('Error saving revenue data:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        fetchData();
        setIsEditing(false);
    };

    const updateMonth = (index: number, value: string) => {
        const newData = [...data];
        newData[index].month = value;
        setData(newData);
    };

    const updateRevenue = (index: number, value: string) => {
        const newData = [...data];
        newData[index].revenue = parseFloat(value) || 0;
        setData(newData);
    };

    const addMonth = () => {
        setData([...data, { month: 'New', revenue: 0 }]);
    };

    const removeMonth = (index: number) => {
        setData(data.filter((_, i) => i !== index));
    };

    if (loading) {
        return <div style={{ padding: '2rem' }}>Loading...</div>;
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                padding: '2rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1e293b' }}>
                        Revenue Data
                    </h2>
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
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
                    ) : (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
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
                                    gap: '0.5rem',
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
                        </div>
                    )}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    {data.map((item, index) => (
                        <div key={index} style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 2fr auto',
                            gap: '1rem',
                            marginBottom: '0.75rem',
                            alignItems: 'center'
                        }}>
                            <input
                                type="text"
                                value={item.month}
                                onChange={(e) => updateMonth(index, e.target.value)}
                                disabled={!isEditing}
                                style={{
                                    padding: '0.5rem',
                                    border: isEditing ? '1px solid #d1d5db' : '1px solid #e5e7eb',
                                    borderRadius: '0.375rem',
                                    backgroundColor: isEditing ? 'white' : '#f9fafb'
                                }}
                            />
                            <input
                                type="number"
                                value={item.revenue}
                                onChange={(e) => updateRevenue(index, e.target.value)}
                                disabled={!isEditing}
                                style={{
                                    padding: '0.5rem',
                                    border: isEditing ? '1px solid #d1d5db' : '1px solid #e5e7eb',
                                    borderRadius: '0.375rem',
                                    backgroundColor: isEditing ? 'white' : '#f9fafb'
                                }}
                            />
                            {isEditing && (
                                <button
                                    onClick={() => removeMonth(index)}
                                    style={{
                                        padding: '0.5rem',
                                        backgroundColor: '#ef4444',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '0.375rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {isEditing && (
                    <button
                        onClick={addMonth}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            backgroundColor: '#6366f1',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            width: '100%',
                            justifyContent: 'center'
                        }}
                    >
                        <Plus size={16} />
                        Add Month
                    </button>
                )}
            </div>
        </div>
    );
}
