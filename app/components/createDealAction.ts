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

    // Update client with latest figures
    await prisma.client.update({
        where: { id: clientId },
        data: {
            arv,
            // @ts-ignore
            repairs,
            // If wholesaleOffer is meant to be the asking price for the buyer, we update it there?
            // User context suggests wholesaleOffer is the deal amount.
        }
    });

    // Calculate assignment fee (Profit)
    // Assignment Fee = Wholesale Offer (Sold Price) - Our Offer (Purchase Price)
    const ourOffer = client.ourOffer || 0;
    const assignmentFee = wholesaleOffer - ourOffer;

    // Create the deal with client information
    await prisma.deal.create({
        data: {
            clientId,
            amount: wholesaleOffer,
            assignmentFee: null, // Let the board calculate potential profit until we have a real buyer spread
            products: `${client.address || 'Property'}`,
            owner: 'Sales Team',
            stage: 'Pending',
        },
    });

    redirect('/deals');
}
