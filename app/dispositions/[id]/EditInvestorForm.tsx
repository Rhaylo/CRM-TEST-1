'use client';

import { useState } from 'react';
import { updateInvestor, deleteInvestor } from '../actions';
import { Pencil, X, Check, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from './InvestorProfile.module.css';

export default function EditInvestorForm({ investor }: { investor: any }) {
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {
        await updateInvestor(investor.id, formData);
        setIsEditing(false);
    };

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this investor? This will also delete all associated deals and notes. This cannot be undone.')) {
            await deleteInvestor(investor.id);
            router.push('/dispositions');
        }
    };

    if (!isEditing) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                <button
                    onClick={() => setIsEditing(true)}
                    className={styles.actionButton}
                >
                    <Pencil size={16} />
                    Edit Profile
                </button>
                <button
                    onClick={handleDelete}
                    className={`${styles.actionButton} ${styles.actionDanger}`}
                >
                    <Trash2 size={16} />
                    Delete Investor
                </button>
            </div>
        );
    }

    return (
        <form action={handleSubmit} style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(148, 163, 184, 0.2)', paddingTop: '1.5rem' }}>
            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.75rem', fontWeight: '600', color: '#64748b' }}>Contact Name</label>
                <input type="text" name="contactName" defaultValue={investor.contactName} required className={styles.input} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.75rem', fontWeight: '600', color: '#64748b' }}>Company Name</label>
                <input type="text" name="companyName" defaultValue={investor.companyName || ''} className={styles.input} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.75rem', fontWeight: '600', color: '#64748b' }}>Email</label>
                <input type="email" name="email" defaultValue={investor.email || ''} className={styles.input} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.75rem', fontWeight: '600', color: '#64748b' }}>Phone</label>
                <input type="tel" name="phone" defaultValue={investor.phone || ''} className={styles.input} />
            </div>
            <div className={styles.formGrid}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.75rem', fontWeight: '600', color: '#64748b' }}>State</label>
                    <input type="text" name="state" defaultValue={investor.state || ''} placeholder="e.g. GA" className={styles.input} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.75rem', fontWeight: '600', color: '#64748b' }}>Zone/Market</label>
                    <input type="text" name="zone" defaultValue={investor.zone || ''} placeholder="e.g. Atlanta" className={styles.input} />
                </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.75rem', fontWeight: '600', color: '#64748b' }}>Status</label>
                <select name="status" defaultValue={investor.status} className={styles.input}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Do Not Contact">Do Not Contact</option>
                </select>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.75rem', fontWeight: '600', color: '#64748b' }}>Buying Criteria</label>
                <textarea name="buyingCriteria" defaultValue={investor.buyingCriteria || ''} rows={3} className={styles.textarea} />
            </div>

            <div className={styles.formActions}>
                <button type="button" onClick={() => setIsEditing(false)} className={styles.actionButton}>
                    <X size={16} /> Cancel
                </button>
                <button type="submit" className={`${styles.actionButton} ${styles.actionPrimary}`}>
                    <Check size={16} /> Save
                </button>
            </div>
        </form>
    );
}
