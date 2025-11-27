import AutomationRuleForm from '../AutomationRuleForm';
import styles from '../../admin.module.css';

export default function NewAutomationRulePage() {
    return (
        <div>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Create Automation Rule</h1>
                <p className={styles.pageDescription}>Define a new automated workflow</p>
            </div>
            <AutomationRuleForm />
        </div>
    );
}
