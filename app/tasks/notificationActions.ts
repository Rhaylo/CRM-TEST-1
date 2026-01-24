'use server';

import { prisma } from '@/lib/prisma';
import { createNotification } from '@/app/notifications/actions';

export async function checkOverdueTasks() {
    const now = new Date();

    // Find tasks that are overdue and not completed
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

    // Create notifications for overdue tasks
    for (const task of overdueTasks) {
        // Check if notification already exists for this task
        const existingNotification = await prisma.notification.findFirst({
            where: {
                taskId: task.id,
                type: 'task',
                title: {
                    contains: 'Tarea Vencida',
                },
            },
        });

        // Only create if doesn't exist
        if (!existingNotification) {
            await createNotification({
                title: 'Tarea Vencida',
                message: `"${task.title}" para ${task.client.companyName} está vencida`,
                type: 'task',
                actionUrl: `/clients/${task.clientId}`,
                taskId: task.id,
                clientId: task.clientId,
<<<<<<< HEAD
                userId: task.userId || ''
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
            });
        }
    }

    return { checked: overdueTasks.length };
}

export async function checkUpcomingTasks() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Find tasks due within 24 hours
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

    // Create notifications for upcoming tasks
    for (const task of upcomingTasks) {
        // Check if notification already exists
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
<<<<<<< HEAD
                userId: task.userId || ''
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
            });
        }
    }

    return { checked: upcomingTasks.length };
}
