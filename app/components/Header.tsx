'use client';

import { LogOut, Settings, LayoutDashboard, Users, ClipboardCheck, Handshake, Building2, FileSignature, Briefcase, CalendarDays } from 'lucide-react';
import styles from './Header.module.css';
import { useRouter, usePathname } from 'next/navigation';
import NotificationBell from './NotificationBell';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const supabase = createClient();
    const [displayName, setDisplayName] = useState('User');
    const [displayRole, setDisplayRole] = useState<string | null>(null);

    const navItems = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Clients', href: '/clients', icon: Users },
        { name: 'Tasks', href: '/tasks', icon: ClipboardCheck },
        { name: 'Deals', href: '/deals', icon: Handshake },
        { name: 'Calendar', href: '/calendar', icon: CalendarDays },
        { name: 'Dispositions', href: '/dispositions', icon: Building2 },
        { name: 'Contracts', href: '/contracts', icon: FileSignature },
        { name: 'Title Companies', href: '/title-companies', icon: Briefcase },
        { name: 'Admin', href: '/admin', icon: Settings },
    ];

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    useEffect(() => {
        let active = true;

        const loadProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!active) return;

            const fallbackName = user?.user_metadata?.full_name || user?.email || 'User';
            setDisplayName(fallbackName);

            try {
                const response = await fetch('/api/user/me');
                if (!active) return;

                if (response.ok) {
                    const data = await response.json();
                    if (data?.name) {
                        setDisplayName(data.name);
                    }
                    if (data?.role) {
                        setDisplayRole(data.role);
                    }
                }
            } catch (error) {
                console.warn('Unable to load user profile.', error);
            }
        };

        loadProfile();

        return () => {
            active = false;
        };
    }, [supabase]);

    return (
        <header className={styles.header}>
            <div className={styles.leftCluster}>
                <div className={styles.brand}>
                    <img
                        src="/logo.png"
                        alt="Xyre Holdings"
                        className={styles.brandLogo}
                    />
                    <div className={styles.brandText}>
                        <span className={styles.brandTitle}>Xyre CRM</span>
                        <span className={styles.brandSubtitle}>Command Center</span>
                    </div>
                </div>

                <div className={styles.userBadge}>
                    <span className={styles.userName}>{displayName}</span>
                    <span className={styles.userRole}>{displayRole ?? 'User'}</span>
                </div>
            </div>

            <nav className={styles.nav} aria-label="Primary">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.navLink} ${isActive ? styles.navActive : ''}`}
                        >
                            <span className={styles.navIcon}>
                                <Icon size={16} strokeWidth={1.6} />
                            </span>
                            <span className={styles.navLabel}>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

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
        </header>
    );
}
