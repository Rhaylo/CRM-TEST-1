'use server';

import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export async function deleteClient(clientId: number) {
    // Delete all related data first (cascade delete)
    await prisma.note.deleteMany({ where: { clientId } });
    await prisma.contract.deleteMany({ where: { clientId } });
    await prisma.deal.deleteMany({ where: { clientId } });
    await prisma.task.deleteMany({ where: { clientId } });
    await prisma.client.delete({ where: { id: clientId } });

    redirect('/');
}
