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
<<<<<<< HEAD
    // Check DB first using findFirst to handle compound key with null userId
    const settings = await prisma.settings.findFirst({
        where: {
            key: 'admin_password',
            userId: null
        },
=======
    // Check DB first
    const settings = await prisma.settings.findUnique({
        where: { key: 'admin_password' },
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
    });
    const storedPassword = settings?.value || process.env.ADMIN_PASSWORD || 'admin123';

    if (currentPassword !== storedPassword) {
        throw new Error('Incorrect current password');
    }

    // Update password
<<<<<<< HEAD
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
=======
    await prisma.settings.upsert({
        where: { key: 'admin_password' },
        update: { value: newPassword },
        create: { key: 'admin_password', value: newPassword },
    });

    return { success: true };
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
}

export async function updateGlobalSettings(formData: FormData) {
    const companyName = formData.get('companyName') as string;
    const supportEmail = formData.get('supportEmail') as string;
    const themeColor = formData.get('themeColor') as string;

<<<<<<< HEAD
    await setGlobalSetting('company_name', companyName);
    await setGlobalSetting('support_email', supportEmail);
    await setGlobalSetting('theme_color', themeColor);
=======
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
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e

    revalidatePath('/');
    return { success: true };
}
