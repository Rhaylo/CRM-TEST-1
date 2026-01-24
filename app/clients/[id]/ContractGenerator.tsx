
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
        }
    };

    return (
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
