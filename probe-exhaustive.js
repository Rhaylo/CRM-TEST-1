const https = require('https');

const host = 'ep-patient-mode-ahg1gxif.neonauth.us-east-1.aws.neon.tech';
const paths = [
    '/neondb/auth/.well-known/openid-configuration',
    '/neondb/auth/sign-up',
    '/auth/.well-known/openid-configuration',
    '/auth/sign-up',
    '/.well-known/openid-configuration',
    '/v1/auth/.well-known/openid-configuration',
    '/v1/signup'
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
        if (res.status === 200) console.log("  FOUND!");
    }
}

run();
