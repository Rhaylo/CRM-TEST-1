import nodemailer from 'nodemailer';

// Create reusable transporter using generic SMTP environment variables
// Supports Zoho, Gmail, etc.
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.zoho.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true, // use SSL
    auth: {
        user: process.env.SMTP_USER || process.env.ZOHO_EMAIL,
        pass: process.env.SMTP_PASSWORD || process.env.ZOHO_APP_PASSWORD,
    },
});

export interface EmailOptions {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}

export async function sendEmail(options: EmailOptions) {
    const user = process.env.SMTP_USER || process.env.ZOHO_EMAIL;
    const pass = process.env.SMTP_PASSWORD || process.env.ZOHO_APP_PASSWORD;

    if (!user || !pass) {
        throw new Error('SMTP credentials are not configured in environment variables');
    }

    const mailOptions = {
        from: `Xyre Holdings <${user}>`,
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
