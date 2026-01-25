'use client';

import { useState } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import { updateDealStage } from './actions';
import { deleteDeal } from './deleteActions';
import { Trash2, ExternalLink, RefreshCw, ArrowRight } from 'lucide-react';

const PIPELINES = {
    acquisitions: {
        title: 'Acquisitions (Buy)',
        stages: ['Lead', 'Due Diligence', 'Contract Sent', 'Under Contract'],
        color: 'blue',
    },
    dispositions: {
        title: 'Dispositions (Sell)',
        stages: ['Under Contract', 'Marketing', 'Buyer Found', 'Sold'],
        color: 'emerald',
    },
};

const STAGE_MAPPING: Record<string, string> = {
    Pending: 'Lead',
    'Contract Out': 'Contract Sent',
    'Contract In': 'Under Contract',
    Complete: 'Sold',
};

const STAGE_COLORS: Record<string, string> = {
    Lead: '#64748b',
    'Due Diligence': '#f59e0b',
    'Contract Sent': '#3b82f6',
    'Under Contract': '#8b5cf6',
    Marketing: '#ec4899',
    'Buyer Found': '#14b8a6',
    Sold: '#22c55e',
};

export default function DealBoard({ initialDeals }: { initialDeals: any[] }) {
    const normalizedDeals = initialDeals.map((d) => ({
        ...d,
        stage: STAGE_MAPPING[d.stage] || d.stage,
    }));

    const [deals, setDeals] = useState(normalizedDeals);
    const [draggedDeal, setDraggedDeal] = useState<any>(null);
    const [activePipeline, setActivePipeline] = useState<'acquisitions' | 'dispositions'>('acquisitions');

    const handleDragStart = (deal: any) => {
        setDraggedDeal(deal);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = async (stage: string) => {
        if (!draggedDeal) return;

        if (draggedDeal.stage !== stage) {
            const updatedDeals = deals.map((d) =>
                d.id === draggedDeal.id ? { ...d, stage, updatedAt: new Date() } : d,
            );
            setDeals(updatedDeals);

            await updateDealStage(draggedDeal.id, stage);
        }
        setDraggedDeal(null);
    };

    const handleDelete = async (dealId: number) => {
        setDeals(deals.filter((d) => d.id !== dealId));
        await deleteDeal(dealId);
    };

    const currentStages = PIPELINES[activePipeline].stages;

    return (
        <div className={styles.boardContainer}>
            <div className={styles.pipelineToggle}>
                <button
                    onClick={() => setActivePipeline('acquisitions')}
                    className={`${styles.pipelineButton} ${activePipeline === 'acquisitions' ? styles.pipelineButtonActive : ''}`}
                >
                    <RefreshCw size={14} className={styles.pipelineIcon} />
                    Acquisitions
                </button>
                <button
                    onClick={() => setActivePipeline('dispositions')}
                    className={`${styles.pipelineButton} ${activePipeline === 'dispositions' ? styles.pipelineButtonActive : ''}`}
                >
                    <ArrowRight size={14} className={styles.pipelineIcon} />
                    Dispositions
                </button>
            </div>

            <div className={styles.board}>
                {currentStages.map((stage) => {
                    const stageDeals = deals.filter((d) => d.stage === stage);
                    const color = STAGE_COLORS[stage] || '#cbd5e1';

                    const isBridge = stage === 'Under Contract';
                    const bridgeStyle = isBridge
                        ? { borderTop: `4px solid #8b5cf6`, backgroundColor: activePipeline === 'dispositions' ? '#f5f3ff' : undefined }
                        : { borderTop: `4px solid ${color}` };

                    return (
                        <div
                            key={stage}
                            className={styles.column}
                            onDragOver={handleDragOver}
                            onDrop={() => handleDrop(stage)}
                            style={{ ...bridgeStyle, '--stage-color': color } as React.CSSProperties}
                        >
                            <div className={styles.columnHeader}>
                                <span className={styles.columnTitle}>
                                    {stage}
                                    {isBridge && (
                                        <span className={styles.bridgeTag}>Handover</span>
                                    )}
                                </span>
                                <span className={styles.count}>{stageDeals.length}</span>
                            </div>
                            <div className={styles.columnContent}>
                                {stageDeals.map((deal) => {
                                    const isStale = (Date.now() - new Date(deal.updatedAt).getTime()) > (7 * 24 * 60 * 60 * 1000);
                                    const arv = deal.client.arv || 0;
                                    const sellerPrice = deal.client.ourOffer || 0;
                                    const wholesalePrice = deal.amount || 0;
                                    const spread = wholesalePrice - sellerPrice;
                                    const hasSpread = spread > 0 && wholesalePrice > sellerPrice;

                                    return (
                                        <div
                                            key={deal.id}
                                            className={`${styles.card} ${isStale ? styles.stale : ''}`}
                                            draggable
                                            onDragStart={() => handleDragStart(deal)}
                                        >
                                            <div className={styles.cardTop}>
                                                <div className={styles.cardMain}>
                                                    <div className={styles.cardTitle}>{deal.products}</div>
                                                    <div className={styles.cardAmount}>${deal.amount.toLocaleString()}</div>
                                                    <div className={styles.cardClient}>{deal.client.companyName}</div>
                                                    {deal.investor && (
                                                        <div className={styles.buyerTag}>
                                                            <span>Buyer:</span> {deal.investor.companyName || deal.investor.contactName}
                                                        </div>
                                                    )}
                                                    <div className={styles.metaRow}>
                                                        {hasSpread ? (
                                                            <span className={styles.spreadTag}>Spread: ${spread.toLocaleString()}</span>
                                                        ) : (
                                                            <span className={styles.arvTag}>Est. ARV: ${arv.toLocaleString()}</span>
                                                        )}
                                                        {isStale && <span className={styles.staleBadge}>Stale ({'>'} 7d)</span>}
                                                    </div>
                                                </div>
                                                <div className={styles.iconActions}>
                                                    <Link
                                                        href={`/deals/${deal.id}`}
                                                        className={styles.iconButton}
                                                        title="View Details"
                                                    >
                                                        <ExternalLink size={14} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(deal.id)}
                                                        className={`${styles.iconButton} ${styles.iconButtonDanger}`}
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
        </div>
    );
}
