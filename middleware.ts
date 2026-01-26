import { neonAuthMiddleware } from '@neondatabase/auth/next/server';

export default function middleware(request: any) {
    if (process.env.AUTH_DISABLED && process.env.AUTH_DISABLED.includes('true')) {
        return;
    }
    return neonAuthMiddleware({
        loginUrl: '/login',
    })(request);
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|logo.png|login|auth|api/auth|api/bootstrap).*)',
    ],
};
