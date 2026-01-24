const https = require('https');

const dbs = ['neondb', 'postgres'];
const host = 'ep-patient-mode-ahg1gxif.neonauth.us-east-1.aws.neon.tech';

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
    for (const db of dbs) {
        const url = `https://${host}/${db}/auth/.well-known/openid-configuration`;
        const res = await t(url);
        console.log(`URL: ${url} | Status: ${res.status}`);
        if (res.status === 200) console.log("  FOUND!");
    }
}

run();
