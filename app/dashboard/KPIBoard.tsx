'use client';

import { useState, useEffect } from 'react';
import { Target, TrendingUp, Phone, FileText, Settings, Plus } from 'lucide-react';
import { getKPIData, incrementKPICounter, updateKPIGoals } from './kpi-actions';

interface KPIData {
    daily: { calls: number; offers: number; appointments: number };
    monthly: { revenue: number; contracts: number };
    goals: { calls: number; offers: number; revenue: number; contracts: number };
}

export default function KPIBoard() {
    const [data, setData] = useState<KPIData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editGoals, setEditGoals] = useState({
        daily_calls: 50,
        daily_offers: 5,
        monthly_revenue: 50000,
        monthly_contracts: 10
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const res = await getKPIData();
        setData(res);
        setEditGoals({
            daily_calls: res.goals.calls,
            daily_offers: res.goals.offers,
            monthly_revenue: res.goals.revenue,
            monthly_contracts: res.goals.contracts
        });
        setLoading(false);
    };

    const handleIncrement = async (field: 'calls' | 'appointments') => {
        // Optimistic UI
        if (data) {
            setData({
                ...data,
                daily: { ...data.daily, [field]: data.daily[field] + 1 }
            });
        }
        await incrementKPICounter(field);
        // Background refresh to be safe
        const res = await getKPIData();
        setData(res);
    };

    const handleSaveGoals = async () => {
        await updateKPIGoals(editGoals);
        setIsEditing(false);
        loadData();
    };

    if (loading || !data) return <div style={{ height: '200px', backgroundColor: '#f8fafc', borderRadius: '0.75rem' }}></div>;

    // Progress calculations
    const callsPercent = Math.min((data.daily.calls / data.goals.calls) * 100, 100);
    const offersPercent = Math.min((data.daily.offers / data.goals.offers) * 100, 100);
    const revenuePercent = Math.min((data.monthly.revenue / data.goals.revenue) * 100, 100);

    return (
        <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Target className="text-blue-600" />
                    Performance & KPIs
                </h2>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    style={{ color: '#64748b', cursor: 'pointer', background: 'none', border: 'none' }}
                    title="Edit Goals"
                >
                    <Settings size={18} />
                </button>
            </div>

            {/* Edit Mode Overlay */}
            {isEditing && (
                <div style={{ padding: '1rem', backgroundColor: '#eff6ff', borderRadius: '0.75rem', marginBottom: '1rem', border: '1px solid #bfdbfe' }}>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '1rem' }}>Set Your Targets</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b' }}>Daily Calls Goal</label>
                            <input
                                type="number"
                                value={editGoals.daily_calls}
                                onChange={e => setEditGoals({ ...editGoals, daily_calls: parseInt(e.target.value) })}
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #cbd5e1' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b' }}>Daily Offers Goal</label>
                            <input
                                type="number"
                                value={editGoals.daily_offers}
                                onChange={e => setEditGoals({ ...editGoals, daily_offers: parseInt(e.target.value) })}
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #cbd5e1' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b' }}>Monthly Revenue Goal</label>
                            <input
                                type="number"
                                value={editGoals.monthly_revenue}
                                onChange={e => setEditGoals({ ...editGoals, monthly_revenue: parseInt(e.target.value) })}
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #cbd5e1' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b' }}>Monthly Contracts Goal</label>
                            <input
                                type="number"
                                value={editGoals.monthly_contracts}
                                onChange={e => setEditGoals({ ...editGoals, monthly_contracts: parseInt(e.target.value) })}
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>

                {/* Daily Calls */}
                <div style={{ padding: '1.25rem', backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Phone size={16} /> Daily Calls
                        </span>
                        <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>{data.daily.calls} / {data.goals.calls}</span>
                    </div>
                    <div style={{ height: '8px', width: '100%', backgroundColor: '#f1f5f9', borderRadius: '999px', overflow: 'hidden', marginBottom: '1rem' }}>
                        <div style={{ height: '100%', width: `${callsPercent}%`, backgroundColor: '#3b82f6', borderRadius: '999px', transition: 'width 0.5s ease' }} />
                    </div>
                    <button
                        onClick={() => handleIncrement('calls')}
                        style={{ width: '100%', padding: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', backgroundColor: '#eff6ff', color: '#3b82f6', border: '1px solid #bdcae0', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s' }}
                    >
                        <Plus size={16} /> Log Call
                    </button>
                </div>

                {/* Daily Offers */}
                <div style={{ padding: '1.25rem', backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FileText size={16} /> Today's Offers
                        </span>
                        <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>{data.daily.offers} / {data.goals.offers}</span>
                    </div>
                    <div style={{ height: '8px', width: '100%', backgroundColor: '#f1f5f9', borderRadius: '999px', overflow: 'hidden', marginBottom: '1rem' }}>
                        <div style={{ height: '100%', width: `${offersPercent}%`, backgroundColor: '#8b5cf6', borderRadius: '999px', transition: 'width 0.5s ease' }} />
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center' }}>
                        Automatically tracked from Deals created
                    </p>
                </div>

                {/* Monthly Revenue */}
                <div style={{ padding: '1.25rem', backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
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
        </div>
    );
}
