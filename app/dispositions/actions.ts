'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createInvestor(formData: FormData) {
    const contactName = formData.get('contactName') as string;
    const companyName = formData.get('companyName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const status = formData.get('status') as string;
    const buyingCriteria = formData.get('buyingCriteria') as string;
    const state = formData.get('state') as string;
    const zone = formData.get('zone') as string;

    await prisma.investor.create({
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

    revalidatePath(`/dispositions/${investorId}`);
    revalidatePath('/dispositions');
}

export async function addInvestorNote(investorId: number, content: string) {
    if (!content.trim()) return;

    await prisma.note.create({
        data: {
            content,
            investorId,
        },
    });
    revalidatePath(`/dispositions/${investorId}`);
}

export async function deleteInvestorNote(noteId: number, investorId: number) {
    await prisma.note.delete({
        where: { id: noteId },
    });
    revalidatePath(`/dispositions/${investorId}`);
}

export async function createDealForInvestor(investorId: number, formData: FormData) {
    const clientId = parseInt(formData.get('clientId') as string);
    const amount = parseFloat(formData.get('amount') as string);
    const assignmentFee = formData.get('assignmentFee') ? parseFloat(formData.get('assignmentFee') as string) : null;
    const stage = formData.get('stage') as string;
    const expectedCloseDate = formData.get('expectedCloseDate') ? new Date(formData.get('expectedCloseDate') as string) : null;

    // Check if there is already an active deal for this client
    const existingDeal = await prisma.deal.findFirst({
        where: {
            clientId: clientId,
            stage: { not: 'Complete' } // Assume we only want to link to active deals
        }
    });

    if (existingDeal) {
        // Update existing deal instead of creating a duplicate
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
    } else {
        // Create new deal only if none exists
        await prisma.deal.create({
            data: {
                clientId,
                investorId,
                amount,
                assignmentFee,
                stage,
                expectedCloseDate,
            },
        });
    }

    revalidatePath(`/dispositions/${investorId}`);
    revalidatePath('/deals'); // Also refresh main pipeline
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

    revalidatePath(`/dispositions/${investorId}`);
}

export async function deleteDeal(dealId: number, investorId: number) {
    // Delete associated contracts first due to Foreign Key Constraint
    await prisma.contract.deleteMany({
        where: { dealId }
    });

    await prisma.deal.delete({
        where: { id: dealId },
    });
    revalidatePath(`/dispositions/${investorId}`);
}

export async function deleteInvestor(investorId: number) {
    await prisma.investor.delete({
        where: { id: investorId },
    });
    revalidatePath('/dispositions');
}
