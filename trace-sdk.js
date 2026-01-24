const { createAuthClient } = require('@neondatabase/neon-js/auth');

// Mock fetch to see where it goes
global.fetch = async (url, options) => {
    console.log('SDK attempted to fetch:', url);
    return {
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({})
    };
};

const authUrl = 'https://ep-lucky-smoke-24151704.neonauth.us-east-1.aws.neon.tech/neondb/auth';
const authClient = createAuthClient(authUrl);

async function test() {
    console.log('Testing signOut...');
    try {
        await authClient.signOut();
    } catch (e) {
        console.log('signOut failed as expected in mock');
    }
}

test();
