import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import TasksPageClient from './TasksPageClient';

export const dynamic = 'force-dynamic';

export default async function TasksPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const user = await getCurrentUser();
    if (!user) {
        redirect('/auth');
    }

    const params = await searchParams;

    const tasks = await prisma.task.findMany({
        where: {
            OR: [{ userId: user.id }, { userId: null }],
        },
        include: {
            client: true,
            notes: {
                orderBy: { createdAt: 'desc' },
            },
        },
        orderBy: {
            dueDate: 'asc',
        },
    });

    const clients = await prisma.client.findMany({
        where: {
            OR: [{ userId: user.id }, { userId: null }],
        },
        orderBy: {
            contactName: 'asc',
        },
    });

    return <TasksPageClient tasks={tasks} clients={clients} searchParams={params} />;
}
