'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateAdminPassword(formData: FormData) {
    const currentPassword = formData.get('currentPassword') as string;
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (newPassword !== confirmPassword) {
        throw new Error('New passwords do not match');
    }

    // Verify current password
    // Check DB first using findFirst to handle compound key with null userId
    const settings = await prisma.settings.findFirst({
        where: {
            key: 'admin_password',
            userId: null
        },
    });
    const storedPassword = settings?.value || process.env.ADMIN_PASSWORD || 'admin123';

    if (currentPassword !== storedPassword) {
        throw new Error('Incorrect current password');
    }

    // Update password
    if (settings) {
        await prisma.settings.update({
            where: { id: settings.id },
            data: { value: newPassword }
        });
    } else {
        await prisma.settings.create({
            data: {
                key: 'admin_password',
                value: newPassword,
                userId: null
            },
        });
    }

    return { success: true };
}

async function setGlobalSetting(key: string, value: string) {
    const existing = await prisma.settings.findFirst({
        where: { key, userId: null }
    });

    if (existing) {
        await prisma.settings.update({
            where: { id: existing.id },
            data: { value }
        });
    } else {
        await prisma.settings.create({
            data: { key, value, userId: null }
        });
    }
}

export async function updateGlobalSettings(formData: FormData) {
    const companyName = formData.get('companyName') as string;
    const supportEmail = formData.get('supportEmail') as string;
    const themeColor = formData.get('themeColor') as string;

    await setGlobalSetting('company_name', companyName);
    await setGlobalSetting('support_email', supportEmail);
    await setGlobalSetting('theme_color', themeColor);

    revalidatePath('/');
    return { success: true };
}
