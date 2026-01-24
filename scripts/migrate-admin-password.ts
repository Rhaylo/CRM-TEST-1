
import { prisma } from "../lib/prisma";

async function main() {
    console.log("Migrating admin_password to global...");

    // Find any existing admin_password setting
    const existing = await prisma.settings.findFirst({
        where: { key: 'admin_password' },
        orderBy: { updatedAt: 'desc' }
    });

    if (!existing) {
        console.log("No existing admin_password found. Nothing to migrate.");
        return;
    }

    console.log("Found existing setting:", existing);

    if (existing.userId === null) {
        console.log("Already global.");
        return;
    }

    // Update to null
    await prisma.settings.update({
        where: { id: existing.id },
        data: { userId: null }
    });

    console.log("Migrated to userId: null");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
