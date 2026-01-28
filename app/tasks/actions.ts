'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { triggerAutomation } from '@/app/lib/automation';
import { logActivity } from '@/lib/activity';

export async function createTask(formData: FormData) {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const notes = formData.get('notes') as string;
    const clientId = formData.get('clientId') as string;
    const dueDate = formData.get('dueDate') as string;
    const dueTime = formData.get('dueTime') as string;
    const priority = formData.get('priority') as string;
    const status = formData.get('status') as string;

    if (!title || !clientId || !dueDate) {
        throw new Error('Title, client, and due date are required');
    }

    const task = await prisma.task.create({
        data: {
            title,
            description,
            // notes field is removed from schema, handled by Note model now
            // But we might want to create an initial note if provided
            clientId: parseInt(clientId),
            dueDate: new Date(dueDate),
            dueTime,
            priority: priority || 'Medium',
            status: status || 'Not Started',
            completed: status === 'Completed',
        },
    });

    await logActivity({
        action: 'created',
        entityType: 'task',
        entityId: task.id,
        summary: `Task created: ${title}`,
        metadata: { clientId: task.clientId, priority: task.priority },
    });

    // Create initial note if provided
    if (notes && notes.trim()) {
        const note = await prisma.note.create({
            data: {
                content: notes,
                taskId: task.id,
            }
        });

        await logActivity({
            action: 'created',
            entityType: 'note',
            entityId: note.id,
            summary: `Note added to task #${task.id}`,
            metadata: { taskId: task.id },
        });
    }

    // Trigger automation
    await triggerAutomation('task_created', task);

    revalidatePath('/tasks');
    return task;
}

export async function updateTask(taskId: number, formData: FormData) {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const clientId = formData.get('clientId') as string;
    const dueDate = formData.get('dueDate') as string;
    const dueTime = formData.get('dueTime') as string;
    const priority = formData.get('priority') as string;
    const status = formData.get('status') as string;
    const completed = status === 'Completed';

    const task = await prisma.task.update({
        where: { id: taskId },
        data: {
            title,
            description,
            clientId: parseInt(clientId),
            dueDate: new Date(dueDate),
            dueTime,
            priority,
            status,
            completed,
        },
    });

    await logActivity({
        action: 'updated',
        entityType: 'task',
        entityId: taskId,
        summary: `Task updated: ${title}`,
        metadata: { clientId: task.clientId, status: task.status },
    });

    if (completed) {
        await triggerAutomation('task_completed', task);
    }

    revalidatePath('/tasks');
}

export async function deleteTask(taskId: number) {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    await prisma.task.delete({
        where: { id: taskId },
    });

    await logActivity({
        action: 'deleted',
        entityType: 'task',
        entityId: taskId,
        summary: 'Task deleted',
        metadata: { clientId: task?.clientId ?? null },
    });

    revalidatePath('/tasks');
}

export async function markTaskComplete(taskId: number) {
    const task = await prisma.task.update({
        where: { id: taskId },
        data: {
            status: 'Completed',
            completed: true,
        },
        include: { client: true },
    });

    await logActivity({
        action: 'completed',
        entityType: 'task',
        entityId: taskId,
        summary: `Task completed: ${task.title}`,
        metadata: { clientId: task.clientId },
    });

    await triggerAutomation('task_completed', task);

    revalidatePath('/tasks');
    return task;
}
