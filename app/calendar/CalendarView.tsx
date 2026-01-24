'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckSquare, Briefcase } from 'lucide-react';
import Link from 'next/link';

interface CalendarEvent {
    id: number;
    title: string;
    date: Date;
    type: 'task' | 'deal';
    status?: string;
    description?: string;
    url: string;
}

interface CalendarPageProps {
    events: CalendarEvent[];
}

export default function CalendarView({ events }: CalendarPageProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month, 1).getDay();
    };

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const days = [];
    // Empty cells for previous month
    for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} style={{ backgroundColor: '#f8fafc', minHeight: '120px' }}></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const dayEvents = events.filter(e =>
            e.date.getDate() === day &&
            e.date.getMonth() === currentDate.getMonth() &&
            e.date.getFullYear() === currentDate.getFullYear()
        );

        const isToday = new Date().toDateString() === date.toDateString();

        days.push(
            <div key={day} style={{
                backgroundColor: 'white',
                minHeight: '120px',
                padding: '0.5rem',
                border: '1px solid #e2e8f0',
                position: 'relative'
            }}>
                <div style={{
                    fontWeight: '600',
                    marginBottom: '0.5rem',
                    color: isToday ? '#2563eb' : '#475569',
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>
                    <span style={isToday ? {
                        backgroundColor: '#dbeafe',
                        padding: '0.125rem 0.375rem',
                        borderRadius: '9999px'
                    } : {}}>
                        {day}
                    </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {dayEvents.map((event, idx) => (
                        <Link
                            key={idx}
                            href={event.url}
                            style={{
                                fontSize: '0.75rem',
                                padding: '0.25rem',
                                borderRadius: '0.25rem',
                                backgroundColor: event.type === 'task' ? '#f1f5f9' : '#dcfce7',
                                color: event.type === 'task' ? '#475569' : '#166534',
                                textDecoration: 'none',
                                display: 'block',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                borderLeft: `3px solid ${event.type === 'task' ? '#94a3b8' : '#22c55e'}`
                            }}
                            title={event.title}
                        >
                            {event.type === 'task' ? <CheckSquare size={10} style={{ display: 'inline', marginRight: '4px' }} /> : <Briefcase size={10} style={{ display: 'inline', marginRight: '4px' }} />}
                            {event.title}
                        </Link>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' }}>{monthName} {year}</h2>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={prevMonth} style={{ padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', backgroundColor: 'white', cursor: 'pointer' }}>
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={() => setCurrentDate(new Date())} style={{ padding: '0.5rem 1rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', backgroundColor: 'white', cursor: 'pointer', fontWeight: '500' }}>
                        Today
                    </button>
                    <button onClick={nextMonth} style={{ padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', backgroundColor: 'white', cursor: 'pointer' }}>
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', backgroundColor: '#e2e8f0', border: '1px solid #e2e8f0', borderRadius: '0.5rem', overflow: 'hidden' }}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} style={{ padding: '0.75rem', backgroundColor: '#f8fafc', textAlign: 'center', fontWeight: '600', color: '#64748b', fontSize: '0.875rem' }}>
                        {day}
                    </div>
                ))}
                {days}
            </div>
        </div>
    );
}
