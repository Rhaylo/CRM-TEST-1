'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, FileSignature, ClipboardCheck, Settings, LayoutDashboard, Handshake, Building2, ChevronLeft, ChevronRight, Briefcase, X } from 'lucide-react';
import styles from './Sidebar.module.css';

const navItems = [
    { name: 'Dashboard', subtitle: 'Overview', href: '/', icon: LayoutDashboard },
    { name: 'Clients', subtitle: 'CRM', href: '/clients', icon: Users },
    { name: 'Tasks', subtitle: 'Work queue', href: '/tasks', icon: ClipboardCheck },
    { name: 'Deals', subtitle: 'Pipeline', href: '/deals', icon: Handshake },
    { name: 'Dispositions', subtitle: 'Inventory', href: '/dispositions', icon: Building2 },
    { name: 'Contracts', subtitle: 'Documents', href: '/contracts', icon: FileSignature },
    { name: 'Title Companies', subtitle: 'Partners', href: '/title-companies', icon: Briefcase },
    { name: 'Admin', subtitle: 'Settings', href: '/admin', icon: Settings },
];

interface SidebarProps {
    isCollapsed?: boolean;
    toggleSidebar?: () => void;
    closeMobileMenu?: () => void;
}

export default function Sidebar({ isCollapsed = false, toggleSidebar, closeMobileMenu }: SidebarProps) {
    const pathname = usePathname();
    const [items, setItems] = useState(navItems);
    const [isCustomizing, setIsCustomizing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load preference
        const loadOrder = async () => {
            const { getSidebarOrder } = await import('./sidebar-actions');
            const savedOrder = await getSidebarOrder();

            if (savedOrder && Array.isArray(savedOrder)) {
                const sorted = [...navItems].sort((a, b) => {
                    const idxA = savedOrder.indexOf(a.name);
                    const idxB = savedOrder.indexOf(b.name);
                    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
                    if (idxA !== -1) return -1;
                    if (idxB !== -1) 1;
                    return 0;
                });
                setItems(sorted);
            }
            setLoading(false);
        };
        loadOrder();
    }, []);
    // Close mobile menu when path changes
    useEffect(() => {
        if (closeMobileMenu) {
            closeMobileMenu();
        }
    }, [pathname, closeMobileMenu]);

    const handleMove = (index: number, direction: 'up' | 'down') => {
        const newItems = [...items];
        if (direction === 'up' && index > 0) {
            [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
        } else if (direction === 'down' && index < newItems.length - 1) {
            [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
        }
        setItems(newItems);
    };

    const handleSave = async () => {
        const { updateSidebarOrder } = await import('./sidebar-actions');
        const names = items.map(i => i.name);
        await updateSidebarOrder(names);
        setIsCustomizing(false);
    };

    const displayItems = items;
    const primaryItems = displayItems.filter((item) => item.name !== 'Admin');
    const systemItems = displayItems.filter((item) => item.name === 'Admin');

    return (
        <aside
            className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}
        >
            <div className={styles.header}>
                <div className={styles.brandRow}>
                    {!isCollapsed && (
                        <div className={styles.brandBlock}>
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
                    )}
                    <div className={styles.headerActions}>
                        {closeMobileMenu && (
                            <button
                                onClick={closeMobileMenu}
                                className={`${styles.iconButton} ${styles.mobileClose}`}
                                title="Close Menu"
                            >
                                <X size={18} />
                            </button>
                        )}
                        <button
                            onClick={toggleSidebar}
                            className={styles.toggleButton}
                            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                        >
                            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                        </button>
                    </div>
                </div>
            </div>
            <nav className={styles.nav}>
                {!isCollapsed && <div className={styles.sectionLabel}>Menu</div>}
                {primaryItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.link} ${isActive ? styles.active : ''} ${isCollapsed ? styles.linkCollapsed : ''}`}
                            title={isCollapsed ? item.name : ''}
                        >
                            <span className={styles.iconWrap}>
                                <Icon size={20} strokeWidth={1.5} />
                            </span>
                            {!isCollapsed && (
                                <span className={styles.textStack}>
                                    <span className={styles.linkLabel}>{item.name}</span>
                                    <span className={styles.linkSubtitle}>{item.subtitle}</span>
                                </span>
                            )}
                            {isCollapsed && (
                                <span className={styles.tooltip}>
                                    <span className={styles.tooltipTitle}>{item.name}</span>
                                    <span className={styles.tooltipSubtitle}>{item.subtitle}</span>
                                </span>
                            )}
                        </Link>
                    );
                })}
                {!isCollapsed && <div className={styles.sectionLabel}>System</div>}
                {systemItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.link} ${isActive ? styles.active : ''} ${isCollapsed ? styles.linkCollapsed : ''}`}
                            title={isCollapsed ? item.name : ''}
                        >
                            <span className={styles.iconWrap}>
                                <Icon size={20} strokeWidth={1.5} />
                            </span>
                            {!isCollapsed && (
                                <span className={styles.textStack}>
                                    <span className={styles.linkLabel}>{item.name}</span>
                                    <span className={styles.linkSubtitle}>{item.subtitle}</span>
                                </span>
                            )}
                            {isCollapsed && (
                                <span className={styles.tooltip}>
                                    <span className={styles.tooltipTitle}>{item.name}</span>
                                    <span className={styles.tooltipSubtitle}>{item.subtitle}</span>
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav >
            <div className={styles.footer}>
                <button
                    onClick={() => setIsCustomizing(true)}
                    className={styles.customizeButton}
                    title="Customize Menu"
                >
                    <Settings size={18} strokeWidth={1.5} />
                    {!isCollapsed && <span>Customize</span>}
                </button>

            </div>

            {/* Customization Modal */}
            {isCustomizing && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    backdropFilter: 'blur(2px)' // subtle blur for modal bg
                }}>
                    <div style={{
                        backgroundColor: '#0f172a', // Dark modal to match theme
                        borderRadius: '0.75rem', padding: '1.5rem',
                        width: '320px',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Settings size={18} /> Customize Menu Order
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '350px', overflowY: 'auto' }}>
                            {items.map((item, index) => (
                                <div key={item.name} style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)'
                                }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: '#e2e8f0' }}>
                                        <item.icon size={16} /> {item.name}
                                    </span>
                                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                                        <button
                                            disabled={index === 0}
                                            onClick={() => handleMove(index, 'up')}
                                            style={{ padding: '0.4rem', borderRadius: '0.25rem', cursor: index === 0 ? 'not-allowed' : 'pointer', opacity: index === 0 ? 0.3 : 1, background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }}
                                        >
                                            ⬆️
                                        </button>
                                        <button
                                            disabled={index === items.length - 1}
                                            onClick={() => handleMove(index, 'down')}
                                            style={{ padding: '0.4rem', borderRadius: '0.25rem', cursor: index === items.length - 1 ? 'not-allowed' : 'pointer', opacity: index === items.length - 1 ? 0.3 : 1, background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }}
                                        >
                                            ⬇️
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                            <button onClick={() => setIsCustomizing(false)} style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', background: 'transparent', color: '#94a3b8', border: '1px solid #334155', cursor: 'pointer' }}>Cancel</button>
                            <button onClick={handleSave} style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', background: '#3b82f6', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 500 }}>Save Order</button>
                        </div>
                    </div>
                </div>
            )}
        </aside >
    );
}
