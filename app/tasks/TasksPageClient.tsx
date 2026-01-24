'use client';

import { useState } from 'react';
import styles from './page.module.css';
import TaskTable from './TaskTable';
import AddTaskModal from './AddTaskModal';
import { Plus } from 'lucide-react';

export default function TasksPageClient({ tasks, clients, searchParams }: { tasks: any[]; clients: any[]; searchParams: any }) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
    const [filters, setFilters] = useState({
        client: searchParams.client || '',
        state: searchParams.state || '',
        status: searchParams.status || '',
    });
    const [sortBy, setSortBy] = useState(searchParams.sort || 'dueDate');

    // Filter tasks
<<<<<<< HEAD
<<<<<<< HEAD
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let filteredTasks = tasks.filter(task => {
        if (activeTab === 'active' && task.status === 'Completed') return false;
        if (activeTab === 'completed') {
            if (task.status !== 'Completed') return false;
            const completedDate = new Date(task.updatedAt);
            completedDate.setHours(0, 0, 0, 0);
            if (completedDate.getTime() !== today.getTime()) return false;
        }
=======
    let filteredTasks = tasks.filter(task => {
        if (activeTab === 'active' && task.status === 'Completed') return false;
        if (activeTab === 'completed' && task.status !== 'Completed') return false;
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
    let filteredTasks = tasks.filter(task => {
        if (activeTab === 'active' && task.status === 'Completed') return false;
        if (activeTab === 'completed' && task.status !== 'Completed') return false;
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e

        if (filters.client && task.clientId !== parseInt(filters.client)) return false;
        if (filters.status && task.status !== filters.status) return false;

        if (filters.state) {
<<<<<<< HEAD
<<<<<<< HEAD
=======
            const today = new Date();
            today.setHours(0, 0, 0, 0);
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
            const today = new Date();
            today.setHours(0, 0, 0, 0);
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
            const due = new Date(task.dueDate);
            due.setHours(0, 0, 0, 0);

            if (filters.state === 'Overdue' && (due >= today || task.status === 'Completed')) return false;
            if (filters.state === 'Due Today' && due.getTime() !== today.getTime()) return false;
            if (filters.state === 'Upcoming' && (due <= today || task.status === 'Completed')) return false;
        }

        return true;
    });

    // Sort tasks
    filteredTasks.sort((a, b) => {
        if (sortBy === 'dueDate') {
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        } else if (sortBy === 'priority') {
            const priorityOrder = { High: 3, Medium: 2, Low: 1 };
            return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
        } else if (sortBy === 'client') {
            return a.client.contactName.localeCompare(b.client.contactName);
        }
        return 0;
    });

    const handleClearFilters = () => {
        setFilters({ client: '', state: '', status: '' });
        setSortBy('dueDate');
    };

<<<<<<< HEAD
<<<<<<< HEAD
    const completedTodayCount = tasks.filter(task => {
        if (task.status !== 'Completed') return false;
        const completedDate = new Date(task.updatedAt);
        completedDate.setHours(0, 0, 0, 0);
        return completedDate.getTime() === today.getTime();
    }).length;

=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Tasks</h1>
                <button onClick={() => setShowAddModal(true)} className={styles.addButton}>
                    <Plus size={20} />
                    Add Task
                </button>
            </div>

            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'active' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('active')}
                >
                    Active Tasks ({tasks.filter(t => t.status !== 'Completed').length})
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'completed' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('completed')}
                >
<<<<<<< HEAD
<<<<<<< HEAD
                    Completed Today ({completedTodayCount})
=======
                    Completed Tasks ({tasks.filter(t => t.status === 'Completed').length})
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
                    Completed Tasks ({tasks.filter(t => t.status === 'Completed').length})
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
                </button>
            </div>

            <div className={styles.filtersSection}>
                <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>Client</label>
                    <select
                        className={styles.filterSelect}
                        value={filters.client}
                        onChange={(e) => setFilters({ ...filters, client: e.target.value })}
                    >
                        <option value="">All Clients</option>
                        {clients.map((client) => (
                            <option key={client.id} value={client.id}>
                                {client.contactName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>Task State</label>
                    <select
                        className={styles.filterSelect}
                        value={filters.state}
                        onChange={(e) => setFilters({ ...filters, state: e.target.value })}
                    >
                        <option value="">All States</option>
                        <option value="Upcoming">Upcoming</option>
                        <option value="Due Today">Due Today</option>
                        <option value="Overdue">Overdue</option>
                    </select>
                </div>

                <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>Status</label>
                    <select
                        className={styles.filterSelect}
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    >
                        <option value="">All Statuses</option>
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>

                <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>Sort By</label>
                    <select
                        className={styles.filterSelect}
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="dueDate">Due Date</option>
                        <option value="priority">Priority</option>
                        <option value="client">Client</option>
                    </select>
                </div>

                <button onClick={handleClearFilters} className={styles.clearButton}>
                    Clear Filters
                </button>
            </div>

            <TaskTable tasks={filteredTasks} clients={clients} />

            {showAddModal && (
                <AddTaskModal
                    clients={clients}
                    onClose={() => setShowAddModal(false)}
                    preSelectedClientId={filters.client ? parseInt(filters.client) : undefined}
                />
            )}
        </div>
    );
}
