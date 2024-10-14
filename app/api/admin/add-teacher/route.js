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
        { message: "You do not have permission to add InfoSite!" },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const type = formData.get("type");
    const academic = formData.getAll("academic");
    const imageTeacher = formData.getAll("imageTeacher");
    const teacherImagePaths = await Promise.all(
      imageTeacher.map(async (image) => {
        if (!image) return undefined;
        const buffer = Buffer.from(await image.arrayBuffer());
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.v2.uploader.upload_stream(
            { folder: "uploads/teacher" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          );
          uploadStream.end(buffer);
        });
        return result;
      })
    );

    const validTeacherImagePaths = teacherImagePaths.filter(
      (path) => path !== undefined
    );

    if (type === "coordinator") {
      await prisma.coordinators.create({
        data: {
          name,
          description,
          academic,
          imageTeacher: validTeacherImagePaths,
          type,
        },
      });
    } else {
      await prisma.teachers.create({
        data: {
          name,
          description,
          academic,
          imageTeacher: validTeacherImagePaths,
          type,
        },
      });
    }


    revalidatePath("/admin/teachers");

    return NextResponse.json({
      message: type === "coordinator"
        ? "Coordenador adicionado com sucesso!"
        : "Professor adicionado com sucesso!",
    });
  } catch (error) {
    console.error("Error in API handler", error);
    return NextResponse.json(
      { message: "Unexpected error occurred." },
      { status: 500 }
    );
  }
};
