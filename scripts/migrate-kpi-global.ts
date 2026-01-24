
import { prisma } from "../lib/prisma";

async function main() {
    console.log("Standardizing KPIRecords to global (userId: null)...");

    const result = await prisma.kPIRecord.updateMany({
        where: { userId: { not: null } },
        data: { userId: null }
    });

    console.log(`Updated ${result.count} records.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
