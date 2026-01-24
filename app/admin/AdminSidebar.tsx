'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
<<<<<<< HEAD
import { LayoutDashboard, Zap, Clock, FileText, Settings, LogOut, Mail } from 'lucide-react';
=======
import { LayoutDashboard, Zap, Clock, FileText, Settings, LogOut } from 'lucide-react';
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
import styles from './admin.module.css';

export default function AdminSidebar() {
    const pathname = usePathname();

    const navItems = [
        { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { href: '/admin/revenue', icon: LayoutDashboard, label: 'Revenue Data' },
        { href: '/admin/automation', icon: Zap, label: 'Automation Rules' },
        { href: '/admin/scheduler', icon: Clock, label: 'Scheduled Tasks' },
<<<<<<< HEAD
        { href: '/admin/email-templates', icon: Mail, label: 'Email Templates' },
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
        { href: '/admin/logs', icon: FileText, label: 'Execution Logs' },
        { href: '/admin/settings', icon: Settings, label: 'Settings' },
    ];

    const handleLogout = () => {
        sessionStorage.removeItem('admin_authenticated');
        window.location.href = '/';
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
                <div className={styles.logo}>
                    🔐 Admin Panel
                </div>
            </div>

            <nav>
                <div className={styles.navSection}>
                    <div className={styles.navTitle}>Menu</div>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                            >
                                <Icon size={18} />
                                {item.label}
                            </Link>
                        );
                    })}
                </div>

                <div className={styles.navSection}>
                    <div className={styles.navTitle}>System</div>
                    <button
                        onClick={handleLogout}
                        className={styles.navLink}
                        style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </nav>
        </aside>
    );
}
