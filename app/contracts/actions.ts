'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { updateDealStage } from '../deals/actions';

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

        // Legacy support
        if (status === 'Out') newDealStage = 'Contract Sent';
        if (status === 'In' || status === 'Signed') newDealStage = 'Under Contract';


        // Update the deal stage if it changed
        if (newDealStage !== contract.deal.stage) {
            // Use the comprehensive action to ensure notifications/automation run
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
