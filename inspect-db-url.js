
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(process.cwd(), '.env');
let url = '';

try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    for (const line of lines) {
        if (line.startsWith('DATABASE_URL=')) {
            // Handle quotes if present
            url = line.replace('DATABASE_URL=', '').trim().replace(/^["']|["']$/g, '');
            break;
        }
    }
} catch (e) {
    console.log('Error reading .env file');
}

if (!url) {
    console.log('NO DATABASE_URL FOUND');
} else {
    try {
        const parsed = new URL(url);
        console.log(`Protocol: ${parsed.protocol}`);
        console.log(`Host: ${parsed.hostname}`);
        console.log(`Port: ${parsed.port}`);
        console.log(`Database: ${parsed.pathname}`);
        console.log(`Params: ${parsed.search}`);
        console.log(`Username: ${parsed.username ? '***' : 'missing'}`);
        console.log(`Password: ${parsed.password ? '***' : 'missing'}`);
    } catch (e) {
        console.log('Invalid URL format');
    }
}
