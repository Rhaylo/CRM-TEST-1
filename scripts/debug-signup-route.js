const https = require('https');

const baseUrl = 'ep-patient-mode-ahg1gxif.neonauth.us-east-1.aws.neon.tech';
const paths = [
    '/neondb/auth/sign-up/email',
    '/sign-up/email',
    '/api/auth/sign-up/email',
    '/neondb/auth/api/sign-up/email',
    '/v1/sign-up/email',
    '/neondb/auth/v1/sign-up/email'
];

const postData = JSON.stringify({
    email: 'test@probe.com',
    password: 'password123',
    name: 'Probe User'
});

async function probe(path) {
    return new Promise((resolve) => {
        const options = {
            hostname: baseUrl,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': postData.length
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                resolve({ path, status: res.statusCode, body: data.substring(0, 100) });
            });
        });

        req.on('error', (e) => {
            resolve({ path, status: 'ERR', body: e.message });
        });

        req.write(postData);
        req.end();
    });
}

async function run() {
    console.log(`Probing base host: ${baseUrl}`);
    for (const path of paths) {
        const result = await probe(path);
        console.log(`[${result.status}] https://${baseUrl}${result.path} - ${result.body}`);
    }
}

run();
