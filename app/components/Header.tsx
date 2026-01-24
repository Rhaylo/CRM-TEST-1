'use client';

<<<<<<< HEAD
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
=======
import { Search, LogOut } from 'lucide-react';
import styles from './Header.module.css';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import NotificationBell from './NotificationBell';
import { signOut } from 'next-auth/react';

export default function Header() {
    const router = useRouter();
    const [query, setQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/login' });
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
    };

    return (
        <header className={styles.header}>
<<<<<<< HEAD
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
                        backgroundColor: 'rgba(147, 197, 253, 0.25)',
                        color: '#1d4ed8',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: '999px',
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
=======
            <div className={styles.searchContainer}>
                <form onSubmit={handleSearch} className={styles.searchWrapper}>
                    <Search className={styles.searchIcon} size={18} />
                    <input
                        type="text"
                        placeholder="Search clients, deals, addresses..."
                        className={styles.searchInput}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </form>
            </div>
            <div className={styles.actions}>
                <NotificationBell />
                <button
                    onClick={handleLogout}
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
<<<<<<< HEAD
                        background: 'linear-gradient(135deg, #fb7185, #e11d48)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '999px',
=======
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                    }}
<<<<<<< HEAD
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
=======
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
                >
                    <LogOut size={16} />
                    Logout
                </button>
            </div>
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
        </header>
    );
}
