
import { prisma } from "../lib/prisma";

async function main() {
    console.log("Checking Settings for 'admin_password'...");
    const settings = await prisma.settings.findMany({
        where: { key: 'admin_password' },
    });
    console.log("Found:", settings);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
