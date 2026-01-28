'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { logActivity } from '@/lib/activity';

export async function updateDealFinancials(
    dealId: number,
    clientId: number,
    data: {
        arv: number;
        repairs: number;
        ourOffer: number;
        wholesalePrice: number;
    }
) {
    try {
        // Update Client fields (Source of truth for property data)
        await prisma.client.update({
            where: { id: clientId },
            data: {
                arv: data.arv,
                // @ts-ignore - Schema mismatch fix from previous steps (float vs int/migration)
                repairs: data.repairs,
                ourOffer: data.ourOffer,
            }
        });

        // Update Deal fields (Transaction data)
        // We also clear any manual 'assignmentFee' override to let the calculated logic take over
        // or we could recalculate and store it. For now, let's clear it to fallback to (Amount - Offer).
        const calculatedFee = data.wholesalePrice - data.ourOffer;

        await prisma.deal.update({
            where: { id: dealId },
            data: {
                amount: data.wholesalePrice,
                // If we want to persist the fee:
                assignmentFee: calculatedFee,
            }
        });

        await logActivity({
            action: 'updated',
            entityType: 'deal',
            entityId: dealId,
            summary: 'Deal financials updated',
            metadata: {
                clientId,
                wholesalePrice: data.wholesalePrice,
                ourOffer: data.ourOffer,
                repairs: data.repairs,
                arv: data.arv,
            },
        });

        revalidatePath(`/deals/${dealId}`);
        revalidatePath('/deals');
        return { success: true };
    } catch (error) {
        console.error('Error updating financials:', error);
        return { success: false, error: 'Failed to update financials' };
    }
}
