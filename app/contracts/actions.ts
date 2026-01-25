'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { updateDealStage } from '../deals/actions';

export async function updateContractStatus(id: number, status: string) {
    await prisma.contract.update({
        where: { id },
        data: { status },
    });

    const contract = await prisma.contract.findUnique({
        where: { id },
        include: { deal: true },
    });

    if (contract && contract.deal) {
        let newDealStage = contract.deal.stage;

        if (status === 'Sent') {
            newDealStage = 'Contract Sent';
        } else if (status === 'Under Contract') {
            newDealStage = 'Under Contract';
        } else if (status === 'Marketing') {
            newDealStage = 'Marketing';
        } else if (status === 'Buyer Found') {
            newDealStage = 'Buyer Found';
        } else if (status === 'Sold') {
            newDealStage = 'Sold';
        }

        if (status === 'Out') newDealStage = 'Contract Sent';
        if (status === 'In' || status === 'Signed') newDealStage = 'Under Contract';

        if (newDealStage !== contract.deal.stage) {
            await updateDealStage(contract.dealId, newDealStage);
        }
    }

    revalidatePath('/contracts');
    revalidatePath('/clients');
}

export async function uploadContractDocument(id: number, filename: string) {
    await prisma.contract.update({
        where: { id },
        data: { documentPath: `/uploads/${filename}` },
    });
    revalidatePath('/contracts');
}

export async function updateContractDocumentName(id: number, name: string) {
    await prisma.contract.update({
        where: { id },
        data: { documentName: name },
    });
    revalidatePath('/contracts');
}
