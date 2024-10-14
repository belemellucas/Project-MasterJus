import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
//import { authOptions } from "../../auth/[...nextauth]/route";
import { authOptions } from "@/app/utils/authOptions"
import { revalidatePath } from "next/cache";



const prisma = new PrismaClient();

export async function POST(req, {params}) {
    try {

        const session = await getServerSession(authOptions);


        const { NomeCat, isExternalLink, linkExternal} = await req.json();

   
    
    if (session?.user?.role === 'ADMIN' || session?.user?.permissions?.includes('CREATE_BLOG')) {
        // push the data into the DB
        const new_cat = await prisma.catCurso.create({
            data: {
                NomeCat,
                isExternalLink,
                linkExternal
               // authorId: session?.user?.id
            }
        })

        revalidatePath('/admin/categories')
    
        return NextResponse.json({ message: 'Categoria adicionada com sucesso!' }, { status: 201 });

    } else {

        return NextResponse.json({ message: 'Você não tem permissão para adicionar a categoria!' }, { status: 403 });

    }

    
    
    } catch (error) {
        console.log("Error while Registeing", error);
        return NextResponse.json({ message: 'Error Occured While Registering the user.' }, { status: 500 });
    }
}