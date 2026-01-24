'use client';

import { useState, useRef } from 'react';
import { Upload, X, CheckCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
            <div style={{
                padding: '1.5rem',
                backgroundColor: '#f0f9ff',
                borderRadius: '0.5rem',
                border: '1px solid #bae6fd',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <CheckCircle size={20} color="#0284c7" />
                        <span style={{ fontWeight: '500', color: '#0369a1' }}>{selectedFile.name}</span>
                        <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                            ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                    </div>
                    <button
                        onClick={() => setSelectedFile(null)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                        disabled={isUploading}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        disabled={isUploading}
                        style={{
                            padding: '0.5rem',
                            borderRadius: '0.25rem',
                            border: '1px solid #cbd5e1',
                            backgroundColor: 'white',
                            color: '#334155'
                        }}
                    >
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>

                    <button
                        onClick={handleUpload}
                        disabled={isUploading}
                        style={{
                            flex: 1,
                            padding: '0.5rem 1rem',
                            backgroundColor: '#0284c7',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.25rem',
                            fontWeight: '500',
                            cursor: isUploading ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
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
            style={{
                border: `2px dashed ${isDragging ? '#3b82f6' : '#cbd5e1'}`,
                borderRadius: '0.5rem',
                padding: '3rem',
                textAlign: 'center',
                backgroundColor: isDragging ? '#eff6ff' : '#f8fafc',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
            }}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                style={{ display: 'none' }}
            />
            <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#e2e8f0',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto',
                color: '#64748b'
            }}>
                <Upload size={24} />
            </div>
            <p style={{ fontWeight: '500', color: '#334155', marginBottom: '0.25rem' }}>
                Click to upload or drag and drop
            </p>
            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                PDF, Images, Documents up to 10MB
            </p>
        </div>
    );
}
