import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;
        const eventId = formData.get('eventId') as string;

        if (!file || !eventId) {
            return NextResponse.json({ error: 'File and eventId are required' }, { status: 400 });
        }

        const parsedId = parseInt(eventId, 10);
        if (Number.isNaN(parsedId)) {
            return NextResponse.json({ error: 'Invalid eventId' }, { status: 400 });
        }

        const prismaAny = prisma as any;
        const hasCalendar = Boolean(prismaAny.calendarEvent);
        let event: any = null;

        if (hasCalendar) {
            event = await prismaAny.calendarEvent.findFirst({
                where: { id: parsedId, userId: user.id }
            });
        } else {
            const isSqlite = process.env.DATABASE_URL?.startsWith('file:') ?? true;
            if (!isSqlite) {
                return NextResponse.json({ error: 'Calendar model missing. Run prisma generate.' }, { status: 500 });
            }
            const rows = await prisma.$queryRaw<any[]>(Prisma.sql`
                SELECT id FROM "CalendarEvent" WHERE id = ${parsedId} AND userId = ${user.id}
            `);
            event = rows[0] || null;
        }

        if (!event) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        const prismaAnyAttach = prisma as any;
        const hasAttachment = Boolean(prismaAnyAttach.calendarAttachment);
        let attachment: any = null;

        if (hasAttachment) {
            attachment = await prismaAnyAttach.calendarAttachment.create({
                data: {
                    eventId: parsedId,
                    fileName: file.name,
                    contentType: file.type || 'application/octet-stream',
                    content: buffer,
                }
            });
        } else {
            const isSqlite = process.env.DATABASE_URL?.startsWith('file:') ?? true;
            if (!isSqlite) {
                return NextResponse.json({ error: 'Calendar model missing. Run prisma generate.' }, { status: 500 });
            }
            await prisma.$executeRaw(Prisma.sql`
                INSERT INTO "CalendarAttachment" (eventId, fileName, contentType, content, createdAt)
                VALUES (${parsedId}, ${file.name}, ${file.type || 'application/octet-stream'}, ${buffer}, datetime('now'))
            `);
            const rows = await prisma.$queryRaw<{ id: number }[]>(Prisma.sql`SELECT last_insert_rowid() as id`);
            attachment = { id: rows[0]?.id, fileName: file.name };
        }

        return NextResponse.json({ attachment: { id: attachment.id, fileName: attachment.fileName } });
    } catch (error: any) {
        console.error('Calendar attachment upload error:', error);
        return NextResponse.json({ error: error.message || 'Failed to upload attachment' }, { status: 500 });
    }
}
