import AutomationRuleForm from '../AutomationRuleForm';
import styles from '../../admin.module.css';

export default function NewAutomationRulePage() {
    return (
        <div>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Create Automation</h1>
                <p className={styles.pageDescription}>Build a trigger and action in minutes</p>
            </div>
            <AutomationRuleForm />
        </div>
    );
}
