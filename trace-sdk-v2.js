const { createAuthClient } = require('@neondatabase/neon-js/auth');

async function test() {
    const authUrl = 'https://ep-patient-mode-ahg1gxif.neonauth.c-3.us-east-1.aws.neon.tech/neondb/auth';
    const client = createAuthClient(authUrl);

    // Mock global fetch
    const originalFetch = global.fetch;
    global.fetch = async (url, options) => {
        console.log(`FETCH: ${url} | Method: ${options?.method || 'GET'}`);
        return {
            ok: false,
            status: 404,
            statusText: 'Not Found',
            text: async () => '{"code":404,"message":"Not found"}',
            json: async () => ({ code: 404, message: "Not found" }),
            headers: new Map()
        };
    };

    console.log("Calling signUp...");
    try {
        await client.signUp({ email: 'test@example.com', password: 'Password123!' });
    } catch (e) {
        // console.log("Caught:", e.message);
    }
}

test();
