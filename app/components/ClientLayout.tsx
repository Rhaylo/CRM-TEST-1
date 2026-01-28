'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = pathname === '/login';
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Add state for mobile menu
    const sidebarOffset = isSidebarCollapsed ? '80px' : '260px';

    if (isLoginPage) {
        return <>{children}</>;
    }

    return (
        <div className="layout-container" style={{ ['--sidebar-offset' as any]: sidebarOffset }}>
            {/* Sidebar handling: 
                - Desktop: controlled by isSidebarCollapsed 
                - Mobile: controlled by isMobileMenuOpen (overlay) 
            */}
            <div className={`sidebar-wrapper ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                <Sidebar
                    isCollapsed={isSidebarCollapsed}
                    toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    closeMobileMenu={() => setIsMobileMenuOpen(false)}
                />
            </div>

            {/* Mobile Overlay Backdrop */}
            {isMobileMenuOpen && (
                <div
                    className="mobile-backdrop"
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(2, 6, 23, 0.55)',
                        zIndex: 40,
                        backdropFilter: 'blur(2px)'
                    }}
                />
            )}

            <div
                className="main-content"
                style={{
                    // On desktop, margin depends on collapse state. On mobile, margin is usually 0 or small.
                    // We'll let CSS handle the media query for margin-left if possible, or use window match logic in useEffect if strict needed.
                    // For now, simple logic:
                }}
            >
                <Header
                    toggleSidebar={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                />
                <main className="page-content">
                    {children}
                </main>
            </div>

            <style jsx global>{`
                .layout-container {
                    display: flex;
                    min-height: 100vh;
                }
                .sidebar-wrapper {
                    z-index: 50;
                }
                .main-content {
                    flex: 1;
                    transition: margin-left 0.3s ease;
                    margin-left: ${sidebarOffset};
                }
                
                @media (max-width: 768px) {
                    .main-content {
                        margin-left: 0 !important;
                    }
                    .sidebar-wrapper {
                        position: fixed;
                        top: 0;
                        left: 0;
                        bottom: 0;
                        transform: translateX(-100%);
                        transition: transform 0.3s ease;
                        height: 100%;
                    }
                    .sidebar-wrapper.mobile-open {
                        transform: translateX(0);
                    }
                }
            `}</style>
        </div>
    );
}
