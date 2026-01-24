const { createAuthClient } = require('@neondatabase/neon-js/auth');

async function test() {
    const authUrl = 'https://ep-patient-mode-ahg1gxif.neonauth.us-east-1.aws.neon.tech/neondb/auth';
    console.log(`Testing URL: ${authUrl}`);
    const client = createAuthClient(authUrl);

    try {
        console.log("Attempting sign-up...");
        const res = await client.signUp({
            email: 'test_ai_' + Date.now() + '@example.com',
            password: 'TestPassword123!'
        });
        console.log("Sign-up result:", JSON.stringify(res, null, 2));
    } catch (e) {
        console.log("Sign-up failed!");
        console.log("Error name:", e.name);
        console.log("Error message:", e.message);
        if (e.response) {
            console.log("Status:", e.response.status);
            const text = await e.response.text();
            console.log("Body:", text);
        }
    }
}

test();
