
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function getCurrentUser() {
    try {
        const session = await getServerSession(authOptions);
        return session?.user || null;
    } catch (error) {
        console.error("Error getting current user:", error);
        return null;
    }
}
