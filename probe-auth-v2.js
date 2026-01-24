const https = require('https');

const hostnames = [
    'ep-patient-mode-ahg1gxif.neonauth.c-3.us-east-1.aws.neon.tech',
    'ep-patient-mode-ahg1gxif.neonauth.us-east-1.aws.neon.tech',
    'floral-snow-76702981.neonauth.us-east-1.aws.neon.tech',
    'ep-patient-mode-ahg1gxif.c-3.us-east-1.aws.neon.tech'
];

const paths = [
    '/neondb/auth/.well-known/openid-configuration',
    '/neondb/auth/v1/session',
    '/.well-known/openid-configuration',
    '/v1/session',
    '/auth/.well-known/openid-configuration'
];

async function probe() {
    for (const host of hostnames) {
        for (const path of paths) {
            const url = `https://${host}${path}`;
            try {
                const res = await new Promise((resolve, reject) => {
                    const req = https.get(url, (res) => {
                        let data = '';
                        res.on('data', (chunk) => data += chunk);
                        res.on('end', () => resolve({ status: res.statusCode, data }));
                    }).on('error', reject);
                    req.setTimeout(5000, () => {
                        req.destroy();
                        reject(new Error('Timeout'));
                    });
                });
                console.log(`URL: ${url} | Status: ${res.status}`);
                console.log(`  Body: ${res.data.substring(0, 200)}...`);
            } catch (e) {
                console.log(`URL: ${url} | Error: ${e.message}`);
            }
        }
    }
}

probe();
