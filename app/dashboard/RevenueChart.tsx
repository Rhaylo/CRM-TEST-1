
'use client';

import { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Pencil, Save, X } from 'lucide-react';
import styles from './Dashboard.module.css';

interface RevenueChartProps {
    data: { month: string; monthKey: string; revenue: number; baseRevenue: number; adjustment: number }[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [adjustments, setAdjustments] = useState(() =>
        data.map((item) => ({
            month: item.month,
            monthKey: item.monthKey,
            baseRevenue: item.baseRevenue,
            adjustment: item.adjustment || 0,
        }))
    );

    useEffect(() => {
        setAdjustments(
            data.map((item) => ({
                month: item.month,
                monthKey: item.monthKey,
                baseRevenue: item.baseRevenue,
                adjustment: item.adjustment || 0,
            }))
        );
    }, [data]);

    const handleAdjustmentChange = (index: number, value: string) => {
        const next = [...adjustments];
        const numeric = Number(value);
        next[index] = {
            ...next[index],
            adjustment: Number.isFinite(numeric) ? numeric : 0,
        };
        setAdjustments(next);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await fetch('/api/dashboard-settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    revenueAdjustments: adjustments.map((item) => ({
                        monthKey: item.monthKey,
                        adjustment: item.adjustment,
                    }))
                }),
            });

            if (response.ok) {
                setIsEditing(false);
                window.location.reload();
            }
        } catch (error) {
            console.error('Error saving revenue adjustments:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setAdjustments(
            data.map((item) => ({
                month: item.month,
                monthKey: item.monthKey,
                baseRevenue: item.baseRevenue,
                adjustment: item.adjustment || 0,
            }))
        );
        setIsEditing(false);
    };

    const GlassBar = (props: any) => {
        const { x, y, width, height } = props as { x?: number; y?: number; width?: number; height?: number };
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
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className={`${styles.actionButton} ${styles.ghostButton}`}
                        type="button"
                    >
                        <Pencil size={16} />
                        Adjust
                    </button>
                )}
            </div>
            {isEditing && (
                <div className={styles.revenueAdjustPanel}>
                    <div className={styles.revenueAdjustHeader}>
                        <span>Month</span>
                        <span>Base</span>
                        <span>Adjustment</span>
                        <span>Total</span>
                    </div>
                    {adjustments.map((item, index) => (
                        <div className={styles.revenueAdjustRow} key={item.monthKey}>
                            <span className={styles.revenueAdjustMonth}>{item.month}</span>
                            <span className={styles.revenueAdjustBase}>${item.baseRevenue.toLocaleString()}</span>
                            <input
                                type="number"
                                value={item.adjustment}
                                onChange={(event) => handleAdjustmentChange(index, event.target.value)}
                                className={styles.revenueAdjustInput}
                                step="100"
                            />
                            <span className={styles.revenueAdjustTotal}>${(item.baseRevenue + item.adjustment).toLocaleString()}</span>
                        </div>
                    ))}
                    <div className={styles.revenueAdjustActions}>
                        <button
                            onClick={handleSave}
                            className={`${styles.actionButton} ${styles.primaryButton}`}
                            disabled={saving}
                        >
                            <Save size={16} />
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                        <button
                            onClick={handleCancel}
                            className={`${styles.actionButton} ${styles.ghostButton}`}
                        >
                            <X size={16} />
                            Cancel
                        </button>
                    </div>
                </div>
            )}
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
                        <Bar dataKey="revenue" shape={GlassBar as any} barSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
