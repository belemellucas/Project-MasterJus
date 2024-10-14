import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/utils/authOptions";
import cloudinary from "cloudinary";
import { revalidatePath } from "next/cache";


const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const POST = async (request) => {
  

  try {
    const session = await getServerSession(authOptions);

    if (
      !session ||
      (session.user?.role !== "ADMIN" &&
        !session.user?.permissions?.includes("CREATE_BLOG"))
    ) {
      return NextResponse.json(
        { message: "You do not have permission to add InfoCourse!" },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const title = formData.getAll("title");
    const description = formData.getAll("description");
    const name = formData.get("name");
   

    await prisma.infoCourse.create({
      data: {
        name,
        title,
        description
       
      },
    });

    revalidatePath(`/admin/infoCourse?${new Date().getTime()}`);

    return NextResponse.json({
      message: "Informações do curso adicionado com sucesso!",
    });
  } catch (error) {
    console.error("Error in API handler", error);
    return NextResponse.json(
      { message: "Unexpected error occurred." },
      { status: 500 }
    );
  }
};
