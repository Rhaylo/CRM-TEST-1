'use client';

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
    };

    return (
        <header className={styles.header}>
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
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
                >
                    <LogOut size={16} />
                    Logout
                </button>
            </div>
        </header>
    );
}
