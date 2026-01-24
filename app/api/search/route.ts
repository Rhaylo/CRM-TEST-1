import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');
        console.log('Search query received:', query);

        if (!query || query.trim().length === 0) {
            return NextResponse.json([]);
        }

        const searchTerm = query.trim();

        // Search clients
        const clients = await prisma.client.findMany({
            where: {
                OR: [
                    { contactName: { contains: searchTerm } },
                    { companyName: { contains: searchTerm } },
                    { email: { contains: searchTerm } },
                    { phone: { contains: searchTerm } },
                ],
            },
            take: 10,
            select: {
                id: true,
                contactName: true,
                companyName: true,
                status: true,
                email: true,
                phone: true,
            },
            orderBy: {
                updatedAt: 'desc',
            },
        });

        // Format results for the frontend
        const results = clients.map(client => ({
            id: client.id,
            title: client.contactName,
            subtitle: `${client.companyName ? client.companyName + ' • ' : ''}${client.status}`,
            type: 'client',
            url: `/clients/${client.id}`
        }));

        return NextResponse.json(results);
    } catch (error) {
        console.error('Search error:', error);
        return NextResponse.json({ error: 'Failed to search' }, { status: 500 });
    }
}
