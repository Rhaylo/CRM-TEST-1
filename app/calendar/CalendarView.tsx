'use client';

import { useEffect, useMemo, useState } from 'react';
import { Bell, CalendarPlus, ChevronLeft, ChevronRight, Paperclip, Pencil, Save, Trash2, X } from 'lucide-react';
import styles from './Calendar.module.css';

interface CalendarAttachment {
    id: number;
    fileName: string;
}

interface CalendarEvent {
    id: number;
    title: string;
    description?: string | null;
    startAt: string;
    endAt?: string | null;
    allDay: boolean;
    reminderAt?: string | null;
    attachments?: CalendarAttachment[];
}

interface EventFormState {
    id?: number | null;
    title: string;
    description: string;
    date: string;
    startTime: string;
    endTime: string;
    allDay: boolean;
    reminderTime: string;
    files: File[];
}

const toDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
const formatMonthLabel = (date: Date) => date.toLocaleString('default', { month: 'long', year: 'numeric' });

const buildDateTime = (date: string, time: string) => {
    const value = `${date}T${time}:00`;
    return new Date(value).toISOString();
};

const formatTimeLabel = (value?: string | null) => {
    if (!value) return '';
    const date = new Date(value);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default function CalendarView() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(false);
    const [note, setNote] = useState('');
    const [noteSaving, setNoteSaving] = useState(false);
    const [formOpen, setFormOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
    const [eventSaving, setEventSaving] = useState(false);
    const [eventError, setEventError] = useState('');
    const [formState, setFormState] = useState<EventFormState>({
        id: null,
        title: '',
        description: '',
        date: toDateKey(new Date()),
        startTime: '09:00',
        endTime: '10:00',
        allDay: false,
        reminderTime: '',
        files: [],
    });

    const getWeekStart = (date: Date) => {
        const day = date.getDay();
        const start = new Date(date);
        start.setDate(date.getDate() - day);
        start.setHours(0, 0, 0, 0);
        return start;
    };

    const monthLabel = useMemo(() => {
        if (viewMode === 'month') {
            return formatMonthLabel(currentDate);
        }
        const start = getWeekStart(currentDate);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        const startLabel = start.toLocaleDateString('default', { month: 'short', day: 'numeric' });
        const endLabel = end.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' });
        return `${startLabel} - ${endLabel}`;
    }, [currentDate, viewMode]);

    const fetchEvents = async (date: Date) => {
        const start = viewMode === 'week'
            ? getWeekStart(date)
            : new Date(date.getFullYear(), date.getMonth(), 1);
        const end = viewMode === 'week'
            ? new Date(start.getFullYear(), start.getMonth(), start.getDate() + 7)
            : new Date(date.getFullYear(), date.getMonth() + 1, 1);
        setLoading(true);
        try {
            const response = await fetch(`/api/calendar/events?start=${encodeURIComponent(start.toISOString())}&end=${encodeURIComponent(end.toISOString())}`);
            if (response.ok) {
                const data = await response.json();
                setEvents(data.events || []);
            }
        } catch (error) {
            console.error('Failed to load events:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchNote = async (date: Date) => {
        try {
            const response = await fetch(`/api/calendar/notes?date=${toDateKey(date)}`);
            if (response.ok) {
                const data = await response.json();
                setNote(data?.note?.content || '');
            }
        } catch (error) {
            console.error('Failed to load note:', error);
        }
    };

    useEffect(() => {
        fetchEvents(currentDate);
    }, [currentDate, viewMode]);

    useEffect(() => {
        fetchNote(selectedDate);
        setFormState((prev) => ({ ...prev, date: toDateKey(selectedDate) }));
    }, [selectedDate]);

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const calendarDays = [] as (Date | null)[];
    for (let i = 0; i < firstDay; i += 1) {
        calendarDays.push(null);
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
        calendarDays.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    }

    const eventsByDate = useMemo(() => {
        const map = new Map<string, CalendarEvent[]>();
        events.forEach((event) => {
            const key = toDateKey(new Date(event.startAt));
            if (!map.has(key)) map.set(key, []);
            map.get(key)?.push(event);
        });
        return map;
    }, [events]);

    const remindersUpcoming = useMemo(() => {
        const now = new Date();
        const end = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        return events
            .filter((event) => event.reminderAt)
            .map((event) => ({
                event,
                reminder: new Date(event.reminderAt as string),
            }))
            .filter(({ reminder }) => reminder >= now && reminder <= end)
            .sort((a, b) => a.reminder.getTime() - b.reminder.getTime());
    }, [events]);

    const urgentReminders = useMemo(() => {
        const now = new Date();
        const end = new Date(now.getTime() + 60 * 60 * 1000);
        return remindersUpcoming.filter(({ reminder }) => reminder <= end);
    }, [remindersUpcoming]);

    const selectedEvents = eventsByDate.get(toDateKey(selectedDate)) || [];

    const openNewEvent = () => {
        setEventError('');
        setFormState({
            id: null,
            title: '',
            description: '',
            date: toDateKey(selectedDate),
            startTime: '09:00',
            endTime: '10:00',
            allDay: false,
            reminderTime: '',
            files: [],
        });
        setFormOpen(true);
    };

    const openEditEvent = (event: CalendarEvent) => {
        setEventError('');
        const start = new Date(event.startAt);
        const end = event.endAt ? new Date(event.endAt) : start;
        setFormState({
            id: event.id,
            title: event.title,
            description: event.description || '',
            date: toDateKey(start),
            startTime: start.toISOString().slice(11, 16),
            endTime: end.toISOString().slice(11, 16),
            allDay: event.allDay,
            reminderTime: event.reminderAt ? new Date(event.reminderAt).toISOString().slice(11, 16) : '',
            files: [],
        });
        setFormOpen(true);
    };

    const handleSaveEvent = async () => {
        if (!formState.title) {
            setEventError('Title is required.');
            return;
        }
        const payload = {
            title: formState.title,
            description: formState.description,
            startAt: formState.allDay ? `${formState.date}T00:00:00` : buildDateTime(formState.date, formState.startTime),
            endAt: formState.allDay ? `${formState.date}T23:59:00` : buildDateTime(formState.date, formState.endTime),
            allDay: formState.allDay,
            reminderAt: formState.reminderTime ? buildDateTime(formState.date, formState.reminderTime) : null,
        };

        try {
            setEventSaving(true);
            setEventError('');
            const response = await fetch(`/api/calendar/events${formState.id ? `/${formState.id}` : ''}`, {
                method: formState.id ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                let message = 'Unable to save event.';
                try {
                    const data = await response.json();
                    if (data?.error) message = data.error;
                } catch (error) {
                    const text = await response.text();
                    if (text) message = text;
                }
                setEventError(message);
                return;
            }

            const data = await response.json();
            const eventId = formState.id || data?.event?.id;

            if (eventId && formState.files.length > 0) {
                for (const file of formState.files) {
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('eventId', String(eventId));
                    await fetch('/api/calendar/attachments', {
                        method: 'POST',
                        body: formData,
                    });
                }
            }

            setFormOpen(false);
            await fetchEvents(currentDate);
        } catch (error) {
            console.error('Failed to save event:', error);
            setEventError('Unable to save event. Check server logs.');
        } finally {
            setEventSaving(false);
        }
    };

    const handleDeleteEvent = async (eventId: number) => {
        try {
            const response = await fetch(`/api/calendar/events/${eventId}`, { method: 'DELETE' });
            if (response.ok) {
                await fetchEvents(currentDate);
            }
        } catch (error) {
            console.error('Failed to delete event:', error);
        }
    };

    const handleSaveNote = async () => {
        setNoteSaving(true);
        try {
            await fetch('/api/calendar/notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: toDateKey(selectedDate),
                    content: note,
                })
            });
        } catch (error) {
            console.error('Failed to save note:', error);
        } finally {
            setNoteSaving(false);
        }
    };

    const renderMonthView = () => (
        <>
            <div className={styles.weekHeader}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className={styles.weekDay}>{day}</div>
                ))}
            </div>
            <div className={styles.grid}>
                {calendarDays.map((date, index) => {
                    if (!date) {
                        return <div key={`empty-${index}`} className={styles.emptyCell} />;
                    }
                    const key = toDateKey(date);
                    const dayEvents = eventsByDate.get(key) || [];
                    const isToday = key === toDateKey(new Date());
                    const isSelected = key === toDateKey(selectedDate);

                    return (
                        <button
                            key={key}
                            className={`${styles.dayCell} ${isSelected ? styles.daySelected : ''}`}
                            onClick={() => setSelectedDate(date)}
                        >
                            <div className={styles.dayHeader}>
                                <span className={`${styles.dayNumber} ${isToday ? styles.dayToday : ''}`}>
                                    {date.getDate()}
                                </span>
                                {dayEvents.length > 0 && (
                                    <span className={styles.eventCount}>{dayEvents.length}</span>
                                )}
                            </div>
                            <div className={styles.dayEvents}>
                                {dayEvents.slice(0, 3).map((event) => (
                                    <span key={event.id} className={styles.eventChip}>
                                        {event.title}
                                    </span>
                                ))}
                                {dayEvents.length > 3 && (
                                    <span className={styles.moreChip}>+{dayEvents.length - 3} more</span>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </>
    );

    const renderWeekView = () => {
        const weekStart = getWeekStart(currentDate);
        const weekDays = Array.from({ length: 7 }).map((_, index) => {
            const date = new Date(weekStart);
            date.setDate(weekStart.getDate() + index);
            return date;
        });

        return (
            <div className={styles.weekGrid}>
                {weekDays.map((date) => {
                    const key = toDateKey(date);
                    const dayEvents = eventsByDate.get(key) || [];
                    const isSelected = key === toDateKey(selectedDate);
                    const isToday = key === toDateKey(new Date());
                    return (
                        <button
                            key={key}
                            className={`${styles.weekColumn} ${isSelected ? styles.daySelected : ''}`}
                            onClick={() => setSelectedDate(date)}
                        >
                            <div className={styles.weekColumnHeader}>
                                <span className={styles.weekDayLabel}>{date.toLocaleDateString('default', { weekday: 'short' })}</span>
                                <span className={`${styles.weekDateLabel} ${isToday ? styles.dayToday : ''}`}>
                                    {date.getDate()}
                                </span>
                            </div>
                            <div className={styles.weekEvents}>
                                {dayEvents.length === 0 && (
                                    <span className={styles.weekEmpty}>No events</span>
                                )}
                                {dayEvents.map((event) => (
                                    <span key={event.id} className={styles.weekEvent}>
                                        {event.title}
                                    </span>
                                ))}
                            </div>
                        </button>
                    );
                })}
            </div>
        );
    };

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <p className={styles.eyebrow}>Calendar</p>
                    <h1 className={styles.title}>{monthLabel}</h1>
                </div>
                <div className={styles.headerActions}>
                    <button className={styles.ghostButton} onClick={() => {
                        const now = new Date();
                        setCurrentDate(now);
                        setSelectedDate(now);
                    }}>
                        Today
                    </button>
                    <div className={styles.viewToggle}>
                        <button
                            className={`${styles.toggleButton} ${viewMode === 'month' ? styles.toggleActive : ''}`}
                            onClick={() => setViewMode('month')}
                        >
                            Month
                        </button>
                        <button
                            className={`${styles.toggleButton} ${viewMode === 'week' ? styles.toggleActive : ''}`}
                            onClick={() => setViewMode('week')}
                        >
                            Week
                        </button>
                    </div>
                    <div className={styles.navButtons}>
                        <button
                            className={styles.iconButton}
                            onClick={() => {
                                const nextDate = viewMode === 'week'
                                    ? new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7)
                                    : new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
                                setCurrentDate(nextDate);
                                setSelectedDate(nextDate);
                            }}
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            className={styles.iconButton}
                            onClick={() => {
                                const nextDate = viewMode === 'week'
                                    ? new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7)
                                    : new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
                                setCurrentDate(nextDate);
                                setSelectedDate(nextDate);
                            }}
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                    <button className={styles.primaryButton} onClick={openNewEvent}>
                        <CalendarPlus size={16} />
                        New event
                    </button>
                </div>
            </div>

            <div className={styles.layout}>
                <section className={styles.calendarCard}>
                    {urgentReminders.length > 0 && (
                        <div className={styles.reminderBanner}>
                            <Bell size={16} />
                            {urgentReminders.length} reminder{urgentReminders.length > 1 ? 's' : ''} in the next hour
                        </div>
                    )}
                    {viewMode === 'month' ? renderMonthView() : renderWeekView()}
                    {loading && <div className={styles.loading}>Loading events...</div>}
                </section>

                <aside className={styles.sidebar}>
                    <div className={styles.sidebarSection}>
                        <h2 className={styles.sidebarTitle}>Selected day</h2>
                        <p className={styles.sidebarDate}>{selectedDate.toDateString()}</p>
                    </div>

                    <div className={styles.sidebarSection}>
                        <div className={styles.sectionHeader}>
                            <h3>Events</h3>
                            <button className={styles.linkButton} onClick={openNewEvent}>Add</button>
                        </div>
                        <div className={styles.eventList}>
                            {selectedEvents.length === 0 && (
                                <p className={styles.emptyState}>No events scheduled.</p>
                            )}
                            {selectedEvents.map((event) => (
                                <div key={event.id} className={styles.eventRow}>
                                    <div>
                                        <strong>{event.title}</strong>
                                        <div className={styles.eventMeta}>
                                            <span>{event.allDay ? 'All day' : formatTimeLabel(event.startAt)}</span>
                                            {event.reminderAt && (
                                                <span className={styles.eventReminder}>
                                                    <Bell size={12} /> {formatTimeLabel(event.reminderAt)}
                                                </span>
                                            )}
                                        </div>
                                        {event.attachments && event.attachments.length > 0 && (
                                            <div className={styles.attachmentList}>
                                                {event.attachments.map((file) => (
                                                    <a
                                                        key={file.id}
                                                        href={`/api/calendar/attachments/${file.id}`}
                                                        className={styles.attachmentLink}
                                                    >
                                                        <Paperclip size={12} /> {file.fileName}
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles.eventActions}>
                                        <button className={styles.iconButton} onClick={() => openEditEvent(event)}>
                                            <Pencil size={14} />
                                        </button>
                                        <button className={styles.iconButton} onClick={() => handleDeleteEvent(event.id)}>
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.sidebarSection}>
                        <div className={styles.sectionHeader}>
                            <h3>Reminders</h3>
                        </div>
                        <div className={styles.eventList}>
                            {remindersUpcoming.length === 0 && (
                                <p className={styles.emptyState}>No reminders in the next 24 hours.</p>
                            )}
                            {remindersUpcoming.map(({ event, reminder }) => (
                                <div key={event.id} className={styles.reminderRow}>
                                    <div>
                                        <strong>{event.title}</strong>
                                        <div className={styles.eventMeta}>
                                            <span>{reminder.toLocaleDateString()}</span>
                                            <span className={styles.eventReminder}>
                                                <Bell size={12} /> {formatTimeLabel(reminder.toISOString())}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.sidebarSection}>
                        <div className={styles.sectionHeader}>
                            <h3>Daily notes</h3>
                            <button className={styles.linkButton} onClick={handleSaveNote} disabled={noteSaving}>
                                {noteSaving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                        <textarea
                            className={styles.notesInput}
                            value={note}
                            onChange={(event) => setNote(event.target.value)}
                            placeholder="Write notes for this day..."
                        />
                    </div>

                    {formOpen && (
                        <div className={styles.sidebarSection}>
                            <div className={styles.sectionHeader}>
                                <h3>{formState.id ? 'Edit event' : 'New event'}</h3>
                                <button className={styles.iconButton} onClick={() => setFormOpen(false)}>
                                    <X size={14} />
                                </button>
                            </div>
                            <div className={styles.formGrid}>
                                <label className={styles.formLabel}>
                                    Title
                                    <input
                                        className={styles.input}
                                        value={formState.title}
                                        onChange={(event) => setFormState({ ...formState, title: event.target.value })}
                                    />
                                </label>
                                <label className={styles.formLabel}>
                                    Date
                                    <input
                                        className={styles.input}
                                        type="date"
                                        value={formState.date}
                                        onChange={(event) => setFormState({ ...formState, date: event.target.value })}
                                    />
                                </label>
                                <div className={styles.formRow}>
                                    <label className={styles.formLabel}>
                                        Start
                                        <input
                                            className={styles.input}
                                            type="time"
                                            value={formState.startTime}
                                            onChange={(event) => setFormState({ ...formState, startTime: event.target.value })}
                                            disabled={formState.allDay}
                                        />
                                    </label>
                                    <label className={styles.formLabel}>
                                        End
                                        <input
                                            className={styles.input}
                                            type="time"
                                            value={formState.endTime}
                                            onChange={(event) => setFormState({ ...formState, endTime: event.target.value })}
                                            disabled={formState.allDay}
                                        />
                                    </label>
                                </div>
                                <label className={styles.checkboxRow}>
                                    <input
                                        type="checkbox"
                                        checked={formState.allDay}
                                        onChange={(event) => setFormState({ ...formState, allDay: event.target.checked })}
                                    />
                                    All day
                                </label>
                                <label className={styles.formLabel}>
                                    Reminder time
                                    <input
                                        className={styles.input}
                                        type="time"
                                        value={formState.reminderTime}
                                        onChange={(event) => setFormState({ ...formState, reminderTime: event.target.value })}
                                    />
                                </label>
                                <label className={styles.formLabel}>
                                    Description
                                    <textarea
                                        className={styles.textarea}
                                        value={formState.description}
                                        onChange={(event) => setFormState({ ...formState, description: event.target.value })}
                                    />
                                </label>
                                <label className={styles.formLabel}>
                                    Attachments
                                    <input
                                        className={styles.input}
                                        type="file"
                                        multiple
                                        onChange={(event) => setFormState({ ...formState, files: Array.from(event.target.files || []) })}
                                    />
                                </label>
                                <div className={styles.formActions}>
                                    <button className={styles.primaryButton} onClick={handleSaveEvent} disabled={eventSaving}>
                                        <Save size={16} />
                                        {eventSaving ? 'Saving...' : formState.id ? 'Update' : 'Create'}
                                    </button>
                                    <button className={styles.ghostButton} onClick={() => setFormOpen(false)}>
                                        Cancel
                                    </button>
                                </div>
                                {eventError && (
                                    <p className={styles.formError}>{eventError}</p>
                                )}
                            </div>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
}
