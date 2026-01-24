import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Create Clients
    const client1 = await prisma.client.create({
        data: {
            companyName: 'Acme Corp',
            contactName: 'John Doe',
            position: 'CEO',
            phone: '555-0100',
            email: 'john@acme.com',
            address: '123 Main St',
            motivationScore: 8,
            motivationNote: 'Very interested in bulk order',
            internalComments: 'High value prospect',
            internalTags: 'VIP,Wholesale',
            notes: {
                create: [
                    { content: 'Initial contact made via email.' },
                    { content: 'Follow-up call scheduled for next week.' },
                ],
            },
        },
    })

    const client2 = await prisma.client.create({
        data: {
            companyName: 'Globex Inc',
            contactName: 'Jane Smith',
            position: 'Procurement Manager',
            phone: '555-0200',
            email: 'jane@globex.com',
            address: '456 Elm St',
            motivationScore: 5,
            motivationNote: 'Shopping around',
            internalComments: 'Needs convincing on price',
            internalTags: 'Standard',
        },
    })

    // Create Deal for Client 1
    const deal1 = await prisma.deal.create({
        data: {
            amount: 50000,
            products: 'Widgets x 1000',
            owner: 'Sales Rep A',
            stage: 'Contract Out',
            expectedCloseDate: new Date('2025-12-01'),
            clientId: client1.id,
            contracts: {
                create: {
                    status: 'Out',
                    dateSent: new Date(),
                    clientId: client1.id,
                },
            },
        },
    })

    // Create Deal for Client 2
    const deal2 = await prisma.deal.create({
        data: {
            amount: 15000,
            products: 'Gadgets x 200',
            owner: 'Sales Rep B',
            stage: 'Pending',
            expectedCloseDate: new Date('2026-01-15'),
            clientId: client2.id,
        },
    })

    console.log({ client1, client2, deal1, deal2 })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
