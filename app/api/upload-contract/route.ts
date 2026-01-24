import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const contractId = formData.get('contractId') as string;

        if (!file || !contractId) {
            return NextResponse.json({ error: 'File and contractId are required' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Update database with file content
        await prisma.contract.update({
            where: { id: parseInt(contractId) },
            data: {
                documentContent: buffer,
                documentPath: `/api/documents/${contractId}`, // API Route to serve content
                documentName: file.name
            },
        });

        return NextResponse.json({ success: true, path: `/api/documents/${contractId}` });

    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
    }
}
