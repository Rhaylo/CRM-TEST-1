'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { logActivity } from '@/lib/activity';

export async function createInvestor(formData: FormData) {
    const contactName = formData.get('contactName') as string;
    const companyName = formData.get('companyName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const status = formData.get('status') as string;
    const buyingCriteria = formData.get('buyingCriteria') as string;
    const state = formData.get('state') as string;
    const zone = formData.get('zone') as string;

    const investor = await prisma.investor.create({
        data: {
            contactName,
            companyName,
            email,
            phone,
            status,
            buyingCriteria,
            state,
            zone,
        },
    });

    await logActivity({
        action: 'created',
        entityType: 'investor',
        entityId: investor.id,
        summary: `Investor created: ${contactName}`,
        metadata: { companyName, email },
    });

    revalidatePath('/dispositions');
}

export async function updateInvestor(investorId: number, formData: FormData) {
    const contactName = formData.get('contactName') as string;
    const companyName = formData.get('companyName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const status = formData.get('status') as string;
    const buyingCriteria = formData.get('buyingCriteria') as string;
    const state = formData.get('state') as string;
    const zone = formData.get('zone') as string;

    await prisma.investor.update({
        where: { id: investorId },
        data: {
            contactName,
            companyName,
            email,
            phone,
            status,
            buyingCriteria,
            state,
            zone,
        },
    });

    await logActivity({
        action: 'updated',
        entityType: 'investor',
        entityId: investorId,
        summary: `Investor updated: ${contactName}`,
        metadata: { companyName, status },
    });

    revalidatePath(`/dispositions/${investorId}`);
    revalidatePath('/dispositions');
}

export async function addInvestorNote(investorId: number, content: string) {
    if (!content.trim()) return;

    const note = await prisma.note.create({
        data: {
            content,
            investorId,
        },
    });

    await logActivity({
        action: 'created',
        entityType: 'note',
        entityId: note.id,
        summary: `Note added to investor #${investorId}`,
        metadata: { investorId },
    });
    revalidatePath(`/dispositions/${investorId}`);
}

export async function deleteInvestorNote(noteId: number, investorId: number) {
    await prisma.note.delete({
        where: { id: noteId },
    });
    await logActivity({
        action: 'deleted',
        entityType: 'note',
        entityId: noteId,
        summary: `Note deleted from investor #${investorId}`,
        metadata: { investorId },
    });
    revalidatePath(`/dispositions/${investorId}`);
}

export async function createDealForInvestor(investorId: number, formData: FormData) {
    const clientId = parseInt(formData.get('clientId') as string);
    const amount = parseFloat(formData.get('amount') as string);
    const assignmentFee = formData.get('assignmentFee') ? parseFloat(formData.get('assignmentFee') as string) : null;
    const stage = formData.get('stage') as string;
    const expectedCloseDate = formData.get('expectedCloseDate') ? new Date(formData.get('expectedCloseDate') as string) : null;

    const existingDeal = await prisma.deal.findFirst({
        where: {
            clientId: clientId,
            stage: { not: 'Complete' },
        },
    });

    if (existingDeal) {
        await prisma.deal.update({
            where: { id: existingDeal.id },
            data: {
                investorId,
                amount,
                assignmentFee,
                stage,
                expectedCloseDate,
            },
        });

        await logActivity({
            action: 'updated',
            entityType: 'deal',
            entityId: existingDeal.id,
            summary: `Deal updated for investor #${investorId}`,
            metadata: { clientId, stage },
        });
    } else {
        const deal = await prisma.deal.create({
            data: {
                clientId,
                investorId,
                amount,
                assignmentFee,
                stage,
                expectedCloseDate,
            },
        });

        await logActivity({
            action: 'created',
            entityType: 'deal',
            entityId: deal.id,
            summary: `Deal created for investor #${investorId}`,
            metadata: { clientId, stage },
        });
    }

    revalidatePath(`/dispositions/${investorId}`);
    revalidatePath('/deals');
}

export async function updateDeal(dealId: number, investorId: number, formData: FormData) {
    const amount = parseFloat(formData.get('amount') as string);
    const assignmentFee = formData.get('assignmentFee') ? parseFloat(formData.get('assignmentFee') as string) : null;
    const stage = formData.get('stage') as string;
    const expectedCloseDate = formData.get('expectedCloseDate') ? new Date(formData.get('expectedCloseDate') as string) : null;

    await prisma.deal.update({
        where: { id: dealId },
        data: {
            amount,
            assignmentFee,
            stage,
            expectedCloseDate,
        },
    });

    await logActivity({
        action: 'updated',
        entityType: 'deal',
        entityId: dealId,
        summary: `Deal updated for investor #${investorId}`,
        metadata: { stage },
    });

    revalidatePath(`/dispositions/${investorId}`);
}

export async function deleteDeal(dealId: number, investorId: number) {
    await prisma.contract.deleteMany({
        where: { dealId },
    });

    await prisma.deal.delete({
        where: { id: dealId },
    });

    await logActivity({
        action: 'deleted',
        entityType: 'deal',
        entityId: dealId,
        summary: `Deal deleted for investor #${investorId}`,
    });

    revalidatePath(`/dispositions/${investorId}`);
}

export async function deleteInvestor(investorId: number) {
    await prisma.investor.delete({
        where: { id: investorId },
    });
    await logActivity({
        action: 'deleted',
        entityType: 'investor',
        entityId: investorId,
        summary: `Investor deleted #${investorId}`,
    });
    revalidatePath('/dispositions');
}
