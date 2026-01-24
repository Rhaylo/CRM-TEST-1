import { NextResponse } from 'next/server';
import { checkOverdueTasks, checkUpcomingTasks } from '@/app/tasks/notificationActions';

export async function GET() {
    try {
        const overdueResult = await checkOverdueTasks();
        const upcomingResult = await checkUpcomingTasks();

        return NextResponse.json({
            success: true,
            overdueChecked: overdueResult.checked,
            upcomingChecked: upcomingResult.checked,
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
