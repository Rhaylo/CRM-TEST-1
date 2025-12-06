'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Briefcase, FileText, CheckSquare, Settings, LayoutDashboard, Calendar } from 'lucide-react';
import styles from './Sidebar.module.css';

const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Clients', href: '/clients', icon: Users },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
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
                <img
                    src="/logo.png"
                    alt="Xyre Holdings"
                    style={{
                        width: '50px',
                        height: 'auto',
                        objectFit: 'contain',
                        margin: '0 auto'
                    }}
                />
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
        </aside>
    );
}
