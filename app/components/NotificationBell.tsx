'use client';

import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead, deleteNotification } from '@/app/notifications/actions';

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [previousCount, setPreviousCount] = useState(0);

    useEffect(() => {
        loadNotifications();
        loadUnreadCount();

        // Poll for new notifications every 30 seconds
        const interval = setInterval(() => {
            loadUnreadCount();
        }, 30000);

        // Listen for notification clicks in Electron
        if (typeof window !== 'undefined' && (window as any).electron) {
            (window as any).electron.onNotificationClicked((actionUrl: string) => {
                window.location.href = actionUrl;
            });
        }

        return () => clearInterval(interval);
    }, []);

    const loadNotifications = async () => {
        const data = await getNotifications(20);
        setNotifications(data);
    };

    const loadUnreadCount = async () => {
        const count = await getUnreadCount();

        // Show native notification if count increased
        if (count > previousCount && typeof window !== 'undefined' && (window as any).electron) {
            const newNotifications = await getNotifications(count - previousCount);
            if (newNotifications.length > 0) {
                const latest = newNotifications[0];
                (window as any).electron.showNotification({
                    title: latest.title,
                    body: latest.message,
                    actionUrl: latest.actionUrl,
                });
            }
        }

        setPreviousCount(count);
        setUnreadCount(count);
    };

    const handleNotificationClick = async (notification: any) => {
        if (!notification.read) {
            await markAsRead(notification.id);
            await loadUnreadCount();
            await loadNotifications();
        }
        if (notification.actionUrl) {
            window.location.href = notification.actionUrl;
        }
        setIsOpen(false);
    };

    const handleMarkAllRead = async () => {
        await markAllAsRead();
        await loadUnreadCount();
        await loadNotifications();
    };

    const handleDelete = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        await deleteNotification(id);
        await loadNotifications();
        await loadUnreadCount();
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'task': return '#3b82f6';
            case 'deal': return '#10b981';
            case 'automation': return '#8b5cf6';
            case 'system': return '#f59e0b';
            default: return '#6b7280';
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'task': return 'Tarea';
            case 'deal': return 'Deal';
            case 'automation': return 'Automation';
            case 'system': return 'Sistema';
            default: return type;
        }
    };

    return (
        <div style={{ position: 'relative' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'relative',
                    padding: '0.5rem',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '0.375rem',
                    transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
                <Bell size={20} color="#475569" />
                {unreadCount > 0 && (
                    <span style={{
                        position: 'absolute',
                        top: '0.25rem',
                        right: '0.25rem',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        borderRadius: '9999px',
                        fontSize: '0.625rem',
                        fontWeight: '600',
                        padding: '0.125rem 0.375rem',
                        minWidth: '1.25rem',
                        textAlign: 'center',
                    }}>
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div
                        onClick={() => setIsOpen(false)}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 40,
                        }}
                    />
                    <div style={{
                        position: 'absolute',
                        right: 0,
                        top: '3rem',
                        width: '400px',
                        maxHeight: '500px',
                        backgroundColor: 'white',
                        borderRadius: '0.5rem',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                        zIndex: 50,
                        overflow: 'hidden',
                        border: '1px solid #e2e8f0',
                    }}>
                        <div style={{
                            padding: '1rem',
                            borderBottom: '1px solid #e2e8f0',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '600', color: '#1e293b' }}>
                                Notificaciones
                            </h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllRead}
                                    style={{
                                        fontSize: '0.75rem',
                                        color: '#3b82f6',
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontWeight: '500',
                                    }}
                                >
                                    Marcar todas como leídas
                                </button>
                            )}
                        </div>

                        <div style={{
                            maxHeight: '400px',
                            overflowY: 'auto',
                        }}>
                            {notifications.length === 0 ? (
                                <div style={{
                                    padding: '2rem',
                                    textAlign: 'center',
                                    color: '#64748b',
                                    fontSize: '0.875rem',
                                }}>
                                    No hay notificaciones
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        onClick={() => handleNotificationClick(notification)}
                                        style={{
                                            padding: '1rem',
                                            borderBottom: '1px solid #f1f5f9',
                                            cursor: notification.actionUrl ? 'pointer' : 'default',
                                            backgroundColor: notification.read ? 'white' : '#eff6ff',
                                            transition: 'background-color 0.2s',
                                        }}
                                        onMouseEnter={(e) => {
                                            if (notification.actionUrl) {
                                                e.currentTarget.style.backgroundColor = '#dbeafe';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = notification.read ? 'white' : '#eff6ff';
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                                    <span style={{
                                                        fontSize: '0.625rem',
                                                        fontWeight: '600',
                                                        color: getTypeColor(notification.type),
                                                        backgroundColor: `${getTypeColor(notification.type)}20`,
                                                        padding: '0.125rem 0.5rem',
                                                        borderRadius: '9999px',
                                                    }}>
                                                        {getTypeLabel(notification.type)}
                                                    </span>
                                                    {!notification.read && (
                                                        <span style={{
                                                            width: '0.5rem',
                                                            height: '0.5rem',
                                                            backgroundColor: '#3b82f6',
                                                            borderRadius: '9999px',
                                                        }} />
                                                    )}
                                                </div>
                                                <h4 style={{
                                                    margin: 0,
                                                    fontSize: '0.875rem',
                                                    fontWeight: '600',
                                                    color: '#1e293b',
                                                    marginBottom: '0.25rem',
                                                }}>
                                                    {notification.title}
                                                </h4>
                                                <p style={{
                                                    margin: 0,
                                                    fontSize: '0.75rem',
                                                    color: '#64748b',
                                                    lineHeight: '1.4',
                                                }}>
                                                    {notification.message}
                                                </p>
                                                <span style={{
                                                    fontSize: '0.625rem',
                                                    color: '#94a3b8',
                                                    marginTop: '0.5rem',
                                                    display: 'block',
                                                }}>
                                                    {new Date(notification.createdAt).toLocaleString('es-ES', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </span>
                                            </div>
                                            <button
                                                onClick={(e) => handleDelete(notification.id, e)}
                                                style={{
                                                    padding: '0.25rem',
                                                    backgroundColor: 'transparent',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    color: '#94a3b8',
                                                    fontSize: '1.25rem',
                                                    lineHeight: 1,
                                                }}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
