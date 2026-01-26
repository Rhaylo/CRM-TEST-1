'use client';

import { NeonAuthUIProvider } from '@neondatabase/auth/react/ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

import { authClient } from '@/lib/auth-client';

interface NeonAuthProviderProps {
    children: ReactNode;
}

export default function NeonAuthProvider({ children }: NeonAuthProviderProps) {
    const router = useRouter();

    return (
        <NeonAuthUIProvider
            authClient={authClient}
            navigate={router.push}
            replace={router.replace}
            onSessionChange={() => router.refresh()}
            Link={Link}
            redirectTo="/"
        >
            {children}
        </NeonAuthUIProvider>
    );
}
