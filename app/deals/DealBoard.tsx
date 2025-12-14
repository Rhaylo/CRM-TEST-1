'use client';

import { useState } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import { updateDealStage } from './actions';
import { deleteDeal } from './deleteActions';
import { Trash2, ExternalLink } from 'lucide-react';

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
                                                {/* Profit Logic */}
                                                {(() => {
                                                    const arv = deal.client.arv || 0;
                                                    const repairs = deal.client.repairs || 0;
                                                    const sellerPrice = deal.client.ourOffer || 0;
                                                    const buyerPrice = deal.amount || 0; // Assuming deal.amount is the wholesale/buyer price

                                                    // MAO Formula: (ARV * 0.7) - Repairs
                                                    const mao = (arv * 0.7) - repairs;
                                                    const potentialProfit = mao - sellerPrice;

                                                    // Realized Profit: BuyerPrice - SellerPrice (or explicit assignmentFee)
                                                    const realizedProfit = deal.assignmentFee ?? (buyerPrice - sellerPrice);

                                                    // Show Realized if we have a spread (>0) or an explicit fee, otherwise show Potential
                                                    // If buyerPrice == sellerPrice (typical at deal creation), realized is 0, so show Potential.
                                                    const showPotential = !deal.assignmentFee && (realizedProfit <= 0 || buyerPrice === sellerPrice);

                                                    return (
                                                        <div style={{ marginTop: '0.25rem' }}>
                                                            {showPotential ? (
                                                                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '500' }}>
                                                                    Potential Profit: <span style={{ color: '#059669' }}>${potentialProfit.toLocaleString()}</span>
                                                                </div>
                                                            ) : (
                                                                <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: '600' }}>
                                                                    Profit: ${realizedProfit.toLocaleString()}
                                                                </div>
                                                            )}
                                                            {/* Debug/info line if needed, or we can hide it */}
                                                        </div>
                                                    );
                                                })()}
                                                {isStale && <span className={styles.staleBadge}>Stale ({'>'} 7 days)</span>}
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
                                                    title="View Details & Documents"
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
    );
}
