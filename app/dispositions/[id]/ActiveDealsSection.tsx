'use client';

import { useState } from 'react';
import { Plus, ExternalLink, Pencil, X, Check, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { createDealForInvestor, updateDeal, deleteDeal } from '../actions';
import styles from './InvestorProfile.module.css';

export default function ActiveDealsSection({
    investorId,
    deals,
    clients,
}: {
    investorId: number;
    deals: any[];
    clients: any[];
}) {
    const [isAdding, setIsAdding] = useState(false);

    const activeDeals = deals.filter((d) => d.stage !== 'Complete' && d.stage !== 'Sold');
    const pastDeals = deals.filter((d) => d.stage === 'Complete' || d.stage === 'Sold');

    return (
        <div className={styles.dealSection}>
            <div className={styles.card}>
                <div className={styles.dealHeader}>
                    <h2 className={styles.sectionTitle}>Active Deals</h2>
                    <button
                        onClick={() => setIsAdding(true)}
                        className={styles.editButton}
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
                    <div className={styles.dealList}>
                        {activeDeals.map((deal) => (
                            <DealCard key={deal.id} deal={deal} investorId={investorId} />
                        ))}
                    </div>
                )}
            </div>

            <div className={styles.card}>
                <h2 className={styles.sectionTitle}>Deal History</h2>
                {pastDeals.length === 0 ? (
                    <p style={{ color: '#64748b', fontStyle: 'italic' }}>No completed deals yet.</p>
                ) : (
                    <div className={styles.dealList}>
                        {pastDeals.map((deal) => (
                            <DealCard key={deal.id} deal={deal} investorId={investorId} isHistory />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function DealCard({ deal, investorId, isHistory = false }: { deal: any; investorId: number; isHistory?: boolean }) {
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
        <div className={`${styles.dealCard} ${isHistory ? styles.dealCardHistory : ''}`}>
            <div className={styles.dealCardHeader}>
                <div>
                    <div className={styles.dealTitle}>
                        {deal.client.address || deal.client.contactName}
                        <Link href={`/clients/${deal.client.id}`} title="View Client/Property">
                            <ExternalLink size={14} color="#64748b" />
                        </Link>
                    </div>
                    <div className={styles.dealSub}>Seller: {deal.client.contactName}</div>
                </div>
                <div className={styles.dealActions}>
                    <span className={`${styles.stageBadge} ${isHistory ? styles.stageHistory : ''}`}>
                        {deal.stage}
                    </span>
                    <button
                        onClick={() => setIsEditing(true)}
                        className={styles.iconButton}
                        title="Edit Deal"
                    >
                        <Pencil size={14} />
                    </button>
                    <button
                        onClick={handleDelete}
                        className={`${styles.iconButton} ${styles.iconDanger}`}
                        title="Delete Deal"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>

            <div className={styles.dealMeta}>
                <div>
                    <div className={styles.metaLabel}>Offer Amount</div>
                    <div className={styles.metaValue}>${deal.amount.toLocaleString()}</div>
                </div>
                <div>
                    <div className={styles.metaLabel}>Assignment Fee</div>
                    <div className={styles.metaValue}>
                        {deal.assignmentFee ? `$${deal.assignmentFee.toLocaleString()}` : '-'}
                    </div>
                </div>
                <div>
                    <div className={styles.metaLabel}>Timeline</div>
                    <div className={styles.metaValue}>
                        {deal.expectedCloseDate ? new Date(deal.expectedCloseDate).toLocaleDateString() : 'TBD'}
                    </div>
                </div>
            </div>
        </div>
    );
}

function EditDealForm({ deal, investorId, onCancel }: { deal: any; investorId: number; onCancel: () => void }) {
    const handleSubmit = async (formData: FormData) => {
        await updateDeal(deal.id, investorId, formData);
        onCancel();
    };

    return (
        <form action={handleSubmit} className={styles.formCard}>
            <div style={{ marginBottom: '1rem', fontWeight: '600', color: '#1e40af' }}>
                Editing Deal for {deal.client.address || deal.client.contactName}
            </div>

            <div className={styles.formGrid}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Offer Amount</label>
                    <input type="number" name="amount" defaultValue={deal.amount} required className={styles.input} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Assignment Fee</label>
                    <input type="number" name="assignmentFee" defaultValue={deal.assignmentFee || ''} className={styles.input} />
                </div>
            </div>

            <div className={styles.formGrid}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Stage</label>
                    <select name="stage" defaultValue={deal.stage} className={styles.input}>
                        <option value="Under Contract">Under Contract</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Buyer Found">Buyer Found</option>
                        <option value="Sold">Sold</option>
                        <option value="Complete">Complete</option>
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Expected Close</label>
                    <input
                        type="date"
                        name="expectedCloseDate"
                        defaultValue={deal.expectedCloseDate ? new Date(deal.expectedCloseDate).toISOString().split('T')[0] : ''}
                        className={styles.input}
                    />
                </div>
            </div>

            <div className={styles.formActions}>
                <button type="button" onClick={onCancel} className={styles.actionButton}>
                    <X size={16} /> Cancel
                </button>
                <button type="submit" className={`${styles.actionButton} ${styles.actionPrimary}`}>
                    <Check size={16} /> Save Changes
                </button>
            </div>
        </form>
    );
}

function AddDealForm({ investorId, clients, onCancel }: { investorId: number; clients: any[]; onCancel: () => void }) {
    const handleSubmit = async (formData: FormData) => {
        await createDealForInvestor(investorId, formData);
        onCancel();
    };

    return (
        <form action={handleSubmit} className={styles.formCard}>
            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Select Property (Client)</label>
                <select name="clientId" required className={styles.input}>
                    <option value="">-- Select Property --</option>
                    {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                            {client.address ? `${client.address} (${client.contactName})` : client.contactName}
                        </option>
                    ))}
                </select>
            </div>

            <div className={styles.formGrid}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Offer Amount</label>
                    <input type="number" name="amount" required placeholder="0.00" className={styles.input} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Assignment Fee</label>
                    <input type="number" name="assignmentFee" placeholder="0.00" className={styles.input} />
                </div>
            </div>

            <div className={styles.formGrid}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Stage</label>
                    <select name="stage" className={styles.input}>
                        <option value="Under Contract">Under Contract</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Buyer Found">Buyer Found</option>
                        <option value="Sold">Sold</option>
                        <option value="Complete">Complete</option>
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Expected Close</label>
                    <input type="date" name="expectedCloseDate" className={styles.input} />
                </div>
            </div>

            <div className={styles.formActions}>
                <button type="button" onClick={onCancel} className={styles.actionButton}>
                    Cancel
                </button>
                <button type="submit" className={`${styles.actionButton} ${styles.actionPrimary}`}>
                    Create Deal
                </button>
            </div>
        </form>
    );
}
