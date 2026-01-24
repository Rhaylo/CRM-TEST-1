const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

console.log('--- Checking Environment Variables ---');

// Manually load .env and .env.local to simulate Next.js precedence
const envPath = path.join(process.cwd(), '.env');
const envLocalPath = path.join(process.cwd(), '.env.local');

let envVars = {};

if (fs.existsSync(envPath)) {
    console.log('Loading .env...');
    const parsed = dotenv.parse(fs.readFileSync(envPath));
    envVars = { ...envVars, ...parsed };
} else {
    console.log('.env file NOT found.');
}

if (fs.existsSync(envLocalPath)) {
    console.log('Loading .env.local (overrides .env)...');
    const parsed = dotenv.parse(fs.readFileSync(envLocalPath));
    envVars = { ...envVars, ...parsed };
} else {
    console.log('.env.local file NOT found.');
}

console.log('\n--- Effective Configuration ---');
console.log('SMTP_HOST:', envVars.SMTP_HOST || '(missing)');
console.log('SMTP_PORT:', envVars.SMTP_PORT || '(missing)');
console.log('SMTP_USER:', envVars.SMTP_USER || '(missing)');
console.log('ZOHO_EMAIL:', envVars.ZOHO_EMAIL || '(missing)');
console.log('SMTP_PASSWORD:', envVars.SMTP_PASSWORD ? '****** (Set)' : '(missing)');
console.log('ZOHO_APP_PASSWORD:', envVars.ZOHO_APP_PASSWORD ? '****** (Set)' : '(missing)');

if ((envVars.SMTP_USER || envVars.ZOHO_EMAIL) && (envVars.SMTP_PASSWORD || envVars.ZOHO_APP_PASSWORD)) {
    console.log('\nSUCCESS: Credentials appear to be configured.');
} else {
    console.log('\nFAILURE: Missing required credentials.');
}
