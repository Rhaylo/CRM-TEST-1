'use client';

import { useState, useEffect } from 'react';
import { Target, TrendingUp, Phone, FileText, Settings, Plus, Minus, Users, Grid, Calendar } from 'lucide-react';
import { getKPIData, incrementKPICounter, updateKPIGoals, updateDailyMetric, VISUALIZATION_RANGE } from './kpi-actions';

interface KPIData {
    daily: { calls: number; offers: number; leads: number; appointments: number; conversations: number };
    monthly: { revenue: number; contracts: number };
    goals: { calls: number; offers: number; leads: number; revenue: number; contracts: number; conversations: number };
    history: { date: string; calls: number; offers: number; leads: number; contracts: number; conversations: number }[];
}

export default function KPIBoard({ initialData }: { initialData?: KPIData }) {
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

    if (loading || !data) return <div style={{ height: '200px', backgroundColor: '#f8fafc', borderRadius: '0.75rem' }}></div>;

    const callsPercent = Math.min((data.daily.calls / data.goals.calls) * 100, 100);
    const offersPercent = Math.min((data.daily.offers / data.goals.offers) * 100, 100);
    const leadsPercent = Math.min((data.daily.leads / data.goals.leads) * 100, 100);
    const conversationsPercent = Math.min((data.daily.conversations / data.goals.conversations) * 100, 100);
    const revenuePercent = Math.min((data.monthly.revenue / data.goals.revenue) * 100, 100);

    return (
        <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Target className="text-blue-600" />
                    Performance & KPIs
                </h2>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    {/* Working Date Selector */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginRight: '1rem' }}>
                        <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Tracking Date:</span>
                        <input
                            type="date"
                            value={workingDate}
                            onChange={(e) => setWorkingDate(e.target.value)}
                            style={{
                                padding: '0.25rem 0.5rem',
                                border: '1px solid #e2e8f0',
                                borderRadius: '0.5rem',
                                fontSize: '0.875rem',
                                color: '#475569',
                                outline: 'none'
                            }}
                        />
                    </div>

                    {/* Range Selector */}
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '0.25rem 0.5rem' }}>
                        <Calendar size={16} className="text-gray-500 mr-2" />
                        <select
                            value={range}
                            onChange={(e) => setRange(e.target.value as VISUALIZATION_RANGE)}
                            style={{ border: 'none', background: 'transparent', fontSize: '0.875rem', color: '#475569', outline: 'none', cursor: 'pointer' }}
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
                        style={{ color: '#64748b', cursor: 'pointer', background: 'none', border: 'none' }}
                        title="Edit Goals"
                    >
                        <Settings size={18} />
                    </button>
                </div>
            </div>

            {/* Edit Mode Overlay (Identical to previous) */}
            {isEditing && (
                <div style={{ padding: '1rem', backgroundColor: '#eff6ff', borderRadius: '0.75rem', marginBottom: '1rem', border: '1px solid #bfdbfe' }}>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '1rem' }}>Set Your Targets</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b' }}>Daily Calls</label>
                            <input
                                type="number"
                                value={editGoals.daily_calls || ''}
                                onChange={e => handleGoalChange('daily_calls', e.target.value)}
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #cbd5e1' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b' }}>Daily Offers</label>
                            <input
                                type="number"
                                value={editGoals.daily_offers || ''}
                                onChange={e => handleGoalChange('daily_offers', e.target.value)}
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #cbd5e1' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b' }}>Daily Conversations</label>
                            <input
                                type="number"
                                value={editGoals.daily_conversations || ''}
                                onChange={e => handleGoalChange('daily_conversations', e.target.value)}
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #cbd5e1' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b' }}>Daily Leads</label>
                            <input
                                type="number"
                                value={editGoals.daily_leads || ''}
                                onChange={e => handleGoalChange('daily_leads', e.target.value)}
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #cbd5e1' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b' }}>Monthly Revenue</label>
                            <input
                                type="number"
                                value={editGoals.monthly_revenue || ''}
                                onChange={e => handleGoalChange('monthly_revenue', e.target.value)}
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #cbd5e1' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b' }}>Monthly Contracts</label>
                            <input
                                type="number"
                                value={editGoals.monthly_contracts || ''}
                                onChange={e => handleGoalChange('monthly_contracts', e.target.value)}
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #cbd5e1' }}
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button onClick={() => setIsEditing(false)} style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', background: '#f1f5f9', color: '#64748b', border: 'none', cursor: 'pointer' }}>Cancel</button>
                        <button onClick={handleSaveGoals} style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', background: '#3b82f6', color: 'white', border: 'none', cursor: 'pointer' }}>Save Goals</button>
                    </div>
                </div>
            )}

            {/* Stats Cards Row */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', // Auto-stacking
                gap: '1rem',
                marginBottom: '2rem'
            }}>
                <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Phone size={16} /> Daily Calls
                        </span>
                        <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>{data.daily.calls} / {data.goals.calls}</span>
                    </div>
                    <div style={{ height: '8px', width: '100%', backgroundColor: '#f1f5f9', borderRadius: '999px', overflow: 'hidden', marginBottom: '1rem' }}>
                        <div style={{ height: '100%', width: `${callsPercent}%`, backgroundColor: '#3b82f6', borderRadius: '999px', transition: 'width 0.5s ease' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button disabled={data.daily.calls <= 0} onClick={() => handleIncrement('calls', -1)} style={{ width: '40px', padding: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f1f5f9', color: data.daily.calls <= 0 ? '#cbd5e1' : '#64748b', border: '1px solid #cbd5e1', borderRadius: '0.5rem', cursor: data.daily.calls <= 0 ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}><Minus size={16} /></button>
                        <button onClick={() => handleIncrement('calls', 1)} style={{ flex: 1, padding: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', backgroundColor: '#eff6ff', color: '#3b82f6', border: '1px solid #bdcae0', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s' }}><Plus size={16} /> Log Call</button>
                    </div>
                </div>

                <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FileText size={16} /> Today's Offers
                        </span>
                        <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>{data.daily.offers} / {data.goals.offers}</span>
                    </div>
                    <div style={{ height: '8px', width: '100%', backgroundColor: '#f1f5f9', borderRadius: '999px', overflow: 'hidden', marginBottom: '1rem' }}>
                        <div style={{ height: '100%', width: `${offersPercent}%`, backgroundColor: '#8b5cf6', borderRadius: '999px', transition: 'width 0.5s ease' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button disabled={data.daily.offers <= 0} onClick={() => handleIncrement('offers', -1)} style={{ width: '40px', padding: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f1f5f9', color: data.daily.offers <= 0 ? '#cbd5e1' : '#64748b', border: '1px solid #cbd5e1', borderRadius: '0.5rem', cursor: data.daily.offers <= 0 ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}><Minus size={16} /></button>
                        <button onClick={() => handleIncrement('offers', 1)} style={{ flex: 1, padding: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', backgroundColor: '#f5f3ff', color: '#8b5cf6', border: '1px solid #ddd6fe', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s' }}><Plus size={16} /> Log Offer</button>
                    </div>
                </div>

                <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Phone size={16} /> Conversations
                        </span>
                        <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>{data.daily.conversations} / {data.goals.conversations}</span>
                    </div>
                    <div style={{ height: '8px', width: '100%', backgroundColor: '#f1f5f9', borderRadius: '999px', overflow: 'hidden', marginBottom: '1rem' }}>
                        <div style={{ height: '100%', width: `${conversationsPercent}%`, backgroundColor: '#10b981', borderRadius: '999px', transition: 'width 0.5s ease' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button disabled={data.daily.conversations <= 0} onClick={() => handleIncrement('conversations', -1)} style={{ width: '40px', padding: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f1f5f9', color: data.daily.conversations <= 0 ? '#cbd5e1' : '#64748b', border: '1px solid #cbd5e1', borderRadius: '0.5rem', cursor: data.daily.conversations <= 0 ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}><Minus size={16} /></button>
                        <button onClick={() => handleIncrement('conversations', 1)} style={{ flex: 1, padding: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', backgroundColor: '#ecfdf5', color: '#10b981', border: '1px solid #a7f3d0', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s' }}><Plus size={16} /> Log Convo</button>
                    </div>
                </div>

                <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Users size={16} /> Today's Leads
                        </span>
                        <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>{data.daily.leads} / {data.goals.leads}</span>
                    </div>
                    <div style={{ height: '8px', width: '100%', backgroundColor: '#f1f5f9', borderRadius: '999px', overflow: 'hidden', marginBottom: '1rem' }}>
                        <div style={{ height: '100%', width: `${leadsPercent}%`, backgroundColor: '#f59e0b', borderRadius: '999px', transition: 'width 0.5s ease' }} />
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center' }}>Auto-tracked (New Clients)</p>
                </div>

                <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <TrendingUp size={16} /> Monthly Revenue
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a' }}>${data.monthly.revenue.toLocaleString()}</span>
                        <span style={{ fontSize: '0.875rem', color: '#64748b' }}>/ ${(data.goals.revenue / 1000)}k</span>
                    </div>
                    <div style={{ height: '8px', width: '100%', backgroundColor: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${revenuePercent}%`, backgroundColor: '#10b981', borderRadius: '999px', transition: 'width 0.5s ease' }} />
                    </div>
                </div>
            </div>

            {/* Matrix Grid */}
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Grid size={18} className="text-gray-500" />
                    <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e293b' }}>
                        Metric Grid ({range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : range === 'thisMonth' ? 'This Month' : range === 'lastMonth' ? 'Last Month' : range === 'thisYear' ? 'This Year' : 'Last Year'})
                    </h3>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ minWidth: '800px', width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                <th style={{ padding: '0.75rem', textAlign: 'left', width: '100px', fontWeight: '600', color: '#64748b' }}>Metric</th>
                                {data.history.map((day) => (
                                    <th key={day.date} style={{ padding: '0.75rem', textAlign: 'center', minWidth: '80px', fontWeight: '500', color: '#64748b' }}>
                                        {(() => {
                                            const [y, m, d] = day.date.split('-').map(Number);
                                            const dateObj = new Date(y, m - 1, d);
                                            // Conditional formatting: If year view, maybe show Month/Day?
                                            // For now standard day/month is likely enough.
                                            return dateObj.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
                                        })()}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '0.75rem', fontWeight: '600', color: '#334155' }}>📞 Calls</td>
                                {data.history.map((day) => (
                                    <td key={'calls' + day.date}
                                        onClick={() => startEditingCell(day.date, 'calls', day.calls)}
                                        style={{ padding: '0.75rem', textAlign: 'center', cursor: 'pointer', backgroundColor: editingCell?.date === day.date && editingCell?.field === 'calls' ? '#eff6ff' : 'transparent' }}
                                    >
                                        {editingCell?.date === day.date && editingCell?.field === 'calls' ? (
                                            <input
                                                autoFocus
                                                type="number"
                                                value={tempValue}
                                                onClick={(e) => e.stopPropagation()}
                                                onChange={e => setTempValue(e.target.value)}
                                                onBlur={saveCell}
                                                onKeyDown={e => e.key === 'Enter' && saveCell()}
                                                style={{ width: '40px', textAlign: 'center', border: 'none', background: 'transparent', outline: 'none', fontWeight: 'bold', color: '#3b82f6' }}
                                            />
                                        ) : (
                                            <span style={{ color: day.calls > 0 ? '#1e293b' : '#cbd5e1' }}>{day.calls}</span>
                                        )}
                                    </td>
                                ))}
                            </tr>
                            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '0.75rem', fontWeight: '600', color: '#334155' }}>📝 Offers</td>
                                {data.history.map((day) => (
                                    <td key={'offers' + day.date}
                                        onClick={() => startEditingCell(day.date, 'offers', day.offers)}
                                        style={{ padding: '0.75rem', textAlign: 'center', cursor: 'pointer', backgroundColor: editingCell?.date === day.date && editingCell?.field === 'offers' ? '#eff6ff' : 'transparent' }}
                                    >
                                        {editingCell?.date === day.date && editingCell?.field === 'offers' ? (
                                            <input
                                                autoFocus
                                                type="number"
                                                value={tempValue}
                                                onClick={(e) => e.stopPropagation()}
                                                onChange={e => setTempValue(e.target.value)}
                                                onBlur={saveCell}
                                                onKeyDown={e => e.key === 'Enter' && saveCell()}
                                                style={{ width: '40px', textAlign: 'center', border: 'none', background: 'transparent', outline: 'none', fontWeight: 'bold', color: '#3b82f6' }}
                                            />
                                        ) : (
                                            <span style={{ color: day.offers > 0 ? '#1e293b' : '#cbd5e1' }}>{day.offers}</span>
                                        )}
                                    </td>
                                ))}
                            </tr>
                            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '0.75rem', fontWeight: '600', color: '#334155' }}>💬 Conversations</td>
                                {data.history.map((day) => (
                                    <td key={'conversations' + day.date}
                                        onClick={() => startEditingCell(day.date, 'conversations', day.conversations)}
                                        style={{ padding: '0.75rem', textAlign: 'center', cursor: 'pointer', backgroundColor: editingCell?.date === day.date && editingCell?.field === 'conversations' ? '#eff6ff' : 'transparent' }}
                                    >
                                        {editingCell?.date === day.date && editingCell?.field === 'conversations' ? (
                                            <input
                                                autoFocus
                                                type="number"
                                                value={tempValue}
                                                onClick={(e) => e.stopPropagation()}
                                                onChange={e => setTempValue(e.target.value)}
                                                onBlur={saveCell}
                                                onKeyDown={e => e.key === 'Enter' && saveCell()}
                                                style={{ width: '40px', textAlign: 'center', border: 'none', background: 'transparent', outline: 'none', fontWeight: 'bold', color: '#3b82f6' }}
                                            />
                                        ) : (
                                            <span style={{ color: day.conversations > 0 ? '#1e293b' : '#cbd5e1' }}>{day.conversations}</span>
                                        )}
                                    </td>
                                ))}
                            </tr>
                            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '0.75rem', fontWeight: '600', color: '#334155' }}>👥 Leads</td>
                                {data.history.map((day) => (
                                    <td key={'leads' + day.date} style={{ padding: '0.75rem', textAlign: 'center' }}>
                                        <span style={{ color: day.leads > 0 ? '#1e293b' : '#cbd5e1' }}>{day.leads}</span>
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td style={{ padding: '0.75rem', fontWeight: '600', color: '#334155' }}>📜 Contracts</td>
                                {data.history.map((day) => (
                                    <td key={'contracts' + day.date} style={{ padding: '0.75rem', textAlign: 'center' }}>
                                        <span style={{ color: day.contracts > 0 ? '#1e293b' : '#cbd5e1' }}>{day.contracts}</span>
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
