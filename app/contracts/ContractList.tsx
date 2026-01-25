'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { updateContractStatus, updateContractDocumentName } from './actions';
import { deleteContract } from './deleteActions';
import { Trash2, Pencil, Check, X, ExternalLink } from 'lucide-react';

export default function ContractList({ contracts }: { contracts: any[] }) {
    const [activeTab, setActiveTab] = useState<'sent' | 'under_contract' | 'marketing' | 'buyer_found' | 'sold'>('sent');
    void updateContractDocumentName;
    const [editingDocId, setEditingDocId] = useState<number | null>(null);
    const [tempDocName, setTempDocName] = useState('');
    void editingDocId;
    void tempDocName;

    const handleStatusChange = async (id: number, status: string) => {
        await updateContractStatus(id, status);
    };

    const handleDelete = async (id: number) => {
        await deleteContract(id);
    };

    const sentContracts = contracts.filter((c) => c.status === 'Out' || c.status === 'Sent');
    const underContractContracts = contracts.filter((c) => c.status === 'In' || c.status === 'Received' || c.status === 'Signed' || c.status === 'Under Contract');
    const marketingContracts = contracts.filter((c) => c.status === 'Marketing');
    const buyerFoundContracts = contracts.filter((c) => c.status === 'Buyer Found');
    const soldContracts = contracts.filter((c) => c.status === 'Sold');

    const displayedContracts =
        activeTab === 'sent'
            ? sentContracts
            : activeTab === 'marketing'
                ? marketingContracts
                : activeTab === 'buyer_found'
                    ? buyerFoundContracts
                    : activeTab === 'sold'
                        ? soldContracts
                        : underContractContracts;

    return (
        <>
            <div style={{
                display: 'flex',
                gap: '1rem',
                marginBottom: '1.5rem',
                borderBottom: '2px solid #e2e8f0',
            }}>
                <button
                    onClick={() => setActiveTab('sent')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: activeTab === 'sent' ? '#3b82f6' : '#64748b',
                        borderBottom: activeTab === 'sent' ? '3px solid #3b82f6' : '3px solid transparent',
                        marginBottom: '-2px',
                        transition: 'all 0.2s',
                    }}
                >
                    Documents Sent ({sentContracts.length})
                </button>
                <button
                    onClick={() => setActiveTab('under_contract')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: activeTab === 'under_contract' ? '#3b82f6' : '#64748b',
                        borderBottom: activeTab === 'under_contract' ? '3px solid #3b82f6' : '3px solid transparent',
                        marginBottom: '-2px',
                        transition: 'all 0.2s',
                    }}
                >
                    Under Contract ({underContractContracts.length})
                </button>
                <button
                    onClick={() => setActiveTab('marketing')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: activeTab === 'marketing' ? '#3b82f6' : '#64748b',
                        borderBottom: activeTab === 'marketing' ? '3px solid #3b82f6' : '3px solid transparent',
                        marginBottom: '-2px',
                        transition: 'all 0.2s',
                    }}
                >
                    Marketing ({marketingContracts.length})
                </button>
                <button
                    onClick={() => setActiveTab('buyer_found')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: activeTab === 'buyer_found' ? '#3b82f6' : '#64748b',
                        borderBottom: activeTab === 'buyer_found' ? '3px solid #3b82f6' : '3px solid transparent',
                        marginBottom: '-2px',
                        transition: 'all 0.2s',
                    }}
                >
                    Buyer Found ({buyerFoundContracts.length})
                </button>
                <button
                    onClick={() => setActiveTab('sold')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: activeTab === 'sold' ? '#3b82f6' : '#64748b',
                        borderBottom: activeTab === 'sold' ? '3px solid #3b82f6' : '3px solid transparent',
                        marginBottom: '-2px',
                        transition: 'all 0.2s',
                    }}
                >
                    Sold ({soldContracts.length})
                </button>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.th}>Client</th>
                            <th className={styles.th}>Deal Amount</th>
                            <th className={styles.th}>Status</th>
                            <th className={styles.th}>Date</th>
                            <th className={styles.th}>Deal Info</th>
                            <th className={styles.th}>Actions</th>
                            <th className={styles.th}>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedContracts.length === 0 ? (
                            <tr>
                                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                                    No contracts in this section
                                </td>
                            </tr>
                        ) : (
                            displayedContracts.map((contract) => {
                                const isStale = contract.status === 'Out' && contract.dateSent &&
                                    (Date.now() - new Date(contract.dateSent).getTime()) > (7 * 24 * 60 * 60 * 1000);
                                const dealId = contract.dealId || contract.deal?.id;

                                return (
                                    <tr key={contract.id} className={`${styles.tr} ${isStale ? styles.staleRow : ''}`}>
                                        <td className={styles.td}>{contract.client.companyName}</td>
                                        <td className={styles.td}>${contract.deal.amount.toLocaleString()}</td>
                                        <td className={styles.td}>
                                            <span className={`${styles.statusBadge} ${(contract.status === 'Out' || contract.status === 'Sent') ? styles.statusOut : styles.statusSigned}`}>
                                                {(contract.status === 'Out' || contract.status === 'Sent')
                                                    ? 'Sent'
                                                    : (contract.status === 'In' || contract.status === 'Received' || contract.status === 'Signed' || contract.status === 'Under Contract')
                                                        ? 'Under Contract'
                                                        : contract.status}
                                            </span>
                                            {isStale && <span className={styles.staleText}>Overdue ({'>'} 7 days)</span>}
                                        </td>
                                        <td className={styles.td}>{contract.dateSent ? new Date(contract.dateSent).toLocaleDateString() : '-'}</td>
                                        <td className={styles.td}>
                                            <button
                                                onClick={() => {
                                                    if (dealId) {
                                                        window.location.href = `/deals/${dealId}`;
                                                    }
                                                }}
                                                className={`${styles.dealInfoButton} ${!dealId ? styles.dealInfoButtonDisabled : ''}`}
                                                title={dealId ? 'View deal details' : 'No deal linked'}
                                                disabled={!dealId}
                                            >
                                                <ExternalLink size={14} />
                                                View Deal
                                            </button>
                                        </td>
                                        <td className={styles.td}>
                                            <select
                                                value={contract.status}
                                                onChange={(e) => handleStatusChange(contract.id, e.target.value)}
                                                className={styles.select}
                                            >
                                                <option value="Sent">Sent</option>
                                                <option value="Under Contract">Under Contract</option>
                                                <option value="Marketing">Marketing</option>
                                                <option value="Buyer Found">Buyer Found</option>
                                                <option value="Sold">Sold</option>
                                            </select>
                                        </td>
                                        <td className={styles.td}>
                                            <button onClick={() => handleDelete(contract.id)} className={styles.deleteButton}>
                                                <Trash2 size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

        </>
    );
}
