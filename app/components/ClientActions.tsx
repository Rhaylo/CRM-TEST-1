'use client';

import { Briefcase, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { updateClientStatus } from '@/app/clients/[id]/actions';
import { createDealFromClient } from './createDealAction';

export default function ClientActions({ clientId, clientName, status }: { clientId: number; clientName: string; status: string }) {
    const [showModal, setShowModal] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(status || 'Active');
    const [mounted, setMounted] = useState(false);

    const handleStatusChange = async (newStatus: string) => {
        setCurrentStatus(newStatus);
        await updateClientStatus(clientId, newStatus);
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

    const handleSubmit = async (formData: FormData) => {
        await createDealFromClient(clientId, formData);
        setShowModal(false);
        await handleActivate();
    };

    return (
        <>
            <select
                value={currentStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                style={{
                    padding: '0.25rem 0.5rem',
                    border: '1px solid #bfdbfe',
                    borderRadius: '0.5rem',
                    fontSize: '0.75rem',
                    color: '#334155',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                }}
            >
                <option value="Active">Active</option>
                <option value="Snoozed">Snoozed</option>
                <option value="Archived">Archived</option>
                <option value="Fall Through">Fall Through</option>
            </select>
            <button
                onClick={() => setShowModal(true)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.35rem 0.75rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                }}
            >
                <Briefcase size={14} /> Move to Deals
            </button>

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
                                    color: '#475569',
                                }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form action={handleSubmit}>
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
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    style={{
                                        padding: '0.55rem 1rem',
                                        borderRadius: '999px',
                                        border: '1px solid #dbeafe',
                                        backgroundColor: '#f8fafc',
                                        cursor: 'pointer',
                                        fontWeight: '500',
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{
                                        padding: '0.55rem 1.1rem',
                                        borderRadius: '999px',
                                        border: 'none',
                                        background: 'linear-gradient(135deg, #2563eb, #60a5fa)',
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
                </div>,
                document.body,
            )}
        </>
    );
}
