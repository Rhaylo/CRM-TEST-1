import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const category = formData.get('category') as string || 'Other';

        if (!file) {
            return new NextResponse('No file uploaded', { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const dealId = parseInt(params.id);

        const document = await prisma.document.create({
            data: {
                fileName: file.name,
                fileContent: buffer,
                category,
                dealId
            }
        });

        // Return JSON but do not include the heavy fileContent
        const { fileContent, ...documentWithoutContent } = document;
        return NextResponse.json(documentWithoutContent);

    } catch (error) {
        console.error('Error uploading document:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
