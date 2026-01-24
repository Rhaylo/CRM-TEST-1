<<<<<<< HEAD
<<<<<<< HEAD

'use client';

import React, { useState } from 'react';
import { FileText, Download, AlertCircle } from 'lucide-react';

interface ContractGeneratorProps {
    dealId: number;
    clientName: string;
    clientId: number;
}

const ContractGenerator: React.FC<{ deal: any, client: any }> = ({ deal, client }) => {
    const [generating, setGenerating] = useState(false);
    const [templateType, setTemplateType] = useState<'standard' | 'no_emd'>('standard');
    const [error, setError] = useState('');

    const handleGenerateContract = async () => {
        setGenerating(true);
        setError('');
        try {
            const response = await fetch('/api/contracts/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    dealId: deal.id,
                    templateType
                    // No manualData, fetching from DB
                })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Failed to generate');
            }

            // Handle Blob Download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const suffix = templateType === 'no_emd' ? '(No EMD)' : '';
            a.download = `Offer_Contract_${client.contactName.replace(/\s+/g, '_')} ${suffix}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();

        } catch (error: any) {
            console.error(error);
            setError(error.message || "Error generating contract.");
        } finally {
            setGenerating(false);
=======
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
'use client';

import { useState } from 'react';
import { FileText, X, Download, Eye } from 'lucide-react';

interface ContractGeneratorProps {
    clientId: number;
    clientName: string;
}

export default function ContractGenerator({ clientId, clientName }: ContractGeneratorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [contractType, setContractType] = useState<'assignment' | 'purchase_with_emd' | 'purchase_without_emd'>('purchase_without_emd');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [contractText, setContractText] = useState('');
    const [showPreview, setShowPreview] = useState(false);

    // Additional fields for assignment contract
    const [assignee, setAssignee] = useState('');
    const [finalSalesPrice, setFinalSalesPrice] = useState('');
    const [earnestMoneyPayee, setEarnestMoneyPayee] = useState('');

    const handleGenerate = async () => {
        setLoading(true);
        setError('');

        try {
            const additionalData: any = {};

            if (contractType === 'assignment') {
                if (!assignee || !finalSalesPrice) {
                    setError('Please fill in all required fields for Assignment contract');
                    setLoading(false);
                    return;
                }
                additionalData.assignee = assignee;
                additionalData.finalSalesPrice = parseFloat(finalSalesPrice);
                additionalData.earnestMoneyPayee = earnestMoneyPayee || 'Title Company';
            }

            const response = await fetch('/api/generate-contract', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clientId,
                    contractType,
                    additionalData
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate contract');
            }

            setContractText(data.contractText);
            setShowPreview(true);
        } catch (err: any) {
            setError(err.message || 'Failed to generate contract');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        const blob = new Blob([contractText], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `contract_${clientName.replace(/\s+/g, '_')}_${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    const handlePrint = () => {
        const printWindow = window.open('', '', 'height=600,width=800');
        if (printWindow) {
            printWindow.document.write('<html><head><title>Contract</title>');
            printWindow.document.write('<style>body { font-family: "Times New Roman", Times, serif; font-size: 12pt; line-height: 1.6; margin: 1in; white-space: pre-wrap; }</style>');
            printWindow.document.write('</head><body>');
            printWindow.document.write(contractText);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
<<<<<<< HEAD
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
        }
    };

    return (
<<<<<<< HEAD
<<<<<<< HEAD
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <FileText className="text-violet-600" size={20} />
                        One-Click Contract Generator
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Instantly generate a binding PDF agreement.
                    </p>
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Contract Template</label>
                <select
                    value={templateType}
                    onChange={(e) => setTemplateType(e.target.value as 'standard' | 'no_emd')}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                >
                    <option value="standard">Standard Purchase Agreement</option>
                    <option value="no_emd">Purchase Agreement (No EMD)</option>
                </select>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md flex items-center gap-2">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}

            <button
                onClick={handleGenerateContract}
                disabled={generating}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all flex items-center justify-center gap-2
                    ${generating
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-violet-600 hover:bg-violet-700 shadow-md hover:shadow-lg'
                    }`}
            >
                {generating ? (
                    <>Generating PDF...</>
                ) : (
                    <>
                        <Download size={18} />
                        Download PDF Offer
                    </>
                )}
            </button>

            <p className="text-xs text-gray-400 mt-3 text-center">
                Uses data from Deal #{deal.id}
            </p>
        </div>
    );
};

export default ContractGenerator;
=======
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
        <>
            <button
                onClick={() => setIsOpen(true)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#8b5cf6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#7c3aed'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#8b5cf6'}
            >
                <FileText size={20} />
                Generate Contract
            </button>

            {isOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '0.75rem',
                        padding: '2rem',
                        maxWidth: showPreview ? '900px' : '500px',
                        width: '90%',
                        maxHeight: '90vh',
                        overflow: 'auto'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' }}>
                                {showPreview ? 'Contract Preview' : 'Generate Contract'}
                            </h2>
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    setShowPreview(false);
                                    setContractText('');
                                }}
                                style={{
                                    padding: '0.5rem',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#64748b'
                                }}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {!showPreview ? (
                            <>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '0.875rem',
                                        fontWeight: '500',
                                        color: '#374151',
                                        marginBottom: '0.5rem'
                                    }}>
                                        Contract Type
                                    </label>
                                    <select
                                        value={contractType}
                                        onChange={(e) => setContractType(e.target.value as any)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '0.5rem',
                                            fontSize: '0.875rem'
                                        }}
                                    >
                                        <option value="purchase_without_emd">Purchase Agreement (No EMD)</option>
                                        <option value="purchase_with_emd">Purchase Agreement (With EMD)</option>
                                        <option value="assignment">Assignment of Contract</option>
                                    </select>
                                </div>

                                {contractType === 'assignment' && (
                                    <>
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <label style={{
                                                display: 'block',
                                                fontSize: '0.875rem',
                                                fontWeight: '500',
                                                color: '#374151',
                                                marginBottom: '0.5rem'
                                            }}>
                                                Assignee Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={assignee}
                                                onChange={(e) => setAssignee(e.target.value)}
                                                placeholder="Enter assignee name"
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem',
                                                    border: '1px solid #d1d5db',
                                                    borderRadius: '0.5rem',
                                                    fontSize: '0.875rem'
                                                }}
                                            />
                                        </div>

                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <label style={{
                                                display: 'block',
                                                fontSize: '0.875rem',
                                                fontWeight: '500',
                                                color: '#374151',
                                                marginBottom: '0.5rem'
                                            }}>
                                                Final Sales Price *
                                            </label>
                                            <input
                                                type="number"
                                                value={finalSalesPrice}
                                                onChange={(e) => setFinalSalesPrice(e.target.value)}
                                                placeholder="Enter final sales price"
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem',
                                                    border: '1px solid #d1d5db',
                                                    borderRadius: '0.5rem',
                                                    fontSize: '0.875rem'
                                                }}
                                            />
                                        </div>

                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <label style={{
                                                display: 'block',
                                                fontSize: '0.875rem',
                                                fontWeight: '500',
                                                color: '#374151',
                                                marginBottom: '0.5rem'
                                            }}>
                                                Earnest Money Payee
                                            </label>
                                            <input
                                                type="text"
                                                value={earnestMoneyPayee}
                                                onChange={(e) => setEarnestMoneyPayee(e.target.value)}
                                                placeholder="Title Company (optional)"
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem',
                                                    border: '1px solid #d1d5db',
                                                    borderRadius: '0.5rem',
                                                    fontSize: '0.875rem'
                                                }}
                                            />
                                        </div>
                                    </>
                                )}

                                {error && (
                                    <div style={{
                                        padding: '0.75rem',
                                        backgroundColor: '#fee2e2',
                                        color: '#991b1b',
                                        borderRadius: '0.5rem',
                                        marginBottom: '1.5rem',
                                        fontSize: '0.875rem'
                                    }}>
                                        {error}
                                    </div>
                                )}

                                <button
                                    onClick={handleGenerate}
                                    disabled={loading}
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        padding: '0.75rem',
                                        backgroundColor: loading ? '#9ca3af' : '#8b5cf6',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '0.5rem',
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        cursor: loading ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    <Eye size={20} />
                                    {loading ? 'Generating...' : 'Generate Contract'}
                                </button>
                            </>
                        ) : (
                            <>
                                <div style={{
                                    backgroundColor: '#f8fafc',
                                    padding: '1.5rem',
                                    borderRadius: '0.5rem',
                                    marginBottom: '1.5rem',
                                    maxHeight: '60vh',
                                    overflow: 'auto',
                                    fontFamily: '"Times New Roman", Times, serif',
                                    fontSize: '12pt',
                                    lineHeight: '1.6',
                                    whiteSpace: 'pre-wrap'
                                }}>
                                    {contractText}
                                </div>

                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button
                                        onClick={handleDownload}
                                        style={{
                                            flex: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            padding: '0.75rem',
                                            backgroundColor: '#10b981',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '0.5rem',
                                            fontSize: '1rem',
                                            fontWeight: '600',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <Download size={20} />
                                        Download
                                    </button>
                                    <button
                                        onClick={handlePrint}
                                        style={{
                                            flex: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            padding: '0.75rem',
                                            backgroundColor: '#3b82f6',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '0.5rem',
                                            fontSize: '1rem',
                                            fontWeight: '600',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <FileText size={20} />
                                        Print
                                    </button>
                                    <button
                                        onClick={() => setShowPreview(false)}
                                        style={{
                                            padding: '0.75rem 1rem',
                                            backgroundColor: '#6b7280',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '0.5rem',
                                            fontSize: '1rem',
                                            fontWeight: '600',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Back
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
<<<<<<< HEAD
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
