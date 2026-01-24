'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
<<<<<<< HEAD
<<<<<<< HEAD
import styles from './Dashboard.module.css';
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e

interface RevenueChartProps {
    data: { month: string; revenue: number }[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
<<<<<<< HEAD
<<<<<<< HEAD
    const GlassBar = ({ x, y, width, height }: { x?: number; y?: number; width?: number; height?: number }) => {
        if (x === undefined || y === undefined || width === undefined || height === undefined) return null;
        const radius = Math.min(12, width / 2);
        const glossHeight = Math.max(height * 0.45, 10);

        return (
            <g>
                <rect x={x} y={y} width={width} height={height} rx={radius} ry={radius} fill="url(#revenueGradient)" />
                <rect
                    x={x + 2}
                    y={y + 2}
                    width={Math.max(width - 4, 0)}
                    height={Math.max(glossHeight - 4, 0)}
                    rx={Math.max(radius - 2, 0)}
                    ry={Math.max(radius - 2, 0)}
                    fill="url(#revenueGloss)"
                />
            </g>
        );
    };

    return (
        <div className={`${styles.card} ${styles.chartCard}`}>
            <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Revenue Overview</h3>
                <span className={styles.cardMeta}>Monthly totals</span>
            </div>
            <div className={styles.chartBody}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <defs>
                            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#bbf7d0" stopOpacity="0.95" />
                                <stop offset="55%" stopColor="#22c55e" stopOpacity="0.6" />
                                <stop offset="100%" stopColor="#10b981" stopOpacity="0.35" />
                            </linearGradient>
                            <linearGradient id="revenueGloss" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
                                <stop offset="60%" stopColor="#ffffff" stopOpacity="0.35" />
                                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="4 6" vertical={false} stroke="rgba(148, 163, 184, 0.35)" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 12 }} tickFormatter={(value) => `$${value / 1000}k`} />
                        <Tooltip
                            cursor={{ fill: 'rgba(148, 163, 184, 0.12)' }}
                            contentStyle={{ borderRadius: '0.75rem', border: '1px solid rgba(15, 23, 42, 0.06)', backgroundColor: 'rgba(255, 255, 255, 0.96)', boxShadow: '0 18px 30px -20px rgba(15, 23, 42, 0.35)' }}
                        />
                        <Bar dataKey="revenue" shape={GlassBar} barSize={40} />
=======
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
    return (
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', height: '100%' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e293b', marginBottom: '1.5rem' }}>Revenue Overview</h3>
            <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(value) => `$${value / 1000}k`} />
                        <Tooltip
                            cursor={{ fill: '#f1f5f9' }}
                            contentStyle={{ borderRadius: '0.375rem', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        />
                        <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
<<<<<<< HEAD
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
