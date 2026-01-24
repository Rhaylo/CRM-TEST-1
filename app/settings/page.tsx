'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Shield, Mail, Lock, Key } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function SettingsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Update Email State
    const [newEmail, setNewEmail] = useState('');
    const [currentPasswordForEmail, setCurrentPasswordForEmail] = useState('');

    // Update Password State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Update Admin Gate Password State
    const [currentAdminGatePassword, setCurrentAdminGatePassword] = useState('');
    const [newAdminGatePassword, setNewAdminGatePassword] = useState('');
    const [confirmAdminGatePassword, setConfirmAdminGatePassword] = useState('');

    const handleUpdateEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const res = await fetch('/api/user/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: newEmail,
                    currentPassword: currentPasswordForEmail
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data || 'Failed to update email');
            } else {
                setMessage('Email updated successfully! Please login again.');
                setTimeout(() => signOut(), 2000);
            }
        } catch (err) {
            setError('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        if (newPassword !== confirmPassword) {
            setError("New passwords don't match");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/user/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    password: newPassword,
                    currentPassword: currentPassword
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data || 'Failed to update password');
            } else {
                setMessage('Password updated successfully! Please login again.');
                setTimeout(() => signOut(), 2000);
            }
        } catch (err) {
            setError('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateAdminGatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        if (newAdminGatePassword !== confirmAdminGatePassword) {
            setError("New admin gate passwords don't match");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/admin/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentAdminPassword: currentAdminGatePassword,
                    newAdminPassword: newAdminGatePassword
                }),
            });

            if (!res.ok) {
                const text = await res.text();
                setError(text || 'Failed to update admin gate password');
            } else {
                setMessage('Admin access password updated successfully!');
                setCurrentAdminGatePassword('');
                setNewAdminGatePassword('');
                setConfirmAdminGatePassword('');
            }
        } catch (err) {
            setError('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div className="flex items-center space-x-3 mb-8">
                <Shield className="w-8 h-8 text-blue-600" />
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Admin Security Settings</h1>
                    <p className="text-gray-500">Manage your login credentials here</p>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                    {error}
                </div>
            )}

            {message && (
                <div className="p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
                    {message}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Email Update Card */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                    <div className="flex items-center space-x-2 mb-6 text-gray-800">
                        <Mail className="w-5 h-5" />
                        <h2 className="text-lg font-semibold">Update Email</h2>
                    </div>

                    <form onSubmit={handleUpdateEmail} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Email Address</label>
                            <input
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password (to confirm)</label>
                            <input
                                type="password"
                                value={currentPasswordForEmail}
                                onChange={(e) => setCurrentPasswordForEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !newEmail || !currentPasswordForEmail}
                            className="w-full py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Update Email'}
                        </button>
                    </form>
                </div>

                {/* Password Update Card */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                    <div className="flex items-center space-x-2 mb-6 text-gray-800">
                        <Lock className="w-5 h-5" />
                        <h2 className="text-lg font-semibold">Change Password</h2>
                    </div>

                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                                minLength={6}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                                minLength={6}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !newPassword || !currentPassword || !confirmPassword}
                            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Change Password'}
                        </button>
                    </form>
                </div>

                {/* Admin Gate Password Update Card */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 col-span-1 md:col-span-2">
                    <div className="flex items-center space-x-2 mb-6 text-gray-800">
                        <Key className="w-5 h-5 text-purple-600" />
                        <h2 className="text-lg font-semibold">Admin Access Password</h2>
                    </div>

                    <p className="text-sm text-gray-500 mb-4">
                        This password is used to unlock the Admin Panel features.
                        Default: XyreHoldings76!@
                    </p>

                    <form onSubmit={handleUpdateAdminGatePassword} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Current Admin Password</label>
                                <input
                                    type="password"
                                    value={currentAdminGatePassword}
                                    onChange={(e) => setCurrentAdminGatePassword(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Admin Password</label>
                                <input
                                    type="password"
                                    value={newAdminGatePassword}
                                    onChange={(e) => setNewAdminGatePassword(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
                                    required
                                    minLength={4}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={confirmAdminGatePassword}
                                    onChange={(e) => setConfirmAdminGatePassword(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
                                    required
                                    minLength={4}
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !newAdminGatePassword || !currentAdminGatePassword || !confirmAdminGatePassword}
                            className="w-full py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Update Admin Access Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
