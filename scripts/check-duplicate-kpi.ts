
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDuplicates() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    console.log('Checking for KPI records for Date:', today);

    const records = await prisma.kPIRecord.findMany({
        where: {
            // date: today, // Relax date check to see what's actually there around this time
            date: {
                gte: new Date(new Date().setHours(0, 0, 0, 0)),
                lt: new Date(new Date().setHours(23, 59, 59, 999))
            },
            userId: null
        }
    });

    console.log(`Found ${records.length} global records for today.`);
    console.log(JSON.stringify(records, null, 2));

    if (records.length > 1) {
        console.log('DUPLICATES FOUND! Merging...');
        // Logic to merge would go here, but first let's see output.
    }
}

checkDuplicates()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
