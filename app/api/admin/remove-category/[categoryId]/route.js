//import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/utils/authOptions";

const prisma = new PrismaClient();

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    const id = params?.categoryId || "";
    if (session?.user?.role === "ADMIN") {
      // push the data into the DB

      if (id) {
        await prisma.catCurso.delete({
          where: {
            id: id,
          },
        });

        revalidatePath(`/admin/categories`);

        return NextResponse.json(
          { message: "Categoria deletada com sucesso!" },
          { status: 200 }
        );
      } else {
        console.log("Id not found");
      }
    } else {
      return NextResponse.json(
        { message: "You Do not have Delete category permissions!" },
        { status: 403 }
      );
    }
    F;
  } catch (error) {
    console.log("Error while Registeing", error);
    return NextResponse.json(
      { message: "Error Occured While Registering the user." },
      { status: 500 }
    );
  }
}
