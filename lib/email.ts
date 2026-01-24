import nodemailer from 'nodemailer';

<<<<<<< HEAD
// Create reusable transporter using generic SMTP environment variables
// Supports Zoho, Gmail, etc.
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.zoho.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true, // use SSL
    auth: {
        user: process.env.SMTP_USER || process.env.ZOHO_EMAIL,
        pass: process.env.SMTP_PASSWORD || process.env.ZOHO_APP_PASSWORD,
=======
// Create reusable transporter using Zoho SMTP
const transporter = nodemailer.createTransport({
    host: process.env.ZOHO_SMTP_HOST || 'smtp.zoho.com',
    port: parseInt(process.env.ZOHO_SMTP_PORT || '465'),
    secure: true, // use SSL
    auth: {
        user: process.env.ZOHO_EMAIL || 'info@xyreholdings.com',
        pass: process.env.ZOHO_APP_PASSWORD || '',
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
    },
});

export interface EmailOptions {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}

export async function sendEmail(options: EmailOptions) {
<<<<<<< HEAD
    const user = process.env.SMTP_USER || process.env.ZOHO_EMAIL;
    const pass = process.env.SMTP_PASSWORD || process.env.ZOHO_APP_PASSWORD;

    if (!user || !pass) {
        throw new Error('SMTP credentials are not configured in environment variables');
    }

    const mailOptions = {
        from: `Xyre Holdings <${user}>`,
=======
    if (!process.env.ZOHO_APP_PASSWORD) {
        throw new Error('ZOHO_APP_PASSWORD is not configured in environment variables');
    }

    const mailOptions = {
        from: `Xyre Holdings <${process.env.ZOHO_EMAIL || 'info@xyreholdings.com'}>`,
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
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
