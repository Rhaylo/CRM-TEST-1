'use client';

import { useState } from 'react';
import styles from './page.module.css';
<<<<<<< HEAD
<<<<<<< HEAD
import Link from 'next/link';
import { updateDealStage } from './actions';
import { deleteDeal } from './deleteActions';
import { Trash2, ExternalLink, RefreshCw, ArrowRight } from 'lucide-react';

const PIPELINES = {
    acquisitions: {
        title: 'Acquisitions (Buy)',
        stages: ['Lead', 'Due Diligence', 'Contract Sent', 'Under Contract'],
        color: 'blue'
    },
    dispositions: {
        title: 'Dispositions (Sell)',
        stages: ['Under Contract', 'Marketing', 'Buyer Found', 'Sold'],
        color: 'emerald'
    }
};

// Legacy mapping for old data compatibility
const STAGE_MAPPING: Record<string, string> = {
    'Pending': 'Lead',
    'Contract Out': 'Contract Sent',
    'Contract In': 'Under Contract',
    'Complete': 'Sold'
};

const STAGE_COLORS: Record<string, string> = {
    'Lead': '#64748b',            // Slate
    'Due Diligence': '#f59e0b',   // Amber
    'Contract Sent': '#3b82f6',   // Blue
    'Under Contract': '#8b5cf6',  // Purple (Shared Bridge)

    'Marketing': '#ec4899',       // Pink
    'Buyer Found': '#14b8a6',     // Teal
    'Sold': '#22c55e',            // Green
};

