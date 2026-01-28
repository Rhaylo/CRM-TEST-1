import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

const normalizeDate = (value: string) => {
    const parsed = new Date(`${value}T00:00:00Z`);
    if (Number.isNaN(parsed.getTime())) {
        return null;
    }
    return parsed;
};

export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const dateParam = searchParams.get('date');

        if (!dateParam) {
            return NextResponse.json({ error: 'date is required' }, { status: 400 });
        }

        const date = normalizeDate(dateParam);
        if (!date) {
            return NextResponse.json({ error: 'Invalid date' }, { status: 400 });
        }

        const prismaAny = prisma as any;
        const hasCalendar = Boolean(prismaAny.calendarNote);
        let note: any = null;

        if (hasCalendar) {
            note = await prismaAny.calendarNote.findUnique({
                where: { userId_date: { userId: user.id, date } }
            });
        } else {
            const isSqlite = process.env.DATABASE_URL?.startsWith('file:') ?? true;
            if (!isSqlite) {
                return NextResponse.json({ error: 'Calendar model missing. Run prisma generate.' }, { status: 500 });
            }
            const rows = await prisma.$queryRaw<any[]>(Prisma.sql`
                SELECT id, userId, date, content, createdAt, updatedAt
                FROM "CalendarNote"
                WHERE userId = ${user.id} AND date = ${date}
            `);
            note = rows[0] || null;
        }

        return NextResponse.json({ note });
    } catch (error: any) {
        console.error('Calendar note fetch error:', error);
        return NextResponse.json({ error: error.message || 'Failed to fetch note' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { date, content } = body ?? {};

        if (!date || content === undefined) {
            return NextResponse.json({ error: 'date and content are required' }, { status: 400 });
        }

        const normalized = normalizeDate(date);
        if (!normalized) {
            return NextResponse.json({ error: 'Invalid date' }, { status: 400 });
        }

        const prismaAny = prisma as any;
        const hasCalendar = Boolean(prismaAny.calendarNote);
        let note: any = null;

        if (hasCalendar) {
            note = await prismaAny.calendarNote.upsert({
                where: { userId_date: { userId: user.id, date: normalized } },
                update: { content },
                create: {
                    userId: user.id,
                    date: normalized,
                    content,
                }
            });
        } else {
            const isSqlite = process.env.DATABASE_URL?.startsWith('file:') ?? true;
            if (!isSqlite) {
                return NextResponse.json({ error: 'Calendar model missing. Run prisma generate.' }, { status: 500 });
            }

            const rows = await prisma.$queryRaw<any[]>(Prisma.sql`
                SELECT id FROM "CalendarNote" WHERE userId = ${user.id} AND date = ${normalized}
            `);
            const existingId = rows[0]?.id;

            if (existingId) {
                await prisma.$executeRaw(Prisma.sql`
                    UPDATE "CalendarNote"
                    SET content = ${content}, updatedAt = datetime('now')
                    WHERE id = ${existingId}
                `);
            } else {
                await prisma.$executeRaw(Prisma.sql`
                    INSERT INTO "CalendarNote" (userId, date, content, createdAt, updatedAt)
                    VALUES (${user.id}, ${normalized}, ${content}, datetime('now'), datetime('now'))
                `);
            }

            const updatedRows = await prisma.$queryRaw<any[]>(Prisma.sql`
                SELECT id, userId, date, content, createdAt, updatedAt
                FROM "CalendarNote"
                WHERE userId = ${user.id} AND date = ${normalized}
            `);
            note = updatedRows[0] || null;
        }

        return NextResponse.json({ note });
    } catch (error: any) {
        console.error('Calendar note save error:', error);
        return NextResponse.json({ error: error.message || 'Failed to save note' }, { status: 500 });
    }
}
