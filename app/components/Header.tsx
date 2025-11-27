'use client';

import { Search, Bell } from 'lucide-react';
import styles from './Header.module.css';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Header() {
    const router = useRouter();
    const [query, setQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
        }
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
                <button className={styles.notificationBtn}>
                    <Bell size={20} />
                    <span className={styles.badge}></span>
                </button>
            </div>
        </header>
    );
}
