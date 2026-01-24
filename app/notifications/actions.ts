'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth';

export async function getNotifications(limit: number = 50) {
    const user = await getCurrentUser();
    if (!user) return [];

    const notifications = await prisma.notification.findMany({
        where: { userId: user.id },
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
    const user = await getCurrentUser();
    if (!user) return 0;

    const count = await prisma.notification.count({
        where: { userId: user.id, read: false },
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
    userId: string; // Required now
}) {
    const notification = await prisma.notification.create({
        data: {
            ...data,
            // userId is in data
        },
    });

    revalidatePath('/');
    return notification;
}

export async function markAsRead(notificationId: number) {
    const user = await getCurrentUser();
    if (!user) return;

    // implicit security: update only if id matches. 
    // Ideally we adds where: { id: notificationId, userId: user.id } 
    // but Prisma update requires unique where. findFirst+update is safer but update is atomic.
    // For now, let's assume global ID is unguessable or low risk, OR use updateMany for safety.
    await prisma.notification.updateMany({
        where: { id: notificationId, userId: user.id },
        data: { read: true },
    });
    revalidatePath('/');
}

export async function markAllAsRead() {
    const user = await getCurrentUser();
    if (!user) return;

    await prisma.notification.updateMany({
        where: { userId: user.id, read: false },
        data: { read: true },
    });
    revalidatePath('/');
}

export async function deleteNotification(notificationId: number) {
    const user = await getCurrentUser();
    if (!user) return;

    await prisma.notification.deleteMany({
        where: { id: notificationId, userId: user.id },
    });
    revalidatePath('/');
}

export async function deleteAllRead() {
    const user = await getCurrentUser();
    if (!user) return;

    await prisma.notification.deleteMany({
        where: { userId: user.id, read: true },
    });
    revalidatePath('/');
}
