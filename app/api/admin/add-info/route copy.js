import { existsSync, mkdirSync } from 'fs';
import { readdir, unlink, writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/utils/authOptions';

const prisma = new PrismaClient();
const uploadDir = path.join(process.cwd(), 'public', 'uploads');

if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
}

export const GET = async (request) => {
    const files = await readdir(uploadDir);
    return NextResponse.json({ msg: 'Images retrieved successfully', files });
};

export const POST = async (request) => {
    if (request.method !== 'POST') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user?.role !== 'ADMIN' && !session.user?.permissions?.includes('CREATE_BLOG'))) {
            return NextResponse.json({ message: 'You do not have permission to add InfoSite!' }, { status: 403 });
        }

        const formData = await request.formData();
        const linkVideo = formData.get('linkVideo');
        const tituloVideo = formData.get('tituloVideo');
        const descVideo = formData.get('descVideo');
        const courseLinksDesktop = formData.getAll('courseLinksDesktop')
        const courseLinksMobile = formData.getAll('courseLinksMobile')
        const desktopImageFiles = formData.getAll('desktopImages');
        const desktopImagePaths = await Promise.all(desktopImageFiles.map(async (image) => {
            const byteLength = await image.arrayBuffer();
            const bufferData = Buffer.from(byteLength);
            const filePath = path.join(uploadDir, `${Date.now()}_${path.basename(image.name)}`);
            await writeFile(filePath, bufferData);
            return `/uploads/${path.basename(filePath)}`;
        }));

        const mobileImageFiles = formData.getAll('mobileImages');
        const mobileImagePaths = await Promise.all(mobileImageFiles.map(async (image) => {
            const byteLength = await image.arrayBuffer();
            const bufferData = Buffer.from(byteLength);
            const filePath = path.join(uploadDir, `${Date.now()}_${path.basename(image.name)}`);
            await writeFile(filePath, bufferData);
            return `/uploads/${path.basename(filePath)}`;
        }));

        await prisma.infoSite.create({
            data: {
                courseLinksDesktop: courseLinksDesktop,
                courseLinksMobile: courseLinksMobile,
                linkVideo,
                tituloVideo,
                descVideo,
                imageAnex: desktopImagePaths,
                imageMob: mobileImagePaths
            },
        });

        return NextResponse.json({ message: 'Conteúdos do site adicionado com sucesso!' });
    } catch (error) {
        console.error('Error in API handler', error);
        return NextResponse.json({ message: 'Unexpected error occurred.' }, { status: 500 });
    }
};

// Optionally, you can implement DELETE and other methods as needed.
