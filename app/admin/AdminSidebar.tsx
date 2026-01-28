'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap, Clock, FileText, LogOut, Mail } from 'lucide-react';
import styles from './admin.module.css';

type SidebarCounts = {
    automations?: { active: number; total: number };
    schedules?: { active: number; total: number };
    templates?: number;
};

export default function AdminSidebar({ counts }: { counts?: SidebarCounts }) {
    const pathname = usePathname();

    const formatActiveTotal = (value?: { active: number; total: number }) => {
        if (!value) return undefined;
        return `${value.active}/${value.total}`;
    };

    const navItems = [
        {
            href: '/admin/automation',
            icon: Zap,
            label: 'Automations',
            description: 'Trigger-based workflows',
            badge: formatActiveTotal(counts?.automations),
        },
        {
            href: '/admin/scheduler',
            icon: Clock,
            label: 'Schedules',
            description: 'Time-based runs',
            badge: formatActiveTotal(counts?.schedules),
        },
        {
            href: '/admin/email-templates',
            icon: Mail,
            label: 'Templates',
            description: 'Reusable emails',
            badge: counts?.templates?.toString(),
        },
        {
            href: '/admin/logs',
            icon: FileText,
            label: 'Activity History',
            description: 'CRM activity log',
        },
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
                                <span className={styles.navIconWrap}>
                                    <Icon size={18} />
                                </span>
                                <span className={styles.navTextStack}>
                                    <span className={styles.navLabelRow}>
                                        <span className={styles.navLabel}>{item.label}</span>
                                        {item.badge && (
                                            <span className={styles.navBadge}>{item.badge}</span>
                                        )}
                                    </span>
                                    <span className={styles.navMeta}>{item.description}</span>
                                </span>
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
