'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = pathname === '/login';
    if (isLoginPage) {
        return <>{children}</>;
    }

    return (
        <div className="layout-container">
            <div className="main-content">
                <Header />
                <main className="page-content">
                    {children}
                </main>
            </div>
        </div>
    );
}
