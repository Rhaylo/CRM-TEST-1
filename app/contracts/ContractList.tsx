'use client';

import { useState } from 'react';
import styles from './page.module.css';
<<<<<<< HEAD
import { updateContractStatus, uploadContractDocument, updateContractDocumentName } from './actions';
import { deleteContract } from './deleteActions';
import { Trash2, Eye, Pencil, Check, X } from 'lucide-react';
import { generateBuyerPacket } from '../utils/generateBuyerPacket';
import { generateDealSummary } from '../utils/generateDealSummary';
import { FileText } from 'lucide-react';
import BuyerPacketModal from './BuyerPacketModal';

export default function ContractList({ contracts }: { contracts: any[] }) {
    const [previewDoc, setPreviewDoc] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'sent' | 'under_contract' | 'marketing' | 'buyer_found' | 'sold'>('sent');

    // Rename state
    const [editingDocId, setEditingDocId] = useState<number | null>(null);
    const [tempDocName, setTempDocName] = useState('');

    const startEditing = (contract: any) => {
        setEditingDocId(contract.id);
        const currentName = contract.documentName || (contract.documentPath ? contract.documentPath.split('/').pop() : '');
        setTempDocName(currentName);
    };

    const saveDocName = async (id: number) => {
        await updateContractDocumentName(id, tempDocName);
        setEditingDocId(null);
    };

    const cancelEditing = () => {
        setEditingDocId(null);
        setTempDocName('');
    };
=======
import { updateContractStatus, uploadContractDocument } from './actions';
import { deleteContract } from './deleteActions';
import { Trash2, Eye } from 'lucide-react';
import DownloadContractButton from './DownloadContractButton';

export default function ContractList({ contracts }: { contracts: any[] }) {
    const [previewDoc, setPreviewDoc] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'sent' | 'received'>('sent');
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e

    const handleStatusChange = async (id: number, status: string) => {
        await updateContractStatus(id, status);
    };

    const handleFileUpload = async (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
<<<<<<< HEAD
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
    const isPreviewable = (name: string) => {
        if (!name) return false;
        const lower = name.toLowerCase();
        return lower.endsWith('.pdf') || lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.png');
    };

    const renderPreviewContent = (path: string, name: string) => {
        const lower = (name || path).toLowerCase();
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
                        download={name}
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

=======
            await uploadContractDocument(id, e.target.files[0].name);
            alert('Document uploaded (mock)!');
        }
    };

>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
    const handleDelete = async (id: number) => {
        await deleteContract(id);
    };

    // Separate contracts by status
<<<<<<< HEAD
    const sentContracts = contracts.filter(c => c.status === 'Out' || c.status === 'Sent');
    const underContractContracts = contracts.filter(c => c.status === 'In' || c.status === 'Received' || c.status === 'Signed' || c.status === 'Under Contract');
    const marketingContracts = contracts.filter(c => c.status === 'Marketing');
    const buyerFoundContracts = contracts.filter(c => c.status === 'Buyer Found');
    const soldContracts = contracts.filter(c => c.status === 'Sold');

    const displayedContracts =
        activeTab === 'sent' ? sentContracts :
            activeTab === 'marketing' ? marketingContracts :
                activeTab === 'buyer_found' ? buyerFoundContracts :
                    activeTab === 'sold' ? soldContracts :
                        underContractContracts;

    return (
        <>
            <BuyerPacketModal
                isOpen={buyerPacketModal.isOpen}
                onClose={() => setBuyerPacketModal({ ...buyerPacketModal, isOpen: false })}
                initialData={buyerPacketModal.data}
            />

=======
    const sentContracts = contracts.filter(c => c.status === 'Out');
    const receivedContracts = contracts.filter(c => c.status === 'In' || c.status === 'Signed');

    const displayedContracts = activeTab === 'sent' ? sentContracts : receivedContracts;

    return (
        <>
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
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
<<<<<<< HEAD
                    onClick={() => setActiveTab('under_contract')}
=======
                    onClick={() => setActiveTab('received')}
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
                    style={{
                        padding: '0.75rem 1.5rem',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '600',
<<<<<<< HEAD
                        color: activeTab === 'under_contract' ? '#3b82f6' : '#64748b',
                        borderBottom: activeTab === 'under_contract' ? '3px solid #3b82f6' : '3px solid transparent',
=======
                        color: activeTab === 'received' ? '#3b82f6' : '#64748b',
                        borderBottom: activeTab === 'received' ? '3px solid #3b82f6' : '3px solid transparent',
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
                        marginBottom: '-2px',
                        transition: 'all 0.2s',
                    }}
                >
<<<<<<< HEAD
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
=======
                    Documents Received ({receivedContracts.length})
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
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
<<<<<<< HEAD
                                            <span className={`${styles.statusBadge} ${(contract.status === 'Out' || contract.status === 'Sent') ? styles.statusOut :
                                                (contract.status === 'Marketing') ? styles.statusWarning :
                                                    (contract.status === 'Buyer Found') ? styles.statusSuccess :
                                                        (contract.status === 'Sold') ? styles.statusSuccess :
                                                            styles.statusSigned
                                                }`}>
                                                {(contract.status === 'Out' || contract.status === 'Sent') ? 'Sent' :
                                                    (contract.status === 'In' || contract.status === 'Received' || contract.status === 'Signed' || contract.status === 'Under Contract') ? 'Under Contract' :
                                                        contract.status}
=======
                                            <span className={`${styles.statusBadge} ${contract.status === 'In' ? styles.statusIn :
                                                contract.status === 'Out' ? styles.statusOut : styles.statusSigned
                                                }`}>
                                                {contract.status}
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
                                            </span>
                                            {isStale && <span className={styles.staleText}>Overdue ({'>'} 7 days)</span>}
                                        </td>
                                        <td className={styles.td}>{contract.dateSent ? new Date(contract.dateSent).toLocaleDateString() : '-'}</td>
                                        <td className={styles.td}>
                                            {contract.documentPath ? (
<<<<<<< HEAD
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
                                                <span className="text-gray-400">-</span>
=======
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
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
                                            )}
                                        </td>
                                        <td className={styles.td}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                <select
<<<<<<< HEAD
                                                    // Check matches broadly for Sent vs Under Contract
                                                    value={
                                                        (contract.status === 'Out' || contract.status === 'Sent') ? 'Sent' :
                                                            (contract.status === 'Marketing') ? 'Marketing' :
                                                                (contract.status === 'Buyer Found') ? 'Buyer Found' :
                                                                    (contract.status === 'Sold') ? 'Sold' :
                                                                        'Under Contract'
                                                    }
                                                    onChange={(e) => handleStatusChange(contract.id, e.target.value)}
                                                >
                                                    <option value="Sent">Sent</option>
                                                    <option value="Under Contract">Under Contract</option>
                                                    <option value="Marketing">Marketing</option>
                                                    <option value="Buyer Found">Buyer Found</option>
                                                    <option value="Sold">Sold</option>
                                                </select>
                                                <button
                                                    onClick={() => setBuyerPacketModal({
                                                        isOpen: true,
                                                        data: {
                                                            address: contract.client.address || 'Address on Request',
                                                            askingPrice: contract.deal?.amount || 0,
                                                            arv: contract.client.arv || 0,
                                                            repairs: contract.client.repairs || 0,
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
=======
                                                    className="p-1 border rounded text-sm"
                                                    value={contract.status}
                                                    onChange={(e) => handleStatusChange(contract.id, e.target.value)}
                                                >
                                                    <option value="Out">Out</option>
                                                    <option value="In">In</option>
                                                    <option value="Signed">Signed</option>
                                                </select>
                                                <DownloadContractButton contract={contract} />
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
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
<<<<<<< HEAD
            </div >



            {/* Document Preview Modal */}
            {
                previewDoc && (
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
                                {renderPreviewContent(previewDoc, tempDocName || previewDoc)}
                            </div>
                        </div>
                    </div>
                )
            }
=======
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
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
        </>
    );
}
