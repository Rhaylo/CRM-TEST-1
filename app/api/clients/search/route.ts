import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');

        if (!query || query.trim().length === 0) {
            return NextResponse.json([]);
        }

        const searchTerm = query.trim();

        const clients = await prisma.client.findMany({
            where: {
                OR: [{ userId: user.id }, { userId: null }],
                AND: [
                    {
                        OR: [
                            { contactName: { contains: searchTerm, mode: 'insensitive' } },
                            { companyName: { contains: searchTerm, mode: 'insensitive' } },
                            { email: { contains: searchTerm, mode: 'insensitive' } },
                            { phone: { contains: searchTerm, mode: 'insensitive' } },
                        ],
                    },
                ],
            },
            take: 8,
            select: {
                id: true,
                contactName: true,
                status: true,
                email: true,
                phone: true,
            },
            orderBy: {
                updatedAt: 'desc',
            },
        });

        return NextResponse.json(clients);
    } catch (error) {
        console.error('Client search error:', error);
        return NextResponse.json({ error: 'Failed to search clients' }, { status: 500 });
    }
}
