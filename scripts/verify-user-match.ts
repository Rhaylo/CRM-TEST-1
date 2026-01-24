
import { prisma } from "../lib/prisma";

async function main() {
    const email = "Raylocot@gmail.com";
    const user = await prisma.user.findUnique({ where: { email } });
    console.log(`User ${email} ID:`, user?.id);

    const setting = await prisma.settings.findFirst({
        where: { key: 'admin_password' }
    });
    console.log("Setting User ID:", setting?.userId);
    console.log("Match:", user?.id === setting?.userId);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
