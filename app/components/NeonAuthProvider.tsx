
'use client';

import { SessionProvider } from 'next-auth/react';

interface NeonAuthProviderProps {
    children: React.ReactNode;
}

export default function NeonAuthProvider({ children }: NeonAuthProviderProps) {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    );
}
