import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Fetch all templates
export async function GET() {
    try {
        const templates = await prisma.emailTemplate.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(templates);
    } catch (error) {
        console.error('Error fetching email templates:', error);
        return NextResponse.json(
            { error: 'Failed to fetch email templates' },
            { status: 500 }
        );
    }
}

// POST: Create a new template
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, subject, body: content, variables } = body;

        if (!name || !subject || !content) {
            return NextResponse.json(
                { error: 'Name, subject, and body are required' },
                { status: 400 }
            );
        }

        const template = await prisma.emailTemplate.create({
            data: {
                name,
                subject,
                body: content,
                variables: variables || '[]',
            }
        });

        return NextResponse.json(template);
    } catch (error) {
        console.error('Error creating email template:', error);
        return NextResponse.json(
            { error: 'Failed to create email template' },
            { status: 500 }
        );
    }
}

// PUT: Update an existing template
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, name, subject, body: content, variables } = body;

        if (!id || !name || !subject || !content) {
            return NextResponse.json(
                { error: 'ID, Name, subject, and body are required' },
                { status: 400 }
            );
        }

        const template = await prisma.emailTemplate.update({
            where: { id: parseInt(id) },
            data: {
                name,
                subject,
                body: content,
                variables: variables || '[]',
            }
        });

        return NextResponse.json(template);
    } catch (error) {
        console.error('Error updating email template:', error);
        return NextResponse.json(
            { error: 'Failed to update email template' },
            { status: 500 }
        );
    }
}

// DELETE: Remove a template
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Template ID is required' },
                { status: 400 }
            );
        }

        await prisma.emailTemplate.delete({
            where: { id: parseInt(id) }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting email template:', error);
        return NextResponse.json(
            { error: 'Failed to delete email template' },
            { status: 500 }
        );
    }
}
