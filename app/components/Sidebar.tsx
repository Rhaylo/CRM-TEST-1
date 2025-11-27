'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Briefcase, FileText, CheckSquare, Settings } from 'lucide-react';
import styles from './Sidebar.module.css';

const navItems = [
    { name: 'Clients', href: '/', icon: Users },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Deals', href: '/deals', icon: Briefcase },
    { name: 'Dispositions', href: '/dispositions', icon: Users },
    { name: 'Contracts', href: '/contracts', icon: FileText },
    { name: 'Admin', href: '/admin', icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className={styles.sidebar}>
            <div className={styles.header}>
                <h1 className={styles.title}>
                    Wholesale CRM
                </h1>
            </div>
            <nav className={styles.nav}>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.link} ${isActive ? styles.active : ''}`}
                        >
                            <Icon size={20} />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
            <div className={styles.footer}>
                <div className={styles.userProfile}>
                    <div className={styles.avatar}>
                        <span>AD</span>
                    </div>
                    <div className={styles.userInfo}>
                        <span className={styles.userName}>Admin User</span>
                        <span className={styles.userEmail}>admin@crm.com</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
