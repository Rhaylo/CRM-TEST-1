'use client';

import { useState } from 'react';
import { TitleCompany, EscrowAgent } from '@prisma/client';
import { Plus, Trash2, Phone, Mail, Globe, MapPin, User, ChevronDown, ChevronUp } from 'lucide-react';
import styles from './title-companies.module.css';
import { createTitleCompany, deleteTitleCompany, createEscrowAgent, deleteEscrowAgent } from './actions';

type TitleCompanyWithAgents = TitleCompany & { escrowAgents: EscrowAgent[] };

interface TitleCompanyListProps {
    initialCompanies: TitleCompanyWithAgents[];
}

export default function TitleCompanyList({ initialCompanies }: TitleCompanyListProps) {
    const [companies, setCompanies] = useState<TitleCompanyWithAgents[]>(initialCompanies);
    const [isAddingCompany, setIsAddingCompany] = useState(false);
    const [loading, setLoading] = useState(false);
    const [expandedCompany, setExpandedCompany] = useState<number | null>(null);

    // New Agency Form State
    const [newCompany, setNewCompany] = useState({
        name: '',
        address: '',
        phone: '',
        email: '',
        website: '',
        contactName: ''
    });

    // New Agent Form State
    const [newAgent, setNewAgent] = useState({
        name: '',
        email: '',
        phone: ''
    });

    const handleAddCompany = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        Object.entries(newCompany).forEach(([key, value]) => formData.append(key, value));

        await createTitleCompany(formData);
        // In a real app we might re-fetch or optimistic update, but revalidatePath in action handles the data refresh on next server render.
        // However, since this is a client component with initial state, we should probably implement a way to refresh or just reload.
        // For simplicity, we'll reload the window to fetch fresh data or rely on router refresh if using router.
        window.location.reload();
    };

    const handleDeleteCompany = async (id: number) => {
        if (!confirm('Are you sure you want to delete this Title Company?')) return;
        await deleteTitleCompany(id);
        window.location.reload();
    };

    const handleAddAgent = async (companyId: number, e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('titleCompanyId', companyId.toString());
        formData.append('name', newAgent.name);
        formData.append('email', newAgent.email);
        formData.append('phone', newAgent.phone);

        await createEscrowAgent(formData);
        window.location.reload();
    };

    const handleDeleteAgent = async (id: number) => {
        if (!confirm('Delete this agent?')) return;
        await deleteEscrowAgent(id);
        window.location.reload();
    };

    const toggleExpand = (id: number) => {
        setExpandedCompany(expandedCompany === id ? null : id);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Title Companies & Escrow</h1>
                <button onClick={() => setIsAddingCompany(!isAddingCompany)} className={styles.addButton}>
                    <Plus size={18} /> Add Title Company
                </button>
            </header>

            {isAddingCompany && (
                <form onSubmit={handleAddCompany} className={styles.form}>
                    <div className={styles.sectionTitle}>New Title Company</div>
                    <div className={styles.formGrid}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Company Name *</label>
                            <input required className={styles.input} value={newCompany.name} onChange={e => setNewCompany({ ...newCompany, name: e.target.value })} placeholder="e.g. First American Title" />
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Contact Person</label>
                            <input className={styles.input} value={newCompany.contactName} onChange={e => setNewCompany({ ...newCompany, contactName: e.target.value })} placeholder="Main Point of Contact" />
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Phone</label>
                            <input className={styles.input} value={newCompany.phone} onChange={e => setNewCompany({ ...newCompany, phone: e.target.value })} placeholder="(555) 123-4567" />
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Email</label>
                            <input className={styles.input} value={newCompany.email} onChange={e => setNewCompany({ ...newCompany, email: e.target.value })} placeholder="orders@title.com" />
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Address</label>
                            <input className={styles.input} value={newCompany.address} onChange={e => setNewCompany({ ...newCompany, address: e.target.value })} placeholder="123 Main St, Suite 100" />
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Website</label>
                            <input className={styles.input} value={newCompany.website} onChange={e => setNewCompany({ ...newCompany, website: e.target.value })} placeholder="www.titlecompany.com" />
                        </div>
                    </div>
                    <div className={styles.formActions}>
                        <button type="button" onClick={() => setIsAddingCompany(false)} className={styles.cancelButton}>Cancel</button>
                        <button type="submit" disabled={loading} className={styles.submitButton}>{loading ? 'Saving...' : 'Save Company'}</button>
                    </div>
                </form>
            )}

            <div className={styles.grid}>
                {companies.map(company => (
                    <div key={company.id} className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div className={styles.companyName}>
                                {company.name}
                                {company.contactName && <span style={{ fontSize: '0.8em', color: '#64748b', fontWeight: 400 }}>• {company.contactName}</span>}
                            </div>
                            <button onClick={() => handleDeleteCompany(company.id)} className={styles.deleteButton} title="Delete Company">
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div className={styles.companyDetails}>
                            {company.phone && <div className={styles.detailItem}><Phone size={14} /> {company.phone}</div>}
                            {company.email && <div className={styles.detailItem}><Mail size={14} /> {company.email}</div>}
                            {company.website && <div className={styles.detailItem}><Globe size={14} /> <a href={company.website} target="_blank" rel="noreferrer" style={{ color: '#3b82f6' }}>{company.website}</a></div>}
                            {company.address && <div className={styles.detailItem}><MapPin size={14} /> {company.address}</div>}
                        </div>

                        <div className={styles.sectionTitle} style={{ cursor: 'pointer' }} onClick={() => toggleExpand(company.id)}>
                            <span>Escrow Agents ({company.escrowAgents.length})</span>
                            {expandedCompany === company.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>

                        {expandedCompany === company.id && (
                            <div className={styles.agentsList}>
                                {company.escrowAgents.map(agent => (
                                    <div key={agent.id} className={styles.agentItem}>
                                        <div className={styles.agentInfo}>
                                            <User size={16} style={{ color: '#94a3b8' }} />
                                            <span style={{ color: 'white', fontWeight: 500 }}>{agent.name}</span>
                                            {agent.email && <span style={{ color: '#64748b' }}>{agent.email}</span>}
                                            {agent.phone && <span style={{ color: '#64748b' }}>{agent.phone}</span>}
                                        </div>
                                        <button onClick={() => handleDeleteAgent(agent.id)} className={styles.deleteButton}>
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}

                                <form onSubmit={(e) => handleAddAgent(company.id, e)} className={styles.agentForm}>
                                    <input required placeholder="Agent Name" className={styles.miniInput} value={newAgent.name} onChange={e => setNewAgent({ ...newAgent, name: e.target.value })} />
                                    <input placeholder="Email" className={styles.miniInput} value={newAgent.email} onChange={e => setNewAgent({ ...newAgent, email: e.target.value })} />
                                    <input placeholder="Phone" className={styles.miniInput} value={newAgent.phone} onChange={e => setNewAgent({ ...newAgent, phone: e.target.value })} />
                                    <button type="submit" className={styles.miniButton}>Add Agent</button>
                                </form>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
