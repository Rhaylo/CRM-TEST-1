'use client';

import { useState } from 'react';
import { FileText, Download, Trash2, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Document {
    id: number;
    fileName: string;
    category: string;
    createdAt: string; // ISO string
}

interface DocumentListProps {
    documents: Document[];
    dealId: number;
}

export default function DocumentList({ documents, dealId }: DocumentListProps) {
    const router = useRouter();
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleDelete = async (docId: number) => {
        if (!confirm('Are you sure you want to delete this document?')) return;

        setDeletingId(docId);
        try {
            const res = await fetch(`/api/deals/documents/${docId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                router.refresh();
            } else {
                alert('Failed to delete document');
            }
        } catch (error) {
            console.error('Error deleting document:', error);
            alert('Error deleting document');
        } finally {
            setDeletingId(null);
        }
    };

    if (documents.length === 0) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', border: '1px dashed #cbd5e1', borderRadius: '0.5rem' }}>
                <p>No documents uploaded yet.</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {documents.map((doc) => (
                <div
                    key={doc.id}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1rem',
                        backgroundColor: '#f8fafc',
                        borderRadius: '0.5rem',
                        border: '1px solid #e2e8f0'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '0.5rem',
                            backgroundColor: '#e0f2fe',
                            color: '#0284c7',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <FileText size={20} />
                        </div>
                        <div>
                            <p style={{ fontWeight: '500', color: '#334155', marginBottom: '0.25rem' }}>{doc.fileName}</p>
                            <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem' }}>
                                <span style={{
                                    padding: '0.125rem 0.5rem',
                                    backgroundColor: '#e2e8f0',
                                    borderRadius: '999px',
                                    color: '#475569'
                                }}>
                                    {doc.category}
                                </span>
                                <span style={{ color: '#94a3b8', display: 'flex', alignItems: 'center' }}>
                                    {new Date(doc.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <a
                            href={`/api/deals/documents/${doc.id}/content`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                padding: '0.5rem',
                                color: '#3b82f6',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            title="View/Download"
                        >
                            <Download size={18} />
                        </a>
                        <button
                            onClick={() => handleDelete(doc.id)}
                            disabled={deletingId === doc.id}
                            style={{
                                padding: '0.5rem',
                                color: '#ef4444',
                                border: 'none',
                                background: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: deletingId === doc.id ? 0.5 : 1
                            }}
                            title="Delete"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
