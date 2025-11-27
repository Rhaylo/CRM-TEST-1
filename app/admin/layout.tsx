import AdminGate from './AdminGate';
import AdminSidebar from './AdminSidebar';
import styles from './admin.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminGate>
            <div className={styles.adminLayout}>
                <AdminSidebar />
                <main className={styles.mainContent}>
                    {children}
                </main>
            </div>
        </AdminGate>
    );
}
