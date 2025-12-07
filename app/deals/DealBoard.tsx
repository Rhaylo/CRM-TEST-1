'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { updateDealStage } from './actions';
import { deleteDeal } from './deleteActions';
import { Trash2 } from 'lucide-react';

const STAGES = ['Pending', 'Contract Out', 'Contract In', 'Complete'];

export default function DealBoard({ initialDeals }: { initialDeals: any[] }) {
    const [deals, setDeals] = useState(initialDeals);
    const [draggedDeal, setDraggedDeal] = useState<any>(null);

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

    const STAGE_COLORS: Record<string, string> = {
        'Pending': '#f59e0b',         // Amber/Orange
        'Contract Out': '#3b82f6',    // Blue
        'Contract In': '#8b5cf6',     // Purple
        'Complete': '#22c55e',        // Green
    };

    return (
        <div className={styles.board}>
            {STAGES.map(stage => {
                const stageDeals = deals.filter(d => d.stage === stage);
                const color = STAGE_COLORS[stage] || '#cbd5e1';

                return (
                    <div
                        key={stage}
                        className={styles.column}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(stage)}
                        style={{ borderTop: `4px solid ${color}` }}
                    >
                        <div className={styles.columnHeader} style={{ color: color }}>
                            <span>{stage}</span>
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
        </div>
    );
}
