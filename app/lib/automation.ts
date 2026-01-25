import { prisma } from '@/lib/prisma';
import { executeAutomationRule } from '@/app/admin/automation/actions';

export async function triggerAutomation(triggerType: string, context: any) {
    try {
        const userId = context.userId;
        if (!userId) {
            console.log('Skipping automation: No userId in context');
            return;
        }

        const rules = await prisma.automationRule.findMany({
            where: {
                userId,
                enabled: true,
                triggerType: triggerType,
            },
        });

        console.log(`Found ${rules.length} rules for trigger ${triggerType} user ${userId}`);

        for (const rule of rules) {
            await executeAutomationRule(rule.id, {
                triggeredBy: triggerType,
                context: context,
            });
        }
    } catch (error) {
        console.error('Error triggering automation:', error);
    }
}
