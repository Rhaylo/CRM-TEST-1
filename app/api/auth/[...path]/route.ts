import { authApiHandler } from '@neondatabase/auth/next/server';

console.log('DEBUG: Auth Route Loaded');
console.log('DEBUG: NEON_AUTH_BASE_URL:', process.env.NEON_AUTH_BASE_URL);
console.log('DEBUG: DATABASE_URL_AUTH:', process.env.DATABASE_URL_AUTH ? 'Set' : 'Unset');

export const { GET, POST } = authApiHandler();
