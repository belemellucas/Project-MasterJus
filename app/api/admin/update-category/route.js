import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/utils/authOptions";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    const { id, NomeCat, isExternalLink, linkExternal } = await req.json();

    if (
      session?.user?.role === "ADMIN" ||
      session?.user?.permissions?.includes("UPDATE_COURSE")
    ) {
      const updated_category = await prisma.catCurso.update({
        where: { id: id },
        data: {
          NomeCat,
          isExternalLink,
          linkExternal,
        },
      });

      revalidatePath("/admin/categories");

      return NextResponse.json(
        { message: "Categoria atualizada com sucesso!" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Você não tem permissão para atualizar a categoria!" },
        { status: 403 }
      );
    }
  } catch (error) {
    console.log("Error while updating course", error);
    return NextResponse.json(
      { message: "Ocorreu um erro ao atualizar o curso." },
      { status: 500 }
    );
  }
}
