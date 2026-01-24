'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
<<<<<<< HEAD
import styles from './Dashboard.module.css';
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e

interface DealPipelineProps {
    data: { name: string; value: number; color: string }[];
}

export default function DealPipeline({ data }: DealPipelineProps) {
    return (
<<<<<<< HEAD
        <div className={`${styles.card} ${styles.chartCard}`}>
            <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Deal Pipeline</h3>
                <span className={styles.cardMeta}>Stage distribution</span>
            </div>
            <div className={styles.chartBody}>
=======
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', height: '100%' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e293b', marginBottom: '1.5rem' }}>Deal Pipeline</h3>
            <div style={{ height: '300px' }}>
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
<<<<<<< HEAD
                            innerRadius={62}
                            outerRadius={86}
                            paddingAngle={4}
                            dataKey="value"
                            stroke="rgba(248, 250, 252, 0.95)"
                            strokeWidth={2}
=======
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
<<<<<<< HEAD
                            contentStyle={{ borderRadius: '0.75rem', border: '1px solid rgba(15, 23, 42, 0.06)', backgroundColor: 'rgba(255, 255, 255, 0.96)', boxShadow: '0 18px 30px -20px rgba(15, 23, 42, 0.35)' }}
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ color: '#475569', fontSize: '0.8rem' }} />
=======
                            contentStyle={{ borderRadius: '0.375rem', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
