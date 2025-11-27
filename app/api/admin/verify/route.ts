import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    const { password } = await request.json();

    // Check DB first
    const settings = await prisma.settings.findUnique({
        where: { key: 'admin_password' },
    });

    const adminPassword = settings?.value || process.env.ADMIN_PASSWORD || 'admin123';

    if (password === adminPassword) {
        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false }, { status: 401 });
}
