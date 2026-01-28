import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function DebugAuthPage() {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    let dbStatus = 'Checking...';
    let dbError = null;
    let userCount = null;

    try {
        // Attempt a simple query to check connection
        userCount = await prisma.user.count();
        dbStatus = 'Connected';
    } catch (e: any) {
        dbStatus = 'Failed';
        dbError = e.message;
    }

    return (
        <div className="p-8 font-mono text-sm max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Vercel Diagnostic Report</h1>

            <div className="space-y-6">
                <section className="p-4 bg-gray-100 rounded border">
                    <h2 className="font-bold text-lg mb-2">1. Environment Variables</h2>
                    <div className="grid grid-cols-2 gap-2">
                        <div>NEXT_PUBLIC_SUPABASE_URL:</div>
                        <div className={process.env.NEXT_PUBLIC_SUPABASE_URL ? "text-green-600" : "text-red-600"}>
                            {process.env.NEXT_PUBLIC_SUPABASE_URL ? "Present" : "MISSING"}
                        </div>

                        <div>NEXT_PUBLIC_SUPABASE_ANON_KEY:</div>
                        <div className={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "text-green-600" : "text-red-600"}>
                            {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Present (Hidden)" : "MISSING"}
                        </div>

                        <div>DATABASE_URL_AUTH:</div>
                        <div>
                            {process.env.DATABASE_URL_AUTH ? (
                                <span className="text-green-600">
                                    Present <br />
                                    <span className="text-xs text-gray-500">
                                        (Host: {process.env.DATABASE_URL_AUTH.split('@')[1]?.split(':')[0] || 'Unknown'})
                                    </span>
                                </span>
                            ) : (
                                <span className="text-red-600">MISSING</span>
                            )}
                        </div>
                    </div>
                </section>

                <section className="p-4 bg-gray-100 rounded border">
                    <h2 className="font-bold text-lg mb-2">2. Supabase Auth (Session)</h2>
                    <div className="mb-2">
                        Status: {user ? <span className="text-green-600 font-bold">Authenticated</span> : <span className="text-yellow-600 font-bold">No Session</span>}
                    </div>
                    {user && (
                        <div className="text-xs text-gray-600">
                            User ID: {user.id}<br />
                            Email: {user.email}
                        </div>
                    )}
                    {authError && (
                        <div className="text-red-600 mt-2">
                            Auth Error: {authError.message}
                        </div>
                    )}
                </section>

                <section className="p-4 bg-gray-100 rounded border">
                    <h2 className="font-bold text-lg mb-2">3. Prisma Database Connection</h2>
                    <div className="mb-2">
                        Status: <span className={dbStatus === 'Connected' ? "text-green-600 font-bold" : "text-red-600 font-bold"}>{dbStatus}</span>
                    </div>

                    {dbStatus === 'Connected' && (
                        <div>User Count: {userCount} (Read Successful)</div>
                    )}

                    {dbError && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-800 whitespace-pre-wrap overflow-auto max-h-64">
                            <strong>Error Details:</strong><br />
                            {dbError}
                        </div>
                    )}
                </section>

                <div className="mt-8 text-center">
                    <a href="/login" className="text-blue-600 hover:underline mr-4">Go to Login</a>
                    <a href="/" className="text-blue-600 hover:underline">Go to Dashboard</a>
                </div>
            </div>
        </div>
    );
}
