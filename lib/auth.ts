import { neonAuth } from '@neondatabase/auth/next/server';
import { prisma } from '@/lib/prisma';

export async function getCurrentUser() {
    try {
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
