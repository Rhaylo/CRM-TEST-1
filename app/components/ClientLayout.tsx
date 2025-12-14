'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = pathname === '/login';
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    if (isLoginPage) {
        return <>{children}</>;
    }

    return (
        <div className="layout-container">
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />
            <div
                className="main-content"
                style={{ marginLeft: isSidebarCollapsed ? '80px' : '260px', transition: 'margin-left 0.3s ease' }}
            >
                <Header />
                <main className="page-content">
                    {children}
                </main>
            </div>
        </div>
    );
}
