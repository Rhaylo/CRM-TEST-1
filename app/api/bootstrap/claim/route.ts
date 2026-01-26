import { NextResponse } from 'next/server';
import { neonAuth } from '@neondatabase/auth/next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const { user } = await neonAuth();

        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await req.json();
        const { userId, email, name } = body ?? {};

        if (!userId || userId !== user.id) {
            return new NextResponse('Invalid user claim.', { status: 400 });
        }

        const result = await prisma.$transaction(async (tx) => {
            const count = await tx.user.count();
            if (count > 0) {
                return { claimed: false };
            }

            await tx.user.upsert({
                where: { id: user.id },
                update: {
                    email: email ?? user.email ?? undefined,
                    name: name ?? user.name ?? undefined,
                    role: 'ADMIN',
                },
                create: {
                    id: user.id,
                    email: email ?? user.email ?? undefined,
                    name: name ?? user.name ?? undefined,
                    role: 'ADMIN',
                },
            });

            return { claimed: true };
        });

        if (!result.claimed) {
            return new NextResponse('CEO already claimed.', { status: 403 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Bootstrap claim error:', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}
