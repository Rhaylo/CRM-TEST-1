'use client';

import { useState } from 'react';
import Papa from 'papaparse';
import { Upload, ArrowRight, Save, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ImportPage() {
    const [file, setFile] = useState<File | null>(null);
    const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
    const [csvData, setCsvData] = useState<any[]>([]);
    const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Upload, 2: Map, 3: Success

    // Mapping State: CRM Field -> CSV Header
    const [mapping, setMapping] = useState<{ [key: string]: string }>({
        contactName: '',
        phone: '',
        email: '',
        address: '',
        askingPrice: '',
        arv: '',
    });

    const [isImporting, setIsImporting] = useState(false);
    const [importResult, setImportResult] = useState<{ count: number } | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            Papa.parse(selectedFile, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    const headers = results.meta.fields || [];
                    setCsvHeaders(headers);
                    setCsvData(results.data);

                    // Auto-map logic attempt
                    const newMapping = { ...mapping };
                    headers.forEach(h => {
                        const lower = h.toLowerCase();
                        if (lower.includes('name') || lower.includes('owner')) newMapping.contactName = h;
                        if (lower.includes('phone') || lower.includes('mobile')) newMapping.phone = h;
                        if (lower.includes('mail')) newMapping.email = h;
                        if (lower.includes('address') || lower.includes('street')) newMapping.address = h;
                        if (lower.includes('price') || lower.includes('amount')) newMapping.askingPrice = h;
                    });
                    setMapping(newMapping);

                    setStep(2);
                }
            });
        }
    };

    const handleImport = async () => {
        setIsImporting(true);
        try {
            // Transform Data
            const clients = csvData.map(row => ({
                contactName: row[mapping.contactName] || '',
                phone: row[mapping.phone] || '',
                email: row[mapping.email] || '',
                address: row[mapping.address] || '',
                askingPrice: row[mapping.askingPrice],
                arv: row[mapping.arv],
                propertyLink: row['Link'] || row['Property Link'] || undefined
            })).filter(c => c.contactName); // Ensure at least a name exists

            const res = await fetch('/api/clients/import', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ clients })
            });

            if (!res.ok) throw new Error('Failed to import');

            const data = await res.json();
            setImportResult(data);
            setStep(3);
        } catch (error) {
            console.error(error);
            alert('Error importing clients');
        } finally {
            setIsImporting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-2xl font-bold flex items-center gap-2 mb-8">
                <Upload className="text-violet-600" />
                Bulk Import Clients (CSV)
            </h1>

            {/* Step 1: Upload */}
            {step === 1 && (
                <div className="bg-white p-12 rounded-xl border-2 border-dashed border-gray-300 text-center hover:bg-gray-50 transition-colors">
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="hidden"
                        id="csv-upload"
                    />
                    <label htmlFor="csv-upload" className="cursor-pointer flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                            <Upload size={32} />
                        </div>
                        <div>
                            <p className="text-lg font-medium text-gray-700">Click to upload your CSV file</p>
                            <p className="text-sm text-gray-500 mt-1">Accepts standard .csv from PropStream, BatchLeads, etc.</p>
                        </div>
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium mt-4">
                            Select File
                        </button>
                    </label>
                </div>
            )}

            {/* Step 2: Mapping */}
            {step === 2 && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-700">Map Columns</h2>
                        <span className="text-sm text-gray-500">{csvData.length} records found</span>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-3">CRM Field</th>
                                    <th className="px-6 py-3">CSV Column</th>
                                    <th className="px-6 py-3">Preview (Row 1)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {Object.keys(mapping).map(field => (
                                    <tr key={field}>
                                        <td className="px-6 py-4 font-medium text-gray-900 capitalize">
                                            {field.replace(/([A-Z])/g, ' $1').trim()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={mapping[field]}
                                                onChange={(e) => setMapping({ ...mapping, [field]: e.target.value })}
                                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-violet-500"
                                            >
                                                <option value="">-- Don't Import --</option>
                                                {csvHeaders.map(h => (
                                                    <option key={h} value={h}>{h}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">
                                            {csvData[0]?.[mapping[field]] || '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => setStep(1)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleImport}
                            disabled={isImporting}
                            className={`px-6 py-2 rounded-lg font-medium text-white flex items-center gap-2
                                ${isImporting ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}
                            `}
                        >
                            {isImporting ? 'Importing...' : (
                                <>
                                    <Save size={18} />
                                    Import {csvData.length} Clients
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Step 3: Success */}
            {step === 3 && (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                        <CheckCircle size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Import Successful!</h2>
                    <p className="text-gray-600 mb-8">Successfully imported {importResult?.count} clients.</p>

                    <Link
                        href="/clients"
                        className="inline-flex items-center gap-2 bg-violet-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-violet-700 transition"
                    >
                        Go to Clients <ArrowRight size={18} />
                    </Link>
                </div>
            )}
        </div>
    );
}
