'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Briefcase, FileText, CheckSquare, Settings, LayoutDashboard, Calendar, Mail, ChevronLeft, ChevronRight } from 'lucide-react';
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

interface SidebarProps {
    isCollapsed?: boolean;
    toggleSidebar?: () => void;
}

export default function Sidebar({ isCollapsed = false, toggleSidebar }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
            <div className={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'space-between', width: '100%' }}>
                    {!isCollapsed && (
                        <img
                            src="/logo.png"
                            alt="Xyre Holdings"
                            style={{
                                width: '40px',
                                height: 'auto',
                                objectFit: 'contain',
                            }}
                        />
                    )}
                    <button
                        onClick={toggleSidebar}
                        className={styles.toggleButton}
                        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                    >
                        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>
            </div>
            <nav className={styles.nav}>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.link} ${isActive ? styles.active : ''} ${isCollapsed ? styles.linkCollapsed : ''}`}
                            title={isCollapsed ? item.name : ''}
                        >
                            <Icon size={20} />
                            {!isCollapsed && <span className="font-medium">{item.name}</span>}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
