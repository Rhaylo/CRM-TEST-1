import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

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

            // Ensure email is a string, fallback to undefined only if absolutely necessary for Prisma (though usually null is better if nullable)
            const userEmail = email ?? user.email ?? undefined;

            await tx.user.upsert({
                where: { id: user.id },
                update: {
                    email: userEmail,
                    name: name ?? undefined, // user.name is not directly on Supabase User object usually, unless in metadata
                    role: 'ADMIN',
                },
                create: {
                    id: user.id,
                    email: userEmail ?? '', // Email is usually required
                    name: name ?? undefined,
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
