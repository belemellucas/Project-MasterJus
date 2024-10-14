import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";
import { getServerSession } from 'next-auth/next'; // Certifique-se de importar isso
import { authOptions } from "@/app/utils/authOptions";

const prisma = new PrismaClient();

export async function POST(req) {
    const { imageUrl, crop, zoom } = await req.json();

    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            console.error('Usuário não autenticado');
            return NextResponse.json(
              { message: "Usuário não autenticado!" },
              { status: 401 }
            );
        }

        if (session.user?.role !== "ADMIN" && !session.user?.permissions?.includes("CREATE_BLOG")) {
            console.error('Sem permissão');
            return NextResponse.json(
              { message: "Você não tem permissão para ajustar a imagem!" },
              { status: 403 }
            );
        }

        
        await prisma.imageAdjustments.upsert({
            where: { imageUrl }, // Certifique-se de que imageUrl é único
            update: { crop, zoom },
            create: { imageUrl, crop, zoom }
        });

        return NextResponse.json({ message: 'Ajustes salvos com sucesso!' });
    } catch (error) {
        console.error('Erro ao salvar os ajustes:', error);
        return NextResponse.json({ error: 'Erro ao salvar os ajustes' }, { status: 500 });
    }
}
