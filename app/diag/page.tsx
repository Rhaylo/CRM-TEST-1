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

    // 3. Test DB Connection
    let dbStatus = "Testing..."
    let dbError = null
    let userCount = -1

    try {
        userCount = await prisma.client.count()
        dbStatus = "CONNECTED ✅"
    } catch (e: any) {
        dbStatus = "FAILED ❌"
        dbError = e.message
    }

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
        <div className="p-10 max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">System Diagnostic</h1>

            <div className="border p-4 rounded bg-gray-50">
                <h2 className="font-semibold">1. Authentication</h2>
                <div>User ID: {user?.id || "Not Logged In"}</div>
                <div>Auth Error: {authError ? authError.message : "None"}</div>
                <div>App User Found in DB: {appUser ? "YES ✅" : "NO ❌"}</div>
            </div>

            <div className="border p-4 rounded bg-gray-50">
                <h2 className="font-semibold">2. Environment Config</h2>
                <div>Starts Correctly? {isCorrectStart ? "Yes ✅" : "No ❌"} ({dbUrl.substring(0, 40)}...)</div>
                <div>Is Supabase Pooler? {isPooler ? "Yes ✅" : "No ❌"}</div>
                <div>Neon Removed? {isNoNeon ? "Yes ✅" : "No ❌"}</div>
            </div>

            <div className="border p-4 rounded bg-gray-50">
                <h2 className="font-semibold">3. Database Connection</h2>
                <div>Status: {dbStatus}</div>
                {dbError && (
                    <pre className="text-red-500 text-sm mt-2 overflow-auto bg-white p-2 border">
                        {dbError}
                    </pre>
                )}
                <div>Client Count: {userCount}</div>
            </div>
        </div>
    )
}
