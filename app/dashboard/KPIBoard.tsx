'use client';

import type { CSSProperties } from 'react';
import { useState, useEffect } from 'react';
import { Target, TrendingUp, Phone, FileText, Settings, Plus, Minus, Users, Grid, Calendar, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getKPIData, incrementKPICounter, updateKPIGoals, updateDailyMetric, VISUALIZATION_RANGE } from './kpi-actions';
import styles from './Dashboard.module.css';

interface KPIData {
    daily: { calls: number; offers: number; leads: number; appointments: number; conversations: number };
    monthly: { revenue: number; contracts: number };
    goals: { calls: number; offers: number; leads: number; revenue: number; contracts: number; conversations: number };
    history: { date: string; calls: number; offers: number; leads: number; contracts: number; conversations: number }[];
}

export default function KPIBoard({ initialData, dealsWon }: { initialData?: KPIData; dealsWon?: number }) {
    const [data, setData] = useState<KPIData | null>(initialData || null);
    const [loading, setLoading] = useState(!initialData);
    const [range, setRange] = useState<VISUALIZATION_RANGE>('30d');

    const [isEditing, setIsEditing] = useState(false);

    // Grid Editing State
    const [editingCell, setEditingCell] = useState<{ date: string, field: string } | null>(null);
    const [tempValue, setTempValue] = useState('');

    const [editGoals, setEditGoals] = useState({
        daily_calls: initialData?.goals.calls || 50,
        daily_offers: initialData?.goals.offers || 5,
        daily_leads: initialData?.goals.leads || 10,
        monthly_revenue: initialData?.goals.revenue || 50000,
        monthly_contracts: initialData?.goals.contracts || 10,
        daily_conversations: initialData?.goals.conversations || 20
    });

    useEffect(() => {
        // Only fetch if range changes or if we didn't have initial data
        if (range !== '30d' || !data) {
            loadData(range);
        }
    }, [range]);

    const loadData = async (r: VISUALIZATION_RANGE = '30d') => {
        setLoading(true);
        const res = await getKPIData(r);
        setData(res);
        setEditGoals({
            daily_calls: res.goals.calls,
            daily_offers: res.goals.offers,
            daily_leads: res.goals.leads,
            monthly_revenue: res.goals.revenue,
            monthly_contracts: res.goals.contracts,
            daily_conversations: res.goals.conversations
        });
        setLoading(false);
    };

    const handleGoalChange = (field: keyof typeof editGoals, value: string) => {
        const intVal = value === '' ? 0 : parseInt(value);
        setEditGoals(prev => ({ ...prev, [field]: isNaN(intVal) ? 0 : intVal }));
    };

    const [workingDate, setWorkingDate] = useState(() => {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    });

    const handleIncrement = async (field: 'calls' | 'offers' | 'appointments' | 'conversations', amount: number) => {
        // Optimistic update ONLY if working on current date (client-side check approx)
        const todayStr = new Date().toISOString().split('T')[0];
        if (data && workingDate === todayStr) {
            setData({
                ...data,
                daily: {
                    ...data.daily,
                    [field]: Math.max(0, data.daily[field] + amount)
                }
            });
        }

        await incrementKPICounter(field, amount, workingDate);
        const res = await getKPIData(range);
        setData(res);
    };

    const handleSaveGoals = async () => {
        await updateKPIGoals(editGoals);
        setIsEditing(false);
        loadData(range);
    };

    const startEditingCell = (date: string, field: string, currentValue: number) => {
        if (field === 'leads' || field === 'contracts') return;
        if (editingCell?.date === date && editingCell?.field === field) return;

        setEditingCell({ date, field });
        setTempValue(currentValue.toString());
    };

    const saveCell = async () => {
        if (!editingCell) return;
        const val = parseInt(tempValue);
        const finalVal = isNaN(val) ? 0 : val;

        if (data) {
            const newHistory = data.history.map(day => {
                if (day.date === editingCell.date) {
                    // @ts-ignore
                    return { ...day, [editingCell.field]: finalVal };
                }
                return day;
            });
            setData({ ...data, history: newHistory });
        }

        await updateDailyMetric(editingCell.date, editingCell.field as 'calls' | 'offers' | 'conversations', finalVal);
        setEditingCell(null);
        loadData(range);
    };

    if (loading || !data) return <div className={styles.loadingCard} />;

    const callsPercent = Math.min((data.daily.calls / data.goals.calls) * 100, 100);
    const offersPercent = Math.min((data.daily.offers / data.goals.offers) * 100, 100);
    const leadsPercent = Math.min((data.daily.leads / data.goals.leads) * 100, 100);
    const conversationsPercent = Math.min((data.daily.conversations / data.goals.conversations) * 100, 100);
    const revenuePercent = Math.min((data.monthly.revenue / data.goals.revenue) * 100, 100);

    const exportReport = () => {
        const rangeLabels: Record<VISUALIZATION_RANGE, string> = {
            '7d': 'Last 7 Days',
            '30d': 'Last 30 Days',
            thisMonth: 'This Month',
            lastMonth: 'Last Month',
            thisYear: 'This Year',
            lastYear: 'Last Year'
        };

        const totals = data.history.reduce(
            (acc, day) => {
                acc.calls += day.calls;
                acc.offers += day.offers;
                acc.conversations += day.conversations;
                acc.leads += day.leads;
                acc.contracts += day.contracts;
                return acc;
            },
            { calls: 0, offers: 0, conversations: 0, leads: 0, contracts: 0 }
        );

        const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });

        doc.setFontSize(18);
        doc.text('KPI Report', 40, 50);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Range: ${rangeLabels[range] || range}`, 40, 70);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 40, 86);
        doc.text(`Deals Won: ${dealsWon ?? 0}`, 40, 102);
        doc.text(`Monthly Revenue: ${data.monthly.revenue}`, 40, 118);
        doc.text(`Monthly Contracts: ${data.monthly.contracts}`, 40, 134);

        const tableRows = [...data.history]
            .sort((a, b) => a.date.localeCompare(b.date))
            .map(day => [day.date, day.calls, day.offers, day.conversations, day.leads, day.contracts]);

        autoTable(doc, {
            startY: 160,
            head: [['Date', 'Calls', 'Offers', 'Conversations', 'Leads', 'Contracts']],
            body: tableRows,
            foot: [[
                'Totals',
                totals.calls,
                totals.offers,
                totals.conversations,
                totals.leads,
                totals.contracts
            ]],
            theme: 'striped',
            headStyles: { fillColor: [37, 99, 235] },
            footStyles: { fillColor: [15, 23, 42], textColor: 255 },
            styles: { fontSize: 9, cellPadding: 6 }
        });

        const finalY = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY || 160;
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text('Report Xyre Holdings LLC', 40, finalY + 24);

        doc.save(`kpi-report-${range}-${new Date().toISOString().split('T')[0]}.pdf`);
    };

    return (
        <div className={styles.kpiBoard}>
            <div className={styles.kpiHeader}>
                <div>
                    <h2 className={styles.sectionTitle}>
                        <Target size={20} />
                        Performance and KPIs
                    </h2>
                    <p className={styles.sectionSubtitle}>Daily momentum with monthly outcomes.</p>
                </div>

                <div className={styles.kpiControls}>
                    <div className={styles.controlGroup}>
                        <span className={styles.controlLabel}>Tracking date</span>
                        <input
                            type="date"
                            value={workingDate}
                            onChange={(e) => setWorkingDate(e.target.value)}
                            className={styles.dateInput}
                        />
                    </div>

                    <div className={styles.controlGroup}>
                        <Calendar size={16} />
                        <select
                            value={range}
                            onChange={(e) => setRange(e.target.value as VISUALIZATION_RANGE)}
                            className={styles.selectInput}
                        >
                            <option value="7d">Last 7 Days</option>
                            <option value="30d">Last 30 Days</option>
                            <option value="thisMonth">This Month</option>
                            <option value="lastMonth">Last Month</option>
                            <option value="thisYear">This Year</option>
                            <option value="lastYear">Last Year</option>
                        </select>
                    </div>

                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={styles.iconButton}
                        title="Edit Goals"
                    >
                        <Settings size={18} />
                    </button>
                    <button
                        onClick={exportReport}
                        className={styles.exportButton}
                        title="Export KPI Report"
                    >
                        <Download size={16} />
                        Export
                    </button>
                </div>
            </div>

            {isEditing && (
                <div className={styles.editPanel}>
                    <h3 className={styles.editPanelTitle}>Set your targets</h3>
                    <div className={styles.editGrid}>
                        <div>
                            <label className={styles.editLabel}>Daily Calls</label>
                            <input
                                type="number"
                                value={editGoals.daily_calls || ''}
                                onChange={e => handleGoalChange('daily_calls', e.target.value)}
                                className={styles.editInput}
                            />
                        </div>
                        <div>
                            <label className={styles.editLabel}>Daily Offers</label>
                            <input
                                type="number"
                                value={editGoals.daily_offers || ''}
                                onChange={e => handleGoalChange('daily_offers', e.target.value)}
                                className={styles.editInput}
                            />
                        </div>
                        <div>
                            <label className={styles.editLabel}>Daily Conversations</label>
                            <input
                                type="number"
                                value={editGoals.daily_conversations || ''}
                                onChange={e => handleGoalChange('daily_conversations', e.target.value)}
                                className={styles.editInput}
                            />
                        </div>
                        <div>
                            <label className={styles.editLabel}>Daily Leads</label>
                            <input
                                type="number"
                                value={editGoals.daily_leads || ''}
                                onChange={e => handleGoalChange('daily_leads', e.target.value)}
                                className={styles.editInput}
                            />
                        </div>
                        <div>
                            <label className={styles.editLabel}>Monthly Revenue</label>
                            <input
                                type="number"
                                value={editGoals.monthly_revenue || ''}
                                onChange={e => handleGoalChange('monthly_revenue', e.target.value)}
                                className={styles.editInput}
                            />
                        </div>
                        <div>
                            <label className={styles.editLabel}>Monthly Contracts</label>
                            <input
                                type="number"
                                value={editGoals.monthly_contracts || ''}
                                onChange={e => handleGoalChange('monthly_contracts', e.target.value)}
                                className={styles.editInput}
                            />
                        </div>
                    </div>
                    <div className={styles.editActions}>
                        <button onClick={() => setIsEditing(false)} className={`${styles.actionButton} ${styles.ghostButton}`}>Cancel</button>
                        <button onClick={handleSaveGoals} className={`${styles.actionButton} ${styles.primaryButton}`}>Save Goals</button>
                    </div>
                </div>
            )}

            <div className={styles.statsGrid}>
                <div className={styles.metricCard} style={{ '--accent': '#22c55e', '--accent-soft': '#dcfce7' } as CSSProperties}>
                    <div className={styles.metricHeader}>
                        <span className={styles.metricLabel}>
                            <Phone size={16} /> Daily Calls
                        </span>
                        <span className={styles.metricRatio}>{data.daily.calls} / {data.goals.calls}</span>
                    </div>
                    <div className={styles.progressTrack}>
                        <div className={styles.progressFill} style={{ width: `${callsPercent}%` }} />
                    </div>
                    <div className={styles.metricActions}>
                        <button
                            disabled={data.daily.calls <= 0}
                            onClick={() => handleIncrement('calls', -1)}
                            className={styles.stepperButton}
                        >
                            <Minus size={16} />
                        </button>
                        <button
                            onClick={() => handleIncrement('calls', 1)}
                            className={`${styles.stepperButton} ${styles.stepperPrimary}`}
                        >
                            <Plus size={16} /> Log Call
                        </button>
                    </div>
                </div>

                <div className={styles.metricCard} style={{ '--accent': '#f59e0b', '--accent-soft': '#fef3c7' } as CSSProperties}>
                    <div className={styles.metricHeader}>
                        <span className={styles.metricLabel}>
                            <FileText size={16} /> Today Offers
                        </span>
                        <span className={styles.metricRatio}>{data.daily.offers} / {data.goals.offers}</span>
                    </div>
                    <div className={styles.progressTrack}>
                        <div className={styles.progressFill} style={{ width: `${offersPercent}%` }} />
                    </div>
                    <div className={styles.metricActions}>
                        <button
                            disabled={data.daily.offers <= 0}
                            onClick={() => handleIncrement('offers', -1)}
                            className={styles.stepperButton}
                        >
                            <Minus size={16} />
                        </button>
                        <button
                            onClick={() => handleIncrement('offers', 1)}
                            className={`${styles.stepperButton} ${styles.stepperPrimary}`}
                        >
                            <Plus size={16} /> Log Offer
                        </button>
                    </div>
                </div>

                <div className={styles.metricCard} style={{ '--accent': '#14b8a6', '--accent-soft': '#ccfbf1' } as CSSProperties}>
                    <div className={styles.metricHeader}>
                        <span className={styles.metricLabel}>
                            <Phone size={16} /> Conversations
                        </span>
                        <span className={styles.metricRatio}>{data.daily.conversations} / {data.goals.conversations}</span>
                    </div>
                    <div className={styles.progressTrack}>
                        <div className={styles.progressFill} style={{ width: `${conversationsPercent}%` }} />
                    </div>
                    <div className={styles.metricActions}>
                        <button
                            disabled={data.daily.conversations <= 0}
                            onClick={() => handleIncrement('conversations', -1)}
                            className={styles.stepperButton}
                        >
                            <Minus size={16} />
                        </button>
                        <button
                            onClick={() => handleIncrement('conversations', 1)}
                            className={`${styles.stepperButton} ${styles.stepperPrimary}`}
                        >
                            <Plus size={16} /> Log Convo
                        </button>
                    </div>
                </div>

                <div className={styles.metricCard} style={{ '--accent': '#3b82f6', '--accent-soft': '#dbeafe' } as CSSProperties}>
                    <div className={styles.metricHeader}>
                        <span className={styles.metricLabel}>
                            <Users size={16} /> Today Leads
                        </span>
                        <span className={styles.metricRatio}>{data.daily.leads} / {data.goals.leads}</span>
                    </div>
                    <div className={styles.progressTrack}>
                        <div className={styles.progressFill} style={{ width: `${leadsPercent}%` }} />
                    </div>
                    <p className={styles.metricNote}>Auto tracked from new clients.</p>
                </div>

                <div className={`${styles.metricCard} ${styles.metricRevenue}`} style={{ '--accent': '#2563eb', '--accent-soft': '#dbeafe' } as CSSProperties}>
                    <div className={styles.metricHeader}>
                        <span className={styles.metricLabel}>
                            <TrendingUp size={16} /> Monthly Revenue
                        </span>
                    </div>
                    <div className={styles.metricValueRow}>
                        <span className={styles.metricValue}>${data.monthly.revenue.toLocaleString()}</span>
                        <span className={styles.metricTarget}>/ ${(data.goals.revenue / 1000)}k</span>
                    </div>
                    <div className={styles.progressTrack}>
                        <div className={styles.progressFill} style={{ width: `${revenuePercent}%` }} />
                    </div>
                </div>
            </div>

            <div className={styles.matrixCard}>
                <div className={styles.matrixHeader}>
                    <Grid size={18} />
                    <h3 className={styles.matrixTitle}>
                        Metric Grid ({range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : range === 'thisMonth' ? 'This Month' : range === 'lastMonth' ? 'Last Month' : range === 'thisYear' ? 'This Year' : 'Last Year'})
                    </h3>
                </div>
                <div className={styles.matrixTableWrap}>
                    <table className={styles.metricsTable}>
                        <thead>
                            <tr className={styles.metricsHeadRow}>
                                <th className={`${styles.metricsHeadCell} ${styles.metricsHeadLabel}`}>Metric</th>
                                {data.history.map((day) => (
                                    <th key={day.date} className={styles.metricsHeadCell}>
                                        {(() => {
                                            const [y, m, d] = day.date.split('-').map(Number);
                                            const dateObj = new Date(y, m - 1, d);
                                            return dateObj.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
                                        })()}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr className={styles.metricRow}>
                                <td className={styles.metricLabelCell}>Calls</td>
                                {data.history.map((day) => {
                                    const isActive = editingCell?.date === day.date && editingCell?.field === 'calls';
                                    return (
                                        <td
                                            key={`calls-${day.date}`}
                                            onClick={() => startEditingCell(day.date, 'calls', day.calls)}
                                            className={`${styles.metricCell} ${isActive ? styles.metricCellActive : ''}`}
                                        >
                                            {isActive ? (
                                                <input
                                                    autoFocus
                                                    type="number"
                                                    value={tempValue}
                                                    onClick={(e) => e.stopPropagation()}
                                                    onChange={e => setTempValue(e.target.value)}
                                                    onBlur={saveCell}
                                                    onKeyDown={e => e.key === 'Enter' && saveCell()}
                                                    className={styles.metricInput}
                                                />
                                            ) : (
                                                <span className={day.calls > 0 ? styles.metricValueActive : styles.metricValueMuted}>{day.calls}</span>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                            <tr className={styles.metricRow}>
                                <td className={styles.metricLabelCell}>Offers</td>
                                {data.history.map((day) => {
                                    const isActive = editingCell?.date === day.date && editingCell?.field === 'offers';
                                    return (
                                        <td
                                            key={`offers-${day.date}`}
                                            onClick={() => startEditingCell(day.date, 'offers', day.offers)}
                                            className={`${styles.metricCell} ${isActive ? styles.metricCellActive : ''}`}
                                        >
                                            {isActive ? (
                                                <input
                                                    autoFocus
                                                    type="number"
                                                    value={tempValue}
                                                    onClick={(e) => e.stopPropagation()}
                                                    onChange={e => setTempValue(e.target.value)}
                                                    onBlur={saveCell}
                                                    onKeyDown={e => e.key === 'Enter' && saveCell()}
                                                    className={styles.metricInput}
                                                />
                                            ) : (
                                                <span className={day.offers > 0 ? styles.metricValueActive : styles.metricValueMuted}>{day.offers}</span>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                            <tr className={styles.metricRow}>
                                <td className={styles.metricLabelCell}>Conversations</td>
                                {data.history.map((day) => {
                                    const isActive = editingCell?.date === day.date && editingCell?.field === 'conversations';
                                    return (
                                        <td
                                            key={`conversations-${day.date}`}
                                            onClick={() => startEditingCell(day.date, 'conversations', day.conversations)}
                                            className={`${styles.metricCell} ${isActive ? styles.metricCellActive : ''}`}
                                        >
                                            {isActive ? (
                                                <input
                                                    autoFocus
                                                    type="number"
                                                    value={tempValue}
                                                    onClick={(e) => e.stopPropagation()}
                                                    onChange={e => setTempValue(e.target.value)}
                                                    onBlur={saveCell}
                                                    onKeyDown={e => e.key === 'Enter' && saveCell()}
                                                    className={styles.metricInput}
                                                />
                                            ) : (
                                                <span className={day.conversations > 0 ? styles.metricValueActive : styles.metricValueMuted}>{day.conversations}</span>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                            <tr className={styles.metricRow}>
                                <td className={styles.metricLabelCell}>Leads</td>
                                {data.history.map((day) => (
                                    <td key={`leads-${day.date}`} className={`${styles.metricCell} ${styles.metricCellStatic}`}>
                                        <span className={day.leads > 0 ? styles.metricValueActive : styles.metricValueMuted}>{day.leads}</span>
                                    </td>
                                ))}
                            </tr>
                            <tr className={styles.metricRow}>
                                <td className={styles.metricLabelCell}>Contracts</td>
                                {data.history.map((day) => (
                                    <td key={`contracts-${day.date}`} className={`${styles.metricCell} ${styles.metricCellStatic}`}>
                                        <span className={day.contracts > 0 ? styles.metricValueActive : styles.metricValueMuted}>{day.contracts}</span>
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
