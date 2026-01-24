'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function deleteContract(contractId: number) {
    await prisma.contract.delete({ where: { id: contractId } });
    revalidatePath('/contracts');
}
