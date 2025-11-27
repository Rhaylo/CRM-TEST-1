'use client';

import { useState } from 'react';
import { Plus, ExternalLink, Pencil, X, Check, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { createDealForInvestor, updateDeal, deleteDeal } from '../actions';

export default function ActiveDealsSection({ investorId, deals, clients }: { investorId: number, deals: any[], clients: any[] }) {
    const [isAdding, setIsAdding] = useState(false);

    const activeDeals = deals.filter(d => d.stage !== 'Complete');
    const pastDeals = deals.filter(d => d.stage === 'Complete');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Active Deals */}
            <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>Active Deals</h2>
                    <button
                        onClick={() => setIsAdding(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '500' }}
                    >
                        <Plus size={16} /> Link New Property
                    </button>
                </div>

                {isAdding && (
                    <AddDealForm
                        investorId={investorId}
                        clients={clients}
                        onCancel={() => setIsAdding(false)}
                    />
                )}

                {activeDeals.length === 0 ? (
                    <p style={{ color: '#64748b', fontStyle: 'italic' }}>No active deals with this investor.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {activeDeals.map(deal => (
                            <DealCard key={deal.id} deal={deal} investorId={investorId} />
                        ))}
                    </div>
                )}
            </div>

            {/* Past Deals (History) */}
            <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1e293b', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                    Deal History
                </h2>
                {pastDeals.length === 0 ? (
                    <p style={{ color: '#64748b', fontStyle: 'italic' }}>No completed deals yet.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {pastDeals.map(deal => (
                            <DealCard key={deal.id} deal={deal} investorId={investorId} isHistory />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function DealCard({ deal, investorId, isHistory = false }: { deal: any, investorId: number, isHistory?: boolean }) {
    const [isEditing, setIsEditing] = useState(false);

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this deal? This cannot be undone.')) {
            await deleteDeal(deal.id, investorId);
        }
    };

    if (isEditing) {
        return (
            <EditDealForm
                deal={deal}
                investorId={investorId}
                onCancel={() => setIsEditing(false)}
            />
        );
    }

    return (
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1rem', backgroundColor: isHistory ? '#f8fafc' : 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div>
                    <div style={{ fontWeight: '600', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {deal.client.address || deal.client.contactName}
                        <Link href={`/clients/${deal.client.id}`} title="View Client/Property">
                            <ExternalLink size={14} color="#64748b" />
                        </Link>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Seller: {deal.client.contactName}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{
                        fontSize: '0.75rem',
                        padding: '0.25rem 0.75rem',
                        backgroundColor: isHistory ? '#dcfce7' : '#dbeafe',
                        color: isHistory ? '#166534' : '#1e40af',
                        borderRadius: '9999px',
                        height: 'fit-content',
                        fontWeight: '600'
                    }}>
                        {deal.stage}
                    </span>
                    <button
                        onClick={() => setIsEditing(true)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '0.25rem' }}
                        title="Edit Deal"
                    >
                        <Pencil size={14} />
                    </button>
                    <button
                        onClick={handleDelete}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '0.25rem' }}
                        title="Delete Deal"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>Offer Amount</div>
                    <div style={{ fontWeight: '600', color: '#1e293b' }}>${deal.amount.toLocaleString()}</div>
                </div>
                <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>Assignment Fee</div>
                    <div style={{ fontWeight: '600', color: '#16a34a' }}>
                        {deal.assignmentFee ? `$${deal.assignmentFee.toLocaleString()}` : '-'}
                    </div>
                </div>
                <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>Timeline</div>
                    <div style={{ fontSize: '0.875rem', color: '#1e293b' }}>
                        {deal.expectedCloseDate ? new Date(deal.expectedCloseDate).toLocaleDateString() : 'TBD'}
                    </div>
                </div>
            </div>
        </div>
    );
}

function EditDealForm({ deal, investorId, onCancel }: { deal: any, investorId: number, onCancel: () => void }) {
    const handleSubmit = async (formData: FormData) => {
        await updateDeal(deal.id, investorId, formData);
        onCancel();
    };

    return (
        <form action={handleSubmit} style={{ border: '1px solid #3b82f6', borderRadius: '0.5rem', padding: '1rem', backgroundColor: '#eff6ff' }}>
            <div style={{ marginBottom: '1rem', fontWeight: '600', color: '#1e40af' }}>
                Editing Deal for {deal.client.address || deal.client.contactName}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Offer Amount</label>
                    <input type="number" name="amount" defaultValue={deal.amount} required style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Assignment Fee</label>
                    <input type="number" name="assignmentFee" defaultValue={deal.assignmentFee || ''} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1' }} />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Stage</label>
                    <select name="stage" defaultValue={deal.stage} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1' }}>
                        <option value="Pending">Pending</option>
                        <option value="Contract In">Contract In</option>
                        <option value="Contract Out">Contract Out</option>
                        <option value="Complete">Complete</option>
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Expected Close</label>
                    <input
                        type="date"
                        name="expectedCloseDate"
                        defaultValue={deal.expectedCloseDate ? new Date(deal.expectedCloseDate).toISOString().split('T')[0] : ''}
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1' }}
                    />
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" onClick={onCancel} style={{ padding: '0.5rem 1rem', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '0.375rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <X size={16} /> Cancel
                </button>
                <button type="submit" style={{ padding: '0.5rem 1rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Check size={16} /> Save Changes
                </button>
            </div>
        </form>
    );
}

function AddDealForm({ investorId, clients, onCancel }: { investorId: number, clients: any[], onCancel: () => void }) {
    const handleSubmit = async (formData: FormData) => {
        await createDealForInvestor(investorId, formData);
        onCancel();
    };

    return (
        <form action={handleSubmit} style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Select Property (Client)</label>
                <select name="clientId" required style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1' }}>
                    <option value="">-- Select Property --</option>
                    {clients.map(client => (
                        <option key={client.id} value={client.id}>
                            {client.address ? `${client.address} (${client.contactName})` : client.contactName}
                        </option>
                    ))}
                </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Offer Amount</label>
                    <input type="number" name="amount" required placeholder="0.00" style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Assignment Fee</label>
                    <input type="number" name="assignmentFee" placeholder="0.00" style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1' }} />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Stage</label>
                    <select name="stage" style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1' }}>
                        <option value="Pending">Pending</option>
                        <option value="Contract In">Contract In</option>
                        <option value="Contract Out">Contract Out</option>
                        <option value="Complete">Complete</option>
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Expected Close</label>
                    <input type="date" name="expectedCloseDate" style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1' }} />
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" onClick={onCancel} style={{ padding: '0.5rem 1rem', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '0.375rem', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '0.5rem 1rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}>Create Deal</button>
            </div>
        </form>
    );
}
