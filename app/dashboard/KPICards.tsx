'use client';

<<<<<<< HEAD
<<<<<<< HEAD
import type { CSSProperties } from 'react';
import { DollarSign, Briefcase, Users, TrendingUp } from 'lucide-react';
import styles from './Dashboard.module.css';
=======
import { DollarSign, Briefcase, Users, TrendingUp } from 'lucide-react';
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
import { DollarSign, Briefcase, Users, TrendingUp } from 'lucide-react';
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e

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
<<<<<<< HEAD
<<<<<<< HEAD
            color: '#2563eb',
            bgColor: '#dbeafe',
=======
            color: '#10b981',
            bgColor: '#d1fae5',
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
            color: '#10b981',
            bgColor: '#d1fae5',
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
        },
        {
            title: 'Active Deals',
            value: activeDeals,
            icon: Briefcase,
<<<<<<< HEAD
<<<<<<< HEAD
            color: '#8b5cf6',
            bgColor: '#ede9fe',
=======
            color: '#3b82f6',
            bgColor: '#dbeafe',
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
            color: '#3b82f6',
            bgColor: '#dbeafe',
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
        },
        {
            title: 'Total Clients',
            value: totalClients,
            icon: Users,
<<<<<<< HEAD
<<<<<<< HEAD
            color: '#6366f1',
            bgColor: '#e0e7ff',
=======
            color: '#8b5cf6',
            bgColor: '#ede9fe',
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
            color: '#8b5cf6',
            bgColor: '#ede9fe',
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
        },
        {
            title: 'Deals Won',
            value: dealsWon,
            icon: TrendingUp,
<<<<<<< HEAD
<<<<<<< HEAD
            color: '#22c55e',
            bgColor: '#dcfce7',
=======
            color: '#f59e0b',
            bgColor: '#fef3c7',
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
            color: '#f59e0b',
            bgColor: '#fef3c7',
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
        },
    ];

    return (
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
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
<<<<<<< HEAD
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
