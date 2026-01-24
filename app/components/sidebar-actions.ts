'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

const SIDEBAR_ORDER_KEY = 'sidebar_order';

export async function getSidebarOrder() {
    try {
        const setting = await prisma.settings.findFirst({
            where: { key: SIDEBAR_ORDER_KEY }
        });

        if (setting?.value) {
            return JSON.parse(setting.value) as string[];
        }
        return null;
    } catch (error) {
        console.error('Failed to get sidebar order:', error);
        return null;
    }
}

export async function updateSidebarOrder(newOrder: string[]) {
    try {
        const existing = await prisma.settings.findFirst({
            where: {
                key: SIDEBAR_ORDER_KEY,
                userId: null
            }
        });

        if (existing) {
            await prisma.settings.update({
                where: { id: existing.id },
                data: { value: JSON.stringify(newOrder) }
            });
        } else {
            await prisma.settings.create({
                data: {
                    key: SIDEBAR_ORDER_KEY,
                    value: JSON.stringify(newOrder),
                    userId: null
                }
            });
        }
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Failed to update sidebar order:', error);
        return { success: false, error: 'Failed to save order' };
    }
}
