import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
    try {
        const { to, subject, message } = await request.json();

        if (!to || !subject || !message) {
            return NextResponse.json(
                { error: 'Missing required fields: to, subject, message' },
                { status: 400 }
            );
        }

        const result = await sendEmail({
            to,
            subject,
            text: message,
        });

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Email API error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to send email' },
            { status: 500 }
        );
    }
}
