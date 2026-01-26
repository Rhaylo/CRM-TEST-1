import { neonAuth } from '@neondatabase/auth/next/server';
import { prisma } from '@/lib/prisma';

export async function getCurrentUser() {
    try {
        if (process.env.AUTH_DISABLED === 'true') {
            return {
                id: 'mock-ceo',
                name: 'Mock CEO',
                email: 'mock@xyre.com',
                image: null,
                emailVerified: new Date(),
                password: null,
                role: 'ADMIN',
                createdAt: new Date(),
                updatedAt: new Date(),
            };
        }

        const { user } = await neonAuth();

        if (!user) {
            return null;
        }

        const appUser = await prisma.user.upsert({
            where: { id: user.id },
            update: {
                email: user.email ?? undefined,
                name: user.name ?? undefined,
            },
            create: {
                id: user.id,
                email: user.email ?? undefined,
                name: user.name ?? undefined,
                role: 'USER',
            },
        });

        return appUser;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}
