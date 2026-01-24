export function getTaskState(dueDate: Date, status: string): 'Upcoming' | 'Due Today' | 'Overdue' {
    if (status === 'Completed') return 'Upcoming';

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);

    if (due < today) return 'Overdue';
    if (due.getTime() === today.getTime()) return 'Due Today';
    return 'Upcoming';
}

export function formatDueDate(dueDate: Date, dueTime?: string): string {
    const date = new Date(dueDate).toLocaleDateString();
    return dueTime ? `${date} ${dueTime}` : date;
}

export function getStateColor(state: string): { bg: string; text: string; border: string } {
    switch (state) {
        case 'Overdue':
            return { bg: '#fef2f2', text: '#dc2626', border: '#ef4444' };
        case 'Due Today':
            return { bg: '#fef3c7', text: '#92400e', border: '#f59e0b' };
        default:
            return { bg: '#f8fafc', text: '#475569', border: '#cbd5e1' };
    }
}

export function getPriorityColor(priority: string): string {
    switch (priority) {
        case 'High':
            return '#dc2626';
        case 'Medium':
            return '#f59e0b';
        case 'Low':
            return '#10b981';
        default:
            return '#64748b';
    }
}
