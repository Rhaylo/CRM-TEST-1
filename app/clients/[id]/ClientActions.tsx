'use client';

import { Briefcase, FileText } from 'lucide-react';
import styles from './ClientActions.module.css';
import { sendToDeal, sendToContract } from './clientActions';

export default function ClientActions({ clientId }: { clientId: number }) {
    return (
        <div className={styles.actionsContainer}>
            <h3 className={styles.actionsTitle}>Quick Actions</h3>
            <div className={styles.actionsGrid}>
                {/* Send to Deal */}
                <form action={(formData) => sendToDeal(clientId, formData)} className={styles.actionCard}>
                    <div className={styles.actionHeader}>
                        <Briefcase size={18} />
                        <span>Send to Deals</span>
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Deal Amount</label>
                        <input
                            name="amount"
                            type="number"
                            step="0.01"
                            className={styles.input}
                            placeholder="50000"
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Address</label>
                        <input
                            name="address"
                            type="text"
                            className={styles.input}
                            placeholder="123 Main St"
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Owner (Seller Name)</label>
                        <input
                            name="owner"
                            type="text"
                            className={styles.input}
                            placeholder="Sales Rep A"
                            required
                        />
                    </div>
                    <button type="submit" className={`${styles.btn} ${styles.btnDeal}`}>
                        <Briefcase size={16} />
                        Create Deal
                    </button>
                </form>

                {/* Send to Contract */}
                <form action={(formData) => sendToContract(clientId, formData)} className={styles.actionCard}>
                    <div className={styles.actionHeader}>
                        <FileText size={18} />
                        <span>Send to Contracts</span>
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Deal Amount</label>
                        <input
                            name="amount"
                            type="number"
                            step="0.01"
                            className={styles.input}
                            placeholder="50000"
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Products</label>
                        <input
                            name="products"
                            type="text"
                            className={styles.input}
                            placeholder="Widgets x 100"
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Owner</label>
                        <input
                            name="owner"
                            type="text"
                            className={styles.input}
                            placeholder="Sales Rep A"
                            required
                        />
                    </div>
                    <button type="submit" className={`${styles.btn} ${styles.btnContract}`}>
                        <FileText size={16} />
                        Create Deal + Contract
                    </button>
                </form>
            </div>
        </div>
    );
}
