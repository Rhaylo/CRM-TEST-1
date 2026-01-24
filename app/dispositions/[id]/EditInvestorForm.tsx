'use client';

import { useState } from 'react';
import { updateInvestor, deleteInvestor } from '../actions';
import { Pencil, X, Check, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: 'white',
                        border: '1px solid #cbd5e1',
                        borderRadius: '0.375rem',
                        color: '#475569',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                    }}
                >
                    <Pencil size={16} />
                    Edit Profile
                </button>
                <button
                    onClick={handleDelete}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: '#fee2e2',
                        border: '1px solid #fca5a5',
                        borderRadius: '0.375rem',
                        color: '#ef4444',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                    }}
                >
                    <Trash2 size={16} />
                    Delete Investor
                </button>
            </div>
        );
    }

    return (
        <form action={handleSubmit} style={{ marginTop: '1.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.75rem', fontWeight: '600', color: '#64748b' }}>Contact Name</label>
                <input type="text" name="contactName" defaultValue={investor.contactName} required style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.75rem', fontWeight: '600', color: '#64748b' }}>Company Name</label>
                <input type="text" name="companyName" defaultValue={investor.companyName || ''} style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.75rem', fontWeight: '600', color: '#64748b' }}>Email</label>
                <input type="email" name="email" defaultValue={investor.email || ''} style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.75rem', fontWeight: '600', color: '#64748b' }}>Phone</label>
                <input type="tel" name="phone" defaultValue={investor.phone || ''} style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.75rem', fontWeight: '600', color: '#64748b' }}>State</label>
                    <input type="text" name="state" defaultValue={investor.state || ''} placeholder="e.g. GA" style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.75rem', fontWeight: '600', color: '#64748b' }}>Zone/Market</label>
                    <input type="text" name="zone" defaultValue={investor.zone || ''} placeholder="e.g. Atlanta" style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }} />
                </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.75rem', fontWeight: '600', color: '#64748b' }}>Status</label>
                <select name="status" defaultValue={investor.status} style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Do Not Contact">Do Not Contact</option>
                </select>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.75rem', fontWeight: '600', color: '#64748b' }}>Buying Criteria</label>
                <textarea name="buyingCriteria" defaultValue={investor.buyingCriteria || ''} rows={3} style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }} />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="button" onClick={() => setIsEditing(false)} style={{ flex: 1, padding: '0.5rem', backgroundColor: '#f1f5f9', color: '#475569', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <X size={16} /> Cancel
                </button>
                <button type="submit" style={{ flex: 1, padding: '0.5rem', backgroundColor: '#2563eb', color: 'white', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <Check size={16} /> Save
                </button>
            </div>
        </form>
    );
}
