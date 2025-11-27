'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateContractStatus(id: number, status: string) {
    // Update the contract status
    await prisma.contract.update({
        where: { id },
        data: { status },
    });

    // Get the contract with its deal
    const contract = await prisma.contract.findUnique({
        where: { id },
        include: { deal: true },
    });

    // Update the deal stage based on contract status
    if (contract && contract.deal) {
        let newDealStage = contract.deal.stage;

        if (status === 'Out') {
            newDealStage = 'Contract Out';
        } else if (status === 'In') {
            newDealStage = 'Contract In';
        } else if (status === 'Signed') {
            newDealStage = 'Complete';
        }

        // Update the deal stage if it changed
        if (newDealStage !== contract.deal.stage) {
            await prisma.deal.update({
                where: { id: contract.dealId },
                data: { stage: newDealStage },
            });
            revalidatePath('/deals');
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
