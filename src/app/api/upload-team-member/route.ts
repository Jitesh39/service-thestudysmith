import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Ensure the directory exists
        const uploadDir = path.join(process.cwd(), 'public', 'team-member');
        try {
            await fs.access(uploadDir);
        } catch {
            await fs.mkdir(uploadDir, { recursive: true });
        }

        // Clean filename
        const filename = file.name.replace(/\s+/g, '-').toLowerCase();
        const filePath = path.join(uploadDir, filename);

        await fs.writeFile(filePath, buffer);

        return NextResponse.json({
            success: true,
            url: `/team-member/${filename}`
        });

    } catch (error) {
        console.error('Upload Error:', error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
