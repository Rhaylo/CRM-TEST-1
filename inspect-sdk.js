const { createAuthClient } = require('@neondatabase/neon-js/auth');

async function test() {
    const authUrl = 'https://ep-patient-mode-ahg1gxif.neonauth.c-3.us-east-1.aws.neon.tech/neondb/auth';
    const client = createAuthClient(authUrl);

    console.log("Client Prototype Methods:");
    let proto = Object.getPrototypeOf(client);
    while (proto) {
        console.log("  -", Object.getOwnPropertyNames(proto));
        proto = Object.getPrototypeOf(proto);
    }

    console.log("Client instance keys:", Object.keys(client));
}

test();
