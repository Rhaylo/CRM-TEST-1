
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'Raylocot@gmail.com';
    const password = 'password123';

    console.log(`Setting password for ${email}...`);

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
        where: { email },
        data: {
            password: hashedPassword,
            role: 'ADMIN' // Promoting to ADMIN just in case
        }
    });

    console.log('Password updated successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
