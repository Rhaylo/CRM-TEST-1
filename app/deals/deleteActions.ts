'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function deleteDeal(dealId: number) {
    // Delete related contracts first
    await prisma.contract.deleteMany({ where: { dealId } });
    await prisma.note.deleteMany({ where: { dealId } });
    await prisma.deal.delete({ where: { id: dealId } });

    revalidatePath('/deals');
}
