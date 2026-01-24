import { prisma } from '@/lib/prisma';
import TasksPageClient from './TasksPageClient';

<<<<<<< HEAD
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function TasksPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const user = await getCurrentUser();
    if (!user) {
        redirect('/auth');
    }

    const params = await searchParams;

    const tasks = await prisma.task.findMany({
        where: {
            OR: [
                { userId: user.id },
                { userId: null }
            ]
        },
=======
export default async function TasksPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const params = await searchParams;

    const tasks = await prisma.task.findMany({
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
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
<<<<<<< HEAD
        where: {
            OR: [
                { userId: user.id },
                { userId: null }
            ]
        },
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
        orderBy: {
            contactName: 'asc',
        },
    });

    return <TasksPageClient tasks={tasks} clients={clients} searchParams={params} />;
}
