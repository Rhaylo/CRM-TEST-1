const https = require('https');

const variations = [
    'https://ep-patient-mode-ahg1gxif.neonauth.us-east-1.aws.neon.tech/neondb/auth/.well-known/openid-configuration',
    'https://ep-patient-mode-ahg1gxif.neon-auth.us-east-1.aws.neon.tech/neondb/auth/.well-known/openid-configuration',
    'https://ep-patient-mode-ahg1gxif.us-east-1.aws.neon.tech/neondb/auth/.well-known/openid-configuration',
    'https://auth.ep-patient-mode-ahg1gxif.us-east-1.aws.neon.tech/neondb/auth/.well-known/openid-configuration',
    'https://ep-patient-mode-ahg1gxif.neonauth.c-3.us-east-1.aws.neon.tech/neondb/auth/.well-known/openid-configuration'
];

async function t(url) {
    return new Promise((resolve) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', d => data += d);
            res.on('end', () => resolve({ status: res.statusCode, data, headers: res.headers }));
        }).on('error', e => resolve({ status: 'ERR', data: e.message }));
    });
}

async function run() {
    for (const url of variations) {
        const res = await t(url);
        console.log(`URL: ${url} | Status: ${res.status} | Trace: ${res.headers ? (res.headers['x-trace-id'] || res.headers['neon-request-id'] || 'NONE') : 'NONE'}`);
    }
}

run();
