'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CalendarDays } from 'lucide-react';
import styles from './Dashboard.module.css';

interface CalendarEvent {
    id: number;
    title: string;
    startAt: string;
    allDay: boolean;
    reminderAt?: string | null;
}

const formatDate = (value: string) => {
    const date = new Date(value);
    return date.toLocaleDateString('default', { month: 'short', day: 'numeric' });
};

const formatTime = (value: string) => {
    const date = new Date(value);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default function CalendarWidget() {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [reminders, setReminders] = useState<CalendarEvent[]>([]);

    useEffect(() => {
        const fetchUpcoming = async () => {
            const now = new Date();
            const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const end = new Date(start);
            end.setDate(end.getDate() + 30);

            try {
                const response = await fetch(`/api/calendar/events?start=${encodeURIComponent(start.toISOString())}&end=${encodeURIComponent(end.toISOString())}`);
                if (response.ok) {
                    const data = await response.json();
                    const items = data.events || [];
                    setEvents(items.slice(0, 5));

                    const now = new Date();
                    const nextDay = new Date(now.getTime() + 24 * 60 * 60 * 1000);
                    const reminderItems = items
                        .filter((event: CalendarEvent) => event.reminderAt)
                        .filter((event: CalendarEvent) => {
                            const reminderDate = new Date(event.reminderAt as string);
                            return reminderDate >= now && reminderDate <= nextDay;
                        })
                        .slice(0, 3);
                    setReminders(reminderItems);
                }
            } catch (error) {
                console.error('Failed to load upcoming events:', error);
            }
        };

        fetchUpcoming();
    }, []);

    return (
        <div className={`${styles.card} ${styles.calendarWidget}`}>
            <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Calendar</h3>
                <Link href="/calendar" className={styles.cardLink}>Open</Link>
            </div>
            {reminders.length > 0 && (
                <div className={styles.calendarReminders}>
                    <p className={styles.calendarSectionTitle}>Reminders</p>
                    {reminders.map((event) => (
                        <div key={`reminder-${event.id}`} className={styles.calendarReminderItem}>
                            <span className={styles.calendarReminderTitle}>{event.title}</span>
                            <span className={styles.calendarTime}>{formatTime(event.reminderAt as string)}</span>
                        </div>
                    ))}
                </div>
            )}
            <div className={styles.calendarList}>
                {events.length === 0 && (
                    <p className={styles.calendarEmpty}>No upcoming events.</p>
                )}
                {events.map((event) => (
                    <div key={event.id} className={styles.calendarItem}>
                        <div className={styles.calendarBadge}>
                            <CalendarDays size={14} />
                            {formatDate(event.startAt)}
                        </div>
                        <div>
                            <strong className={styles.calendarTitle}>{event.title}</strong>
                            <p className={styles.calendarTime}>
                                {event.allDay ? 'All day' : formatTime(event.startAt)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
