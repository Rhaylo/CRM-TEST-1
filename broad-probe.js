const https = require('https');

const hosts = [
    'ep-patient-mode-ahg1gxif.neonauth.us-east-1.aws.neon.tech',
    'ep-patient-mode-ahg1gxif.neonauth.aws.neon.tech',
    'ep-patient-mode-ahg1gxif.neon.tech',
    'floral-snow-76702981.neonauth.us-east-1.aws.neon.tech',
    'ep-patient-mode-ahg1gxif.neonauth.c-3.us-east-1.aws.neon.tech'
];

const paths = [
    '/neondb/auth/.well-known/openid-configuration',
    '/auth/.well-known/openid-configuration',
    '/.well-known/openid-configuration'
];

async function t(url) {
    return new Promise((resolve) => {
        const req = https.get(url, (res) => {
            let data = '';
            res.on('data', d => data += d);
            res.on('end', () => resolve({ status: res.statusCode, data, headers: res.headers }));
        }).on('error', e => resolve({ status: 'ERR', data: e.message }));
        req.setTimeout(5000, () => {
            req.destroy();
            resolve({ status: 'TIMEOUT', data: '' });
        });
    });
}

async function run() {
    for (const host of hosts) {
        for (const path of paths) {
            const url = `https://${host}${path}`;
            const res = await t(url);
            console.log(`URL: ${url} | Status: ${res.status}`);
            if (res.status === 200) {
                console.log(`  SUCCESS! Trace: ${res.headers['x-trace-id'] || 'NONE'}`);
                process.exit(0);
            }
        }
    }
}

run();
