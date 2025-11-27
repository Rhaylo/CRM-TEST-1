'use client';

import { Briefcase, X } from 'lucide-react';
import { useState } from 'react';
import { createDealFromClient } from './createDealAction';

export default function ClientActions({ clientId, clientName }: { clientId: number; clientName: string }) {
    const [showModal, setShowModal] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        await createDealFromClient(clientId, formData);
        setShowModal(false);
    };

    return (
        <>
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
                                <X size={20} />
                            </button>
                        </div>

                        <form action={handleSubmit}>
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
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
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
                                    type="submit"
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '0.375rem',
                                        border: 'none',
                                        backgroundColor: '#3b82f6',
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
                </div>
            )}
        </>
    );
}
