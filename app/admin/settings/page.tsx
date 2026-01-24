import { prisma } from '@/lib/prisma';
import SettingsForm from './SettingsForm';

<<<<<<< HEAD
export const dynamic = 'force-dynamic';

=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
export default async function SettingsPage() {
    // Fetch settings
    const settingsList = await prisma.settings.findMany();

    // Convert array to object
    const settings = settingsList.reduce((acc: any, curr: any) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {});

    // Map to expected props
    const initialSettings = {
        companyName: settings.company_name || 'Wholesale CRM',
        supportEmail: settings.support_email || '',
        themeColor: settings.theme_color || '#4f46e5',
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', color: '#1e293b' }}>
                Admin Settings
            </h1>
            <SettingsForm initialSettings={initialSettings} />
        </div>
    );
}
