
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const settings = await prisma.settings.findMany({
            where: {
                key: {
                    in: ['business_name', 'welcome_message', 'revenue_adjustments']
                },
                userId: user.id
            }
        });

        const businessName = settings.find(s => s.key === 'business_name')?.value || 'Business Overview';
        const welcomeMessage = settings.find(s => s.key === 'welcome_message')?.value || "Welcome back! Here's what's happening today.";
        const revenueAdjustments = settings.find(s => s.key === 'revenue_adjustments')?.value || '[]';

        return NextResponse.json({ businessName, welcomeMessage, revenueAdjustments });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { businessName, welcomeMessage, revenueAdjustments } = await request.json();

        // Helper to update user settings
        const upsertUserSetting = async (key: string, value: string) => {
            const existing = await prisma.settings.findFirst({
                where: { key, userId: user.id }
            });

            if (existing) {
                await prisma.settings.update({
                    where: { id: existing.id },
                    data: { value }
                });
            } else {
                await prisma.settings.create({
                    data: { key, value, userId: user.id }
                });
            }
        };

        // Update or create business_name
        if (businessName !== undefined) {
            await upsertUserSetting('business_name', businessName);
        }

        // Update or create welcome_message
        if (welcomeMessage !== undefined) {
            await upsertUserSetting('welcome_message', welcomeMessage);
        }

        if (revenueAdjustments !== undefined) {
            await upsertUserSetting('revenue_adjustments', JSON.stringify(revenueAdjustments));
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
