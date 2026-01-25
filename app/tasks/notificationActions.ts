'use server';

import { prisma } from '@/lib/prisma';
import { createNotification } from '@/app/notifications/actions';

export async function checkOverdueTasks() {
    const now = new Date();

    const overdueTasks = await prisma.task.findMany({
        where: {
            completed: false,
            dueDate: {
                lt: now,
            },
        },
        include: {
            client: true,
        },
    });

    for (const task of overdueTasks) {
        if (!task.userId) continue;

        const existingNotification = await prisma.notification.findFirst({
            where: {
                taskId: task.id,
                type: 'task',
                title: {
                    contains: 'Tarea Vencida',
                },
            },
        });

        if (!existingNotification) {
            await createNotification({
                title: 'Tarea Vencida',
                message: `"${task.title}" para ${task.client.companyName} está vencida`,
                type: 'task',
                actionUrl: `/clients/${task.clientId}`,
                taskId: task.id,
                clientId: task.clientId,
                userId: task.userId,
            });
        }
    }

    return { checked: overdueTasks.length };
}

export async function checkUpcomingTasks() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const upcomingTasks = await prisma.task.findMany({
        where: {
            completed: false,
            dueDate: {
                gte: now,
                lte: tomorrow,
            },
        },
        include: {
            client: true,
        },
    });

    for (const task of upcomingTasks) {
        if (!task.userId) continue;

        const existingNotification = await prisma.notification.findFirst({
            where: {
                taskId: task.id,
                type: 'task',
                title: {
                    contains: 'Tarea Próxima',
                },
            },
        });

        if (!existingNotification) {
            await createNotification({
                title: 'Tarea Próxima a Vencer',
                message: `"${task.title}" para ${task.client.companyName} vence pronto`,
                type: 'task',
                actionUrl: `/clients/${task.clientId}`,
                taskId: task.id,
                clientId: task.clientId,
                userId: task.userId,
            });
        }
    }

    return { checked: upcomingTasks.length };
}
