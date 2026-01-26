'use client';

import { createAuthClient } from '@neondatabase/auth/next';

const neonClient = createAuthClient();

const mockClient = {
    signIn: {
        email: async () => ({ data: { user: { id: 'mock-ceo', name: 'Mock CEO', email: 'mock@xyre.com' } }, error: null })
    },
    signUp: {
        email: async () => ({ data: { user: { id: 'mock-ceo', name: 'Mock CEO', email: 'mock@xyre.com' } }, error: null })
    },
    signOut: async () => ({ data: true, error: null }),
    session: {
        get: async () => ({ data: { user: { id: 'mock-ceo', name: 'Mock CEO', email: 'mock@xyre.com' }, session: { token: 'mock-token' } }, error: null })
    },
    useAuth: () => ({
        data: { user: { id: 'mock-ceo', name: 'Mock CEO', email: 'mock@xyre.com' }, session: { token: 'mock-token' } },
        isPending: false,
        error: null
    })
} as unknown as typeof neonClient;

export const authClient = (process.env.NEXT_PUBLIC_AUTH_DISABLED && process.env.NEXT_PUBLIC_AUTH_DISABLED.includes('true')) ? mockClient : neonClient;
