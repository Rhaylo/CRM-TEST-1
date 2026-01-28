import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function PATCH(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const params = await props.params;
        const eventId = parseInt(params.id, 10);
        if (Number.isNaN(eventId)) {
            return NextResponse.json({ error: 'Invalid event id' }, { status: 400 });
        }

        const body = await request.json();
        const { title, description, startAt, endAt, allDay, reminderAt } = body ?? {};

        const prismaAny = prisma as any;
        const hasCalendar = Boolean(prismaAny.calendarEvent);
        let event: any = null;

        if (hasCalendar) {
            event = await prismaAny.calendarEvent.findFirst({
                where: { id: eventId, userId: user.id }
            });
        } else {
            const isSqlite = process.env.DATABASE_URL?.startsWith('file:') ?? true;
            if (!isSqlite) {
                return NextResponse.json({ error: 'Calendar model missing. Run prisma generate.' }, { status: 500 });
            }
            const rows = await prisma.$queryRaw<any[]>(Prisma.sql`
                SELECT id, title, description, startAt, endAt, allDay, reminderAt
                FROM "CalendarEvent"
                WHERE id = ${eventId} AND userId = ${user.id}
            `);
            event = rows[0] || null;
        }

        if (!event) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        const updatedData = {
            title: title ?? event.title,
            description: description ?? event.description,
            startAt: startAt ? new Date(startAt) : new Date(event.startAt),
            endAt: endAt !== undefined ? (endAt ? new Date(endAt) : null) : (event.endAt ? new Date(event.endAt) : null),
            allDay: allDay !== undefined ? Boolean(allDay) : Boolean(event.allDay),
            reminderAt: reminderAt !== undefined ? (reminderAt ? new Date(reminderAt) : null) : (event.reminderAt ? new Date(event.reminderAt) : null),
        };

        let updated: any = null;
        if (hasCalendar) {
            updated = await prismaAny.calendarEvent.update({
                where: { id: eventId },
                data: updatedData,
            });
        } else {
            await prisma.$executeRaw(Prisma.sql`
                UPDATE "CalendarEvent"
                SET title = ${updatedData.title},
                    description = ${updatedData.description},
                    startAt = ${updatedData.startAt},
                    endAt = ${updatedData.endAt},
                    allDay = ${updatedData.allDay},
                    reminderAt = ${updatedData.reminderAt},
                    updatedAt = datetime('now')
                WHERE id = ${eventId} AND userId = ${user.id}
            `);

            const rows = await prisma.$queryRaw<any[]>(Prisma.sql`
                SELECT id, title, description, startAt, endAt, allDay, reminderAt
                FROM "CalendarEvent"
                WHERE id = ${eventId} AND userId = ${user.id}
            `);
            updated = rows[0] || null;
        }

        return NextResponse.json({ event: updated });
    } catch (error: any) {
        console.error('Calendar event update error:', error);
        return NextResponse.json({ error: error.message || 'Failed to update event' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const params = await props.params;
        const eventId = parseInt(params.id, 10);
        if (Number.isNaN(eventId)) {
            return NextResponse.json({ error: 'Invalid event id' }, { status: 400 });
        }

        const prismaAny = prisma as any;
        const hasCalendar = Boolean(prismaAny.calendarEvent);

        let deletedCount = 0;
        if (hasCalendar) {
            const deleted = await prismaAny.calendarEvent.deleteMany({
                where: { id: eventId, userId: user.id }
            });
            deletedCount = deleted.count;
        } else {
            const isSqlite = process.env.DATABASE_URL?.startsWith('file:') ?? true;
            if (!isSqlite) {
                return NextResponse.json({ error: 'Calendar model missing. Run prisma generate.' }, { status: 500 });
            }
            await prisma.$executeRaw(Prisma.sql`
                DELETE FROM "CalendarEvent" WHERE id = ${eventId} AND userId = ${user.id}
            `);
            const rows = await prisma.$queryRaw<{ count: number }[]>(Prisma.sql`SELECT changes() as count`);
            deletedCount = rows[0]?.count ?? 0;
        }

        if (deletedCount === 0) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Calendar event delete error:', error);
        return NextResponse.json({ error: error.message || 'Failed to delete event' }, { status: 500 });
    }
}
