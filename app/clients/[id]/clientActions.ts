'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { logActivity } from '@/lib/activity';

export async function sendToDeal(clientId: number, formData: FormData) {
    const amount = parseFloat(formData.get('amount') as string);
    const address = formData.get('address') as string;
    const owner = formData.get('owner') as string;

    const deal = await prisma.deal.create({
        data: {
            clientId,
            amount,
            products: address, // Store address in products field
            owner,
            stage: 'Pending',
        },
    });

    await logActivity({
        action: 'created',
        entityType: 'deal',
        entityId: deal.id,
        summary: `Deal created for client #${clientId}`,
        metadata: { amount, owner },
    });

    redirect('/deals');
}

export async function sendToContract(clientId: number, formData: FormData) {
    const amount = parseFloat(formData.get('amount') as string);
    const products = formData.get('products') as string;
    const owner = formData.get('owner') as string;

    // Create Deal first
    const deal = await prisma.deal.create({
        data: {
            clientId,
            amount,
            products,
            owner,
            stage: 'Contract In',
        },
    });

    // Create Contract linked to the deal
    const contract = await prisma.contract.create({
        data: {
            dealId: deal.id,
            clientId,
            status: 'In',
            dateSent: new Date(),
        },
    });

    await logActivity({
        action: 'created',
        entityType: 'contract',
        entityId: contract.id,
        summary: `Contract created for client #${clientId}`,
        metadata: { dealId: deal.id },
    });

    redirect('/contracts');
}
