import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
<<<<<<< HEAD
        const settings = await prisma.settings.findFirst({
            where: {
                key: 'revenue_data',
                userId: null
            }
=======
        const settings = await prisma.settings.findUnique({
            where: { key: 'revenue_data' }
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
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

<<<<<<< HEAD
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

=======
        await prisma.settings.upsert({
            where: { key: 'revenue_data' },
            update: { value: JSON.stringify(data) },
            create: { key: 'revenue_data', value: JSON.stringify(data) }
        });

>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
