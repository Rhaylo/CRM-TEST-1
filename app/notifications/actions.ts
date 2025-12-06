'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getNotifications(limit: number = 50) {
    const notifications = await prisma.notification.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: {
            client: true,
            task: true,
            deal: true,
        },
    });
    return notifications;
}

export async function getUnreadCount() {
    const count = await prisma.notification.count({
        where: { read: false },
    });
    return count;
}

export async function createNotification(data: {
    title: string;
    message: string;
    type: string;
    actionUrl?: string;
    clientId?: number;
    taskId?: number;
    dealId?: number;
}) {
    const notification = await prisma.notification.create({
        data,
    });

    revalidatePath('/');
    return notification;
}

export async function markAsRead(notificationId: number) {
    await prisma.notification.update({
        where: { id: notificationId },
        data: { read: true },
    });
    revalidatePath('/');
}

export async function markAllAsRead() {
    await prisma.notification.updateMany({
        where: { read: false },
        data: { read: true },
    });
    revalidatePath('/');
}

export async function deleteNotification(notificationId: number) {
    await prisma.notification.delete({
        where: { id: notificationId },
    });
    revalidatePath('/');
}

export async function deleteAllRead() {
    await prisma.notification.deleteMany({
        where: { read: true },
    });
    revalidatePath('/');
}
