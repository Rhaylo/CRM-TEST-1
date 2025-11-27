import styles from './page.module.css';
import { createClient } from './actions';

export default function NewClientPage() {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Add New Client</h1>

            <form action={createClient} className={styles.form}>
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Basic Information</h2>
                    <div className={styles.grid}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Contact Name *</label>
                            <input name="contactName" type="text" className={styles.input} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Email</label>
                            <input name="email" type="email" className={styles.input} />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Phone</label>
                            <input name="phone" type="tel" className={styles.input} />
                        </div>
                    </div>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Property Details</h2>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Address</label>
                        <input name="address" type="text" className={styles.input} placeholder="123 Main St, City, State" />
                    </div>
                    <div className={styles.grid}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Property Condition</label>
                            <textarea name="propertyCondition" className={styles.textarea} placeholder="Describe the condition of the property..." rows={3} />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Property Link</label>
                            <input name="propertyLink" type="url" className={styles.input} placeholder="https://zillow.com/..." />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Asking Price</label>
                            <input name="askingPrice" type="number" step="0.01" className={styles.input} placeholder="150000" />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Our Offer</label>
                            <input name="ourOffer" type="number" step="0.01" className={styles.input} placeholder="120000" />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>ARV (After Repair Value)</label>
                            <input name="arv" type="number" step="0.01" className={styles.input} placeholder="200000" />
                        </div>
                    </div>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Motivation</h2>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Motivation Notes</label>
                        <textarea name="motivationNote" className={styles.textarea} placeholder="Why are they selling?" />
                    </div>
                </div>

                <button type="submit" className={styles.btn}>Create Client</button>
            </form>
        </div>
    );
}
