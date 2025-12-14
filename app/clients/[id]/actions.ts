'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateClientDetails(clientId: number, formData: FormData) {
    const contactName = formData.get('contactName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;
    const propertyCondition = formData.get('propertyCondition') as string;
    const propertyLink = formData.get('propertyLink') as string;
    const askingPrice = formData.get('askingPrice') as string;
    const ourOffer = formData.get('ourOffer') as string;

    await prisma.client.update({
        where: { id: clientId },
        data: {
            companyName: contactName,
            contactName,
            email,
            phone,
            address,
            propertyCondition,
            propertyLink,
            askingPrice: askingPrice ? parseFloat(askingPrice) : null,
            ourOffer: ourOffer ? parseFloat(ourOffer) : null,
            arv: formData.get('arv') ? parseFloat(formData.get('arv') as string) : null,
        },
    });

    revalidatePath(`/clients/${clientId}`);
}

export async function addNote(clientId: number, content: string) {
    if (!content.trim()) return;

    await prisma.note.create({
        data: {
            content,
            clientId,
        },
    });
    revalidatePath(`/clients/${clientId}`);
}

export async function deleteNote(noteId: number, clientId: number) {
    await prisma.note.delete({
        where: { id: noteId },
    });
    revalidatePath(`/clients/${clientId}`);
}

// Edit an existing client note
export async function editClientNote(noteId: number, content: string) {
    if (!content.trim()) return;
    // Update note content
    const note = await prisma.note.update({
        where: { id: noteId },
        data: { content: content.trim() },
    });
    // Revalidate the client page using the note's clientId
    if (note.clientId) {
        revalidatePath(`/clients/${note.clientId}`);
    }
}

// Delete a client note (wrapper without needing clientId)
export async function deleteClientNote(noteId: number) {
    const note = await prisma.note.findUnique({ where: { id: noteId } });
    if (!note) return;
    await prisma.note.delete({ where: { id: noteId } });
    if (note.clientId) {
        revalidatePath(`/clients/${note.clientId}`);
    }
}



export async function updateMotivation(clientId: number, score: number, note: string, condition: string) {
    await prisma.client.update({
        where: { id: clientId },
        data: {
            motivationScore: score,
            motivationNote: note,
            propertyCondition: condition,
        },
    });
    revalidatePath(`/clients/${clientId}`);
}

export async function updateManagementInfo(clientId: number, comments: string, tags: string) {
    await prisma.client.update({
        where: { id: clientId },
        data: {
            internalComments: comments,
            internalTags: tags,
        },
    });
    revalidatePath(`/clients/${clientId}`);
}

export async function updateClientStatus(clientId: number, status: string) {
    await prisma.client.update({
        where: { id: clientId },
        data: { status },
    });
    revalidatePath('/clients');
    revalidatePath(`/clients/${clientId}`);
}
