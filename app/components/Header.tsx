'use client';

import { Search, LogOut, Menu, Settings } from 'lucide-react';
import styles from './Header.module.css';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import NotificationBell from './NotificationBell';
import { signOut } from 'next-auth/react';

interface HeaderProps {
    toggleSidebar?: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
    const router = useRouter();

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/auth' });
    };

    return (
        <header className={styles.header}>
            {/* Mobile Menu Toggle - Visible only on mobile */}
            <button
                onClick={toggleSidebar}
                className="mobile-menu-btn"
                style={{
                    marginRight: '0.5rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#64748b',
                }}
            >
                <Menu size={24} />
            </button>

            <div style={{ flex: 1 }}></div>

            <div className={styles.actions}>
                <NotificationBell />
                <button
                    onClick={() => router.push('/settings')}
                    className="settings-btn"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: '#f3f4f6',
                        color: '#374151',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                    }}
                >
                    <Settings size={16} />
                    <span className="settings-text">Settings</span>
                </button>
                <button
                    onClick={handleLogout}
                    className="logout-btn"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                    }}
                >
                    <LogOut size={16} />
                    <span className="logout-text">Logout</span>
                </button>
            </div>

            <style jsx>{`
                .mobile-menu-btn {
                    display: none;
                }
                .logout-text {
                    display: inline;
                }
                
                @media (max-width: 768px) {
                    .mobile-menu-btn {
                        display: block;
                    }
                    .logout-text {
                        display: none;
                    }
                    .logout-btn {
                        padding: 0.5rem;
                    }
                }
            `}</style>
        </header>
    );
}
