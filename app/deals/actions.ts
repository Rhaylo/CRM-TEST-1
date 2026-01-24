'use server';

import { prisma } from '@/lib/prisma';
<<<<<<< HEAD
<<<<<<< HEAD
import { getCurrentUser } from '@/lib/auth';
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
import { revalidatePath } from 'next/cache';
import { triggerAutomation } from '@/app/lib/automation';
import { createNotification } from '@/app/notifications/actions';

export async function updateDealStage(dealId: number, stage: string) {
    // Update the deal stage
<<<<<<< HEAD
<<<<<<< HEAD
    console.log(`[updateDealStage] Moving Deal ${dealId} to stage: ${stage}`);
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
    const updatedDeal = await prisma.deal.update({
        where: { id: dealId },
        data: { stage },
        include: { client: true }
    });

    // Create notification for stage change
    await createNotification({
        title: 'Deal Stage Actualizado',
        message: `${updatedDeal.client.companyName} cambió a "${stage}"`,
        type: 'deal',
        actionUrl: `/clients/${updatedDeal.clientId}`,
        dealId: dealId,
        clientId: updatedDeal.clientId,
<<<<<<< HEAD
<<<<<<< HEAD
        userId: updatedDeal.userId || '',
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
    });

    // Trigger automation
    await triggerAutomation('deal_stage_change', updatedDeal);

<<<<<<< HEAD
<<<<<<< HEAD
    // If moving to "Contract Sent" (or legacy "Contract Out"), create a contract if one doesn't exist
    if (stage === 'Contract Sent' || stage === 'Contract Out') {
=======
    // If moving to "Contract Out", create a contract if one doesn't exist
    if (stage === 'Contract Out') {
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
    // If moving to "Contract Out", create a contract if one doesn't exist
    if (stage === 'Contract Out') {
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
        const deal = await prisma.deal.findUnique({
            where: { id: dealId },
            include: { contracts: true },
        });

        // Only create contract if one doesn't already exist for this deal
        if (deal && deal.contracts.length === 0) {
<<<<<<< HEAD
<<<<<<< HEAD
            const user = await getCurrentUser();
            if (user) {
                await prisma.contract.create({
                    data: {
                        userId: user.id,
                        dealId: dealId,
                        clientId: deal.clientId,
                        status: 'Sent', // Use 'Sent' to match stage
                        dateSent: new Date(),
                    },
                });
                revalidatePath('/contracts');
            }
        }
    }

    // Sync Deal Stage -> Contract Status
    // If we move the deal to a Dispositions stage, we want the contract to reflect that
    if (['Under Contract', 'Marketing', 'Buyer Found', 'Sold'].includes(stage)) {
        // Find existing contract
        const dealWithContract = await prisma.deal.findUnique({
            where: { id: dealId },
            include: { contracts: true }
        });

        if (dealWithContract && dealWithContract.contracts.length > 0) {
            // Update the most recent contract
            // (Assuming 1 active contract per deal usually, or just update all linked to this deal context)
            const contractId = dealWithContract.contracts[0].id;

            // Map Deal Stage to Contract Status exactly 1:1 since we aligned them
            await prisma.contract.update({
                where: { id: contractId },
                data: { status: stage }
            });
            revalidatePath('/contracts'); // Refresh contracts view
=======
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
            await prisma.contract.create({
                data: {
                    dealId: dealId,
                    clientId: deal.clientId,
                    status: 'Out',
                    dateSent: new Date(),
                },
            });
            revalidatePath('/contracts');
<<<<<<< HEAD
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
        }
    }

    revalidatePath('/deals');
    revalidatePath('/clients');
}
<<<<<<< HEAD
<<<<<<< HEAD

export async function updateDealAnalysis(dealId: number, data: { arv?: number, repairs?: number, fee?: number, titleCompanyId?: number | null, escrowAgentId?: number | null }) {
    // Use raw SQL to update fields safely, including new closing fields
    try {
        // Build dynamic SET clause or just update all potential fields
        // Since we might not want to overwrite ARV if only updating title company, ideally we check keys.
        // But for simplicity/robustness with raw SQL:

        /* 
           We can do separate updates or one big one.
           If titleCompanyId is undefined in 'data', we shouldn't set it to null unless explicitly passed as null.
           However, the incoming data structure is simple.
        */

        // If we are updating Title Info, handle it.
        const updateData: any = {};

        if (data.titleCompanyId !== undefined) updateData.titleCompanyId = data.titleCompanyId;
        if (data.escrowAgentId !== undefined) updateData.escrowAgentId = data.escrowAgentId;
        if (data.arv !== undefined) updateData.arv = data.arv ?? null;
        if (data.repairs !== undefined) updateData.repairs = data.repairs ?? null;
        if (data.fee !== undefined) updateData.fee = data.fee ?? null;

        if (Object.keys(updateData).length > 0) {
            await prisma.deal.update({
                where: { id: dealId },
                data: updateData
            });
        }

    } catch (error) {
        console.error("Failed to update Deal analysis via raw SQL:", error);
        throw error;
    }

    revalidatePath('/deals');
    revalidatePath('/clients');
}
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
