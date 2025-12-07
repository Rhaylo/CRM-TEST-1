'use client';

import { useState, useEffect } from 'react';
import { generateBuyerPacket } from '../utils/generateBuyerPacket';

interface BuyerPacketModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: {
        address: string;
        askingPrice: number;
        arv: number;
        repairs: number | string;
        titleStatus: string;
        contactEmail: string;
    };
}

export default function BuyerPacketModal({ isOpen, onClose, initialData }: BuyerPacketModalProps) {
    const [formData, setFormData] = useState(initialData);

    useEffect(() => {
        setFormData(initialData);
    }, [initialData]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'askingPrice' || name === 'arv' ? parseFloat(value) || 0 : value
        }));
    };

    const handleGenerate = () => {
        generateBuyerPacket(formData);
        onClose();
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 50,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <div style={{
                backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', width: '100%', maxWidth: '500px'
            }}>
                <h2 className="text-xl font-bold mb-4">Edit Buyer Packet Details</h2>

                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Property Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Asking Price ($)</label>
                            <input
                                type="number"
                                name="askingPrice"
                                value={formData.askingPrice}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Est. ARV ($)</label>
                            <input
                                type="number"
                                name="arv"
                                value={formData.arv}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Est. Repairs ($)</label>
                            <input
                                type="text"
                                name="repairs"
                                value={formData.repairs}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                placeholder="e.g. 50000 or 'Low'"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title Status</label>
                            <input
                                type="text"
                                name="titleStatus"
                                value={formData.titleStatus}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                        <input
                            type="email"
                            name="contactEmail"
                            value={formData.contactEmail}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleGenerate}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                        Generate PDF
                    </button>
                </div>
            </div>
        </div>
    );
}
