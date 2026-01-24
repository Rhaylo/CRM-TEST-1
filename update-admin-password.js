const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateAdminPassword() {
    try {
        // Delete existing admin_password if it exists
        await prisma.settings.deleteMany({
            where: { key: 'admin_password' }
        });

        // Create new admin_password setting
        await prisma.settings.create({
            data: {
                key: 'admin_password',
                value: 'XyreHoldings76!@'
            }
        });

        console.log('✅ Admin password updated successfully to: XyreHoldings76!@');
    } catch (error) {
        console.error('❌ Error updating admin password:', error);
    } finally {
        await prisma.$disconnect();
    }
}

updateAdminPassword();
