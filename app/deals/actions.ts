'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { triggerAutomation } from '@/app/lib/automation';

export async function updateDealStage(dealId: number, stage: string) {
    // Update the deal stage
    const updatedDeal = await prisma.deal.update({
        where: { id: dealId },
        data: { stage },
        include: { client: true }
    });

    // Trigger automation
    await triggerAutomation('deal_stage_change', updatedDeal);

    // If moving to "Contract Out", create a contract if one doesn't exist
    if (stage === 'Contract Out') {
        const deal = await prisma.deal.findUnique({
            where: { id: dealId },
            include: { contracts: true },
        });

        // Only create contract if one doesn't already exist for this deal
        if (deal && deal.contracts.length === 0) {
            await prisma.contract.create({
                data: {
                    dealId: dealId,
                    clientId: deal.clientId,
                    status: 'Out',
                    dateSent: new Date(),
                },
            });
            revalidatePath('/contracts');
        }
    }

    revalidatePath('/deals');
    revalidatePath('/clients');
}
