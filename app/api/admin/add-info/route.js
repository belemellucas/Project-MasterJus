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
    const linkVideo = formData.get("linkVideo");
    const tituloVideo = formData.get("tituloVideo");
    const descVideo = formData.get("descVideo");
    const courseLinksDesktop = formData.getAll("courseLinksDesktop");
    const courseLinksMobile = formData.getAll("courseLinksMobile");

    const desktopImageFiles = formData.getAll("desktopImages");
    const desktopImagePaths = await Promise.all(
      desktopImageFiles.map(async (image) => {
        if (!image) return undefined;
        const buffer = Buffer.from(await image.arrayBuffer());
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.v2.uploader.upload_stream(
            { folder: "uploads/desktop" },
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

    const validDesktopImagePaths = desktopImagePaths.filter(
      (path) => path !== undefined
    );

    const mobileImageFiles = formData.getAll("mobileImages");
    const mobileImagePaths = await Promise.all(
      mobileImageFiles.map(async (image) => {
        if (!image) return undefined;
        const buffer = Buffer.from(await image.arrayBuffer());
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.v2.uploader.upload_stream(
            { folder: "uploads/mobile" },
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

    const validMobileImagePaths = mobileImagePaths.filter(
      (path) => path !== undefined
    );

    await prisma.infoSite.create({
      data: {
        courseLinksDesktop: courseLinksDesktop.filter((link) => link),
        courseLinksMobile: courseLinksMobile.filter((link) => link),
        linkVideo,
        tituloVideo,
        descVideo,
        imageAnex: validDesktopImagePaths,
        imageMob: validMobileImagePaths,
      },
    });

    revalidatePath('/admin/infoSite');

    return NextResponse.json({
      message: "Conteúdos do site adicionado com sucesso!",
    });
  } catch (error) {
    console.error("Error in API handler", error);
    return NextResponse.json(
      { message: "Unexpected error occurred." },
      { status: 500 }
    );
  }
};
