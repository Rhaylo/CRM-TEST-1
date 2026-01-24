import { prisma } from '@/lib/prisma';
import { executeAutomationRule } from '@/app/admin/automation/actions';

export async function triggerAutomation(triggerType: string, context: any) {
    try {
<<<<<<< HEAD
        const userId = context.userId;
        if (!userId) {
            console.log('Skipping automation: No userId in context');
            return;
        }

        // Find enabled rules matching the trigger type AND user
        const rules = await prisma.automationRule.findMany({
            where: {
                userId,
=======
        // Find enabled rules matching the trigger type
        const rules = await prisma.automationRule.findMany({
            where: {
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
                enabled: true,
                triggerType: triggerType,
            },
        });

<<<<<<< HEAD
        console.log(`Found ${rules.length} rules for trigger ${triggerType} user ${userId}`);
=======
        console.log(`Found ${rules.length} rules for trigger ${triggerType}`);
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e

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
