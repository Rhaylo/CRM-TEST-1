
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getCurrentUser } from "@/lib/auth";

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

        // Fetch user from DB to get the current hashed password
        const dbUser = await prisma.user.findUnique({
            where: { id: user.id }
        });

        if (!dbUser || !dbUser.password) {
            return new NextResponse("User not found", { status: 404 });
        }

        // Validate current password
        const isValid = await bcrypt.compare(currentPassword, dbUser.password);
        if (!isValid) {
            return new NextResponse("Incorrect current password", { status: 400 });
        }

        const updates: any = {};

        // Update Email
        if (email && email !== dbUser.email) {
            // Check if email is taken
            const existing = await prisma.user.findUnique({
                where: { email }
            });
            if (existing) {
                return new NextResponse("Email already in use", { status: 400 });
            }
            updates.email = email;
        }

        // Update Password
        if (password) {
            if (password.length < 6) {
                return new NextResponse("Password must be at least 6 characters", { status: 400 });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            updates.password = hashedPassword;
        }

        if (Object.keys(updates).length === 0) {
            return new NextResponse("No changes provided", { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: updates,
        });

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
