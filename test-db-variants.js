
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// Read .env manually
const envPath = path.resolve(process.cwd(), '.env');
let baseUrl = '';

try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    for (const line of lines) {
        if (line.startsWith('DATABASE_URL=')) {
            baseUrl = line.replace('DATABASE_URL=', '').trim().replace(/^["']|["']$/g, '');
            break;
        }
    }
} catch (e) {
    console.error('Failed to read .env');
    process.exit(1);
}

// Test function
async function testConnection(connectionString, label) {
    console.log(`Testing: ${label}`);
    const prisma = new PrismaClient({
        datasources: { db: { url: connectionString } },
        log: ['error'], // limit logs
    });

    try {
        await prisma.user.count();
        console.log(`✅ SUCCESS: ${label}`);
        return true;
    } catch (e) {
        // Log just the first line of error to avoid huge stack traces
        const msg = e.message ? e.message.split('\n').find(l => l.includes('Prisma')) || e.message.split('\n')[0] : 'Unknown Error';
        console.log(`❌ FAILED: ${label} - ${msg}`);
        return false;
    } finally {
        await prisma.$disconnect();
    }
}

async function main() {
    if (!baseUrl) {
        console.log('No URL found');
        return;
    }

    // 1. Original (Direct/Default)
    await testConnection(baseUrl, 'Original URL');

    // 2. Add pgbouncer=true
    let paramChar = baseUrl.includes('?') ? '&' : '?';
    const urlWithPgbouncer = `${baseUrl}${paramChar}pgbouncer=true`;
    await testConnection(urlWithPgbouncer, 'With pgbouncer=true');

    // 3. Add connect_timeout=10
    paramChar = baseUrl.includes('?') ? '&' : '?';
    const urlWithTimeout = `${baseUrl}${paramChar}connect_timeout=20`;
    await testConnection(urlWithTimeout, 'With connect_timeout=20');
}

main();
