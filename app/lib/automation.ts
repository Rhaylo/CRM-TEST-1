import { prisma } from '@/lib/prisma';
import { executeAutomationRule } from '@/app/admin/automation/actions';

export async function triggerAutomation(triggerType: string, context: any) {
    try {
        // Find enabled rules matching the trigger type
        const rules = await prisma.automationRule.findMany({
            where: {
                enabled: true,
                triggerType: triggerType,
            },
        });

        console.log(`Found ${rules.length} rules for trigger ${triggerType}`);

        // Execute each matching rule
        // In a real system, we would check conditions here before executing
        for (const rule of rules) {
            // Simple condition check (mock implementation)
            // const conditions = JSON.parse(rule.conditions);
            // if (!evaluateConditions(conditions, context)) continue;

            await executeAutomationRule(rule.id, {
                triggeredBy: triggerType,
                context: context,
            });
        }
    } catch (error) {
        console.error('Error triggering automation:', error);
    }
}
