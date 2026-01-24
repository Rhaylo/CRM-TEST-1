'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
<<<<<<< HEAD
<<<<<<< HEAD
import { updateDealStage } from '../deals/actions';
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e

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

<<<<<<< HEAD
<<<<<<< HEAD
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
=======
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
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
<<<<<<< HEAD
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
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
<<<<<<< HEAD
<<<<<<< HEAD

export async function updateContractDocumentName(id: number, name: string) {
    await prisma.contract.update({
        where: { id },
        data: { documentName: name },
    });
    revalidatePath('/contracts');
}
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
