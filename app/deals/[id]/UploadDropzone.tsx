'use client';

import { useState, useRef } from 'react';
import { Upload, X, CheckCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from './Documents.module.css';

interface UploadDropzoneProps {
    dealId: number;
}

const CATEGORIES = ['Contract', 'ID', 'Deed', 'Photo', 'Inspection', 'Other'];

export default function UploadDropzone({ dealId }: UploadDropzoneProps) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [category, setCategory] = useState('Other');
    const [isUploading, setIsUploading] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setSelectedFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('category', category);

        try {
            const res = await fetch(`/api/deals/${dealId}/documents/upload`, {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                setSelectedFile(null);
                setCategory('Other');
                router.refresh();
            } else {
                alert('Upload failed');
            }
        } catch (error) {
            console.error('Error uploading:', error);
            alert('Error uploading file');
        } finally {
            setIsUploading(false);
        }
    };

    if (selectedFile) {
        return (
            <div className={styles.uploadCard}>
                <div className={styles.fileRow}>
                    <div className={styles.fileMeta}>
                        <CheckCircle size={20} color="#0284c7" />
                        <span>{selectedFile.name}</span>
                        <span className={styles.fileSize}>
                            ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                    </div>
                    <button
                        onClick={() => setSelectedFile(null)}
                        className={styles.iconButton}
                        disabled={isUploading}
                        type="button"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className={styles.uploadActions}>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        disabled={isUploading}
                        className={styles.select}
                    >
                        {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>

                    <button
                        onClick={handleUpload}
                        disabled={isUploading}
                        className={styles.uploadButton}
                        type="button"
                    >
                        {isUploading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Uploading...
                            </>
                        ) : 'Confirm Upload'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`${styles.dropzone} ${isDragging ? styles.dropzoneActive : ''}`}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                style={{ display: 'none' }}
            />
            <div className={styles.dropzoneIcon}>
                <Upload size={24} />
            </div>
            <p className={styles.dropzoneTitle}>
                Click to upload or drag and drop
            </p>
            <p className={styles.dropzoneHint}>
                PDF, Images, Documents up to 10MB
            </p>
        </div>
    );
}
