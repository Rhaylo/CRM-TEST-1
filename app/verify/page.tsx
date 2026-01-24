'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

function VerifyContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Missing verification token');
            return;
        }

        const verify = async () => {
            try {
                const res = await fetch('/api/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token })
                });

                if (res.ok) {
                    setStatus('success');
                    setTimeout(() => router.push('/login'), 3000); // Redirect after 3s
                } else {
                    const msg = await res.text();
                    setStatus('error');
                    setMessage(msg || 'Verification failed');
                }
            } catch (error) {
                setStatus('error');
                setMessage('An error occurred');
            }
        };

        verify();
    }, [token, router]);

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f1f5f9'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '1rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
                maxWidth: '400px',
                width: '100%'
            }}>
                {status === 'loading' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <Loader2 className="animate-spin" size={48} color="#3b82f6" />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' }}>Verifying your email...</h2>
                    </div>
                )}

                {status === 'success' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <CheckCircle size={48} color="#22c55e" />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' }}>Email Verified!</h2>
                        <p style={{ color: '#64748b' }}>Redirecting to login...</p>
                        <Link href="/login" style={{ color: '#3b82f6', textDecoration: 'underline' }}>
                            Go to Login
                        </Link>
                    </div>
                )}

                {status === 'error' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <XCircle size={48} color="#ef4444" />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' }}>Verification Failed</h2>
                        <p style={{ color: '#ef4444' }}>{message}</p>
                        <Link href="/login" style={{ color: '#3b82f6', textDecoration: 'underline' }}>
                            Back to Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyContent />
        </Suspense>
    );
}
