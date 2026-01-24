const https = require('https');

const host = 'ep-patient-mode-ahg1gxif.neonauth.c-3.us-east-1.aws.neon.tech';
const paths = [
    '/.well-known/openid-configuration',
    '/neondb/auth/.well-known/openid-configuration',
    '/auth/.well-known/openid-configuration',
    '/api/auth/.well-known/openid-configuration',
    '/postgres/auth/.well-known/openid-configuration',
    '/v1/auth/.well-known/openid-configuration'
];

async function t(url) {
    return new Promise((resolve) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', d => data += d);
            res.on('end', () => resolve({ status: res.statusCode, data }));
        }).on('error', e => resolve({ status: 'ERR', data: e.message }));
    });
}

async function run() {
    for (const path of paths) {
        const url = `https://${host}${path}`;
        const res = await t(url);
        console.log(`Path: ${path} | Status: ${res.status}`);
        if (res.status !== 404 && res.status !== 400) {
            console.log(`  Body: ${res.data.substring(0, 100)}`);
        }
    }
}

run();
