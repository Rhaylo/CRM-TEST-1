import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

const parseDate = (value: string | null, fallback: Date) => {
    if (!value) return fallback;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? fallback : parsed;
};

export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const now = new Date();
        const defaultStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const defaultEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

        const startAt = parseDate(searchParams.get('start'), defaultStart);
        const endAt = parseDate(searchParams.get('end'), defaultEnd);

        const prismaAny = prisma as any;
        const hasCalendar = Boolean(prismaAny.calendarEvent);
        let events: any[] = [];

        if (hasCalendar) {
            events = await prismaAny.calendarEvent.findMany({
                where: {
                    userId: user.id,
                    OR: [
                        { startAt: { gte: startAt, lt: endAt } },
                        { endAt: { gte: startAt, lt: endAt } },
                        { startAt: { lte: startAt }, endAt: { gte: endAt } },
                    ],
                },
                orderBy: { startAt: 'asc' },
                include: {
                    attachments: {
                        select: {
                            id: true,
                            fileName: true,
                        }
                    }
                }
            });
        } else {
            const isSqlite = process.env.DATABASE_URL?.startsWith('file:') ?? true;
            if (!isSqlite) {
                return NextResponse.json({ error: 'Calendar model missing. Run prisma generate.' }, { status: 500 });
            }

            events = await prisma.$queryRaw<any[]>(Prisma.sql`
                SELECT e.id, e.title, e.description, e.startAt, e.endAt, e.allDay, e.reminderAt
                FROM "CalendarEvent" e
                WHERE e.userId = ${user.id}
                AND e.startAt < ${endAt}
                AND (e.endAt IS NULL OR e.endAt >= ${startAt})
                ORDER BY e.startAt ASC
            `);

            const eventIds = events.map((event) => event.id);
            let attachments: { id: number; fileName: string; eventId: number }[] = [];
            if (eventIds.length > 0) {
                attachments = await prisma.$queryRaw(Prisma.sql`
                    SELECT id, fileName, eventId
                    FROM "CalendarAttachment"
                    WHERE eventId IN (${Prisma.join(eventIds)})
                `);
            }

            const attachmentsByEvent = new Map<number, { id: number; fileName: string }[]>();
            attachments.forEach((file) => {
                if (!attachmentsByEvent.has(file.eventId)) attachmentsByEvent.set(file.eventId, []);
                attachmentsByEvent.get(file.eventId)?.push({ id: file.id, fileName: file.fileName });
            });

            events = events.map((event) => ({
                ...event,
                attachments: attachmentsByEvent.get(event.id) || [],
            }));
        }

        return NextResponse.json({ events });
    } catch (error: any) {
        console.error('Calendar events fetch error:', error);
        return NextResponse.json({ error: error.message || 'Failed to fetch events' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { title, description, startAt, endAt, allDay, reminderAt } = body ?? {};

        if (!title || !startAt) {
            return NextResponse.json({ error: 'Title and startAt are required' }, { status: 400 });
        }

        const startDate = new Date(startAt);
        const endDate = endAt ? new Date(endAt) : null;
        const reminderDate = reminderAt ? new Date(reminderAt) : null;

        const prismaAny = prisma as any;
        const hasCalendar = Boolean(prismaAny.calendarEvent);
        let event: any = null;

        if (hasCalendar) {
            event = await prismaAny.calendarEvent.create({
                data: {
                    userId: user.id,
                    title,
                    description,
                    startAt: startDate,
                    endAt: endDate,
                    allDay: Boolean(allDay),
                    reminderAt: reminderDate,
                }
            });
        } else {
            const isSqlite = process.env.DATABASE_URL?.startsWith('file:') ?? true;
            if (!isSqlite) {
                return NextResponse.json({ error: 'Calendar model missing. Run prisma generate.' }, { status: 500 });
            }

            await prisma.$executeRaw(Prisma.sql`
                INSERT INTO "CalendarEvent" (userId, title, description, startAt, endAt, allDay, reminderAt, createdAt, updatedAt)
                VALUES (${user.id}, ${title}, ${description}, ${startDate}, ${endDate}, ${Boolean(allDay)}, ${reminderDate}, datetime('now'), datetime('now'))
            `);

            const rows = await prisma.$queryRaw<{ id: number }[]>(Prisma.sql`SELECT last_insert_rowid() as id`);
            const insertedId = rows[0]?.id;
            if (insertedId) {
                const created = await prisma.$queryRaw<any[]>(Prisma.sql`
                    SELECT id, title, description, startAt, endAt, allDay, reminderAt
                    FROM "CalendarEvent"
                    WHERE id = ${insertedId}
                `);
                event = created[0] || null;
            }
        }

        return NextResponse.json({ event });
    } catch (error: any) {
        console.error('Calendar event create error:', error);
        return NextResponse.json({ error: error.message || 'Failed to create event' }, { status: 500 });
    }
}
