'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createAutomationRule(data: {
    name: string;
    description?: string;
    triggerType: string;
    conditions: string;
    actions: string;
}) {
    const rule = await prisma.automationRule.create({
        data: {
            name: data.name,
            description: data.description,
            triggerType: data.triggerType,
            conditions: data.conditions,
            actions: data.actions,
            enabled: true,
        },
    });

    revalidatePath('/admin');
    return rule;
}

export async function updateAutomationRule(id: number, data: {
    name?: string;
    description?: string;
    triggerType?: string;
    conditions?: string;
    actions?: string;
    enabled?: boolean;
}) {
    const rule = await prisma.automationRule.update({
        where: { id },
        data,
    });

    revalidatePath('/admin');
    return rule;
}

export async function toggleAutomationRule(id: number, enabled: boolean) {
    await prisma.automationRule.update({
        where: { id },
        data: { enabled },
    });

    revalidatePath('/admin');
}

export async function deleteAutomationRule(id: number) {
    await prisma.automationRule.delete({
        where: { id },
    });

    revalidatePath('/admin');
}

export async function executeAutomationRule(ruleId: number, metadata?: any) {
    const rule = await prisma.automationRule.findUnique({
        where: { id: ruleId },
    });

    if (!rule || !rule.enabled) {
        throw new Error('Rule not found or disabled');
    }

    const execution = await prisma.automationExecution.create({
        data: {
            ruleId,
            status: 'pending',
            metadata: metadata ? JSON.stringify(metadata) : null,
        },
    });

    try {
        // Parse and execute actions
        const actions = JSON.parse(rule.actions);

        // Extract IDs from metadata
        let clientId: number | undefined;
        let taskId: number | undefined;

        if (metadata?.context) {
            if (metadata.triggeredBy === 'client_added') {
                clientId = metadata.context.id;
            } else if (metadata.triggeredBy === 'task_created' || metadata.triggeredBy === 'task_completed') {
                clientId = metadata.context.clientId;
                taskId = metadata.context.id;
            } else if (metadata.triggeredBy === 'deal_stage_change') {
                clientId = metadata.context.clientId;
            }
        } else {
            // Fallback for direct metadata passing (legacy/scheduled)
            clientId = metadata?.clientId;
            taskId = metadata?.taskId;
        }

        if (Array.isArray(actions)) {
            for (const action of actions) {
                if (action.type === 'create_task') {
                    // Create a follow-up task
                    if (clientId) {
                        const daysDue = action.params?.daysDue || 1;
                        const dueDate = new Date();
                        dueDate.setDate(dueDate.getDate() + daysDue);

                        await prisma.task.create({
                            data: {
                                title: action.params?.title || 'Automated Task',
                                description: action.params?.description || 'Created by automation rule',
                                clientId: clientId,
                                dueDate: dueDate,
                                priority: action.params?.priority || 'Medium',
                                status: 'Not Started',
                            }
                        });
                        console.log(`Automation: Created task for client ${clientId}`);
                    } else {
                        console.warn('Automation: create_task action skipped - no clientId found');
                    }
                } else if (action.type === 'send_notification') {
                    // Create a notification note
                    if (clientId || taskId) {
                        await prisma.note.create({
                            data: {
                                content: `🔔 Automation Notification: ${action.params?.message || 'Trigger fired'}`,
                                clientId: clientId,
                                taskId: taskId,
                            }
                        });
                        console.log(`Automation: Created notification note`);
                    }
                } else if (action.type === 'send_email') {
                    // Mock email sending
                    const recipient = action.recipient || 'info@xyreholdings.com';
                    const subject = action.subject || 'Automation Notification';
                    const body = `This is an automated email notification.\n\nTriggered by rule: ${rule.name}\n\nContext: Client ID ${clientId || 'N/A'}, Task ID ${taskId || 'N/A'}`;

                    console.log(`
---------------------------------------------------
[MOCK EMAIL SENT]
To: ${recipient}
Subject: ${subject}
Body:
${body}
---------------------------------------------------
`);
                    // TODO: Integrate with Resend or Nodemailer here
                    // await resend.emails.send({ from: '...', to: recipient, subject, text: body });
                }
            }
        }

        await prisma.automationExecution.update({
            where: { id: execution.id },
            data: {
                status: 'success',
                completedAt: new Date(),
            },
        });

        revalidatePath('/admin');
        return { success: true, execution };
    } catch (error: any) {
        await prisma.automationExecution.update({
            where: { id: execution.id },
            data: {
                status: 'failed',
                completedAt: new Date(),
                error: error.message,
            },
        });

        revalidatePath('/admin');
        return { success: false, error: error.message };
    }
}
