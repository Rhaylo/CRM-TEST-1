export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { prisma } from '@/lib/prisma';
import CalendarView from './CalendarView';

export default async function CalendarPage() {
    // Fetch tasks
    const tasks = await prisma.task.findMany({
        where: {
            status: { not: 'Completed' }
        },
        select: {
            id: true,
            title: true,
            dueDate: true,
            status: true,
        }
    });

    // Fetch deals with expected close date
    const deals = await prisma.deal.findMany({
        where: {
            expectedCloseDate: { not: null },
            stage: { notIn: ['Closed Won', 'Closed Lost'] }
        },
        select: {
            id: true,
            stage: true,
            expectedCloseDate: true,
            client: {
                select: { companyName: true }
            }
        }
    });

    // Transform to events
    const events = [
        ...tasks.map(task => ({
            id: task.id,
            title: task.title,
            date: task.dueDate,
            type: 'task' as const,
            status: task.status,
            url: '/tasks'
        })),
        ...deals.map(deal => ({
            id: deal.id,
            title: `Closing: ${deal.client.companyName}`,
            date: deal.expectedCloseDate!,
            type: 'deal' as const,
            status: deal.stage,
            url: '/deals'
        }))
    ];

    return (
        <div style={{ padding: '2rem', height: 'calc(100vh - 4rem)' }}>
            <CalendarView events={events} />
        </div>
    );
}
