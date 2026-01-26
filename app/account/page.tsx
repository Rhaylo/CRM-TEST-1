'use client';

import { authClient } from '@/lib/auth-client';

export default function AccountPage() {
    const { data: session } = authClient.useSession();

    return (
        <div className="min-h-screen pt-20 bg-slate-950 text-white flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
            <div className="w-full max-w-2xl bg-slate-900 rounded-xl border border-slate-800 p-8">
                <div className="flex items-center gap-4 mb-8">
                    {session?.user?.image && (
                        <img src={session.user.image} alt="Profile" className="w-16 h-16 rounded-full" />
                    )}
                    <div>
                        <h2 className="text-xl font-semibold">{session?.user?.name || 'User'}</h2>
                        <p className="text-slate-400">{session?.user?.email}</p>
                    </div>
                </div>

                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <p className="text-sm text-slate-400">
                        Profile management is handled via the Admin Settings page or directly through your identity provider.
                    </p>
                </div>
            </div>
        </div>
    );
}
