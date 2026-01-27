'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/login/reset`,
            });

            if (error) {
                setError(error.message || 'Unable to send reset code.');
            } else {
                setMessage('We sent a reset link to your email. Please check your inbox.');
                // Don't redirect immediately to allow them to read the message?
                // The link will take them to /login/reset.
                // Redirecting to /login might be better?
                // "Go check your email" is the end state here.
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-halo" />
            <div className="auth-haloBottom" />
            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">
                        Reset your password
                    </h1>
                    <p className="auth-subtitle">
                        Enter your email to receive a reset code.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="auth-label">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@company.com"
                            required
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
                        {loading ? 'Sending code...' : 'Send reset code'}
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
