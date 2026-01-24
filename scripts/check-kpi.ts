
import { prisma } from "../lib/prisma";

async function main() {
    const records = await prisma.kPIRecord.findMany({
        orderBy: { date: 'desc' }
    });
    console.log(JSON.stringify(records, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
