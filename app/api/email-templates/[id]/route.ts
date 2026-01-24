import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT: Update a template
// PUT: Update a template
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idString } = await params;
        const id = parseInt(idString);
        const body = await request.json();
        const { name, subject, body: content, variables } = body;

        const updatedTemplate = await prisma.emailTemplate.update({
            where: { id },
            data: {
                name,
                subject,
                body: content,
                variables: variables || '[]',
            }
        });

        return NextResponse.json(updatedTemplate);
    } catch (error) {
        console.error('Error updating template:', error);
        return NextResponse.json(
            { error: 'Failed to update template' },
            { status: 500 }
        );
    }
}

// DELETE: Delete a template
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idString } = await params;
        const id = parseInt(idString);

        await prisma.emailTemplate.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting template:', error);
        return NextResponse.json(
            { error: 'Failed to delete template' },
            { status: 500 }
        );
    }
}
