import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const contractId = parseInt(params.id);
        const contract = await prisma.contract.findUnique({
            where: { id: contractId },
            select: { documentContent: true, documentName: true, documentPath: true }
        });

        if (!contract || !contract.documentContent) {
            return new NextResponse('Document not found', { status: 404 });
        }

        const buffer = contract.documentContent;
        const filename = contract.documentName || contract.documentPath || 'document.pdf';

        // Simple mime type detection based on extension
        let contentType = 'application/octet-stream';
        if (filename.toLowerCase().endsWith('.pdf')) contentType = 'application/pdf';
        else if (filename.toLowerCase().endsWith('.jpg') || filename.toLowerCase().endsWith('.jpeg')) contentType = 'image/jpeg';
        else if (filename.toLowerCase().endsWith('.png')) contentType = 'image/png';

        return new NextResponse(new Uint8Array(buffer), {
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `inline; filename="${filename}"`
            }
        });

    } catch (error) {
        console.error('Error fetching document:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
