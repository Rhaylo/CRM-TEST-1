'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminGate({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        // Check if already authenticated in session
        const auth = sessionStorage.getItem('admin_authenticated');
        if (auth === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        // Verify password with server
        try {
            const res = await fetch('/api/admin/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                sessionStorage.setItem('admin_authenticated', 'true');
                setIsAuthenticated(true);
                setError('');
            } else {
                setError('Invalid password');
                setPassword('');
            }
        } catch (err) {
            setError('Authentication error');
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('admin_authenticated');
        setIsAuthenticated(false);
        router.push('/');
    };

    if (!isAuthenticated) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}>
                <div style={{
                    background: 'white',
                    padding: '3rem',
                    borderRadius: '1rem',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                    maxWidth: '400px',
                    width: '100%',
                }}>
                    <h1 style={{ marginBottom: '0.5rem', fontSize: '2rem', fontWeight: 'bold' }}>🔐 Admin Access</h1>
                    <p style={{ color: '#64748b', marginBottom: '2rem' }}>Enter administrator password</p>

                    <form onSubmit={handleLogin}>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Admin Password"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '2px solid #e2e8f0',
                                borderRadius: '0.5rem',
                                fontSize: '1rem',
                                marginBottom: '1rem',
                            }}
                            autoFocus
                        />
                        {error && (
                            <p style={{ color: '#ef4444', fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</p>
                        )}
                        <button
                            type="submit"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.5rem',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                            }}
                        >
                            Unlock Admin Panel
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
