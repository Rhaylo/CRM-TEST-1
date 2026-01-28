'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { triggerAutomation } from '@/app/lib/automation';
import { createNotification } from '@/app/notifications/actions';
import { logActivity } from '@/lib/activity';

export async function updateDealStage(dealId: number, stage: string) {
    const updatedDeal = await prisma.deal.update({
        where: { id: dealId },
        data: { stage },
        include: { client: true },
    });

    if (updatedDeal.userId) {
        await createNotification({
            title: 'Deal Stage Actualizado',
            message: `${updatedDeal.client.companyName} cambió a "${stage}"`,
            type: 'deal',
            actionUrl: `/clients/${updatedDeal.clientId}`,
            dealId: dealId,
            clientId: updatedDeal.clientId,
            userId: updatedDeal.userId,
        });
    }

    await logActivity({
        userId: updatedDeal.userId ?? null,
        action: 'status_changed',
        entityType: 'deal',
        entityId: updatedDeal.id,
        summary: `Deal stage changed to ${stage}`,
        metadata: {
            clientId: updatedDeal.clientId,
            stage,
        },
    });

    await triggerAutomation('deal_stage_change', updatedDeal);

    if (stage === 'Contract Sent' || stage === 'Contract Out') {
        const deal = await prisma.deal.findUnique({
            where: { id: dealId },
            include: { contracts: true },
        });

        if (deal && deal.contracts.length === 0) {
            const user = await getCurrentUser();
            if (user || updatedDeal.userId) {
                await prisma.contract.create({
                    data: {
                        userId: updatedDeal.userId ?? user?.id ?? null,
                        dealId: dealId,
                        clientId: deal.clientId,
                        status: 'Sent',
                        dateSent: new Date(),
                    },
                });
                revalidatePath('/contracts');
            }
        }
    }

    if (['Under Contract', 'Marketing', 'Buyer Found', 'Sold'].includes(stage)) {
        const dealWithContract = await prisma.deal.findUnique({
            where: { id: dealId },
            include: { contracts: true },
        });

        if (dealWithContract && dealWithContract.contracts.length > 0) {
            const contractId = dealWithContract.contracts[0].id;
            await prisma.contract.update({
                where: { id: contractId },
                data: { status: stage },
            });
            revalidatePath('/contracts');
        }
    }

    revalidatePath('/deals');
    revalidatePath('/clients');
}

export async function updateDealAnalysis(
    dealId: number,
    data: {
        arv?: number;
        repairs?: number;
        fee?: number;
        titleCompanyId?: number | null;
        escrowAgentId?: number | null;
    },
) {
    try {
        const updateData: any = {};

        if (data.titleCompanyId !== undefined) updateData.titleCompanyId = data.titleCompanyId;
        if (data.escrowAgentId !== undefined) updateData.escrowAgentId = data.escrowAgentId;
        if (data.arv !== undefined) updateData.arv = data.arv ?? null;
        if (data.repairs !== undefined) updateData.repairs = data.repairs ?? null;
        if (data.fee !== undefined) updateData.fee = data.fee ?? null;

    if (Object.keys(updateData).length > 0) {
        await prisma.deal.update({
            where: { id: dealId },
            data: updateData,
        });

        await logActivity({
            action: 'updated',
            entityType: 'deal',
            entityId: dealId,
            summary: 'Deal analysis updated',
            metadata: updateData,
        });
    }
    } catch (error) {
        console.error('Failed to update Deal analysis via raw SQL:', error);
        throw error;
    }

    revalidatePath('/deals');
    revalidatePath('/clients');
}
