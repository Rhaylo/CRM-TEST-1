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
            <div className="admin-gate">
                <div className="admin-card">
                    <div className="admin-badge" aria-hidden="true">🔐</div>
                    <div className="admin-title">Admin Access</div>
                    <div className="admin-subtitle">Enter administrator password to unlock restricted settings.</div>

                    <form onSubmit={handleLogin} className="admin-form">
                        <label className="admin-label" htmlFor="admin-password">Admin Password</label>
                        <input
                            id="admin-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="admin-input"
                            autoFocus
                        />
                        {error && (
                            <div className="admin-error" role="alert">{error}</div>
                        )}
                        <button type="submit" className="admin-button">
                            Unlock Admin Panel
                        </button>
                    </form>
                </div>

                <style jsx>{`
                    :global(body) {
                        background: #eef3fb;
                    }

                    .admin-gate {
                        --primary: #2f6df6;
                        --primary-soft: #dfe9ff;
                        --primary-fade: rgba(47, 109, 246, 0.16);
                        --text-main: #0f1b33;
                        --text-subtle: #5b6b84;
                        --card-border: rgba(120, 140, 180, 0.18);
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 2.5rem 1.5rem;
                        background:
                            radial-gradient(900px 520px at 15% 20%, rgba(255, 255, 255, 0.75), transparent 60%),
                            radial-gradient(780px 520px at 82% 10%, rgba(220, 231, 255, 0.7), transparent 55%),
                            linear-gradient(140deg, #f4f7ff 0%, #e7effd 45%, #f8fbff 100%);
                        font-family: "Manrope", "Space Grotesk", "Plus Jakarta Sans", "Poppins", sans-serif;
                    }

                    .admin-card {
                        position: relative;
                        width: min(440px, 90vw);
                        padding: 2.75rem 2.5rem 2.25rem;
                        background: rgba(255, 255, 255, 0.96);
                        border-radius: 1.25rem;
                        box-shadow:
                            0 18px 45px rgba(26, 35, 58, 0.12),
                            inset 0 1px 0 rgba(255, 255, 255, 0.7);
                        border: 1px solid var(--card-border);
                        animation: floatIn 420ms ease-out;
                    }

                    .admin-card::after {
                        content: "";
                        position: absolute;
                        inset: 0;
                        border-radius: inherit;
                        background: linear-gradient(150deg, rgba(110, 144, 220, 0.08), transparent 65%);
                        pointer-events: none;
                    }

                    .admin-badge {
                        width: 54px;
                        height: 54px;
                        border-radius: 16px;
                        display: grid;
                        place-items: center;
                        background: linear-gradient(135deg, #eef5ff 0%, #f7faff 100%);
                        box-shadow: 0 10px 22px rgba(47, 109, 246, 0.18);
                        font-size: 1.35rem;
                        margin-bottom: 1.25rem;
                    }

                    .admin-title {
                        font-size: 1.9rem;
                        font-weight: 700;
                        letter-spacing: -0.02em;
                        color: var(--text-main);
                        margin-bottom: 0.4rem;
                    }

                    .admin-subtitle {
                        color: var(--text-subtle);
                        font-size: 0.98rem;
                        line-height: 1.55;
                        margin-bottom: 1.8rem;
                    }

                    .admin-form {
                        display: grid;
                        gap: 0.9rem;
                    }

                    .admin-label {
                        font-size: 0.82rem;
                        text-transform: uppercase;
                        letter-spacing: 0.18em;
                        color: #7a889e;
                        font-weight: 600;
                    }

                    .admin-input {
                        width: 100%;
                        padding: 0.85rem 1rem;
                        border-radius: 0.85rem;
                        border: 1px solid rgba(120, 140, 180, 0.22);
                        background: #f3f7ff;
                        font-size: 1rem;
                        color: #1f2a44;
                        transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
                    }

                    .admin-input:focus {
                        outline: none;
                        border-color: var(--primary);
                        box-shadow: 0 0 0 4px var(--primary-fade);
                        transform: translateY(-1px);
                        background: #ffffff;
                    }

                    .admin-error {
                        padding: 0.75rem 0.9rem;
                        border-radius: 0.75rem;
                        background: rgba(239, 68, 68, 0.12);
                        color: #b42318;
                        font-weight: 600;
                        font-size: 0.9rem;
                    }

                    .admin-button {
                        width: 100%;
                        padding: 0.85rem 1rem;
                        border: none;
                        border-radius: 0.85rem;
                        font-size: 1rem;
                        font-weight: 600;
                        color: #ffffff;
                        background: linear-gradient(135deg, #3b7bff 0%, #2f6df6 55%, #2b5fe0 100%);
                        box-shadow: 0 14px 28px rgba(47, 109, 246, 0.28);
                        cursor: pointer;
                        transition: transform 180ms ease, box-shadow 180ms ease, filter 180ms ease;
                    }

                    .admin-button:hover {
                        transform: translateY(-1px);
                        box-shadow: 0 18px 32px rgba(47, 109, 246, 0.35);
                        filter: saturate(1.05);
                    }

                    .admin-button:active {
                        transform: translateY(0);
                    }

                    @keyframes floatIn {
                        0% {
                            opacity: 0;
                            transform: translateY(14px) scale(0.98);
                        }
                        100% {
                            opacity: 1;
                            transform: translateY(0) scale(1);
                        }
                    }

                    @media (max-width: 520px) {
                        .admin-card {
                            padding: 2.2rem 1.6rem 2rem;
                        }

                        .admin-title {
                            font-size: 1.6rem;
                        }
                    }
                `}</style>
            </div>
        );
    }

    return <>{children}</>;
}
