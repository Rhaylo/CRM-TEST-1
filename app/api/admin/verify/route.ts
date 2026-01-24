import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const user = await getCurrentUser();
        // Allow even if user is not fully authenticated?? 
        // AdminGate usually requires "admin_authenticated" session storage which is separate.
        // But to verify, we generally want to know who is asking.
        // Assuming AdminGate effectively acts as a 2nd factor for logged in users.
        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { password } = await request.json();

        // Check Global Setting
        const settings = await prisma.settings.findFirst({
            where: {
                key: 'admin_password',
                userId: null
            },
        });

        const adminPassword = settings?.value || 'XyreHoldings76!@';

        if (password === adminPassword) {
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ success: false }, { status: 401 });
    } catch (error) {
        console.error("Admin verify error:", error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
