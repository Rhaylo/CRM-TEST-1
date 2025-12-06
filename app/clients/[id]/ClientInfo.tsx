'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { updateClientDetails } from './actions';
import { deleteClient } from './deleteActions';
import { Pencil, Save, X } from 'lucide-react';
import DeleteButton from '@/app/components/DeleteButton';
import EmailModal from './EmailModal';
import ContractGenerator from './ContractGenerator';

export default function ClientInfo({ client }: { client: any }) {
    const [isEditing, setIsEditing] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const leadAge = Math.floor((Date.now() - new Date(client.createdAt).getTime()) / (1000 * 60 * 60 * 24));

    const handleSubmit = async (formData: FormData) => {
        await updateClientDetails(client.id, formData);
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <form action={handleSubmit} className={styles.header}>
                <div className={styles.headerTop}>
                    <input
                        name="contactName"
                        defaultValue={client.contactName}
                        className="text-2xl font-bold border rounded px-2 py-1 w-full max-w-md"
                        required
                    />
                    <div className="flex gap-2">
                        <button type="submit" className="p-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200">
                            <Save size={20} />
                        </button>
                        <button type="button" onClick={() => setIsEditing(false)} className="p-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className={styles.contactInfo}>
                    <div className={styles.infoItem}>
                        <label className={styles.label}>Email</label>
                        <input name="email" defaultValue={client.email} className="border rounded px-2 py-1 w-full" />
                    </div>
                    <div className={styles.infoItem}>
                        <label className={styles.label}>Phone</label>
                        <input name="phone" defaultValue={client.phone} className="border rounded px-2 py-1 w-full" />
                    </div>
                    <div className={styles.infoItem}>
                        <label className={styles.label}>Address</label>
                        <input name="address" defaultValue={client.address} className="border rounded px-2 py-1 w-full" />
                    </div>
                    <div className={styles.infoItem}>
                        <label className={styles.label}>Property Condition</label>
                        <input name="propertyCondition" defaultValue={client.propertyCondition} className="border rounded px-2 py-1 w-full" placeholder="e.g. Good" />
                    </div>
                    <div className={styles.infoItem}>
                        <label className={styles.label}>Property Link</label>
                        <input name="propertyLink" defaultValue={client.propertyLink} className="border rounded px-2 py-1 w-full" placeholder="https://..." />
                    </div>
                    <div className={styles.infoItem}>
                        <label className={styles.label}>Asking Price</label>
                        <input name="askingPrice" type="number" step="0.01" defaultValue={client.askingPrice} className="border rounded px-2 py-1 w-full" placeholder="150000" />
                    </div>
                    <div className={styles.infoItem}>
                        <label className={styles.label}>Our Offer</label>
                        <input name="ourOffer" type="number" step="0.01" defaultValue={client.ourOffer} className="border rounded px-2 py-1 w-full" placeholder="120000" />
                    </div>
                    <div className={styles.infoItem}>
                        <label className={styles.label}>ARV</label>
                        <input name="arv" type="number" step="0.01" defaultValue={client.arv} className="border rounded px-2 py-1 w-full" placeholder="200000" />
                    </div>
                </div>
            </form>
        );
    }

    return (
        <div className={styles.header}>
            <div className={styles.headerTop}>
                <div className="flex items-center gap-4">
                    <h1 className={styles.companyName}>{client.contactName}</h1>
                    {client.deals && client.deals.length > 0 ? (
                        <span style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            backgroundColor: client.deals[0].stage === 'Complete' ? '#dcfce7' :
                                client.deals[0].stage === 'Pending' ? '#fef3c7' :
                                    client.deals[0].stage === 'Contract In' ? '#dbeafe' : '#e0e7ff',
                            color: client.deals[0].stage === 'Complete' ? '#166534' :
                                client.deals[0].stage === 'Pending' ? '#92400e' :
                                    client.deals[0].stage === 'Contract In' ? '#1e40af' : '#4338ca',
                            border: '2px solid',
                            borderColor: client.deals[0].stage === 'Complete' ? '#86efac' :
                                client.deals[0].stage === 'Pending' ? '#fde047' :
                                    client.deals[0].stage === 'Contract In' ? '#93c5fd' : '#a5b4fc',
                        }}>
                            {client.deals[0].stage}
                        </span>
                    ) : (
                        <span style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            backgroundColor: '#f1f5f9',
                            color: '#64748b',
                            border: '2px solid #cbd5e1',
                        }}>
                            Working
                        </span>
                    )}
                    <button onClick={() => setIsEditing(true)} className="text-slate-400 hover:text-blue-600 transition-colors">
                        <Pencil size={18} />
                    </button>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span className={styles.leadAge}>{leadAge} days old</span>
                    <ContractGenerator clientId={client.id} clientName={client.contactName} />
                    <DeleteButton
                        onDelete={() => deleteClient(client.id)}
                        itemType="Client"
                        itemName={client.contactName}
                    />
                </div>
            </div>
            <div className={styles.contactInfo}>
                <div className={styles.infoItem}>
                    <span className={styles.label}>Email:</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                        <span className={styles.value}>{client.email || '-'}</span>
                        {client.email && (
                            <button
                                onClick={() => setShowEmailModal(true)}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    padding: '0.25rem 0.75rem',
                                    backgroundColor: '#10b981',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0.375rem',
                                    fontSize: '0.75rem',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                📧 Send Email
                            </button>
                        )}
                    </div>
                </div>
                <div className={styles.infoItem}>
                    <span className={styles.label}>Phone:</span>
                    <span className={styles.value}>{client.phone || '-'}</span>
                </div>
                <div className={styles.infoItem}>
                    <span className={styles.label}>Address:</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                        <span className={styles.value}>{client.address || '-'}</span>
                        {client.address && (
                            <a
                                href={client.propertyLink || `https://www.zillow.com/homes/${encodeURIComponent(client.address)}_rb/`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    padding: '0.25rem 0.75rem',
                                    backgroundColor: client.propertyLink ? '#10b981' : '#0074e4',
                                    color: 'white',
                                    textDecoration: 'none',
                                    borderRadius: '0.375rem',
                                    fontSize: '0.75rem',
                                    fontWeight: '500',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {client.propertyLink ? '🔗 View Property' : '🏠 View on Zillow'}
                            </a>
                        )}
                    </div>
                </div>
                <div className={styles.infoItem}>
                    <span className={styles.label}>Condition:</span>
                    <span className={styles.value}>{client.propertyCondition || '-'}</span>
                </div>
                <div className={styles.infoItem}>
                    <span className={styles.label}>Asking Price:</span>
                    <span className={styles.value}>{client.askingPrice ? `$${client.askingPrice.toLocaleString()}` : '-'}</span>
                </div>
                <div className={styles.infoItem}>
                    <span className={styles.label}>Our Offer:</span>
                    <span className={styles.value}>{client.ourOffer ? `$${client.ourOffer.toLocaleString()}` : '-'}</span>
                </div>
                <div className={styles.infoItem}>
                    <span className={styles.label}>ARV:</span>
                    <span className={styles.value}>{client.arv ? `$${client.arv.toLocaleString()}` : '-'}</span>
                </div>
            </div>

            {showEmailModal && client.email && (
                <EmailModal
                    clientEmail={client.email}
                    clientName={client.contactName}
                    onClose={() => setShowEmailModal(false)}
                />
            )}
        </div>
    );
}
