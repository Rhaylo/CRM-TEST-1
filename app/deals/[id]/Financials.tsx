'use client';

import { useState } from 'react';
import { Pencil, Check, X, Calculator } from 'lucide-react';
import { updateDealFinancials } from './actions';

interface FinancialsProps {
    dealId: number;
    clientId: number;
    initialArv: number;
    initialRepairs: number;
    initialOurOffer: number;
    initialWholesalePrice: number;
    initialAssignmentFee: number | null;
}

export default function Financials({
    dealId,
    clientId,
    initialArv,
    initialRepairs,
    initialOurOffer,
    initialWholesalePrice,
    initialAssignmentFee
}: FinancialsProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        arv: initialArv,
        repairs: initialRepairs,
        ourOffer: initialOurOffer,
        wholesalePrice: initialWholesalePrice
    });

    // Determine Profit Logic Live
    const mao = (form.arv * 0.7) - form.repairs;
    const potentialProfit = mao - form.ourOffer;
    const realizedProfit = form.wholesalePrice - form.ourOffer;

    // Logic matches page traversal: show Potential if no spread or explicit fee
    // Note: In edit mode we ignore the stored 'initialAssignmentFee' to show live math
    const isPotential = (realizedProfit <= 0 && form.wholesalePrice === form.ourOffer);
    const displayProfit = isPotential ? potentialProfit : realizedProfit;

    const handleSave = async () => {
        setSaving(true);
        const res = await updateDealFinancials(dealId, clientId, form);
        setSaving(false);
        if (res.success) {
            setIsEditing(false);
        } else {
            alert('Failed to save changes');
        }
    };

    const handleCancel = () => {
        setForm({
            arv: initialArv,
            repairs: initialRepairs,
            ourOffer: initialOurOffer,
            wholesalePrice: initialWholesalePrice
        });
        setIsEditing(false);
    };

    return (
        <div style={{ position: 'relative' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
            }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calculator size={20} />
                    Financials
                </h2>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            fontSize: '0.875rem',
                            color: '#3b82f6',
                            background: '#eff6ff',
                            border: 'none',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            fontWeight: '500'
                        }}
                    >
                        <Pencil size={16} /> Edit Numbers
                    </button>
                ) : (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            onClick={handleCancel}
                            disabled={saving}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 1rem',
                                fontSize: '0.875rem',
                                color: '#64748b',
                                background: '#f1f5f9',
                                border: 'none',
                                borderRadius: '0.5rem',
                                cursor: 'pointer',
                                fontWeight: '500'
                            }}
                        >
                            <X size={16} /> Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 1rem',
                                fontSize: '0.875rem',
                                color: 'white',
                                background: '#22c55e',
                                border: 'none',
                                borderRadius: '0.5rem',
                                cursor: 'pointer',
                                fontWeight: '500'
                            }}
                        >
                            {saving ? 'Saving...' : <><Check size={16} /> Save Changes</>}
                        </button>
                    </div>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
                <Card
                    label="ARV"
                    value={form.arv}
                    isEditing={isEditing}
                    onChange={v => setForm({ ...form, arv: v })}
                />
                <Card
                    label="Repairs"
                    value={form.repairs}
                    isEditing={isEditing}
                    onChange={v => setForm({ ...form, repairs: v })}
                />
                <Card
                    label="Our Offer"
                    value={form.ourOffer}
                    isEditing={isEditing}
                    onChange={v => setForm({ ...form, ourOffer: v })}
                />
                <Card
                    label="Wholesale Price"
                    value={form.wholesalePrice}
                    isEditing={isEditing}
                    onChange={v => setForm({ ...form, wholesalePrice: v })}
                />

                {/* Profit is always read-only / calculated */}
                <div style={{ padding: '1rem', backgroundColor: isPotential ? '#f8fafc' : '#f0fdf4', border: `1px solid ${isPotential ? '#cbd5e1' : '#86efac'}`, borderRadius: '0.5rem' }}>
                    <p style={{ fontSize: '0.75rem', color: isPotential ? '#64748b' : '#166534', marginBottom: '0.25rem' }}>
                        {isPotential ? 'Potential Profit (MAO)' : 'Projected Profit'}
                    </p>
                    <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: isPotential ? '#475569' : '#15803d' }}>
                        ${Math.floor(displayProfit).toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    );
}

function Card({ label, value, isEditing, onChange }: { label: string, value: number, isEditing: boolean, onChange: (v: number) => void }) {
    return (
        <div style={{ padding: '1rem', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>{label}</p>
            {isEditing ? (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: '#94a3b8', marginRight: '0.25rem' }}>$</span>
                    <input
                        type="number"
                        value={value}
                        onChange={e => onChange(parseFloat(e.target.value) || 0)}
                        style={{
                            width: '100%',
                            fontWeight: 'bold',
                            border: 'none',
                            borderBottom: '2px solid #3b82f6',
                            outline: 'none',
                            fontSize: '1.125rem',
                            color: '#334155'
                        }}
                    />
                </div>
            ) : (
                <p style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#334155' }}>${value.toLocaleString()}</p>
            )}
        </div>
    );
}
