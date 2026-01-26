import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const count = await prisma.user.count();
        return NextResponse.json({ hasUsers: count > 0 });
    } catch (error) {
        console.error('Bootstrap status error:', error);
        return NextResponse.json({ hasUsers: true }, { status: 500 });
    }
}
