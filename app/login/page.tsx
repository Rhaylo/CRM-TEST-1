'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { authClient } from '@/lib/auth-client';

type BootstrapStatus = {
    hasUsers: boolean;
};

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [bootstrapAllowed, setBootstrapAllowed] = useState(false);
    const [isSignup, setIsSignup] = useState(false);
    const router = useRouter();

    useEffect(() => {
        let mounted = true;

        const loadStatus = async () => {
            try {
                const res = await fetch('/api/bootstrap/status', { cache: 'no-store' });
                if (!res.ok) return;
                const data = (await res.json()) as BootstrapStatus;
                if (mounted) {
                    setBootstrapAllowed(!data.hasUsers);
                }
            } catch (err) {
                if (mounted) {
                    setBootstrapAllowed(false);
                }
            }
        };

        loadStatus();

        return () => {
            mounted = false;
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            if (isSignup) {
                // Registration is now open for verification
                // if (!bootstrapAllowed) { ... }

                const result = await authClient.signUp.email({
                    email,
                    password,
                    name,
                });

                if (result.error) {
                    setError(result.error.message || 'Unable to create account.');
                    return;
                }

                const user = result.data?.user;

                if (!user) {
                    setError('Account created, but profile setup failed.');
                    return;
                }

                const claimResponse = await fetch('/api/bootstrap/claim', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: user.id,
                        email: user.email,
                        name: user.name,
                    }),
                });

                if (!claimResponse.ok) {
                    const text = await claimResponse.text();
                    setError(text || 'Account created, but CEO assignment failed.');
                    return;
                }

                router.push('/');
                router.refresh();
                return;
            }

            const result = await authClient.signIn.email({
                email,
                password,
            });

            if (result.error) {
                setError('Invalid email or password');
            } else {
                router.push('/');
                router.refresh();
            }
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.message || JSON.stringify(err) || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #5f67f5 0%, #6b47b2 60%, #764ba2 100%)',
            padding: '1.5rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{
                position: 'absolute',
                width: '520px',
                height: '520px',
                borderRadius: '999px',
                background: 'radial-gradient(circle, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 65%)',
                top: '-140px',
                left: '-120px',
                filter: 'blur(2px)',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                width: '420px',
                height: '420px',
                borderRadius: '999px',
                background: 'radial-gradient(circle, rgba(94,234,212,0.3) 0%, rgba(94,234,212,0) 70%)',
                bottom: '-120px',
                right: '-80px',
                filter: 'blur(2px)',
                pointerEvents: 'none'
            }} />
            <div className="auth-card" style={{
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                borderRadius: '1.25rem',
                boxShadow: '0 28px 60px -30px rgba(15, 23, 42, 0.6)',
                padding: '3rem',
                width: '100%',
                maxWidth: '420px',
                border: '1px solid rgba(148, 163, 184, 0.25)',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '72px',
                        height: '72px',
                        margin: '0 auto 1.2rem',
                        borderRadius: '18px',
                        background: 'linear-gradient(140deg, rgba(99,102,241,0.18), rgba(129,140,248,0.08))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 12px 24px -18px rgba(79, 70, 229, 0.8)'
                    }}>
                        <img
                            src="/logo.png"
                            alt="Xyre Holdings"
                            style={{
                                width: '42px',
                                height: 'auto'
                            }}
                        />
                    </div>
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        color: '#1e293b',
                        marginBottom: '0.5rem'
                    }}>
                        {isSignup ? 'Create CEO Access' : 'Welcome Back'}
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '280px', margin: '0 auto' }}>
                        {isSignup
                            ? 'First account becomes the CEO with full access.'
                            : 'Sign in to access your CRM workspace.'}
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    {isSignup && (
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                color: '#374151',
                                marginBottom: '0.5rem'
                            }}>
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your name"
                                required
                                className="auth-input"
                            />
                        </div>
                    )}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#374151',
                            marginBottom: '0.5rem'
                        }}>
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="info@xyreholdings.com"
                            required
                            className="auth-input"
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#374151',
                            marginBottom: '0.5rem'
                        }}>
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                            className="auth-input"
                        />
                    </div>

                    {error && (
                        <div style={{
                            padding: '0.85rem 1rem',
                            backgroundColor: '#fee2e2',
                            color: '#991b1b',
                            borderRadius: '0.75rem',
                            marginBottom: '1.5rem',
                            fontSize: '0.875rem',
                            textAlign: 'center',
                            border: '1px solid rgba(248, 113, 113, 0.35)'
                        }}>
                            {error}
                        </div>
                    )}

                    {message && (
                        <div style={{
                            padding: '0.85rem 1rem',
                            backgroundColor: '#dcfce7',
                            color: '#166534',
                            borderRadius: '0.75rem',
                            marginBottom: '1.5rem',
                            fontSize: '0.875rem',
                            textAlign: 'center',
                            border: '1px solid rgba(74, 222, 128, 0.35)'
                        }}>
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="auth-button"
                    >
                        {loading && <span className="auth-spinner" />}
                        {loading
                            ? (isSignup ? 'Creating account...' : 'Signing in...')
                            : (isSignup ? 'Create CEO Account' : 'Sign In')}
                    </button>
                </form>

                <div style={{
                    marginTop: '1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.82rem',
                    color: '#4b5563',
                    alignItems: 'center'
                }}>
                    <a href="/login/forgot" className="auth-link">
                        Forgot password?
                    </a>
                    <button
                        type="button"
                        onClick={() => setIsSignup((prev) => !prev)}
                        className="auth-link-button"
                    >
                        {isSignup ? 'Back to Sign In' : 'Sign Up'}
                    </button>
                </div>

                {bootstrapAllowed && (
                    <div style={{
                        marginTop: '1rem',
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <span style={{
                            padding: '0.35rem 0.75rem',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            color: '#4338ca',
                            background: 'rgba(99, 102, 241, 0.12)',
                            borderRadius: '999px',
                            border: '1px solid rgba(99, 102, 241, 0.2)'
                        }}>
                            Secure Registration
                        </span>
                    </div>
                )}

                <p style={{
                    marginTop: '2rem',
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    color: '#9ca3af'
                }}>
                    © 2024 Xyre Holdings LLC. All rights reserved.
                </p>
            </div>
            <style jsx>{`
                .auth-card {
                    backdrop-filter: blur(6px);
                }
                .auth-input {
                    width: 100%;
                    padding: 0.85rem 0.9rem;
                    border: 1px solid #d1d5db;
                    border-radius: 0.75rem;
                    font-size: 0.9rem;
                    outline: none;
                    transition: border-color 0.2s, box-shadow 0.2s;
                    background: #ffffff;
                    color: #1f2937; /* Ensure text is visible */
                }
                .auth-input:focus {
                    border-color: #6366f1;
                    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15);
                }
                .auth-button {
                    width: 100%;
                    padding: 0.85rem;
                    background: linear-gradient(135deg, #4f46e5, #6366f1);
                    color: white;
                    border: none;
                    border-radius: 0.75rem;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.15s ease, box-shadow 0.2s ease, opacity 0.2s ease;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                }
                .auth-button:disabled {
                    cursor: not-allowed;
                    opacity: 0.7;
                }
                .auth-button:not(:disabled):hover {
                    transform: translateY(-1px);
                    box-shadow: 0 14px 24px -14px rgba(79, 70, 229, 0.9);
                }
                .auth-link {
                    text-decoration: none;
                    color: #4f46e5;
                    font-weight: 600;
                }
                .auth-link:hover {
                    color: #3730a3;
                }
                .auth-link-button {
                    border: none;
                    background: none;
                    color: #4f46e5;
                    font-weight: 600;
                    cursor: pointer;
                }
                .auth-link-button:hover {
                    color: #3730a3;
                }
                .auth-spinner {
                    width: 16px;
                    height: 16px;
                    border-radius: 999px;
                    border: 2px solid rgba(255, 255, 255, 0.5);
                    border-top-color: #ffffff;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                @media (max-width: 600px) {
                    .auth-card {
                        padding: 2.25rem 1.75rem;
                    }
                }
            `}</style>
        </div>
    );
}
