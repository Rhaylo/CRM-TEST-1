import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const settings = await prisma.settings.findFirst({
            where: {
                key: 'revenue_data',
                userId: null
            }
        });

        if (settings?.value) {
            return NextResponse.json(JSON.parse(settings.value));
        }

        // Default data
        const defaultData = [
            { month: 'Jan', revenue: 12000 },
            { month: 'Feb', revenue: 19000 },
            { month: 'Mar', revenue: 15000 },
            { month: 'Apr', revenue: 22000 },
            { month: 'May', revenue: 28000 },
            { month: 'Jun', revenue: 35000 },
        ];

        return NextResponse.json(defaultData);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        // Robust update
        const existing = await prisma.settings.findFirst({
            where: {
                key: 'revenue_data',
                userId: null
            }
        });

        if (existing) {
            await prisma.settings.update({
                where: { id: existing.id },
                data: { value: JSON.stringify(data) }
            });
        } else {
            await prisma.settings.create({
                data: {
                    key: 'revenue_data',
                    value: JSON.stringify(data),
                    userId: null
                }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
