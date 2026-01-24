
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany();
    console.log('Users:', users);

    const settings = await prisma.settings.findMany({
        where: { key: 'admin_password' }
    });
    console.log('Admin Gate Settings:', settings);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
