'use server';

import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export async function createDealFromClient(clientId: number, formData: FormData) {
    const arv = parseFloat(formData.get('arv') as string);
    const repairs = parseFloat(formData.get('repairs') as string);
    const wholesaleOffer = parseFloat(formData.get('wholesaleOffer') as string);

    const client = await prisma.client.findUnique({
        where: { id: clientId },
    });

    if (!client) {
        throw new Error('Client not found');
    }

    await prisma.client.update({
        where: { id: clientId },
        data: {
            arv,
            repairs,
        },
    });

    const ourOffer = client.ourOffer || 0;
    const assignmentFee = wholesaleOffer - ourOffer;

    await prisma.deal.create({
        data: {
            clientId,
            amount: wholesaleOffer,
            assignmentFee: assignmentFee > 0 ? assignmentFee : null,
            products: `${client.address || 'Property'}`,
            owner: 'Sales Team',
            stage: 'Pending',
        },
    });

    redirect('/deals');
}
