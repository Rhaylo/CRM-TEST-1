
import { prisma } from "../lib/prisma";

async function main() {
    console.log("Migrating KPI Goals to global (userId: null)...");

    const keys = ['goal_daily_calls', 'goal_daily_offers', 'goal_daily_leads', 'goal_monthly_revenue', 'goal_monthly_contracts', 'goal_daily_conversations'];

    const result = await prisma.settings.updateMany({
        where: {
            key: { in: keys },
            userId: { not: null }
        },
        data: { userId: null }
    });

    console.log(`Updated ${result.count} goal settings.`);
}

main()
    .catch((e) => {
        // If unique constraint violation occurs (e.g. global goal already exists), we might need to handle it.
        // But for now let's hope it's clean or we'll see the error.
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
