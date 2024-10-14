import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/utils/authOptions";
import { revalidatePath } from "next/cache";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const POST = async (request) => {
  try {
    const session = await getServerSession(authOptions);
    if (
      !session ||
      (session.user?.role !== "ADMIN" &&
        !session.user?.permissions?.includes("CREATE_BLOG"))
    ) {
      return NextResponse.json(
        {
          message:
            "You do not have permission to update teacher or coordinator!",
        },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const name = formData.get("name");

    const title = formData.getAll("title");
    const description = formData.getAll("description");

    const id = formData.get("id");

 

    const updated_infoCourse = await prisma.infoCourse.update({
      where: { id: id },
      data: {
        name: name,
        title: title,
        description: description,
      },
    });

    revalidatePath(`/admin/infoCourse?${new Date().getTime()}`);

    return NextResponse.json({
      message: "Informações do curso atualizado com sucesso!",
    });
  } catch (error) {
    console.error("Error in API handler", error);
    return NextResponse.json(
      { message: "Unexpected error occurred." },
      { status: 500 }
    );
  }
};
