import { prisma } from '@/lib/prisma';

type ActivityLogInput = {
    userId?: string | null;
    action: string;
    entityType: string;
    entityId?: number | null;
    summary: string;
    metadata?: Record<string, unknown> | string | null;
};

export async function logActivity(input: ActivityLogInput) {
    if (typeof (prisma as any).activityLog?.create !== 'function') {
        return;
    }

    const metadata = input.metadata
        ? typeof input.metadata === 'string'
            ? input.metadata
            : JSON.stringify(input.metadata)
        : null;

    try {
        await prisma.activityLog.create({
            data: {
                userId: input.userId ?? null,
                action: input.action,
                entityType: input.entityType,
                entityId: input.entityId ?? null,
                summary: input.summary,
                metadata,
            },
        });
    } catch (error) {
        console.warn('Activity logging failed:', error);
    }
}
