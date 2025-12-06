import nodemailer from 'nodemailer';

// Create reusable transporter using Zoho SMTP
const transporter = nodemailer.createTransport({
    host: process.env.ZOHO_SMTP_HOST || 'smtp.zoho.com',
    port: parseInt(process.env.ZOHO_SMTP_PORT || '465'),
    secure: true, // use SSL
    auth: {
        user: process.env.ZOHO_EMAIL || 'info@xyreholdings.com',
        pass: process.env.ZOHO_APP_PASSWORD || '',
    },
});

export interface EmailOptions {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}

export async function sendEmail(options: EmailOptions) {
    if (!process.env.ZOHO_APP_PASSWORD) {
        throw new Error('ZOHO_APP_PASSWORD is not configured in environment variables');
    }

    const mailOptions = {
        from: `Xyre Holdings <${process.env.ZOHO_EMAIL || 'info@xyreholdings.com'}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html || options.text?.replace(/\n/g, '<br>'),
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Email sending error:', error);
        throw error;
    }
}
