'use client';

import { LogOut, Menu, Settings } from 'lucide-react';
import styles from './Header.module.css';
import { useRouter } from 'next/navigation';
import NotificationBell from './NotificationBell';
import { createClient } from '@/lib/supabase/client';

interface HeaderProps {
    toggleSidebar?: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    return (
        <header className={styles.header}>
            {/* Mobile Menu Toggle - Visible only on mobile */}
            <button
                onClick={toggleSidebar}
                className={styles.mobileMenuButton}
                aria-label="Open menu"
            >
                <Menu size={24} />
            </button>

            <div className={styles.headerSpacer}></div>

            <div className={styles.actions}>
                <NotificationBell />
                <button
                    onClick={() => router.push('/settings')}
                    className={styles.settingsButton}
                >
                    <Settings size={16} />
                    <span className={styles.actionText}>Settings</span>
                </button>
                <button
                    onClick={handleLogout}
                    className={styles.logoutButton}
                >
                    <LogOut size={16} />
                    <span className={styles.actionText}>Logout</span>
                </button>
            </div>
        </header >
    );
}
