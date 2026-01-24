'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Mail } from 'lucide-react';
import Sidebar from '@/app/components/Sidebar';
import TemplateForm from './TemplateForm';

interface EmailTemplate {
    id: number;
    name: string;
    subject: string;
    body: string;
    updatedAt: string;
}

export default function EmailTemplatesPage() {
    const [templates, setTemplates] = useState<EmailTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentTemplate, setCurrentTemplate] = useState<EmailTemplate | null>(null);

    const fetchTemplates = async () => {
        try {
            const res = await fetch('/api/email-templates');
            const data = await res.json();
            setTemplates(data);
        } catch (error) {
            console.error('Error fetching templates:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    const handleEdit = (template: EmailTemplate) => {
        setCurrentTemplate(template);
        setIsEditing(true);
    };

    const handleCreate = () => {
        setCurrentTemplate(null);
        setIsEditing(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this template?')) return;

        try {
            await fetch(`/api/email-templates?id=${id}`, { method: 'DELETE' });
            fetchTemplates();
        } catch (error) {
            console.error('Error deleting template:', error);
        }
    };

    const handleSave = () => {
        setIsEditing(false);
        fetchTemplates();
    };

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ flex: 1, padding: '2rem', backgroundColor: '#f8fafc', minHeight: '100vh', marginLeft: '250px' }}>
                <div className="max-w-5xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Email Templates</h1>
                            <p className="text-gray-600 mt-1">Manage your reusable email templates</p>
                        </div>
                        <button
                            onClick={handleCreate}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            <Plus size={20} />
                            Create Template
                        </button>
                    </div>

                    {isEditing ? (
                        <TemplateForm
                            template={currentTemplate}
                            onSave={handleSave}
                            onCancel={() => setIsEditing(false)}
                        />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {loading ? (
                                <p className="text-gray-500">Loading templates...</p>
                            ) : templates.length === 0 ? (
                                <div className="col-span-full text-center py-12 bg-white rounded-lg border border-dashed border-slate-300">
                                    <Mail className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                                    <h3 className="text-lg font-medium text-gray-900">No templates yet</h3>
                                    <p className="text-gray-500 mb-4">Create your first email template to get started.</p>
                                    <button
                                        onClick={handleCreate}
                                        className="text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        Create one now &rarr;
                                    </button>
                                </div>
                            ) : (
                                templates.map((template) => (
                                    <div key={template.id} className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="font-bold text-lg text-gray-900 truncate pr-2">{template.name}</h3>
                                            <div className="flex gap-1 shrink-0">
                                                <button
                                                    onClick={() => handleEdit(template)}
                                                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                                    title="Edit"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(template.id)}
                                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 rounded p-3 mb-4 border border-slate-100 flex-1">
                                            <p className="text-xs font-bold text-gray-700 uppercase mb-1">Subject</p>
                                            <p className="text-sm text-gray-900 font-bold truncate">{template.subject}</p>
                                            <div className="h-px bg-slate-200 my-2"></div>
                                            <p className="text-xs text-gray-800 line-clamp-3 font-medium">{template.body}</p>
                                        </div>

                                        <div className="text-xs text-gray-500 font-medium">
                                            Updated: {new Date(template.updatedAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
