import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/utils/authOptions";
import { revalidatePath } from "next/cache";
import cloudinary from "cloudinary";

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const isValidUrl = (str) => {
  try {
    new URL(str);
    return true;
  } catch (_) {
    return false;
  }
};

const uploadImage = (image, folder) => {
  return new Promise(async (resolve, reject) => {
    try {
      const buffer = Buffer.from(await image.arrayBuffer());
      const uploadStream = cloudinary.v2.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error) reject(error);
          else resolve(result.secure_url);
        }
      );
      uploadStream.end(buffer);
    } catch (error) {
      reject(error);
    }
  });
};

const processImages = async (imageFiles, folder) => {
  return Promise.all(
    imageFiles.map(async (image) => {
      if (isValidUrl(image)) return image;
      if (image && typeof image !== "string") {
        return await uploadImage(image, folder);
      }
      return undefined;
    })
  );
};

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
    const description = formData.get("description");
    const type = formData.get("type");
    const academic = formData.getAll("academic");
    const teacherId = formData.get("id");
    const imageTeacherUrls = formData.getAll("imageTeacherUrls") || [];

    const newImagePaths = await processImages(
      formData.getAll("imageTeacher"),
      "uploads/courses"
    );

    const finalImagePaths = newImagePaths.length
      ? newImagePaths
      : imageTeacherUrls;

    const updateData = {
      name: name,
      description: description,
      type: type,
      academic: academic,
      imageTeacher: finalImagePaths,
    };

    const existingTeacher = await prisma.teachers.findUnique({
      where: { id: teacherId },
    });

    const existingCoordinator = await prisma.coordinators.findUnique({
      where: { id: teacherId },
    });

    if (type === "teacher") {
      if (existingCoordinator) {
        await prisma.coordinators.delete({
          where: { id: teacherId },
        });
      }
      if (!existingTeacher) {
        await prisma.teachers.create({
          data: {
            id: teacherId,
            ...updateData,
            type: "teacher",
          },
        });
      } else {
        await prisma.teachers.update({
          where: { id: teacherId },
          data: {
            ...updateData,
            type: "teacher",
          },
        });
      }

      revalidatePath(`/admin/teachers?${new Date().getTime()}`);

      return NextResponse.json({
        message: "Professor atualizado com sucesso!",
      });
    } else if (type === "coordinator") {
      if (existingTeacher) {
        // Atualiza professor para coordenador
        await prisma.teachers.update({
          where: { id: teacherId },
          data: {
            ...updateData,
            type: "coordinator",
          },
        });
      } else if (!existingCoordinator) {
        // Se não existe, cria o coordenador
        await prisma.coordinators.create({
          data: {
            id: teacherId,
            ...updateData,
            type: "coordinator",
          },
        });
      } else {
        await prisma.coordinators.update({
          where: { id: teacherId },
          data: {
            ...updateData,
            type: "coordinator",
          },
        });
      }

      revalidatePath(`/admin/teachers?${new Date().getTime()}`);

      return NextResponse.json({
        message: "Coordenador atualizado com sucesso!",
      });
    }

    return NextResponse.json(
      { message: "Invalid type specified." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error in API handler", error);
    return NextResponse.json(
      { message: "Unexpected error occurred." },
      { status: 500 }
    );
  }
};
