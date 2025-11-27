'use server';

import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export async function createDealFromClient(clientId: number, formData: FormData) {
    const arv = parseFloat(formData.get('arv') as string);
    const repairs = parseFloat(formData.get('repairs') as string);
    const wholesaleOffer = parseFloat(formData.get('wholesaleOffer') as string);

    // Get client info to populate deal
    const client = await prisma.client.findUnique({
        where: { id: clientId },
    });

    if (!client) {
        throw new Error('Client not found');
    }

    // Create the deal with client information
    await prisma.deal.create({
        data: {
            clientId,
            amount: wholesaleOffer,
            products: `${client.address || 'Property'} - ARV: $${arv.toLocaleString()}, Repairs: $${repairs.toLocaleString()}`,
            owner: 'Sales Team',
            stage: 'Pending',
        },
    });

    redirect('/deals');
}
