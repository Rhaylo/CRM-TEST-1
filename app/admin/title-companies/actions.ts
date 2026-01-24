'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getTitleCompanies() {
    try {
        const companies = await prisma.titleCompany.findMany({
            include: {
                escrowAgents: true,
            },
            orderBy: {
                name: 'asc',
            },
        });
        return companies;
    } catch (error) {
        console.error('Error fetching title companies:', error);
        return [];
    }
}

export async function createTitleCompany(data: FormData) {
    try {
        const name = data.get('name') as string;
        const address = data.get('address') as string;
        const phone = data.get('phone') as string;
        const email = data.get('email') as string;
        const website = data.get('website') as string;
        const contactName = data.get('contactName') as string;

        await prisma.titleCompany.create({
            data: {
                name,
                address,
                phone,
                email,
                website,
                contactName,
            },
        });

        revalidatePath('/admin/title-companies');
        return { success: true };
    } catch (error) {
        console.error('Error creating title company:', error);
        return { success: false, error: 'Failed to create title company' };
    }
}

export async function updateTitleCompany(id: number, data: FormData) {
    try {
        const name = data.get('name') as string;
        const address = data.get('address') as string;
        const phone = data.get('phone') as string;
        const email = data.get('email') as string;
        const website = data.get('website') as string;
        const contactName = data.get('contactName') as string;

        await prisma.titleCompany.update({
            where: { id },
            data: {
                name,
                address,
                phone,
                email,
                website,
                contactName,
            },
        });

        revalidatePath('/admin/title-companies');
        return { success: true };
    } catch (error) {
        console.error('Error updating title company:', error);
        return { success: false, error: 'Failed to update title company' };
    }
}

export async function deleteTitleCompany(id: number) {
    try {
        await prisma.titleCompany.delete({
            where: { id },
        });

        revalidatePath('/admin/title-companies');
        return { success: true };
    } catch (error) {
        console.error('Error deleting title company:', error);
        return { success: false, error: 'Failed to delete title company' };
    }
}

export async function createEscrowAgent(data: FormData) {
    try {
        const titleCompanyId = parseInt(data.get('titleCompanyId') as string);
        const name = data.get('name') as string;
        const email = data.get('email') as string;
        const phone = data.get('phone') as string;

        await prisma.escrowAgent.create({
            data: {
                titleCompanyId,
                name,
                email,
                phone,
            },
        });

        revalidatePath('/admin/title-companies');
        return { success: true };
    } catch (error) {
        console.error('Error creating escrow agent:', error);
        return { success: false, error: 'Failed to create escrow agent' };
    }
}

export async function deleteEscrowAgent(id: number) {
    try {
        await prisma.escrowAgent.delete({
            where: { id },
        });

        revalidatePath('/admin/title-companies');
        revalidatePath(`/admin/title-companies`);
        return { success: true };
    } catch (error) {
        console.error('Error deleting escrow agent:', error);
        return { success: false, error: 'Failed to delete escrow agent' };
    }
}
