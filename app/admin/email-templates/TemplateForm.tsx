'use client';

import { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';

interface EmailTemplate {
    id?: number;
    name: string;
    subject: string;
    body: string;
}

interface TemplateFormProps {
    template?: EmailTemplate | null;
    onSave: () => void;
    onCancel: () => void;
}

export default function TemplateForm({ template, onSave, onCancel }: TemplateFormProps) {
    const [name, setName] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (template) {
            setName(template.name);
            setSubject(template.subject);
            setBody(template.body);
        }
    }, [template]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const method = template?.id ? 'PUT' : 'POST';
        const payload = { id: template?.id, name, subject, body };

        try {
            const res = await fetch('/api/email-templates', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                onSave();
            } else {
                alert('Failed to save template');
            }
        } catch (error) {
            console.error('Error saving template:', error);
            alert('Error saving template');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800">
                    {template ? 'Edit Template' : 'New Template'}
                </h3>
                <button type="button" onClick={onCancel} className="text-slate-400 hover:text-red-500">
                    <X size={24} />
                </button>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Template Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="e.g. Initial Offer"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Subject</label>
                    <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Subject line..."
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Body</label>
                    <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none h-48 font-mono text-sm"
                        placeholder="Write your email content here..."
                        required
                    />
                    <p className="text-xs text-slate-500 mt-1">
                        Available variables: {'{{clientName}}'}, {'{{companyName}}'}, {'{{myCompany}}'}
                    </p>
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded"
                    disabled={loading}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    disabled={loading}
                >
                    <Save size={18} />
                    {loading ? 'Saving...' : 'Save Template'}
                </button>
            </div>
        </form>
    );
}
