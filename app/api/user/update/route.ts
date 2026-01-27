import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { email, password, currentPassword } = body;

        // Verify current password is required for any changes
        if (!currentPassword) {
            return new NextResponse("Current password is required", { status: 400 });
        }

        const supabase = await createClient();

        // Verify current password by attempting to sign in (or re-authenticate)
        // Since we are already logged in, we are just checking credentials.
        // We use a fresh client or just try signInWithPassword.
        // Note: signInWithPassword will update the session cookies in the response, which is fine.
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: user.email!,
            password: currentPassword
        });

        if (signInError) {
            return new NextResponse("Incorrect current password", { status: 400 });
        }

        const updates: any = {};
        let passwordChanged = false;

        // Update Email
        if (email) {
            if (user.role !== 'ADMIN') {
                return new NextResponse('Only the CEO can change the login email', { status: 403 });
            }

            const { error } = await supabase.auth.updateUser({ email });

            if (error) {
                return new NextResponse(error.message || "Failed to update email", { status: 400 });
            }

            updates.email = email;
        }

        // Update Password
        if (password) {
            if (password.length < 6) {
                return new NextResponse("Password must be at least 6 characters", { status: 400 });
            }

            const { error } = await supabase.auth.updateUser({ password });

            if (error) {
                return new NextResponse(error.message || "Failed to update password", { status: 400 });
            }

            passwordChanged = true;
        }

        if (Object.keys(updates).length === 0 && !passwordChanged) {
            return new NextResponse("No changes provided", { status: 400 });
        }

        const updatedUser = Object.keys(updates).length > 0
            ? await prisma.user.update({
                where: { id: user.id },
                data: updates,
            })
            : user;

        return NextResponse.json({
            success: true,
            user: {
                email: updatedUser.email,
                name: updatedUser.name
            }
        });

    } catch (error) {
        console.error("Profile update error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
