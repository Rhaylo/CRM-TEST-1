import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateContract } from '@/lib/contract-generator';

export async function POST(request: NextRequest) {
    console.log('API /api/generate-contract hit');
    try {
        const bodyText = await request.text();
        console.log('Raw body:', bodyText);

        let body;
        try {
            body = JSON.parse(bodyText);
        } catch (e) {
            console.error('JSON parse error:', e);
            return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
        }

        const { clientId, contractType, additionalData } = body;
        console.log(`Generating contract: ClientID=${clientId}, Type=${contractType}`);

        // Fetch client data
        let client;
        try {
            client = await prisma.client.findUnique({
                where: { id: parseInt(clientId) }
            });
        } catch (dbError: any) {
            console.error('Database error:', dbError);
            return NextResponse.json({ error: 'Database connection failed', details: dbError.message }, { status: 500 });
        }

        if (!client) {
            console.error(`Client ${clientId} not found`);
            return NextResponse.json({ error: 'Client not found' }, { status: 404 });
        }

        console.log('Client found:', client.contactName);

        // Prepare contract data
        const contractData = {
            sellerName: client.contactName,
            seller2Name: client.seller2Name || undefined,
            propertyAddress: client.address || '',
            purchasePrice: client.purchasePrice || client.ourOffer || 0,
            closingDate: client.closingDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            state: client.state || 'TX',
            contractType: contractType,
            ...additionalData
        };

        // Generate contract text
        let contractText = '';
        try {
            contractText = generateContract(contractData);
            console.log('Contract text generated, length:', contractText.length);
        } catch (genError: any) {
            console.error('Generation logic error:', genError);
            return NextResponse.json({ error: 'Failed to generate contract text', details: genError.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            contractText,
            fileName: `contract_${client.contactName.replace(/\s+/g, '_')}_${Date.now()}.txt`
        });

    } catch (error: any) {
        console.error('CRITICAL API ERROR:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message, stack: error.stack },
            { status: 500 }
        );
    }
}
