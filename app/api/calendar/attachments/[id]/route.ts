import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const params = await props.params;
        const attachmentId = parseInt(params.id, 10);
        if (Number.isNaN(attachmentId)) {
            return new NextResponse('Invalid attachment id', { status: 400 });
        }

        const prismaAny = prisma as any;
        const hasAttachment = Boolean(prismaAny.calendarAttachment);
        let attachment: any = null;

        if (hasAttachment) {
            attachment = await prismaAny.calendarAttachment.findFirst({
                where: { id: attachmentId, event: { userId: user.id } },
                select: { content: true, fileName: true, contentType: true }
            });
        } else {
            const isSqlite = process.env.DATABASE_URL?.startsWith('file:') ?? true;
            if (!isSqlite) {
                return new NextResponse('Calendar model missing. Run prisma generate.', { status: 500 });
            }
            const rows = await prisma.$queryRaw<any[]>(Prisma.sql`
                SELECT a.content, a.fileName, a.contentType
                FROM "CalendarAttachment" a
                INNER JOIN "CalendarEvent" e ON e.id = a.eventId
                WHERE a.id = ${attachmentId} AND e.userId = ${user.id}
            `);
            attachment = rows[0] || null;
        }

        if (!attachment) {
            return new NextResponse('Attachment not found', { status: 404 });
        }

        return new NextResponse(new Uint8Array(attachment.content), {
            headers: {
                'Content-Type': attachment.contentType || 'application/octet-stream',
                'Content-Disposition': `attachment; filename="${attachment.fileName}"`
            }
        });
    } catch (error) {
        console.error('Calendar attachment fetch error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
