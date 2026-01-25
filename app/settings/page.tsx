'use client';

import { useState } from 'react';
import { Loader2, Shield, Mail, Lock, Key, Eye, EyeOff } from 'lucide-react';
import { signOut } from 'next-auth/react';
import styles from './Settings.module.css';

const feedbackDelay = 4000;

export default function SettingsPage() {
    const [loadingEmail, setLoadingEmail] = useState(false);
    const [loadingPassword, setLoadingPassword] = useState(false);
    const [loadingAdmin, setLoadingAdmin] = useState(false);

    const [emailMessage, setEmailMessage] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [adminMessage, setAdminMessage] = useState('');
    const [adminError, setAdminError] = useState('');

    const [newEmail, setNewEmail] = useState('');
    const [currentPasswordForEmail, setCurrentPasswordForEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [currentAdminGatePassword, setCurrentAdminGatePassword] = useState('');
    const [newAdminGatePassword, setNewAdminGatePassword] = useState('');
    const [confirmAdminGatePassword, setConfirmAdminGatePassword] = useState('');
    const [showAdminPasswords, setShowAdminPasswords] = useState(false);

    const scheduleClear = (setter: (value: string) => void) => {
        if (feedbackDelay > 0) {
            setTimeout(() => setter(''), feedbackDelay);
        }
    };

    const handleUpdateEmail = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoadingEmail(true);
        setEmailError('');
        setEmailMessage('');

        try {
            const res = await fetch('/api/user/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: newEmail,
                    currentPassword: currentPasswordForEmail,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setEmailError(data || 'Failed to update email');
                scheduleClear(setEmailError);
            } else {
                setEmailMessage('Email updated successfully. Please login again.');
                scheduleClear(setEmailMessage);
                setTimeout(() => signOut(), 2000);
            }
        } catch (err) {
            setEmailError('Something went wrong');
            scheduleClear(setEmailError);
        } finally {
            setLoadingEmail(false);
        }
    };

    const handleUpdatePassword = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoadingPassword(true);
        setPasswordError('');
        setPasswordMessage('');

        if (newPassword !== confirmPassword) {
            setPasswordError("New passwords don't match");
            setLoadingPassword(false);
            scheduleClear(setPasswordError);
            return;
        }

        try {
            const res = await fetch('/api/user/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    password: newPassword,
                    currentPassword,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setPasswordError(data || 'Failed to update password');
                scheduleClear(setPasswordError);
            } else {
                setPasswordMessage('Password updated successfully. Please login again.');
                scheduleClear(setPasswordMessage);
                setTimeout(() => signOut(), 2000);
            }
        } catch (err) {
            setPasswordError('Something went wrong');
            scheduleClear(setPasswordError);
        } finally {
            setLoadingPassword(false);
        }
    };

    const handleUpdateAdminGatePassword = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoadingAdmin(true);
        setAdminError('');
        setAdminMessage('');

        if (newAdminGatePassword !== confirmAdminGatePassword) {
            setAdminError("New admin gate passwords don't match");
            setLoadingAdmin(false);
            scheduleClear(setAdminError);
            return;
        }

        try {
            const res = await fetch('/api/admin/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentAdminPassword: currentAdminGatePassword,
                    newAdminPassword: newAdminGatePassword,
                }),
            });

            if (!res.ok) {
                const text = await res.text();
                setAdminError(text || 'Failed to update admin gate password');
                scheduleClear(setAdminError);
            } else {
                setAdminMessage('Admin access password updated successfully.');
                scheduleClear(setAdminMessage);
                setCurrentAdminGatePassword('');
                setNewAdminGatePassword('');
                setConfirmAdminGatePassword('');
            }
        } catch (err) {
            setAdminError('Something went wrong');
            scheduleClear(setAdminError);
        } finally {
            setLoadingAdmin(false);
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.headerIcon}>
                    <Shield className={styles.headerIconSvg} />
                </div>
                <div>
                    <h1 className={styles.headerTitle}>Admin Security Settings</h1>
                    <p className={styles.headerSubtitle}>Manage your login credentials and admin access policies.</p>
                </div>
            </div>

            <div className={styles.sectionGrid}>
                <section className={styles.sectionCard}>
                    <div className={styles.sectionHeader}>
                        <div className={`${styles.sectionIcon} ${styles.sectionIconPrimary}`}>
                            <Lock className={styles.sectionIconSvg} />
                        </div>
                        <div>
                            <h2 className={styles.sectionTitle}>Primary Login Security</h2>
                            <p className={styles.sectionSubtitle}>Manage the email and password tied to your main login.</p>
                        </div>
                    </div>

                    <div className={styles.sectionBody}>
                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <div className={`${styles.cardIcon} ${styles.cardIconEmail}`}>
                                    <Mail className={styles.cardIconSvg} />
                                </div>
                                <div>
                                    <h3 className={styles.cardTitle}>Update Email</h3>
                                    <p className={styles.cardSubtitle}>Keep your login email up to date.</p>
                                </div>
                            </div>

                            {emailError && <div className={`${styles.alert} ${styles.alertError}`}>{emailError}</div>}
                            {emailMessage && <div className={`${styles.alert} ${styles.alertSuccess}`}>{emailMessage}</div>}

                            <form onSubmit={handleUpdateEmail} className={styles.form}>
                                <div className={styles.field}>
                                    <label className={styles.label}>New Email Address</label>
                                    <input
                                        type="email"
                                        value={newEmail}
                                        onChange={(event) => setNewEmail(event.target.value)}
                                        className={styles.input}
                                        required
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label className={styles.label}>Current Password (to confirm)</label>
                                    <input
                                        type="password"
                                        value={currentPasswordForEmail}
                                        onChange={(event) => setCurrentPasswordForEmail(event.target.value)}
                                        className={styles.input}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loadingEmail || !newEmail || !currentPasswordForEmail}
                                    className={`${styles.button} ${styles.buttonDark}`}
                                >
                                    {loadingEmail ? <Loader2 className={styles.spinner} /> : 'Update Email'}
                                </button>
                            </form>
                        </div>

                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <div className={`${styles.cardIcon} ${styles.cardIconLock}`}>
                                    <Lock className={styles.cardIconSvg} />
                                </div>
                                <div>
                                    <h3 className={styles.cardTitle}>Change Password</h3>
                                    <p className={styles.cardSubtitle}>Update your login password securely.</p>
                                </div>
                            </div>

                            {passwordError && <div className={`${styles.alert} ${styles.alertError}`}>{passwordError}</div>}
                            {passwordMessage && <div className={`${styles.alert} ${styles.alertSuccess}`}>{passwordMessage}</div>}

                            <form onSubmit={handleUpdatePassword} className={styles.form}>
                                <div className={styles.field}>
                                    <label className={styles.label}>Current Password</label>
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(event) => setCurrentPassword(event.target.value)}
                                        className={styles.input}
                                        required
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label className={styles.label}>New Password</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(event) => setNewPassword(event.target.value)}
                                        className={styles.input}
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label className={styles.label}>Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(event) => setConfirmPassword(event.target.value)}
                                        className={styles.input}
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loadingPassword || !newPassword || !currentPassword || !confirmPassword}
                                    className={`${styles.button} ${styles.buttonPrimary}`}
                                >
                                    {loadingPassword ? <Loader2 className={styles.spinner} /> : 'Change Password'}
                                </button>
                            </form>
                        </div>
                    </div>
                </section>

                <section className={`${styles.sectionCard} ${styles.sectionCardAdmin}`}>
                    <div className={styles.sectionHeader}>
                        <div className={`${styles.sectionIcon} ${styles.sectionIconAdmin}`}>
                            <Key className={styles.sectionIconSvg} />
                        </div>
                        <div>
                            <h2 className={styles.sectionTitle}>Admin Access Security</h2>
                            <p className={styles.sectionSubtitle}>Controls access to the Admin Panel features only.</p>
                        </div>
                    </div>

                    <div className={styles.defaultRow}>
                        <span className={styles.defaultLabel}>Default</span>
                        <span className={styles.defaultValue}>
                            {showAdminPasswords ? 'XyreHoldings76!@' : '••••••••••••'}
                        </span>
                        <button
                            type="button"
                            className={styles.toggleButton}
                            onClick={() => setShowAdminPasswords((prev) => !prev)}
                            aria-label={showAdminPasswords ? 'Hide admin passwords' : 'Show admin passwords'}
                        >
                            {showAdminPasswords ? <EyeOff className={styles.toggleIcon} /> : <Eye className={styles.toggleIcon} />}
                        </button>
                    </div>

                    {adminError && <div className={`${styles.alert} ${styles.alertError}`}>{adminError}</div>}
                    {adminMessage && <div className={`${styles.alert} ${styles.alertSuccess}`}>{adminMessage}</div>}

                    <form onSubmit={handleUpdateAdminGatePassword} className={styles.form}>
                        <div className={styles.inlineGrid}>
                            <div className={styles.field}>
                                <label className={styles.label}>Current Admin Password</label>
                                <input
                                    type={showAdminPasswords ? 'text' : 'password'}
                                    value={currentAdminGatePassword}
                                    onChange={(event) => setCurrentAdminGatePassword(event.target.value)}
                                    className={styles.input}
                                    required
                                />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label}>New Admin Password</label>
                                <input
                                    type={showAdminPasswords ? 'text' : 'password'}
                                    value={newAdminGatePassword}
                                    onChange={(event) => setNewAdminGatePassword(event.target.value)}
                                    className={styles.input}
                                    required
                                    minLength={4}
                                />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label}>Confirm New Password</label>
                                <input
                                    type={showAdminPasswords ? 'text' : 'password'}
                                    value={confirmAdminGatePassword}
                                    onChange={(event) => setConfirmAdminGatePassword(event.target.value)}
                                    className={styles.input}
                                    required
                                    minLength={4}
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={
                                loadingAdmin ||
                                !newAdminGatePassword ||
                                !currentAdminGatePassword ||
                                !confirmAdminGatePassword
                            }
                            className={`${styles.button} ${styles.buttonPurple}`}
                        >
                            {loadingAdmin ? <Loader2 className={styles.spinner} /> : 'Update Admin Access Password'}
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
}
