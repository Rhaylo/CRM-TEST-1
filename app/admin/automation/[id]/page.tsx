import { prisma } from '@/lib/prisma';
import AutomationRuleForm from '../AutomationRuleForm';
import styles from '../../admin.module.css';
import { notFound } from 'next/navigation';

export default async function EditAutomationRulePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const rule = await prisma.automationRule.findUnique({
        where: { id: parseInt(id) }
    });

    if (!rule) {
        notFound();
    }

    return (
        <div>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Edit Automation Rule</h1>
                <p className={styles.pageDescription}>Modify existing workflow configuration</p>
            </div>
            <AutomationRuleForm initialData={rule} isEditing={true} />
        </div>
    );
}
