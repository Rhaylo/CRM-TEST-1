'use client';

import { useState } from 'react';
import { X, Send } from 'lucide-react';

interface EmailModalProps {
    clientEmail: string;
    clientName: string;
    clientCompanyName: string;
    onClose: () => void;
}

export default function EmailModal({ clientEmail, clientName, clientCompanyName, onClose }: EmailModalProps) {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Templates state
    const [templates, setTemplates] = useState<any[]>([]);
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');

    // Fetch templates on mount
    useState(() => {
        fetch('/api/email-templates')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setTemplates(data);
                }
            })
            .catch(err => console.error('Error fetching templates:', err));
    });

    // Helper function for replacements
    const replaceVariables = (text: string) => {
        if (!text) return '';
        let result = text;
        // Case insensitive and allows spaces inside braces
        result = result.replace(/{{\s*clientName\s*}}/gi, clientName || '');
        result = result.replace(/{{\s*companyName\s*}}/gi, clientCompanyName || '');
        result = result.replace(/{{\s*clientEmail\s*}}/gi, clientEmail || '');
        result = result.replace(/{{\s*myCompany\s*}}/gi, 'Xyre Holdings');
        return result;
    };

    const handleTemplateChange = (templateId: string) => {
        setSelectedTemplateId(templateId);
        if (!templateId) return;

        const template = templates.find(t => t.id.toString() === templateId);
        if (template) {
            setSubject(replaceVariables(template.subject));
            setMessage(replaceVariables(template.body));
        }
    };

    const handleSend = async () => {
        if (!subject.trim() || !message.trim()) {
            setError('Please fill in both subject and message');
            return;
        }

        setSending(true);
        setError('');

        // Apply replacements one last time before sending to handle manual edits
        const finalSubject = replaceVariables(subject);
        const finalMessage = replaceVariables(message);

        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: clientEmail,
                    subject: finalSubject,
                    message: finalMessage,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send email');
            }

            setSuccess(true);
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSending(false);
        }
    };

    return (
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
            zIndex: 1000,
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                padding: '1.5rem',
                width: '90%',
                maxWidth: '600px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' }}>Send Email</h2>
                    <button onClick={onClose} style={{ color: '#64748b', cursor: 'pointer', background: 'none', border: 'none' }}>
                        <X size={24} />
                    </button>
                </div>

                {success ? (
                    <div style={{
                        padding: '1rem',
                        backgroundColor: '#d1fae5',
                        color: '#065f46',
                        borderRadius: '0.375rem',
                        marginBottom: '1rem',
                        textAlign: 'center',
                        fontWeight: '500'
                    }}>
                        ✓ Email sent successfully!
                    </div>
                ) : (
                    <>
                        {/* Template Selector */}
                        {templates.length > 0 && (
                            <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '0.5rem', border: '1px solid #bae6fd' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#0369a1', marginBottom: '0.5rem' }}>
                                    Load Template
                                </label>
                                <select
                                    value={selectedTemplateId}
                                    onChange={(e) => handleTemplateChange(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        border: '1px solid #7dd3fc',
                                        borderRadius: '0.375rem',
                                        backgroundColor: 'white',
                                        color: '#0c4a6e'
                                    }}
                                >
                                    <option value="">-- Select a template to autofill --</option>
                                    {templates.map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                                To:
                            </label>
                            <input
                                type="email"
                                value={`${clientName} <${clientEmail}>`}
                                disabled
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '0.375rem',
                                    backgroundColor: '#f9fafb',
                                    color: '#6b7280'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                                Subject:
                            </label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Enter email subject"
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '0.375rem',
                                    outline: 'none'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                                Message:
                            </label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Enter your message"
                                rows={8}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '0.375rem',
                                    outline: 'none',
                                    resize: 'vertical'
                                }}
                            />
                        </div>

                        {error && (
                            <div style={{
                                padding: '0.75rem',
                                backgroundColor: '#fee2e2',
                                color: '#991b1b',
                                borderRadius: '0.375rem',
                                marginBottom: '1rem',
                                fontSize: '0.875rem'
                            }}>
                                {error}
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                            <button
                                onClick={onClose}
                                style={{
                                    padding: '0.5rem 1rem',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '0.375rem',
                                    backgroundColor: 'white',
                                    color: '#374151',
                                    cursor: 'pointer',
                                    fontWeight: '500'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSend}
                                disabled={sending}
                                style={{
                                    padding: '0.5rem 1rem',
                                    border: 'none',
                                    borderRadius: '0.375rem',
                                    backgroundColor: sending ? '#9ca3af' : '#2563eb',
                                    color: 'white',
                                    cursor: sending ? 'not-allowed' : 'pointer',
                                    fontWeight: '500',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <Send size={16} />
                                {sending ? 'Sending...' : 'Send Email'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
