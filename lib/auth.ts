import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

export async function getCurrentUser() {
    try {
        if (process.env.AUTH_DISABLED === 'true' || process.env.NEXT_PUBLIC_AUTH_DISABLED === 'true') {
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

        const supabase = await createClient();
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            return null;
        }

        // Sync Supabase user with local Prisma DB
        const appUser = await prisma.user.upsert({
            where: { id: user.id },
            update: {
                email: user.email ?? undefined,
                // Supabase stores name in user_metadata
                name: user.user_metadata?.full_name ?? undefined,
            },
            create: {
                id: user.id,
                email: user.email ?? undefined,
                name: user.user_metadata?.full_name ?? undefined,
                role: 'USER',
            },
        });

        return appUser;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}

