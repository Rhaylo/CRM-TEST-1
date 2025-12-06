import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
    try {
        const { newPassword } = await request.json();

        if (!newPassword || newPassword.length < 8) {
            return NextResponse.json(
                { error: 'Password must be at least 8 characters' },
                { status: 400 }
            );
        }

        // Read current .env file
        const envPath = join(process.cwd(), '.env');
        const fs = require('fs');
        let envContent = fs.readFileSync(envPath, 'utf8');

        // Update password
        if (envContent.includes('AUTH_PASSWORD=')) {
            envContent = envContent.replace(/AUTH_PASSWORD=.*/g, `AUTH_PASSWORD=${newPassword}`);
        } else {
            envContent += `\nAUTH_PASSWORD=${newPassword}`;
        }

        // Write back to .env
        await writeFile(envPath, envContent);

        return NextResponse.json({ success: true, message: 'Password updated successfully. Please restart the server.' });
    } catch (error: any) {
        console.error('Password update error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to update password' },
            { status: 500 }
        );
    }
}
