
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function mergeDuplicates() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    console.log('Finding duplicates for merge...');

    // Find all global records for today
    const records = await prisma.kPIRecord.findMany({
        where: {
            date: {
                gte: new Date(new Date().setHours(0, 0, 0, 0)),
                lt: new Date(new Date().setHours(23, 59, 59, 999))
            },
            userId: null
        }
    });

    if (records.length <= 1) {
        console.log('No duplicates found needing merge.');
        return;
    }

    // Determine max values
    const maxValues = {
        calls: 0,
        offers: 0,
        leads: 0,
        appointments: 0,
        conversations: 0
    };

    records.forEach(r => {
        maxValues.calls = Math.max(maxValues.calls, r.calls);
        maxValues.offers = Math.max(maxValues.offers, r.offers);
        maxValues.leads = Math.max(maxValues.leads, r.leads);
        maxValues.appointments = Math.max(maxValues.appointments, r.appointments);
        maxValues.conversations = Math.max(maxValues.conversations, r.conversations);
    });

    console.log('Merged Values:', maxValues);

    // Keep the first one/latest one, update it, delete others
    // Let's keep the one that was mostly recently updated
    const sorted = records.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    const toKeep = sorted[0];
    const toDelete = sorted.slice(1);

    console.log(`Keeping ID ${toKeep.id}, Deleting ${toDelete.length} records...`);

    // Update the keeper
    await prisma.kPIRecord.update({
        where: { id: toKeep.id },
        data: maxValues
    });

    // Delete the others
    for (const r of toDelete) {
        await prisma.kPIRecord.delete({ where: { id: r.id } });
    }

    console.log('Merge Complete.');
}

mergeDuplicates()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
