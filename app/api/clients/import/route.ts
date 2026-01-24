import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { clients } = body;

        if (!Array.isArray(clients) || clients.length === 0) {
            return new NextResponse("No clients provided", { status: 400 });
        }

        // Limit batch size if necessary, but createMany handles reasonable sizes well (e.g. 1000)
        // Ensure data matches schema
        const clientsToCreate = clients.map((c: any) => ({
            contactName: c.contactName || 'Unknown Contact',
            companyName: c.companyName || c.contactName || 'Unknown Company',
            email: c.email || null,
            phone: c.phone || null,
            address: c.address || null,
            status: 'Lead', // Default status for imports
            userId: user.id, // Assign to current user

            // Optional fields
            askingPrice: c.askingPrice ? parseFloat(c.askingPrice) : null,
            arv: c.arv ? parseFloat(c.arv) : null,
            propertyLink: c.propertyLink || null,
        }));

        const result = await prisma.client.createMany({
            data: clientsToCreate,
            skipDuplicates: true, // Optional: skip if unique constraint violated (e.g. email?) 
            // Note: Our schema only has unique on User.email, not Client.email, so duplicates are allowed unless we enforce it.
        });

        return NextResponse.json({
            success: true,
            count: result.count
        });

    } catch (error) {
        console.error('[IMPORT_CLIENTS_ERROR]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
