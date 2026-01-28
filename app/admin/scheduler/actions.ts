'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { logActivity } from '@/lib/activity';

export async function createScheduledTask(data: {
    name: string;
    description?: string;
    schedule: string;
    action: string;
}) {
    const task = await prisma.scheduledTask.create({
        data: {
            name: data.name,
            description: data.description,
            schedule: data.schedule,
            action: data.action,
            enabled: true,
        },
    });

    await logActivity({
        action: 'created',
        entityType: 'scheduled_task',
        entityId: task.id,
        summary: `Scheduled task created: ${task.name}`,
        metadata: { schedule: task.schedule },
    });

    revalidatePath('/admin');
    return task;
}

export async function updateScheduledTask(id: number, data: {
    name?: string;
    description?: string;
    schedule?: string;
    action?: string;
    enabled?: boolean;
}) {
    const task = await prisma.scheduledTask.update({
        where: { id },
        data,
    });

    await logActivity({
        action: 'updated',
        entityType: 'scheduled_task',
        entityId: task.id,
        summary: `Scheduled task updated: ${task.name}`,
    });

    revalidatePath('/admin');
    return task;
}

export async function toggleScheduledTask(id: number, enabled: boolean) {
    await prisma.scheduledTask.update({
        where: { id },
        data: { enabled },
    });

    await logActivity({
        action: enabled ? 'enabled' : 'disabled',
        entityType: 'scheduled_task',
        entityId: id,
        summary: `Scheduled task ${enabled ? 'enabled' : 'disabled'} #${id}`,
    });

    revalidatePath('/admin');
}

export async function deleteScheduledTask(id: number) {
    await prisma.scheduledTask.delete({
        where: { id },
    });

    await logActivity({
        action: 'deleted',
        entityType: 'scheduled_task',
        entityId: id,
        summary: `Scheduled task deleted #${id}`,
    });

    revalidatePath('/admin');
}

export async function runScheduledTask(id: number) {
    const task = await prisma.scheduledTask.findUnique({
        where: { id },
    });

    if (!task) throw new Error('Task not found');

    // Update last run time
    await prisma.scheduledTask.update({
        where: { id },
        data: { lastRun: new Date() },
    });

    // Parse and execute action
    try {
        const action = JSON.parse(task.action);

        if (action.type === 'create_task') {
            await prisma.task.create({
                data: {
                    title: action.title ?? 'Scheduled Task',
                    priority: action.priority ?? 'Medium',
                    status: 'Pending',
                    dueDate: new Date().toISOString(),
                } as any,
            });
        } else if (action.type === 'check_lead_age') {
            // Find leads (Deals in 'Lead' stage) older than X days
            const days = action.days || 7;
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - days);

            const oldLeads = await prisma.deal.findMany({
                where: {
                    stage: 'Lead',
                    createdAt: {
                        lt: cutoffDate
                    },
                    // Optional: Check if they don't have recent tasks?
                },
                include: { client: true }
            });

            // Create tasks for each old lead
            for (const lead of oldLeads) {
                await prisma.task.create({
                    data: {
                        title: `Follow up: ${lead.client.companyName} (${days} days old)`,
                        description: `This lead has been inactive for ${days} days. Please follow up.`,
                        priority: 'High',
                        status: 'Not Started',
                        clientId: lead.clientId,
                        dueDate: new Date(),
                    }
                });
            }

            console.log(`Checked lead age: Found ${oldLeads.length} old leads.`);
        } else if (action.type === 'check_task_due') {
            // Find tasks due within X hours
            const hoursBefore = action.hoursBefore || 24;
            const now = new Date();
            const targetDate = new Date(now.getTime() + (hoursBefore * 60 * 60 * 1000));

            const dueTasks = await prisma.task.findMany({
                where: {
                    dueDate: {
                        gte: now,
                        lte: targetDate
                    },
                    status: {
                        not: 'Completed'
                    },
                    completed: false
                }
            });

            // Add reminder notes
            for (const dueTask of dueTasks) {
                await prisma.note.create({
                    data: {
                        content: `⚠️ Automated Reminder: This task is due in less than ${hoursBefore} hours.`,
                        taskId: dueTask.id,
                        clientId: dueTask.clientId
                    }
                });
            }

            console.log(`Checked task due: Found ${dueTasks.length} tasks due soon.`);
        }

        // Log execution success
        await prisma.automationExecution.create({
            data: {
                // ruleId is optional now
                status: 'Success',
                metadata: JSON.stringify({ taskId: task.id, action: action.type }),
                duration: 0
            }
        });

        await logActivity({
            action: 'ran',
            entityType: 'scheduled_task',
            entityId: task.id,
            summary: `Scheduled task ran: ${task.name}`,
            metadata: { status: 'success', action: action.type },
        });

    } catch (error) {
        console.error('Failed to execute scheduled task:', error);
        // Log failure
        await prisma.automationExecution.create({
            data: {
                status: 'Failed',
                error: String(error),
                metadata: JSON.stringify({ taskId: task.id }),
                duration: 0
            }
        });

        await logActivity({
            action: 'ran',
            entityType: 'scheduled_task',
            entityId: task.id,
            summary: `Scheduled task failed: ${task.name}`,
            metadata: { status: 'failed', error: String(error) },
        });
    }

    revalidatePath('/admin');
    return { success: true };
}
