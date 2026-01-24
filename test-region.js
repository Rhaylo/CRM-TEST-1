const https = require('https');

const hosts = [
    'ep-patient-mode-ahg1gxif.neonauth.aws-us-east-1.neon.tech',
    'ep-patient-mode-ahg1gxif.neonauth.us-east-1.aws.neon.tech',
    'ep-patient-mode-ahg1gxif.neonauth.c-3.us-east-1.aws.neon.tech'
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
    for (const host of hosts) {
        const url = `https://${host}/neondb/auth/.well-known/openid-configuration`;
        const res = await t(url);
        console.log(`URL: ${url} | Status: ${res.status}`);
        if (res.status === 200) console.log("  SUCCESS!");
    }
}

run();
