'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import styles from './Dashboard.module.css';

interface DealPipelineProps {
    data: { name: string; value: number; color: string }[];
}

export default function DealPipeline({ data }: DealPipelineProps) {
    return (
        <div className={`${styles.card} ${styles.chartCard}`}>
            <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Deal Pipeline</h3>
                <span className={styles.cardMeta}>Stage distribution</span>
            </div>
            <div className={styles.chartBody}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={62}
                            outerRadius={86}
                            paddingAngle={4}
                            dataKey="value"
                            stroke="rgba(248, 250, 252, 0.95)"
                            strokeWidth={2}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                borderRadius: '0.75rem',
                                border: '1px solid rgba(15, 23, 42, 0.06)',
                                backgroundColor: 'rgba(255, 255, 255, 0.96)',
                                boxShadow: '0 18px 30px -20px rgba(15, 23, 42, 0.35)',
                            }}
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ color: '#475569', fontSize: '0.8rem' }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
