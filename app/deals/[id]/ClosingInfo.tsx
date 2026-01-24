'use client';

import { useState } from 'react';
import { Pencil, Save, X, Building2 } from 'lucide-react';
import { updateDealAnalysis } from '../actions';

interface ClosingInfoProps {
    deal: any;
    titleCompanies: any[]; // Using any to avoid strict type issues for now
}

export default function ClosingInfo({ deal, titleCompanies }: ClosingInfoProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    // Initial values
    const [titleCompanyId, setTitleCompanyId] = useState<string>(deal.titleCompanyId?.toString() || '');
    const [escrowAgentId, setEscrowAgentId] = useState<string>(deal.escrowAgentId?.toString() || '');

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateDealAnalysis(deal.id, {
                titleCompanyId: titleCompanyId ? parseInt(titleCompanyId) : null,
                escrowAgentId: escrowAgentId ? parseInt(escrowAgentId) : null,
            });
            setIsEditing(false);
            window.location.reload(); // Refresh to ensure server state is synced
        } catch (error) {
            console.error(error);
            alert('Failed to save closing info');
        } finally {
            setSaving(false);
        }
    };

    const selectedCompany = titleCompanies.find(tc => tc.id.toString() === titleCompanyId);
    const selectedAgent = titleCompanies.flatMap(tc => tc.escrowAgents).find((a: any) => a.id.toString() === escrowAgentId);

    // Filter agents by selected company
    const availableAgents = titleCompanyId
        ? titleCompanies.find(tc => tc.id.toString() === titleCompanyId)?.escrowAgents || []
        : [];

    if (isEditing) {
        return (
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
                <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontWeight: 'bold', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Building2 size={20} /> Closing Setup
                    </h3>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => setIsEditing(false)} style={{ padding: '0.25rem 0.5rem', color: '#64748b' }}>Cancel</button>
                        <button onClick={handleSave} disabled={saving} style={{ padding: '0.25rem 0.75rem', backgroundColor: '#3b82f6', color: 'white', borderRadius: '0.25rem' }}>
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#64748b', marginBottom: '0.5rem' }}>Title Company</label>
                        <select
                            value={titleCompanyId}
                            onChange={(e) => {
                                setTitleCompanyId(e.target.value);
                                setEscrowAgentId(''); // Reset agent when company changes
                            }}
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1' }}
                        >
                            <option value="">-- Select Company --</option>
                            {titleCompanies.map(tc => (
                                <option key={tc.id} value={tc.id}>{tc.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#64748b', marginBottom: '0.5rem' }}>Escrow Agent</label>
                        <select
                            value={escrowAgentId}
                            onChange={(e) => setEscrowAgentId(e.target.value)}
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1' }}
                            disabled={!titleCompanyId}
                        >
                            <option value="">-- Select Agent --</option>
                            {availableAgents.map((agent: any) => (
                                <option key={agent.id} value={agent.id}>{agent.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        );
    }

    // View Mode
    return (
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontWeight: 'bold', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Building2 size={20} /> Closing Setup
                </h3>
                <button
                    onClick={() => setIsEditing(true)}
                    style={{ color: '#94a3b8', padding: '0.25rem', borderRadius: '0.25rem', border: '1px solid #e2e8f0' }}
                    title="Edit Closing Info"
                >
                    <Pencil size={16} />
                </button>
            </div>

            {(!selectedCompany && !selectedAgent) ? (
                <p style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.875rem' }}>No closing information assigned.</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {selectedCompany && (
                        <div>
                            <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', textTransform: 'uppercase' }}>Title Company</span>
                            <div style={{ fontWeight: '600', color: '#334155' }}>{selectedCompany.name}</div>
                            {selectedCompany.address && <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{selectedCompany.address}</div>}
                            {selectedCompany.contactName && <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Contact: {selectedCompany.contactName}</div>}
                        </div>
                    )}
                    {selectedAgent && (
                        <div>
                            <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', textTransform: 'uppercase' }}>Escrow Agent</span>
                            <div style={{ fontWeight: '600', color: '#334155' }}>{selectedAgent.name}</div>
                            {selectedAgent.email && <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{selectedAgent.email}</div>}
                            {selectedAgent.phone && <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{selectedAgent.phone}</div>}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
