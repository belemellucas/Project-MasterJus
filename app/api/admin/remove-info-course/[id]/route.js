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

    const id = params?.id || "";

    if (session?.user?.role === "ADMIN") {
      // push the data into the DB
     await prisma.cards.updateMany({
        where: { infoId: id }, 
        data: { infoId: null }
     }); 
      if (id) {
        await prisma.infoCourse.delete({
          where: {
            id: id,
          },
        });

        revalidatePath(`/admin/infoCourse`);

        return NextResponse.json(
          { message: "Informação do curso deletado com sucesso!" },
          { status: 200 }
        );
      } else {
        console.log("Id not found");
      }
    } else {
      return NextResponse.json(
        { message: "You Do not have Delete info permissions!" },
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
