'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { updateContractStatus, uploadContractDocument } from './actions';
import { deleteContract } from './deleteActions';
import { Trash2, Eye } from 'lucide-react';
import { generateBuyerPacket } from '../utils/generateBuyerPacket';
import { generateDealSummary } from '../utils/generateDealSummary';
import { FileText } from 'lucide-react';
import BuyerPacketModal from './BuyerPacketModal';

export default function ContractList({ contracts }: { contracts: any[] }) {
    const [previewDoc, setPreviewDoc] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'sent' | 'received'>('sent');

    const handleStatusChange = async (id: number, status: string) => {
        await updateContractStatus(id, status);
    };

    const handleFileUpload = async (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append('file', file);
            formData.append('contractId', id.toString());

            try {
                const response = await fetch('/api/upload-contract', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const data = await response.json();
                    alert('Document uploaded successfully!');
                    // Force refresh to show the new document link
                    window.location.reload();
                } else {
                    const error = await response.json();
                    alert(`Upload failed: ${error.error}`);
                }
            } catch (error) {
                console.error('Error uploading:', error);
                alert('Upload failed due to network error');
            }
        }
    };

    // Helper to determine if file is previewable
    const isPreviewable = (path: string) => {
        const lower = path.toLowerCase();
        return lower.endsWith('.pdf') || lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.png');
    };

    const renderPreviewContent = (path: string) => {
        const lower = path.toLowerCase();
        if (lower.endsWith('.pdf')) {
            return (
                <iframe
                    src={path}
                    style={{ width: '100%', height: '70vh', border: 'none' }}
                    title="PDF Preview"
                />
            );
        } else if (lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.png')) {
            return (
                <img
                    src={path}
                    alt="Document Preview"
                    style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }}
                />
            );
        } else {
            return (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p style={{ marginBottom: '1rem' }}>This file type cannot be previewed directly.</p>
                    <a
                        href={path}
                        download
                        target="_blank"
                        rel="noreferrer"
                        style={{
                            padding: '0.75rem 1.5rem',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            borderRadius: '0.5rem',
                            textDecoration: 'none',
                            fontWeight: 'bold'
                        }}
                    >
                        Download File
                    </a>
                </div>
            );
        }
    };



    const [buyerPacketModal, setBuyerPacketModal] = useState<{ isOpen: boolean; data: any }>({
        isOpen: false,
        data: { address: '', askingPrice: 0, arv: 0, repairs: 0, titleStatus: 'Open', contactEmail: '' }
    });

    const handleDelete = async (id: number) => {
        await deleteContract(id);
    };

    // Separate contracts by status
    const sentContracts = contracts.filter(c => c.status === 'Out');
    const receivedContracts = contracts.filter(c => c.status === 'In' || c.status === 'Signed');

    const displayedContracts = activeTab === 'sent' ? sentContracts : receivedContracts;

    return (
        <>
            <BuyerPacketModal
                isOpen={buyerPacketModal.isOpen}
                onClose={() => setBuyerPacketModal({ ...buyerPacketModal, isOpen: false })}
                initialData={buyerPacketModal.data}
            />

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
                                                {
                                                    contract.documentPath ? (
                                                        <div className="flex flex-col gap-1">
                                                            {editingDocId === contract.id ? (
                                                                <div className="flex items-center gap-1">
                                                                    <input
                                                                        type="text"
                                                                        className="border rounded px-1 py-0.5 text-sm w-32"
                                                                        value={tempDocName}
                                                                        onChange={(e) => setTempDocName(e.target.value)}
                                                                        autoFocus
                                                                    />
                                                                    <button onClick={() => saveDocName(contract.id)} className="text-green-600 hover:text-green-700"><Check size={14} /></button>
                                                                    <button onClick={cancelEditing} className="text-red-500 hover:text-red-700"><X size={14} /></button>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-1">
                                                                    <span className="text-green-600 text-sm truncate max-w-[150px]" title={contract.documentName || contract.documentPath.split('/').pop()}>
                                                                        📄 {contract.documentName || contract.documentPath.split('/').pop()}
                                                                    </span>
                                                                    <button onClick={() => startEditing(contract)} className="text-gray-400 hover:text-blue-600 p-0.5"><Pencil size={12} /></button>
                                                                </div>
                                                            )}

                                                            {!editingDocId && (
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
                                                                        justifyContent: 'center',
                                                                        width: 'fit-content'
                                                                    }}
                                                                    title="Preview document"
                                                                >
                                                                    <Eye size={14} /> <span className="text-xs ml-1">View</span>
                                                                </button>
                                                            )}
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
                                                    )
                                                }
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
                                                <button
                                                    onClick={() => setBuyerPacketModal({
                                                        isOpen: true,
                                                        data: {
                                                            address: contract.client.address || 'Address on Request',
                                                            askingPrice: contract.deal?.amount || 0,
                                                            arv: contract.client.arv || 0,
                                                            repairs: contract.client.propertyCondition || 0,
                                                            titleStatus: 'Open',
                                                            contactEmail: 'adrian@xyreholdings.com'
                                                        }
                                                    })}
                                                    className="bg-indigo-600 text-white px-2 py-1 rounded text-xs flex items-center justify-center gap-1 hover:bg-indigo-700 transition-colors"
                                                    title="Download Investor Sheet"
                                                >
                                                    <FileText size={12} />
                                                    Buyer Packet
                                                </button>
                                                <button
                                                    onClick={() => generateDealSummary({
                                                        client: {
                                                            ...contract.client,
                                                            tasks: contract.client.tasks || [],
                                                            notes: contract.client.notes || []
                                                        },
                                                        deal: {
                                                            ...contract.deal,
                                                            notes: contract.deal?.notes || []
                                                        }
                                                    })}
                                                    className="bg-amber-500 text-white px-2 py-1 rounded text-xs flex items-center justify-center gap-1 hover:bg-amber-600 transition-colors"
                                                    title="Download Deal Summary"
                                                >
                                                    <FileText size={12} />
                                                    Deal Summary
                                                </button>
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
                        <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem', minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <p style={{ color: '#64748b', marginBottom: '1rem', fontWeight: 'bold' }}>{previewDoc.split('/').pop()}</p>
                            {renderPreviewContent(previewDoc)}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
