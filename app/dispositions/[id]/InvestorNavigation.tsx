'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface InvestorNavigationProps {
    prevInvestorId: number | null;
    nextInvestorId: number | null;
    currentIndex: number;
    totalInvestors: number;
}

export default function InvestorNavigation({
    prevInvestorId,
    nextInvestorId,
    currentIndex,
    totalInvestors
}: InvestorNavigationProps) {
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
            {/* Previous Investor Button */}
            <button
                onClick={() => prevInvestorId && router.push(`/dispositions/${prevInvestorId}`)}
                disabled={!prevInvestorId}
                style={{
                    padding: '0.75rem',
                    backgroundColor: prevInvestorId ? '#3b82f6' : '#cbd5e1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    cursor: prevInvestorId ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                    if (prevInvestorId) {
                        e.currentTarget.style.backgroundColor = '#2563eb';
                        e.currentTarget.style.transform = 'scale(1.1)';
                    }
                }}
                onMouseLeave={(e) => {
                    if (prevInvestorId) {
                        e.currentTarget.style.backgroundColor = '#3b82f6';
                        e.currentTarget.style.transform = 'scale(1)';
                    }
                }}
                title="Inversor anterior"
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
                {currentIndex}/{totalInvestors}
            </div>

            {/* Next Investor Button */}
            <button
                onClick={() => nextInvestorId && router.push(`/dispositions/${nextInvestorId}`)}
                disabled={!nextInvestorId}
                style={{
                    padding: '0.75rem',
                    backgroundColor: nextInvestorId ? '#3b82f6' : '#cbd5e1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    cursor: nextInvestorId ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                    if (nextInvestorId) {
                        e.currentTarget.style.backgroundColor = '#2563eb';
                        e.currentTarget.style.transform = 'scale(1.1)';
                    }
                }}
                onMouseLeave={(e) => {
                    if (nextInvestorId) {
                        e.currentTarget.style.backgroundColor = '#3b82f6';
                        e.currentTarget.style.transform = 'scale(1)';
                    }
                }}
                title="Inversor siguiente"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
}
