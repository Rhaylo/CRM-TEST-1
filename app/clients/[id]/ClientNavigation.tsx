'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ClientNavigationProps {
    prevClientId: number | null;
    nextClientId: number | null;
    currentIndex: number;
    totalClients: number;
}

export default function ClientNavigation({
    prevClientId,
    nextClientId,
    currentIndex,
    totalClients
}: ClientNavigationProps) {
    const router = useRouter();

    return (
        <div style={{
            position: 'fixed',
            top: '50%',
            right: '1rem',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            zIndex: 100,
        }}>
            {/* Previous Client Button */}
            <button
                onClick={() => prevClientId && router.push(`/clients/${prevClientId}`)}
                disabled={!prevClientId}
                style={{
                    padding: '0.75rem',
                    backgroundColor: prevClientId ? '#3b82f6' : '#cbd5e1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    cursor: prevClientId ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                    if (prevClientId) {
                        e.currentTarget.style.backgroundColor = '#2563eb';
                        e.currentTarget.style.transform = 'scale(1.1)';
                    }
                }}
                onMouseLeave={(e) => {
                    if (prevClientId) {
                        e.currentTarget.style.backgroundColor = '#3b82f6';
                        e.currentTarget.style.transform = 'scale(1)';
                    }
                }}
                title="Cliente anterior"
            >
                <ChevronLeft size={20} />
            </button>

            {/* Counter */}
            <div style={{
                backgroundColor: 'white',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                textAlign: 'center',
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#475569',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                minWidth: '3rem',
            }}>
                {currentIndex}/{totalClients}
            </div>

            {/* Next Client Button */}
            <button
                onClick={() => nextClientId && router.push(`/clients/${nextClientId}`)}
                disabled={!nextClientId}
                style={{
                    padding: '0.75rem',
                    backgroundColor: nextClientId ? '#3b82f6' : '#cbd5e1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    cursor: nextClientId ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                    if (nextClientId) {
                        e.currentTarget.style.backgroundColor = '#2563eb';
                        e.currentTarget.style.transform = 'scale(1.1)';
                    }
                }}
                onMouseLeave={(e) => {
                    if (nextClientId) {
                        e.currentTarget.style.backgroundColor = '#3b82f6';
                        e.currentTarget.style.transform = 'scale(1)';
                    }
                }}
                title="Cliente siguiente"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
}
