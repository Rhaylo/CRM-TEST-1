import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ docId: string }> }
) {
    const params = await props.params;
    try {
        const docId = parseInt(params.docId);
        const document = await prisma.document.findUnique({
            where: { id: docId },
            select: { fileContent: true, fileName: true }
        });

        if (!document) {
            return new NextResponse('Document not found', { status: 404 });
        }

        // Detect content type based on extension
        let contentType = 'application/octet-stream';
        const lowerName = document.fileName.toLowerCase();
        if (lowerName.endsWith('.pdf')) contentType = 'application/pdf';
        else if (lowerName.endsWith('.jpg') || lowerName.endsWith('.jpeg')) contentType = 'image/jpeg';
        else if (lowerName.endsWith('.png')) contentType = 'image/png';
        else if (lowerName.endsWith('.txt')) contentType = 'text/plain';
        else if (lowerName.endsWith('.doc') || lowerName.endsWith('.docx')) contentType = 'application/msword';

        // Use Uint8Array for Next.js/Edge compatibility
        return new NextResponse(new Uint8Array(document.fileContent), {
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `inline; filename="${document.fileName}"`
            }
        });

    } catch (error) {
        console.error('Error serving document:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