export default function DealBoard({ initialDeals }: { initialDeals: any[] }) {
    // Normalize initial stages using mapping
    const normalizedDeals = initialDeals.map(d => ({
        ...d,
        stage: STAGE_MAPPING[d.stage] || d.stage
    }));

    const [deals, setDeals] = useState(normalizedDeals);
    const [draggedDeal, setDraggedDeal] = useState<any>(null);
    const [activePipeline, setActivePipeline] = useState<'acquisitions' | 'dispositions'>('acquisitions');
=======
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
import { updateDealStage } from './actions';
import { deleteDeal } from './deleteActions';
import { Trash2 } from 'lucide-react';

const STAGES = ['Pending', 'Contract Out', 'Contract In', 'Complete'];

export default function DealBoard({ initialDeals }: { initialDeals: any[] }) {
    const [deals, setDeals] = useState(initialDeals);
    const [draggedDeal, setDraggedDeal] = useState<any>(null);
<<<<<<< HEAD
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e

    const handleDragStart = (deal: any) => {
        setDraggedDeal(deal);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = async (stage: string) => {
        if (!draggedDeal) return;

        if (draggedDeal.stage !== stage) {
            const updatedDeals = deals.map(d =>
                d.id === draggedDeal.id ? { ...d, stage, updatedAt: new Date() } : d
            );
            setDeals(updatedDeals);

            await updateDealStage(draggedDeal.id, stage);
        }
        setDraggedDeal(null);
    };

    const handleDelete = async (dealId: number) => {
        setDeals(deals.filter(d => d.id !== dealId));
        await deleteDeal(dealId);
    };

<<<<<<< HEAD
<<<<<<< HEAD
    const currentStages = PIPELINES[activePipeline].stages;

    return (
        <div className={styles.boardContainer}>
            {/* Pipeline Toggle */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', backgroundColor: '#f1f5f9', padding: '0.25rem', borderRadius: '0.5rem', width: 'fit-content' }}>
                <button
                    onClick={() => setActivePipeline('acquisitions')}
                    style={{
                        padding: '0.5rem 1.5rem',
                        borderRadius: '0.375rem',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        backgroundColor: activePipeline === 'acquisitions' ? 'white' : 'transparent',
                        color: activePipeline === 'acquisitions' ? '#1e293b' : '#64748b',
                        boxShadow: activePipeline === 'acquisitions' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <RefreshCw size={14} className={activePipeline === 'acquisitions' ? 'text-blue-500' : ''} />
                    Acquisitions
                </button>
                <button
                    onClick={() => setActivePipeline('dispositions')}
                    style={{
                        padding: '0.5rem 1.5rem',
                        borderRadius: '0.375rem',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        backgroundColor: activePipeline === 'dispositions' ? 'white' : 'transparent',
                        color: activePipeline === 'dispositions' ? '#1e293b' : '#64748b',
                        boxShadow: activePipeline === 'dispositions' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <ArrowRight size={14} className={activePipeline === 'dispositions' ? 'text-emerald-500' : ''} />
                    Dispositions
                </button>
            </div>

            <div className={styles.board}>
                {currentStages.map(stage => {
                    const stageDeals = deals.filter(d => d.stage === stage);
                    const color = STAGE_COLORS[stage] || '#cbd5e1';

                    // Special styling for "Under Contract" Bridge
                    const isBridge = stage === 'Under Contract';
                    const bridgeStyle = isBridge ? { borderTop: `4px solid #8b5cf6`, backgroundColor: activePipeline === 'dispositions' ? '#f5f3ff' : undefined } : { borderTop: `4px solid ${color}` };

                    return (
                        <div
                            key={stage}
                            className={styles.column}
                            onDragOver={handleDragOver}
                            onDrop={() => handleDrop(stage)}
                            style={bridgeStyle}
                        >
                            <div className={styles.columnHeader} style={{ color: isBridge ? '#7c3aed' : color }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    {stage}
                                    {isBridge && <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#ddd6fe', color: '#5b21b6' }}>Handover</span>}
                                </span>
                                <span
                                    className={styles.count}
                                    style={{ backgroundColor: `${color}20`, color: color }}
                                >
                                    {stageDeals.length}
                                </span>
                            </div>
                            <div className={styles.columnContent}>
                                {stageDeals.map(deal => {
                                    const isStale = (Date.now() - new Date(deal.updatedAt).getTime()) > (7 * 24 * 60 * 60 * 1000);
                                    return (
                                        <div
                                            key={deal.id}
                                            className={`${styles.card} ${isStale ? styles.stale : ''}`}
                                            draggable
                                            onDragStart={() => handleDragStart(deal)}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                                <div style={{ flex: 1 }}>
                                                    <div className={styles.cardTitle}>{deal.products}</div>
                                                    <div className={styles.cardAmount}>${deal.amount.toLocaleString()}</div>
                                                    <div className={styles.cardClient}>{deal.client.companyName}</div>
                                                    {deal.investor && (
                                                        <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '0.125rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                            <span style={{ fontWeight: '600' }}>Buyer:</span> {deal.investor.companyName || deal.investor.contactName}
                                                        </div>
                                                    )}
                                                    {/* Proft/Spread Calculation */}
                                                    {(() => {
                                                        const arv = deal.client.arv || 0;
                                                        const repairs = deal.client.repairs || 0;
                                                        const sellerPrice = deal.client.ourOffer || 0;
                                                        const wholesalePrice = deal.amount || 0;

                                                        // Acquisition View: Show Projected Profit based on Max Offer vs Seller Price? 
                                                        // Disposition View: Show Actual Spread (Wholesale Price - Seller Price)

                                                        const spread = (wholesalePrice - sellerPrice);
                                                        const hasSpread = spread > 0 && wholesalePrice > sellerPrice;

                                                        return (
                                                            <div style={{ marginTop: '0.25rem' }}>
                                                                {hasSpread ? (
                                                                    <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: '600' }}>
                                                                        Spread: ${spread.toLocaleString()}
                                                                    </div>
                                                                ) : (
                                                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                                                        Est. ARV: ${(arv).toLocaleString()}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })()}
                                                    {isStale && <span className={styles.staleBadge}>Stale ({'>'} 7d)</span>}
                                                </div>
                                                <div style={{ display: 'flex', gap: '0.25rem' }}>
                                                    <Link
                                                        href={`/deals/${deal.id}`}
                                                        style={{
                                                            padding: '0.25rem',
                                                            color: '#3b82f6',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}
                                                        title="View Details"
                                                    >
                                                        <ExternalLink size={14} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(deal.id)}
                                                        style={{
                                                            padding: '0.25rem',
                                                            border: 'none',
                                                            background: 'none',
                                                            cursor: 'pointer',
                                                            color: '#94a3b8',
                                                        }}
                                                        title="Delete deal"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
=======
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
    return (
        <div className={styles.board}>
            {STAGES.map(stage => {
                const stageDeals = deals.filter(d => d.stage === stage);
                return (
                    <div
                        key={stage}
                        className={styles.column}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(stage)}
                    >
                        <div className={styles.columnHeader}>
                            <span>{stage}</span>
                            <span className={styles.count}>{stageDeals.length}</span>
                        </div>
                        <div className={styles.columnContent}>
                            {stageDeals.map(deal => {
                                const isStale = (Date.now() - new Date(deal.updatedAt).getTime()) > (7 * 24 * 60 * 60 * 1000);
                                return (
                                    <div
                                        key={deal.id}
                                        className={`${styles.card} ${isStale ? styles.stale : ''}`}
                                        draggable
                                        onDragStart={() => handleDragStart(deal)}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                            <div style={{ flex: 1 }}>
                                                <div className={styles.cardTitle}>{deal.products}</div>
                                                <div className={styles.cardAmount}>${deal.amount.toLocaleString()}</div>
                                                <div className={styles.cardClient}>{deal.client.companyName}</div>
                                                {isStale && <span className={styles.staleBadge}>Stale ({'>'} 7 days)</span>}
                                            </div>
                                            <button
                                                onClick={() => handleDelete(deal.id)}
                                                style={{
                                                    padding: '0.25rem',
                                                    border: 'none',
                                                    background: 'none',
                                                    cursor: 'pointer',
                                                    color: '#94a3b8',
                                                }}
                                                title="Delete deal"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
<<<<<<< HEAD
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
        </div>
    );
}
