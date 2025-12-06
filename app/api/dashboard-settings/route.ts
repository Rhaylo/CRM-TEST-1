import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const settings = await prisma.settings.findMany({
            where: {
                key: {
                    in: ['business_name', 'welcome_message']
                }
            }
        });

        const businessName = settings.find(s => s.key === 'business_name')?.value || 'Business Overview';
        const welcomeMessage = settings.find(s => s.key === 'welcome_message')?.value || "Welcome back! Here's what's happening today.";

        return NextResponse.json({ businessName, welcomeMessage });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { businessName, welcomeMessage } = await request.json();

        // Update or create business_name
        if (businessName !== undefined) {
            await prisma.settings.upsert({
                where: { key: 'business_name' },
                update: { value: businessName },
                create: { key: 'business_name', value: businessName }
            });
        }

        // Update or create welcome_message
        if (welcomeMessage !== undefined) {
            await prisma.settings.upsert({
                where: { key: 'welcome_message' },
                update: { value: welcomeMessage },
                create: { key: 'welcome_message', value: welcomeMessage }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
