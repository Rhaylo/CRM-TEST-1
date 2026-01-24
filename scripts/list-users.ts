
import { prisma } from "../lib/prisma";

async function main() {
    const users = await prisma.user.findMany();
    console.log(JSON.stringify(users.map(u => ({ id: u.id, email: u.email })), null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
