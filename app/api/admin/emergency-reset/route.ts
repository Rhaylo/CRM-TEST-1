
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // 1. Reset Admin Gate Password
        const adminPw = 'XyreHoldings76!@';

        // Upsert logic manually
        const existingAdmin = await prisma.settings.findFirst({
            where: { key: 'admin_password', userId: null }
        });

        if (existingAdmin) {
            await prisma.settings.update({
                where: { id: existingAdmin.id },
                data: { value: adminPw }
            });
        } else {
            await prisma.settings.create({
                data: {
                    key: 'admin_password',
                    value: adminPw,
                    userId: null
                }
            });
        }

        // 2. Reset/Create User Password
        const targetEmail = 'raylocot@gmail.com';
        const userPw = 'password123';
        const hashedPassword = await bcrypt.hash(userPw, 10);

        // Upsert User
        await prisma.user.upsert({
            where: { email: targetEmail },
            update: {
                password: hashedPassword,
                email: targetEmail
            },
            create: {
                email: targetEmail,
                password: hashedPassword,
                name: 'Admin User',
                role: 'ADMIN'
            }
        });

        return NextResponse.json({
            status: 'COMPLETED',
            message: 'User account secured.',
            login_instructions: {
                email: targetEmail,
                password: userPw,
                note: 'Please type the email exactly as shown (all lowercase).'
            }
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
