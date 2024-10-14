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

export const POST = async (request) => {
  try {
    const session = await getServerSession(authOptions);

    if (
      !session ||
      (session.user?.role !== "ADMIN" &&
        !session.user?.permissions?.includes("CREATE_BLOG"))
    ) {
      return NextResponse.json(
        { message: "You do not have permission to add blog site!" },
        { status: 403 }
      );
    }
    const formData = await request.formData();
    const title = formData.get("title");
    const subtitulo = formData.get("subtitulo");
    const description = formData.get("description");
    const autorBlog = formData.get("autorBlog");
    const category = formData.get("category");
    const imageFile = formData.getAll("imageFile");
    const imagePaths = await Promise.all(
      imageFile.map(async (image) => {
        if (!image) return undefined;
        const buffer = Buffer.from(await image.arrayBuffer());
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.v2.uploader.upload_stream(
            { folder: "uploads/blog" },
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

    const validTeacherImagePaths = imagePaths.filter(
      (path) => path !== undefined
    );

    const new_blog = await prisma.blog.create({
      data: {
        imageUrl: validTeacherImagePaths,
        title,
        subtitulo,
        autorBlog,
        category,
        description,
        authorId: session?.user?.id,
      },
    });

    revalidatePath("/admin/blogs");

    return NextResponse.json(
      { message: "Blog adicionado com sucesso!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in API handler", error);
    return NextResponse.json(
      { message: "Unexpected error occurred." },
      { status: 500 }
    );
  }
}
