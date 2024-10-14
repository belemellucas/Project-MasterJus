import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
//import { authOptions } from "../../auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/app/utils/authOptions"

const prisma = new PrismaClient();


export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    const { nameItem, typeMenu, catId, rotaMenu, isExternalLink} = await req.json();
    if (
      session?.user?.role === "ADMIN" ||
      session?.user?.permissions?.includes("CREATE_BLOG")
    ) {
      const menuItem = await prisma.menuItems.create({
        data: {
         name: nameItem, 
         type: typeMenu,
         rota: rotaMenu,
         catId: catId,
         isExternalLink: isExternalLink
        },
      });

      revalidatePath("/admin/menu");

      return NextResponse.json(
        { message: "Item adicionado com sucesso" },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { message: "You Do not have Add Menu permissions!" },
        { status: 403 }
      );
    }
  } catch (error) {
    console.log("Error while Registeing", error);
    return NextResponse.json(
      { message: "Error Occured While Registering the user." },
      { status: 500 }
    );
  }
}
