import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ docId: string }> }
) {
    const params = await props.params;
    try {
        const docId = parseInt(params.docId);
        await prisma.document.delete({
            where: { id: docId }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting document:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
