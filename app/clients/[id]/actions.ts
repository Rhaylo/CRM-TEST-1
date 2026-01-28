'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { logActivity } from '@/lib/activity';

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
            titleCompanyId: formData.get('titleCompanyId') ? parseInt(formData.get('titleCompanyId') as string) : null,
            escrowAgentId: formData.get('escrowAgentId') ? parseInt(formData.get('escrowAgentId') as string) : null,
        },
    });

    await logActivity({
        action: 'updated',
        entityType: 'client',
        entityId: clientId,
        summary: 'Client details updated',
        metadata: {
            contactName,
            email,
            phone,
        },
    });

    revalidatePath(`/clients/${clientId}`);
}

export async function addNote(clientId: number, content: string) {
    if (!content.trim()) return;

    const note = await prisma.note.create({
        data: {
            content,
            clientId,
        },
    });

    await logActivity({
        action: 'created',
        entityType: 'note',
        entityId: note.id,
        summary: `Note added to client #${clientId}`,
        metadata: { clientId },
    });
    revalidatePath(`/clients/${clientId}`);
}

export async function deleteNote(noteId: number, clientId: number) {
    await prisma.note.delete({
        where: { id: noteId },
    });

    await logActivity({
        action: 'deleted',
        entityType: 'note',
        entityId: noteId,
        summary: `Note deleted from client #${clientId}`,
        metadata: { clientId },
    });
    revalidatePath(`/clients/${clientId}`);
}

export async function editClientNote(noteId: number, content: string) {
    if (!content.trim()) return;
    const note = await prisma.note.update({
        where: { id: noteId },
        data: { content: content.trim() },
    });

    await logActivity({
        action: 'updated',
        entityType: 'note',
        entityId: noteId,
        summary: 'Note updated',
        metadata: { clientId: note.clientId ?? null },
    });
    if (note.clientId) {
        revalidatePath(`/clients/${note.clientId}`);
    }
}

export async function deleteClientNote(noteId: number) {
    const note = await prisma.note.findUnique({ where: { id: noteId } });
    if (!note) return;
    await prisma.note.delete({ where: { id: noteId } });
    await logActivity({
        action: 'deleted',
        entityType: 'note',
        entityId: noteId,
        summary: 'Note deleted',
        metadata: { clientId: note.clientId ?? null },
    });
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

    await logActivity({
        action: 'updated',
        entityType: 'client',
        entityId: clientId,
        summary: 'Client motivation updated',
        metadata: { score, condition },
    });
    revalidatePath(`/clients/${clientId}`);
}

export async function updateClientStatus(clientId: number, status: string) {
    await prisma.client.update({
        where: { id: clientId },
        data: { status },
    });

    await logActivity({
        action: 'status_changed',
        entityType: 'client',
        entityId: clientId,
        summary: `Client status changed to ${status}`,
    });
    revalidatePath(`/clients/${clientId}`);
}

export async function addSeller(clientId: number, formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const relationship = formData.get('relationship') as string;

    if (!name) return;

    await prisma.additionalSeller.create({
        data: {
            clientId,
            name,
            email: email || null,
            phone: phone || null,
            relationship: relationship || null,
        },
    });

    await logActivity({
        action: 'created',
        entityType: 'additional_seller',
        entityId: null,
        summary: `Additional seller added for client #${clientId}`,
        metadata: { clientId, name },
    });

    revalidatePath(`/clients/${clientId}`);
}

export async function deleteSeller(sellerId: number, clientId: number) {
    await prisma.additionalSeller.delete({
        where: { id: sellerId },
    });

    await logActivity({
        action: 'deleted',
        entityType: 'additional_seller',
        entityId: sellerId,
        summary: `Additional seller removed for client #${clientId}`,
        metadata: { clientId },
    });
    revalidatePath(`/clients/${clientId}`);
}

export async function editSeller(clientId: number, sellerId: number, formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const relationship = formData.get('relationship') as string;

    if (!name) return;

    await prisma.additionalSeller.update({
        where: { id: sellerId },
        data: {
            name,
            email: email || null,
            phone: phone || null,
            relationship: relationship || null,
        },
    });

    await logActivity({
        action: 'updated',
        entityType: 'additional_seller',
        entityId: sellerId,
        summary: `Additional seller updated for client #${clientId}`,
        metadata: { clientId, name },
    });

    revalidatePath(`/clients/${clientId}`);
}
