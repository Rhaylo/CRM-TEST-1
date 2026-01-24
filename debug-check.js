
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    if (prisma.calendarEvent) {
        console.log('SUCCESS');
    } else {
        console.log('FAILURE');
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
