import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

// Manual .env loading
function loadEnv(filename: string) {
    const filePath = path.join(process.cwd(), filename);
    if (!fs.existsSync(filePath)) return;
    const content = fs.readFileSync(filePath, 'utf-8');
    content.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
            const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
            if (!process.env[key.trim()]) {
                process.env[key.trim()] = value;
            }
        }
    });
}
loadEnv('.env');
loadEnv('.env.local');

const prisma = new PrismaClient();

async function main() {
    const email = 'Raylocot@gmail.com';
    const newPassword = 'password123';
    const adminGatePassword = 'XyreHoldings76!@';

    // 1. Reset User Password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword }
        });
        console.log(`✅ User password for ${email} reset to: ${newPassword}`);
    } else {
        console.log(`❌ User ${email} not found.`);
        // List all users to see who is there
        const allUsers = await prisma.user.findMany();
        console.log('Available users:', allUsers.map(u => u.email));
    }

    // 2. Reset Admin Gate Password
    // Handle the complex unique key logic (null userId)
    const adminSetting = await prisma.settings.findFirst({
        where: { key: 'admin_password', userId: null }
    });

    if (adminSetting) {
        await prisma.settings.update({
            where: { id: adminSetting.id },
            data: { value: adminGatePassword }
        });
        console.log(`✅ Admin Gate password updated to: ${adminGatePassword}`);
    } else {
        await prisma.settings.create({
            data: {
                key: 'admin_password',
                value: adminGatePassword,
                userId: null
            }
        });
        console.log(`✅ Admin Gate password created: ${adminGatePassword}`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
