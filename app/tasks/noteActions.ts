'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function createNote(taskId: number, content: string) {
    if (!content.trim()) {
        throw new Error('Note content cannot be empty');
    }

    const note = await prisma.note.create({
        data: {
            content: content.trim(),
            taskId,
        },
    });

    revalidatePath('/tasks');
    return note;
}

export async function deleteNote(noteId: number) {
    await prisma.note.delete({
        where: { id: noteId },
    });

    revalidatePath('/tasks');
}
