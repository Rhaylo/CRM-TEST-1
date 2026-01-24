'use client';

import { useState, useEffect } from 'react';
import { Calculator, Save, Pencil } from 'lucide-react';
import { updateDealAnalysis } from '../actions';
import styles from './deal-calculator.module.css';

interface DealCalculatorProps {
    deal: any; // Using any for now due to TS/Schema sync issues
}

export default function DealCalculator({ deal }: DealCalculatorProps) {
    const [isEditing, setIsEditing] = useState(false);

    // Values
    const [arv, setArv] = useState<string>(deal.arv ? deal.arv.toString() : '');
    const [repairs, setRepairs] = useState<string>(deal.repairs ? deal.repairs.toString() : '');
    const [fee, setFee] = useState<string>(deal.fee ? deal.fee.toString() : '10000');

    // Calculated
    const [mao, setMao] = useState<number>(0);
    const [isSaving, setIsSaving] = useState(false);
    const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle');

    // Display Values
    const displayArv = parseFloat(arv) || 0;
    const displayRepairs = parseFloat(repairs) || 0;
    const ourOffer = deal.client?.ourOffer || 0;
    const wholesalePrice = deal.amount || 0;
    const projectedProfit = wholesalePrice - ourOffer;

    // Calculate MAO live
    useEffect(() => {
        const arvVal = parseFloat(arv) || 0;
        const repairsVal = parseFloat(repairs) || 0;
        const feeVal = parseFloat(fee) || 0;

        // MAO Formula: (ARV * 0.70) - Repairs - Fee
        const calculatedMao = (arvVal * 0.70) - repairsVal - feeVal;
        setMao(calculatedMao);
    }, [arv, repairs, fee]);

    const handleSave = async () => {
        setIsSaving(true);
        setStatus('idle');
        try {
            await updateDealAnalysis(deal.id, {
                arv: parseFloat(arv) || 0,
                repairs: parseFloat(repairs) || 0,
                fee: parseFloat(fee) || 0,
            });
            setStatus('saved');
            setIsEditing(false); // Switch back to view mode on save
            setTimeout(() => setStatus('idle'), 2000);
        } catch (e) {
            console.error(e);
            setStatus('error');
        } finally {
            setIsSaving(false);
        }
    };

    if (isEditing) {
        return (
            <div className={styles.editContainer}>
                <div className={styles.header}>
                    <h3 className={styles.title}>
                        <Calculator size={20} color="#7c3aed" />
                        Edit Financials (MAO Calculator)
                    </h3>
                    <button onClick={() => setIsEditing(false)} className={styles.cancelButton}>Cancel</button>
                </div>

                <div className={styles.editGrid}>
                    {/* Inputs */}
                    <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>ARV (Future Value)</label>
                        <div className={styles.inputWrapper}>
                            <span className={styles.currencySymbol}>$</span>
                            <input
                                type="number"
                                className={styles.paramInput}
                                placeholder="250,000"
                                value={arv}
                                onChange={(e) => setArv(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>Est. Repairs</label>
                        <div className={styles.inputWrapper}>
                            <span className={styles.currencySymbol}>$</span>
                            <input
                                type="number"
                                className={styles.paramInput}
                                placeholder="30,000"
                                value={repairs}
                                onChange={(e) => setRepairs(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>Your Fee (Target)</label>
                        <div className={styles.inputWrapper}>
                            <span className={styles.currencySymbol}>$</span>
                            <input
                                type="number"
                                className={styles.paramInput}
                                placeholder="10,000"
                                value={fee}
                                onChange={(e) => setFee(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Results Bar */}
                <div className={styles.resultsBar}>
                    <div className={styles.resultsHeader}>
                        <span className={styles.resultsLabel}>Max Allowable Offer (MAO)</span>
                        <span className={`${styles.resultsValue} ${mao > 0 ? styles.positive : styles.negative}`}>
                            ${mao.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </span>
                    </div>

                    {/* Visual Bar */}
                    <div className={styles.visualBar}>
                        <div className={styles.barSegment70}>70% Rule</div>
                        <div className={styles.barSegmentRepairs}>Repairs</div>
                        <div className={styles.barSegmentFee}>Fee</div>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={styles.saveButton}
                    >
                        {isSaving ? 'Saving...' : (
                            <>
                                <Save size={16} />
                                Save Analysis
                            </>
                        )}
                    </button>
                </div>
            </div>
        );
    }

    // View Mode (Matches specific user request)
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>
                    <Calculator size={20} color="#374151" />
                    Financials
                </h3>
                <button
                    onClick={() => setIsEditing(true)}
                    className={styles.editButton}
                >
                    <Pencil size={14} />
                    Edit Numbers
                </button>
            </div>

            <div className={styles.grid}>
                <div className={styles.card}>
                    <span className={styles.cardLabel}>ARV</span>
                    <span className={styles.cardValue}>${displayArv.toLocaleString()}</span>
                </div>

                <div className={styles.card}>
                    <span className={styles.cardLabel}>Repairs</span>
                    <span className={styles.cardValue}>${displayRepairs.toLocaleString()}</span>
                </div>

                <div className={styles.card}>
                    <span className={styles.cardLabel}>Our Offer</span>
                    <span className={styles.cardValue}>${ourOffer.toLocaleString()}</span>
                </div>

                <div className={styles.card}>
                    <span className={styles.cardLabel}>Wholesale Price</span>
                    <span className={styles.cardValue}>${wholesalePrice.toLocaleString()}</span>
                </div>

                <div className={styles.profitCard}>
                    <span className={styles.profitLabel}>Projected Profit</span>
                    <span className={styles.profitValue}>${projectedProfit.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
}
