import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/utils/authOptions";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function POST(req, { params }) {
    try {
        const session = await getServerSession(authOptions);

        const { id, nameItem, typeMenu, catId, rotaMenu, isExternalLink} = await req.json();
    
         if (session?.user?.role === 'ADMIN' || session?.user?.permissions?.includes('UPDATE_COURSE')) {
         
            const updated_info = await prisma.menuItems.update({
                where: { id: id },
                data: {
                    name: nameItem, 
                    type: typeMenu,
                    rota: rotaMenu,
                    catId: catId,
                    isExternalLink: isExternalLink
                   },
            });

            revalidatePath('/admin/menu');

            return NextResponse.json({ message: 'Item do menu atualizado com sucesso!' }, { status: 200 });
        } else {
            return NextResponse.json({ message: 'Você não tem permissão para atualizar o menu!' }, { status: 403 });
        }
    } catch (error) {
        console.log("Error while updating course", error);
        return NextResponse.json({ message: 'Ocorreu um erro ao atualizar o menu.' }, { status: 500 });
    }
}
