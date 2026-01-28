'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { triggerAutomation } from '@/app/lib/automation';
import { logActivity } from '@/lib/activity';

export async function createClient(formData: FormData) {
    const contactName = formData.get('contactName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;
    const propertyCondition = formData.get('propertyCondition') as string;
    const propertyLink = formData.get('propertyLink') as string;
    const askingPrice = formData.get('askingPrice') as string;
    const ourOffer = formData.get('ourOffer') as string;
    const motivationScore = formData.get('motivationScore') as string;
    const motivationNote = formData.get('motivationNote') as string;
    const arv = formData.get('arv') as string;

    if (!contactName) {
        throw new Error('Contact Name is required');
    }

    const user = await getCurrentUser();
    if (!user) {
        throw new Error('Unauthorized');
    }

    const client = await prisma.client.create({
        data: {
            userId: user.id, // Assign owner
            companyName: contactName,
            contactName,
            email,
            phone,
            address,
            propertyCondition,
            propertyLink,
            askingPrice: askingPrice ? parseFloat(askingPrice) : undefined,
            ourOffer: ourOffer ? parseFloat(ourOffer) : undefined,
            arv: arv ? parseFloat(arv) : undefined,
            motivationScore: motivationScore ? parseInt(motivationScore) : undefined,
            motivationNote,
        },
    });

    await logActivity({
        userId: user.id,
        action: 'created',
        entityType: 'client',
        entityId: client.id,
        summary: `Client created: ${contactName}`,
        metadata: {
            email,
            phone,
        },
    });

    // Trigger automation
    await triggerAutomation('client_added', client);

    redirect(`/clients/${client.id}`);
}
