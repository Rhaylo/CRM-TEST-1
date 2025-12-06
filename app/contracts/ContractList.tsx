'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { updateContractStatus, uploadContractDocument } from './actions';
import { deleteContract } from './deleteActions';
import { Trash2, Eye } from 'lucide-react';
import DownloadContractButton from './DownloadContractButton';

export default function ContractList({ contracts }: { contracts: any[] }) {
    const [previewDoc, setPreviewDoc] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'sent' | 'received'>('sent');

    const handleStatusChange = async (id: number, status: string) => {
        await updateContractStatus(id, status);
    };

    const handleFileUpload = async (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            await uploadContractDocument(id, e.target.files[0].name);
            alert('Document uploaded (mock)!');
        }
    };

    const handleDelete = async (id: number) => {
        await deleteContract(id);
    };

    // Separate contracts by status
    const sentContracts = contracts.filter(c => c.status === 'Out');
    const receivedContracts = contracts.filter(c => c.status === 'In' || c.status === 'Signed');

    const displayedContracts = activeTab === 'sent' ? sentContracts : receivedContracts;

    return (
        <>
            {/* Tabs */}
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
                    onClick={() => setActiveTab('received')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: activeTab === 'received' ? '#3b82f6' : '#64748b',
                        borderBottom: activeTab === 'received' ? '3px solid #3b82f6' : '3px solid transparent',
                        marginBottom: '-2px',
                        transition: 'all 0.2s',
                    }}
                >
                    Documents Received ({receivedContracts.length})
                </button>
            </div>

            {/* Contract Table */}
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.th}>Client</th>
                            <th className={styles.th}>Deal Amount</th>
                            <th className={styles.th}>Status</th>
                            <th className={styles.th}>Date</th>
                            <th className={styles.th}>Document</th>
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
                                const isStale = contract.status === 'Out' &&
                                    contract.dateSent &&
                                    (Date.now() - new Date(contract.dateSent).getTime()) > (7 * 24 * 60 * 60 * 1000);

                                return (
                                    <tr key={contract.id} className={`${styles.tr} ${isStale ? styles.staleRow : ''}`}>
                                        <td className={styles.td}>{contract.client.companyName}</td>
                                        <td className={styles.td}>${contract.deal.amount.toLocaleString()}</td>
                                        <td className={styles.td}>
                                            <span className={`${styles.statusBadge} ${contract.status === 'In' ? styles.statusIn :
                                                contract.status === 'Out' ? styles.statusOut : styles.statusSigned
                                                }`}>
                                                {contract.status}
                                            </span>
                                            {isStale && <span className={styles.staleText}>Overdue ({'>'} 7 days)</span>}
                                        </td>
                                        <td className={styles.td}>{contract.dateSent ? new Date(contract.dateSent).toLocaleDateString() : '-'}</td>
                                        <td className={styles.td}>
                                            {contract.documentPath ? (
                                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                    <span className="text-green-600 text-sm">📄 {contract.documentPath.split('/').pop()}</span>
                                                    <button
                                                        onClick={() => setPreviewDoc(contract.documentPath)}
                                                        style={{
                                                            padding: '0.25rem',
                                                            border: '1px solid #cbd5e1',
                                                            backgroundColor: 'white',
                                                            borderRadius: '0.25rem',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                        }}
                                                        title="Preview document"
                                                    >
                                                        <Eye size={14} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <label className={styles.uploadLabel}>
                                                    Upload
                                                    <input
                                                        type="file"
                                                        className={styles.fileInput}
                                                        onChange={(e) => handleFileUpload(contract.id, e)}
                                                    />
                                                </label>
                                            )}
                                        </td>
                                        <td className={styles.td}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                <select
                                                    className="p-1 border rounded text-sm"
                                                    value={contract.status}
                                                    onChange={(e) => handleStatusChange(contract.id, e.target.value)}
                                                >
                                                    <option value="Out">Out</option>
                                                    <option value="In">In</option>
                                                    <option value="Signed">Signed</option>
                                                </select>
                                                <DownloadContractButton contract={contract} />
                                            </div>
                                        </td>
                                        <td className={styles.td}>
                                            <button
                                                onClick={() => handleDelete(contract.id)}
                                                style={{
                                                    padding: '0.25rem 0.5rem',
                                                    border: '1px solid #fecaca',
                                                    backgroundColor: '#fef2f2',
                                                    color: '#dc2626',
                                                    borderRadius: '0.375rem',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.25rem',
                                                    fontSize: '0.75rem',
                                                }}
                                            >
                                                <Trash2 size={12} />
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Document Preview Modal */}
            {previewDoc && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                }} onClick={() => setPreviewDoc(null)}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '2rem',
                        borderRadius: '0.75rem',
                        maxWidth: '800px',
                        width: '90%',
                        maxHeight: '90vh',
                        overflow: 'auto',
                    }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Document Preview</h3>
                            <button onClick={() => setPreviewDoc(null)} style={{ cursor: 'pointer', fontSize: '1.5rem', border: 'none', background: 'none' }}>×</button>
                        </div>
                        <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
                            <p style={{ color: '#64748b', marginBottom: '1rem' }}>Document: {previewDoc.split('/').pop()}</p>
                            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                                (Preview functionality - In production, this would display the actual document)
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
