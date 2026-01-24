'use client';

import type { CSSProperties } from 'react';
import { DollarSign, Briefcase, Users, TrendingUp } from 'lucide-react';
import styles from './Dashboard.module.css';

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
            color: '#2563eb',
            bgColor: '#dbeafe',
        },
        {
            title: 'Active Deals',
            value: activeDeals,
            icon: Briefcase,
            color: '#8b5cf6',
            bgColor: '#ede9fe',
        },
        {
            title: 'Total Clients',
            value: totalClients,
            icon: Users,
            color: '#6366f1',
            bgColor: '#e0e7ff',
        },
        {
            title: 'Deals Won',
            value: dealsWon,
            icon: TrendingUp,
            color: '#22c55e',
            bgColor: '#dcfce7',
        },
    ];

    return (
        <div className={styles.kpiCards}>
            {cards.map((card, index) => {
                const Icon = card.icon;
                const isHero = index === 0;
                return (
                    <div
                        key={index}
                        className={`${styles.kpiCard} ${isHero ? styles.kpiCardHero : ''}`}
                        style={{ '--accent': card.color, '--accent-soft': card.bgColor } as CSSProperties}
                    >
                        <div className={styles.kpiIcon}>
                            <Icon size={24} />
                        </div>
                        <div>
                            <p className={styles.kpiLabel}>{card.title}</p>
                            <h3 className={styles.kpiValue}>{card.value}</h3>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
