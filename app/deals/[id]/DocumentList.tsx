'use client';

import { useEffect, useState } from 'react';
import { FileText, Download, Trash2, Eye, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from './Documents.module.css';

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
    const [previewDoc, setPreviewDoc] = useState<Document | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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

    useEffect(() => {
        if (!isPreviewOpen) return;
        const original = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = original;
        };
    }, [isPreviewOpen]);

    const getPreviewType = (fileName: string) => {
        const ext = fileName.split('.').pop()?.toLowerCase();
        if (!ext) return 'unknown';
        if (ext === 'pdf') return 'pdf';
        if (['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext)) return 'image';
        return 'unknown';
    };

    const openPreview = (doc: Document) => {
        setPreviewDoc(doc);
        setIsPreviewOpen(true);
    };

    if (documents.length === 0) {
        return (
            <div className={styles.emptyState}>
                <p>No documents uploaded yet.</p>
            </div>
        );
    }

    return (
        <div className={styles.documentsList}>
            {documents.map((doc) => (
                <div
                    key={doc.id}
                    className={styles.docItem}
                >
                    <div className={styles.docInfo}>
                        <div className={styles.docIcon}>
                            <FileText size={20} />
                        </div>
                        <div>
                            <p className={styles.docTitle}>{doc.fileName}</p>
                            <div className={styles.docMeta}>
                                <span className={styles.docTag}>{doc.category}</span>
                                <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.docActions}>
                        <button
                            onClick={() => openPreview(doc)}
                            className={`${styles.docButton} ${styles.previewButton}`}
                            title="Preview"
                            type="button"
                        >
                            <Eye size={18} />
                        </button>
                        <a
                            href={`/api/deals/documents/${doc.id}/content`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.docButton}
                            title="View/Download"
                        >
                            <Download size={18} />
                        </a>
                        <button
                            onClick={() => handleDelete(doc.id)}
                            disabled={deletingId === doc.id}
                            className={`${styles.docButton} ${styles.docButtonDanger}`}
                            title="Delete"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
            ))}
            {isPreviewOpen && previewDoc && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <div>
                                <h3 className={styles.modalTitle}>{previewDoc.fileName}</h3>
                                <div className={styles.modalMeta}>
                                    <span>{previewDoc.category}</span>
                                    <span>{new Date(previewDoc.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <button
                                type="button"
                                className={styles.iconButton}
                                onClick={() => setIsPreviewOpen(false)}
                                aria-label="Close preview"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            {getPreviewType(previewDoc.fileName) === 'pdf' && (
                                <iframe
                                    className={styles.previewFrame}
                                    src={`/api/deals/documents/${previewDoc.id}/content`}
                                    title="Document preview"
                                />
                            )}
                            {getPreviewType(previewDoc.fileName) === 'image' && (
                                <img
                                    className={styles.previewImage}
                                    src={`/api/deals/documents/${previewDoc.id}/content`}
                                    alt={previewDoc.fileName}
                                />
                            )}
                            {getPreviewType(previewDoc.fileName) === 'unknown' && (
                                <div className={styles.previewFallback}>
                                    Preview not available for this file type.
                                </div>
                            )}
                        </div>
                        <div className={styles.modalActions}>
                            <a
                                href={`/api/deals/documents/${previewDoc.id}/content`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${styles.actionButton} ${styles.actionPrimary}`}
                            >
                                Open in new tab
                            </a>
                            <button
                                type="button"
                                className={styles.actionButton}
                                onClick={() => setIsPreviewOpen(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
