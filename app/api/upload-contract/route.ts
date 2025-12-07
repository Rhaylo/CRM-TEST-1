import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const contractId = formData.get('contractId') as string;

        if (!file || !contractId) {
            return NextResponse.json({ error: 'File and contractId are required' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Ensure uploads directory exists
        const uploadDir = join(process.cwd(), 'public', 'uploads');
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {
            // Ignore error if directory already exists
        }

        // Create a unique filename to avoid collisions
        const uniqueFilename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
        const filePath = join(uploadDir, uniqueFilename);

        // Write file to public/uploads
        await writeFile(filePath, buffer);

        const publicPath = `/uploads/${uniqueFilename}`;

        // Update database
        await prisma.contract.update({
            where: { id: parseInt(contractId) },
            data: { documentPath: publicPath },
        });

        return NextResponse.json({ success: true, path: publicPath });

    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
    }
}
