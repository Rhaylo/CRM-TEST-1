'use client';

import { DollarSign, Briefcase, Users, TrendingUp } from 'lucide-react';

interface KPICardsProps {
    totalRevenue: number;
    activeDeals: number;
    totalClients: number;
    dealsWon: number;
}

export default function KPICards({ totalRevenue, activeDeals, totalClients, dealsWon }: KPICardsProps) {
    const cards = [
        {
            title: 'Total Revenue',
            value: `$${totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            color: '#10b981',
            bgColor: '#d1fae5',
        },
        {
            title: 'Active Deals',
            value: activeDeals,
            icon: Briefcase,
            color: '#3b82f6',
            bgColor: '#dbeafe',
        },
        {
            title: 'Total Clients',
            value: totalClients,
            icon: Users,
            color: '#8b5cf6',
            bgColor: '#ede9fe',
        },
        {
            title: 'Deals Won',
            value: dealsWon,
            icon: TrendingUp,
            color: '#f59e0b',
            bgColor: '#fef3c7',
        },
    ];

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            {cards.map((card, index) => {
                const Icon = card.icon;
                return (
                    <div key={index} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: card.bgColor, color: card.color }}>
                            <Icon size={24} />
                        </div>
                        <div>
                            <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>{card.title}</p>
                            <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' }}>{card.value}</h3>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
