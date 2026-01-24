import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const { token } = await req.json();

        if (!token) {
            return new NextResponse('Missing token', { status: 400 });
        }

        const verificationToken = await prisma.verificationToken.findUnique({
            where: {
                token
            }
        });

        if (!verificationToken) {
            return new NextResponse('Invalid token', { status: 400 });
        }

        const hasExpired = new Date(verificationToken.expires) < new Date();

        if (hasExpired) {
            return new NextResponse('Token has expired', { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: {
                email: verificationToken.identifier
            }
        });

        if (!user) {
            return new NextResponse('Email does not exist', { status: 400 });
        }

        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                emailVerified: new Date(),
            }
        });

        await prisma.verificationToken.delete({
            where: {
                token: token
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[VERIFY_POST_ERROR]', error);
        return new NextResponse(`Internal Error: ${(error as any).message}`, { status: 500 });
    }
}
