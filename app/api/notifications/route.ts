import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');

    const where = unreadOnly ? { read: false } : {};

    const notifications = await prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: {
            client: true,
            task: true,
            deal: true,
        },
    });

    return NextResponse.json(notifications);
}

export async function POST(request: Request) {
    const body = await request.json();

    const notification = await prisma.notification.create({
        data: {
            title: body.title,
            message: body.message,
            type: body.type,
            actionUrl: body.actionUrl,
            clientId: body.clientId,
            taskId: body.taskId,
            dealId: body.dealId,
        },
    });

    return NextResponse.json(notification);
}

export async function PATCH(request: Request) {
    const body = await request.json();
    const { id, read } = body;

    const notification = await prisma.notification.update({
        where: { id },
        data: { read },
    });

    return NextResponse.json(notification);
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
        await prisma.notification.delete({
            where: { id: parseInt(id) },
        });
        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'ID required' }, { status: 400 });
}
