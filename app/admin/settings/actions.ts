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
    // Check DB first
    const settings = await prisma.settings.findUnique({
        where: { key: 'admin_password' },
    });
    const storedPassword = settings?.value || process.env.ADMIN_PASSWORD || 'admin123';

    if (currentPassword !== storedPassword) {
        throw new Error('Incorrect current password');
    }

    // Update password
    await prisma.settings.upsert({
        where: { key: 'admin_password' },
        update: { value: newPassword },
        create: { key: 'admin_password', value: newPassword },
    });

    return { success: true };
}

export async function updateGlobalSettings(formData: FormData) {
    const companyName = formData.get('companyName') as string;
    const supportEmail = formData.get('supportEmail') as string;
    const themeColor = formData.get('themeColor') as string;

    await prisma.settings.upsert({
        where: { key: 'company_name' },
        update: { value: companyName },
        create: { key: 'company_name', value: companyName },
    });

    await prisma.settings.upsert({
        where: { key: 'support_email' },
        update: { value: supportEmail },
        create: { key: 'support_email', value: supportEmail },
    });

    await prisma.settings.upsert({
        where: { key: 'theme_color' },
        update: { value: themeColor },
        create: { key: 'theme_color', value: themeColor },
    });

    revalidatePath('/');
    return { success: true };
}
