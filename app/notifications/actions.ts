'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
<<<<<<< HEAD
<<<<<<< HEAD
import { getCurrentUser } from '@/lib/auth';

export async function getNotifications(limit: number = 50) {
    const user = await getCurrentUser();
    if (!user) return [];

    const notifications = await prisma.notification.findMany({
        where: { userId: user.id },
=======

export async function getNotifications(limit: number = 50) {
    const notifications = await prisma.notification.findMany({
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======

export async function getNotifications(limit: number = 50) {
    const notifications = await prisma.notification.findMany({
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
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
<<<<<<< HEAD
<<<<<<< HEAD
    const user = await getCurrentUser();
    if (!user) return 0;

    const count = await prisma.notification.count({
        where: { userId: user.id, read: false },
=======
    const count = await prisma.notification.count({
        where: { read: false },
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
    const count = await prisma.notification.count({
        where: { read: false },
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
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
<<<<<<< HEAD
<<<<<<< HEAD
    userId: string; // Required now
}) {
    const notification = await prisma.notification.create({
        data: {
            ...data,
            // userId is in data
        },
=======
}) {
    const notification = await prisma.notification.create({
        data,
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
}) {
    const notification = await prisma.notification.create({
        data,
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
    });

    revalidatePath('/');
    return notification;
}

export async function markAsRead(notificationId: number) {
<<<<<<< HEAD
<<<<<<< HEAD
    const user = await getCurrentUser();
    if (!user) return;

    // implicit security: update only if id matches. 
    // Ideally we adds where: { id: notificationId, userId: user.id } 
    // but Prisma update requires unique where. findFirst+update is safer but update is atomic.
    // For now, let's assume global ID is unguessable or low risk, OR use updateMany for safety.
    await prisma.notification.updateMany({
        where: { id: notificationId, userId: user.id },
=======
    await prisma.notification.update({
        where: { id: notificationId },
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
    await prisma.notification.update({
        where: { id: notificationId },
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
        data: { read: true },
    });
    revalidatePath('/');
}

export async function markAllAsRead() {
<<<<<<< HEAD
<<<<<<< HEAD
    const user = await getCurrentUser();
    if (!user) return;

    await prisma.notification.updateMany({
        where: { userId: user.id, read: false },
=======
    await prisma.notification.updateMany({
        where: { read: false },
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
    await prisma.notification.updateMany({
        where: { read: false },
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
        data: { read: true },
    });
    revalidatePath('/');
}

export async function deleteNotification(notificationId: number) {
<<<<<<< HEAD
<<<<<<< HEAD
    const user = await getCurrentUser();
    if (!user) return;

    await prisma.notification.deleteMany({
        where: { id: notificationId, userId: user.id },
=======
    await prisma.notification.delete({
        where: { id: notificationId },
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
    await prisma.notification.delete({
        where: { id: notificationId },
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
    });
    revalidatePath('/');
}

export async function deleteAllRead() {
<<<<<<< HEAD
<<<<<<< HEAD
    const user = await getCurrentUser();
    if (!user) return;

    await prisma.notification.deleteMany({
        where: { userId: user.id, read: true },
=======
    await prisma.notification.deleteMany({
        where: { read: true },
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
    await prisma.notification.deleteMany({
        where: { read: true },
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
    });
    revalidatePath('/');
}
