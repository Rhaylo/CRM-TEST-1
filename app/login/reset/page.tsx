'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(true);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                // If no session, it might be that the hash hasn't been processed yet or link is invalid.
                // supabase-js handles hash parsing automatically.
                // Give it a moment or check if we are on the client.
                // But typically if we land here from an email link, the session is set.
                // If not, we should probably redirect to login or forgot password.
                setError('Invalid or expired reset link.');
            }
            setVerifying(false);
        };
        checkSession();
    }, [supabase]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        setMessage('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({ password });

            if (error) {
                setError(error.message || 'Unable to reset password.');
            } else {
                setMessage('Password updated. You can sign in now.');
                setTimeout(() => {
                    supabase.auth.signOut().then(() => router.push('/login'));
                }, 1500);
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (verifying) {
        return (
            <div className="auth-page">
                <div className="auth-halo" />
                <div className="auth-haloBottom" />
                <div className="auth-verify">Verifying link...</div>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <div className="auth-halo" />
            <div className="auth-haloBottom" />
            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">Set new password</h1>
                    <p className="auth-subtitle">Please enter your new password below.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.2rem' }}>
                        <label className="auth-label">
                            New Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="New password"
                            required
                            minLength={6}
                            className="auth-input"
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="auth-label">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm password"
                            required
                            minLength={6}
                            className="auth-input"
                        />
                    </div>

                    {error && (
                        <div className="auth-message auth-messageError">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="auth-message auth-messageSuccess">
                            {message}
                        </div>
                    )}

                    <button type="submit" disabled={loading} className="auth-button">
                        {loading ? 'Updating...' : 'Update password'}
                    </button>
                </form>

                <div className="auth-footer">
                    <a href="/login" className="auth-link">
                        Back to sign in
                    </a>
                </div>
            </div>
        </div>
    );
}
