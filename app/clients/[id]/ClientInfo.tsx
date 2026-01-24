'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { updateClientDetails, addSeller, deleteSeller, editSeller } from './actions';
import { deleteClient } from './deleteActions';
import { Pencil, Save, X, Plus, Trash2, UserPlus } from 'lucide-react';
import DeleteButton from '@/app/components/DeleteButton';
import EmailModal from './EmailModal';

export default function ClientInfo({ client, titleCompanies = [] }: { client: any, titleCompanies?: any[] }) {
    const [isEditing, setIsEditing] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [isAddingSeller, setIsAddingSeller] = useState(false);
    const leadAge = Math.floor((Date.now() - new Date(client.createdAt).getTime()) / (1000 * 60 * 60 * 24));

    const handleSubmit = async (formData: FormData) => {
        await updateClientDetails(client.id, formData);
        setIsEditing(false);
    };

    const handleAddSeller = async (formData: FormData) => {
        await addSeller(client.id, formData);
        setIsAddingSeller(false);
    };

    const [editingSellerId, setEditingSellerId] = useState<number | null>(null);

    const handleEditSeller = async (formData: FormData) => {
        if (!editingSellerId) return;
        await editSeller(client.id, editingSellerId, formData);
        setEditingSellerId(null);
    };

    return (
        <div className={styles.header}>
            <div className={styles.headerTop}>
                {/* ... (Existing Header Logic - Kept concise, assuming simple replace handles it if context matches) ... */}
                {/* Actually, I need to restore the full header if I'm replacing the whole component or block. */}
                {/* To avoid huge replace, I will try to target specific blocks or inject. But replacing the whole return is cleaner here to insert the new section. */}
                {/* Wait, I can't easily replicate the whole header logic without reading it precisely. */}
                {/* I will use the "Edit Mode" check as a boundary? No. */}
                {/* I will append the wrapper logic. */}

                <div className="flex items-center gap-4">
                    {/* ... Re-implementing specific parts is risky if I miss lines. */}
                    {/* Let's try to just insert the "Additional Sellers" section at the end of the return JSX. */}
                </div>
                {/* ... */}
            </div>

            {/* If Editing Mode ... */}
            {isEditing ? (
                <form action={handleSubmit} className={styles.header}>
                    {/* ... Edit Form ... */}
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
                        {/* ... Info Items ... */}
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

                        <div className={styles.infoItem} style={{ gridColumn: '1 / -1' }}>
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

                        {/* Title Company Selection in Edit Mode */}
                        <div className={styles.infoItem} style={{ gridColumn: '1 / -1', marginTop: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                            <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#475569' }}>Closing Setup</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label className={styles.label}>Title Company</label>
                                    <select
                                        name="titleCompanyId"
                                        defaultValue={client.titleCompanyId || ''}
                                        className="border rounded px-2 py-1 w-full"
                                        style={{ backgroundColor: 'white' }}
                                    >
                                        <option value="">-- Select Company --</option>
                                        {titleCompanies.map(tc => (
                                            <option key={tc.id} value={tc.id}>{tc.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className={styles.label}>Escrow Agent</label>
                                    <select
                                        name="escrowAgentId"
                                        defaultValue={client.escrowAgentId || ''}
                                        className="border rounded px-2 py-1 w-full"
                                        style={{ backgroundColor: 'white' }}
                                    >
                                        <option value="">-- Select Agent --</option>
                                        {titleCompanies.flatMap(tc => tc.escrowAgents).map((agent: any) => (
                                            <option key={agent.id} value={agent.id}>{agent.name} ({titleCompanies.find(t => t.id === agent.titleCompanyId)?.name})</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            ) : (
                <>
                    <div className={styles.headerTop}>
                        {/* Existing View Mode Header ... */}
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
                            <span className={styles.label}>Asking Price:</span>
                            <span className={styles.value}>{client.askingPrice ? `$${client.askingPrice.toLocaleString()}` : '-'}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.label}>Our Offer:</span>
                            <span className={styles.value}>{client.ourOffer ? `$${client.ourOffer.toLocaleString()}` : '-'}</span>
                        </div>
                        <span className={styles.value}>{client.arv ? `$${client.arv.toLocaleString()}` : '-'}</span>
                    </div>

                    {(client.titleCompany || client.escrowAgent) && (
                        <div style={{ gridColumn: '1 / -1', marginTop: '1rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                            <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Closing Team</h4>
                            <div style={{ display: 'flex', gap: '2rem' }}>
                                {client.titleCompany && (
                                    <div>
                                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Title Company</span>
                                        <span style={{ fontWeight: '500', color: '#334155' }}>{client.titleCompany.name}</span>
                                        {client.titleCompany.phone && <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748b' }}>{client.titleCompany.phone}</span>}
                                    </div>
                                )}
                                {client.escrowAgent && (
                                    <div>
                                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Escrow Agent</span>
                                        <span style={{ fontWeight: '500', color: '#334155' }}>{client.escrowAgent.name}</span>
                                        <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748b' }}>{client.escrowAgent.email}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}



                    {/* Additional Sellers Section */}
                    <div className={styles.sellersSection}>
                        <div className={styles.sellersHeader}>
                            <h3 className={styles.sectionTitle}>
                                <UserPlus size={18} color="#94a3b8" />
                                Additional Sellers
                            </h3>
                            {!isAddingSeller && (
                                <button
                                    onClick={() => setIsAddingSeller(true)}
                                    className={styles.addSellerButton}
                                >
                                    <Plus size={14} /> Add Seller
                                </button>
                            )}
                        </div>

                        {isAddingSeller && (
                            <form action={handleAddSeller} className={styles.addForm}>
                                <div className={styles.formGrid}>
                                    <input name="name" placeholder="Name" required className={styles.input} />
                                    <input name="email" placeholder="Email" className={styles.input} />
                                    <input name="phone" placeholder="Phone" className={styles.input} />
                                    <input name="relationship" placeholder="Relationship (e.g. Spouse)" className={styles.input} />
                                </div>
                                <div className={styles.formActions}>
                                    <button type="button" onClick={() => setIsAddingSeller(false)} className={styles.cancelBtn}>Cancel</button>
                                    <button type="submit" className={styles.saveBtn}>Save Seller</button>
                                </div>
                            </form>
                        )}

                        <div className={styles.sellersList}>
                            {client.additionalSellers && client.additionalSellers.map((seller: any) => (
                                editingSellerId === seller.id ? (
                                    <form key={seller.id} action={handleEditSeller} className={styles.addForm}>
                                        <div className={styles.formGrid}>
                                            <input name="name" defaultValue={seller.name} required className={styles.input} placeholder="Name" />
                                            <input name="email" defaultValue={seller.email} className={styles.input} placeholder="Email" />
                                            <input name="phone" defaultValue={seller.phone} className={styles.input} placeholder="Phone" />
                                            <input name="relationship" defaultValue={seller.relationship} className={styles.input} placeholder="Relationship" />
                                        </div>
                                        <div className={styles.formActions}>
                                            <button type="button" onClick={() => setEditingSellerId(null)} className={styles.cancelBtn}>Cancel</button>
                                            <button type="submit" className={styles.saveBtn}>Save Changes</button>
                                        </div>
                                    </form>
                                ) : (
                                    <div key={seller.id} className={styles.sellerCard}>
                                        <div>
                                            <div className={styles.sellerName}>{seller.name}</div>
                                            <div className={styles.sellerDetails}>
                                                {seller.relationship && <span className={styles.sellerTag}>{seller.relationship}</span>}
                                                {seller.email && <span>{seller.email}</span>}
                                                {seller.phone && <span>{seller.phone}</span>}
                                            </div>
                                        </div>
                                        <div className={styles.actionButtons}>
                                            <button
                                                onClick={() => setEditingSellerId(seller.id)}
                                                className={styles.editSellerBtn}
                                                title="Edit Seller"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                onClick={() => deleteSeller(seller.id, client.id)}
                                                className={styles.deleteSellerBtn}
                                                title="Remove Seller"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )
                            ))}
                            {(!client.additionalSellers || client.additionalSellers.length === 0) && !isAddingSeller && (
                                <p style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.875rem' }}>No additional sellers listed.</p>
                            )}
                        </div>
                    </div>

                    {
                        showEmailModal && client.email && (
                            <EmailModal
                                clientEmail={client.email}
                                clientName={client.contactName}
                                clientCompanyName={client.companyName || ''}
                                onClose={() => setShowEmailModal(false)}
                            />
                        )
                    }
                </>
            )}
        </div>
    );
}
