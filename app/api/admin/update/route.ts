
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { currentAdminPassword, newAdminPassword } = body;

        if (!currentAdminPassword || !newAdminPassword) {
            return new NextResponse("Missing fields", { status: 400 });
        }

        if (newAdminPassword.length < 4) {
            return new NextResponse("Password is too short", { status: 400 });
        }

        // Fetch Global Setting (userId: null) IS ERRORING WITH STRICT NULL CHECKS? 
        // We need to query assuming there might be one.
        // Prisma Client types for 'null' in 'userId' can be tricky with string fields.
        // But schema says `String?`.

        // Find existing global setting
        const settings = await prisma.settings.findFirst({
            where: {
                key: 'admin_password',
                userId: null
            },
        });

        const currentStoredPassword = settings?.value || 'XyreHoldings76!@';

        if (currentAdminPassword !== currentStoredPassword) {
            return new NextResponse("Incorrect current admin password", { status: 400 });
        }

        // Upsert Global Setting
        // Note: upsert with non-unique where might fail if we don't use the unique accessor.
        // But (userId, key) is unique. userId can be null.
        // Prisma `where` for unique compound needs explicit match.

        // However, Prisma TS types sometimes struggle with `null` in compound unique findUnique.
        // If findUnique fails typing, we use findFirst + update/create.

        if (settings) {
            await prisma.settings.update({
                where: { id: settings.id },
                data: { value: newAdminPassword }
            });
        } else {
            await prisma.settings.create({
                data: {
                    key: 'admin_password',
                    value: newAdminPassword,
                    userId: null
                }
            });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Admin password update error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
