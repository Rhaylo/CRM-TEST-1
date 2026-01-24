'use client';

import { Briefcase, X } from 'lucide-react';
<<<<<<< HEAD
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { createDealFromClient } from './createDealAction';
import { updateClientStatus } from '@/app/clients/[id]/actions';

export default function ClientActions({ clientId, clientName, status }: { clientId: number; clientName: string; status: string }) {
    const [showModal, setShowModal] = useState(false);
    const [mounted, setMounted] = useState(false);
=======
import { useState } from 'react';
import { createDealFromClient } from './createDealAction';

export default function ClientActions({ clientId, clientName }: { clientId: number; clientName: string }) {
    const [showModal, setShowModal] = useState(false);
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e

    const handleSubmit = async (formData: FormData) => {
        await createDealFromClient(clientId, formData);
        setShowModal(false);
    };

<<<<<<< HEAD
    const handleSnooze = async () => {
        if (confirm(`Are you sure you want to snooze ${clientName}? They will be moved to the Snoozed tab.`)) {
            await updateClientStatus(clientId, 'Snoozed');
        }
    };

    const handleActivate = async () => {
        await updateClientStatus(clientId, 'Active');
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        if (showModal) {
            const original = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = original;
            };
        }
    }, [showModal, mounted]);

    return (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
            <select
                value={status}
                onChange={async (e) => {
                    const newStatus = e.target.value;
                    if (confirm(`Change status to ${newStatus}?`)) {
                        await updateClientStatus(clientId, newStatus);
                    }
                }}
                style={{
                    padding: '0.375rem 0.75rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    color: '#334155',
                    cursor: 'pointer',
                    outline: 'none',
                    backgroundColor: status === 'Active' ? '#f0f9ff' : status === 'Snoozed' ? '#fffbeb' : '#f1f5f9',
                    borderColor: status === 'Active' ? '#bae6fd' : status === 'Snoozed' ? '#fde68a' : '#e2e8f0',
                }}
            >
                <option value="Active">Active</option>
                <option value="Snoozed">Snoozed</option>
                <option value="Archived">Archived</option>
            </select>

=======
    return (
        <>
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
            <button
                onClick={() => setShowModal(true)}
                style={{
                    padding: '0.375rem 0.75rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                }}
                title="Move to Deals"
            >
                <Briefcase size={14} />
                Move to Deals
            </button>

<<<<<<< HEAD
            {showModal && mounted && createPortal(
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(2, 6, 23, 0.78)',
                    backdropFilter: 'blur(10px)',
                    padding: '2rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                }}>
                    <div style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.97)',
                        padding: '1.75rem',
                        borderRadius: '1rem',
                        maxWidth: '520px',
                        width: '100%',
                        boxShadow: '0 28px 45px -30px rgba(15, 23, 42, 0.45)',
                        border: '1px solid rgba(148, 163, 184, 0.3)',
                        maxHeight: '80vh',
                        overflow: 'auto',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#0f172a', margin: 0 }}>
                                    Move to Deals
                                </h3>
                                <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>{clientName}</p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{
                                    cursor: 'pointer',
                                    border: 'none',
                                    background: 'rgba(148, 163, 184, 0.2)',
                                    borderRadius: '999px',
                                    width: '32px',
                                    height: '32px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#475569'
                                }}
                            >
=======
            {showModal && (
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
                        maxWidth: '500px',
                        width: '90%',
                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                                Move {clientName} to Deals
                            </h3>
                            <button onClick={() => setShowModal(false)} style={{ cursor: 'pointer', border: 'none', background: 'none' }}>
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
                                <X size={20} />
                            </button>
                        </div>

                        <form action={handleSubmit}>
<<<<<<< HEAD
                            <div style={{ display: 'grid', gap: '0.9rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.4rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                        ARV (After Repair Value)
                                    </label>
                                    <input
                                        name="arv"
                                        type="number"
                                        step="0.01"
                                        required
                                        placeholder="150000"
                                        style={{
                                            width: '100%',
                                            padding: '0.65rem 0.75rem',
                                            border: '1px solid #dbeafe',
                                            borderRadius: '0.65rem',
                                            fontSize: '0.875rem',
                                            background: '#f8fafc',
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.4rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                        Repairs Estimate
                                    </label>
                                    <input
                                        name="repairs"
                                        type="number"
                                        step="0.01"
                                        required
                                        placeholder="30000"
                                        style={{
                                            width: '100%',
                                            padding: '0.65rem 0.75rem',
                                            border: '1px solid #dbeafe',
                                            borderRadius: '0.65rem',
                                            fontSize: '0.875rem',
                                            background: '#f8fafc',
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.4rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                        Wholesale Offer
                                    </label>
                                    <input
                                        name="wholesaleOffer"
                                        type="number"
                                        step="0.01"
                                        required
                                        placeholder="85000"
                                        style={{
                                            width: '100%',
                                            padding: '0.65rem 0.75rem',
                                            border: '1px solid #dbeafe',
                                            borderRadius: '0.65rem',
                                            fontSize: '0.875rem',
                                            background: '#f8fafc',
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
=======
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                                    ARV (After Repair Value)
                                </label>
                                <input
                                    name="arv"
                                    type="number"
                                    step="0.01"
                                    required
                                    placeholder="150000"
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        border: '1px solid #cbd5e1',
                                        borderRadius: '0.375rem',
                                        fontSize: '0.875rem',
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                                    Repairs Estimate
                                </label>
                                <input
                                    name="repairs"
                                    type="number"
                                    step="0.01"
                                    required
                                    placeholder="30000"
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        border: '1px solid #cbd5e1',
                                        borderRadius: '0.375rem',
                                        fontSize: '0.875rem',
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                                    Wholesale Offer
                                </label>
                                <input
                                    name="wholesaleOffer"
                                    type="number"
                                    step="0.01"
                                    required
                                    placeholder="85000"
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        border: '1px solid #cbd5e1',
                                        borderRadius: '0.375rem',
                                        fontSize: '0.875rem',
                                    }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    style={{
<<<<<<< HEAD
                                        padding: '0.55rem 1rem',
                                        borderRadius: '999px',
                                        border: '1px solid #dbeafe',
                                        backgroundColor: '#f8fafc',
=======
                                        padding: '0.5rem 1rem',
                                        borderRadius: '0.375rem',
                                        border: '1px solid #cbd5e1',
                                        backgroundColor: 'white',
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
                                        cursor: 'pointer',
                                        fontWeight: '500',
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{
<<<<<<< HEAD
                                        padding: '0.55rem 1.1rem',
                                        borderRadius: '999px',
                                        border: 'none',
                                        background: 'linear-gradient(135deg, #2563eb, #60a5fa)',
=======
                                        padding: '0.5rem 1rem',
                                        borderRadius: '0.375rem',
                                        border: 'none',
                                        backgroundColor: '#3b82f6',
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
                                        color: 'white',
                                        cursor: 'pointer',
                                        fontWeight: '500',
                                    }}
                                >
                                    Create Deal
                                </button>
                            </div>
                        </form>
                    </div>
<<<<<<< HEAD
                </div>,
                document.body
            )}
        </div>
=======
                </div>
            )}
        </>
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
    );
}
