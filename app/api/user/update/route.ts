
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { authServer } from "@/lib/auth-server";

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

        const updates: any = {};
        let passwordChanged = false;

        // Update Email
        if (email) {
            const { error } = await authServer.updateUser({
                data: {
                    email,
                },
            });

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

            const { error } = await authServer.changePassword({
                currentPassword,
                newPassword: password,
            });

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
