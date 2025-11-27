'use client';

import { useState } from 'react';
import { updateAdminPassword, updateGlobalSettings } from './actions';

export default function SettingsForm({ initialSettings }: { initialSettings: any }) {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handlePasswordUpdate = async (formData: FormData) => {
        setError('');
        setMessage('');
        try {
            await updateAdminPassword(formData);
            setMessage('Password updated successfully');
            (document.getElementById('passwordForm') as HTMLFormElement).reset();
        } catch (e: any) {
            setError(e.message);
        }
    };

    const handleSettingsUpdate = async (formData: FormData) => {
        setError('');
        setMessage('');
        try {
            await updateGlobalSettings(formData);
            setMessage('Settings updated successfully');
        } catch (e: any) {
            setError(e.message);
        }
    };

    return (
        <div style={{ maxWidth: '800px' }}>
            {message && (
                <div style={{ padding: '1rem', backgroundColor: '#dcfce7', color: '#166534', marginBottom: '1rem', borderRadius: '0.5rem' }}>
                    {message}
                </div>
            )}
            {error && (
                <div style={{ padding: '1rem', backgroundColor: '#fee2e2', color: '#991b1b', marginBottom: '1rem', borderRadius: '0.5rem' }}>
                    {error}
                </div>
            )}

            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                    Change Admin Password
                </h2>
                <form id="passwordForm" action={handlePasswordUpdate}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Current Password</label>
                        <input type="password" name="currentPassword" required style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }} />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>New Password</label>
                        <input type="password" name="newPassword" required style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }} />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Confirm New Password</label>
                        <input type="password" name="confirmPassword" required style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }} />
                    </div>
                    <button type="submit" style={{ backgroundColor: '#4f46e5', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer' }}>
                        Update Password
                    </button>
                </form>
            </div>

            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                    Global Settings
                </h2>
                <form action={handleSettingsUpdate}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Company Name</label>
                        <input
                            type="text"
                            name="companyName"
                            defaultValue={initialSettings.companyName}
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }}
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Support Email</label>
                        <input
                            type="email"
                            name="supportEmail"
                            defaultValue={initialSettings.supportEmail}
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }}
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Theme Color</label>
                        <input
                            type="color"
                            name="themeColor"
                            defaultValue={initialSettings.themeColor || '#4f46e5'}
                            style={{ width: '100%', height: '40px', padding: '0.25rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }}
                        />
                    </div>
                    <button type="submit" style={{ backgroundColor: '#4f46e5', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer' }}>
                        Save Settings
                    </button>
                </form>
            </div>
        </div>
    );
}
