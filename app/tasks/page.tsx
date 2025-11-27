import { prisma } from '@/lib/prisma';
import TasksPageClient from './TasksPageClient';

export default async function TasksPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const params = await searchParams;

    const tasks = await prisma.task.findMany({
        include: {
            client: true,
            notes: {
                orderBy: { createdAt: 'desc' }
            }
        },
        orderBy: {
            dueDate: 'asc',
        },
    });

    const clients = await prisma.client.findMany({
        orderBy: {
            contactName: 'asc',
        },
    });

    return <TasksPageClient tasks={tasks} clients={clients} searchParams={params} />;
}
