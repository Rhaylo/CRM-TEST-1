const { createAuthClient } = require('@neondatabase/neon-js/auth');

async function test() {
    // Exact URL from the screenshot
    const authUrl = 'https://ep-patient-mode-ahg1gxif.neonauth.c-3.us-east-1.aws.neon.tech/neondb/auth';
    console.log(`Testing URL: ${authUrl}`);
    const client = createAuthClient(authUrl);

    try {
        console.log("Attempting sign-up...");
        const res = await client.signUp({
            email: 'test_ai_v3_' + Date.now() + '@example.com',
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
