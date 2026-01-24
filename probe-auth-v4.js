const https = require('https');

const hostnames = [
    'ep-patient-mode-ahg1gxif.c-3.neonauth.us-east-1.aws.neon.tech',
    'ep-patient-mode-ahg1gxif.neonauth.us-east-1.aws.neon.tech',
    'floral-snow-76702981.neonauth.us-east-1.aws.neon.tech'
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
    for (const host of hostnames) {
        const url = `https://${host}/neondb/auth/.well-known/openid-configuration`;
        const res = await t(url);
        console.log(`URL: ${url} | Status: ${res.status} | Body: ${res.data.substring(0, 50)}`);
    }
}

run();
