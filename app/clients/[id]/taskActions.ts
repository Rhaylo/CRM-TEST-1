'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createTask(clientId: number, formData: FormData) {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const dueDate = formData.get('dueDate') as string;

    if (!title || !dueDate) {
        throw new Error('Title and due date are required');
    }

    await prisma.task.create({
        data: {
            title,
            description,
            dueDate: new Date(dueDate),
            clientId,
        },
    });

    revalidatePath(`/clients/${clientId}`);
}

export async function toggleTaskComplete(taskId: number, completed: boolean) {
    await prisma.task.update({
        where: { id: taskId },
        data: { completed },
    });

    revalidatePath('/clients');
}


export async function deleteTask(taskId: number) {
    await prisma.task.delete({
        where: { id: taskId },
    });

    revalidatePath('/clients');
}

export async function deleteTaskNote(noteId: number) {
    await prisma.note.delete({
        where: { id: noteId },
    });

    revalidatePath('/clients');
}
