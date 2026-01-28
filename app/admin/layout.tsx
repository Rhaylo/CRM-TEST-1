import AdminGate from './AdminGate';
import AdminSidebar from './AdminSidebar';
import styles from './admin.module.css';
import { prisma } from '@/lib/prisma';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const [automationActive, automationTotal, scheduleActive, scheduleTotal, templateTotal] = await Promise.all([
        prisma.automationRule.count({ where: { enabled: true } }),
        prisma.automationRule.count(),
        prisma.scheduledTask.count({ where: { enabled: true } }),
        prisma.scheduledTask.count(),
        prisma.emailTemplate.count(),
    ]);

    return (
        <AdminGate>
            <div className={styles.adminLayout}>
                <AdminSidebar
                    counts={{
                        automations: { active: automationActive, total: automationTotal },
                        schedules: { active: scheduleActive, total: scheduleTotal },
                        templates: templateTotal,
                    }}
                />
                <main className={styles.mainContent}>
                    {children}
                </main>
            </div>
        </AdminGate>
    );
}
