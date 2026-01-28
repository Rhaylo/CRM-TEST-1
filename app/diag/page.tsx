import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"

export const dynamic = 'force-dynamic'

export default async function DiagPage() {
    const supabase = await createClient()

    // 1. Check Session
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    // 2. Check DB Config
    const dbUrl = process.env.DATABASE_URL_AUTH || "NOT_SET"
    const isCorrectStart = dbUrl.startsWith("postgres://postgres.xaepkmmpldijporclzwe")
    const isPooler = dbUrl.includes("pooler.supabase.com")
    const isNoNeon = !dbUrl.includes("neon.tech")

    // 3. Test DB Connection Variants
    const variants = [
        { name: "Current (DATABASE_URL_AUTH)", url: process.env.DATABASE_URL_AUTH },
        { name: "Vercel Integration (POSTGRES_PRISMA_URL)", url: process.env.POSTGRES_PRISMA_URL },
        { name: "Direct Port 6543 (db.ref.supabase.co)", url: process.env.DATABASE_URL_AUTH?.replace("aws-0-us-east-1.pooler.supabase.com", "db.xaepkmmpldijporclzwe.supabase.co") },
        { name: "Direct Port 5432 (Session Mode)", url: process.env.DATABASE_URL_AUTH?.replace(":6543/", ":5432/").replace("pgbouncer=true", "") },
    ]

    const testResults = await Promise.all(variants.map(async (v) => {
        if (!v.url) return { name: v.name, status: "SKIPPED (No Var)", error: null };
        try {
            const tempPrisma = new (require('@prisma/client').PrismaClient)({
                datasourceUrl: v.url
            });
            const count = await tempPrisma.client.count();
            await tempPrisma.$disconnect();
            return { name: v.name, status: "CONNECTED ✅", count };
        } catch (e: any) {
            return { name: v.name, status: "FAILED ❌", error: e.message };
        }
    }))

    // 4. Check App User
    let appUser = null
    if (user) {
        try {
            appUser = await prisma.user.findUnique({ where: { id: user.id } })
        } catch (e) {
            // ignore
        }
    }

    return (
        <div className="p-10 max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-blue-600">Enhanced System Diagnostic</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border p-4 rounded bg-gray-50 shadow-sm">
                    <h2 className="font-semibold text-gray-700 mb-2">1. Authentication</h2>
                    <div className="space-y-1">
                        <div>User ID: <span className="text-xs font-mono">{user?.id || "Not Logged In"}</span></div>
                        <div>Auth Error: <span className={authError ? "text-red-500" : "text-green-600"}>{authError ? authError.message : "None"}</span></div>
                        <div>App User Found: {appUser ? "YES ✅" : "NO ❌"}</div>
                    </div>
                </div>

                <div className="border p-4 rounded bg-gray-50 shadow-sm">
                    <h2 className="font-semibold text-gray-700 mb-2">2. Environment Summary</h2>
                    <div className="space-y-1">
                        <div>Supabase URL: <span className="text-xs font-mono">{process.env.NEXT_PUBLIC_SUPABASE_URL}</span></div>
                        <div>Vercel Integration Detected: {process.env.POSTGRES_PRISMA_URL ? "Yes ✅" : "No ❌"}</div>
                        <div>Neon Cleaned: {isNoNeon ? "Yes ✅" : "No ❌"}</div>
                    </div>
                </div>
            </div>

            <div className="border p-4 rounded bg-white shadow-md">
                <h2 className="font-bold text-gray-800 mb-4 border-b pb-2">3. Connection Variant Testing</h2>
                <div className="space-y-4">
                    {testResults.map((res, i) => (
                        <div key={i} className="border-l-4 border-blue-200 pl-4 py-1">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold">{res.name}</span>
                                <span className={res.status.includes("✅") ? "text-green-600 font-bold" : "text-red-500 font-bold"}>
                                    {res.status}
                                </span>
                            </div>
                            {res.count !== undefined && <div className="text-sm text-gray-600">Client Count: {res.count}</div>}
                            {res.error && (
                                <div className="mt-2 text-xs bg-red-50 text-red-800 p-2 rounded border border-red-100 font-mono whitespace-pre-wrap">
                                    {res.error}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
