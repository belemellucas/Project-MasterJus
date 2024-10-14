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
  if (request.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }

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
    const id = formData.get("id");
    const linkVideo = formData.get("linkVideo");
    const tituloVideo = formData.get("tituloVideo");
    const descVideo = formData.get("descVideo");
    const courseLinksDesktop = formData.getAll("courseLinksDesktop");
    const courseLinksMobile = formData.getAll("courseLinksMobile");
  

    const desktopImageUrls = formData.getAll("desktopImageUrls") || []; 
    const mobileImageUrls = formData.getAll("mobileImageUrls") || [];

    
    const newDesktopImagePaths = await processImages(
      formData.getAll("desktopImages"),
      "uploads/desktop"
    );
    const validNewDesktopImagePaths = newDesktopImagePaths.filter(Boolean);

    const newMobileImagePaths = await processImages(
      formData.getAll("mobileImages"),
      "uploads/mobile"
    );
    const validNewMobileImagePaths = newMobileImagePaths.filter(Boolean);

    const existingInfoSite = await prisma.infoSite.findUnique({
      where: { id },
      select: {
        imageAnex: true,
        imageMob: true,
      },
    });

    const updatedDesktopImages = [
     ...desktopImageUrls.filter((url) => existingInfoSite?.imageAnex.includes(url)),
     ...validNewDesktopImagePaths
    ];
    const updatedMobileImages = [
      ...mobileImageUrls.filter((url) => existingInfoSite?.imageMob.includes(url)), // Somente URLs válidas
      ...validNewMobileImagePaths,
    ];

   
    const updateData = {
      courseLinksDesktop: courseLinksDesktop.filter(Boolean),
      courseLinksMobile: courseLinksMobile.filter(Boolean),
      linkVideo,
      tituloVideo,
      descVideo,
      imageAnex: [...new Set(updatedDesktopImages)], 
      imageMob: [...new Set(updatedMobileImages)],   // Use Set to remove duplicates
    };

    await prisma.infoSite.update({
      where: { id },
      data: updateData,
    });

    revalidatePath(`/admin/infoSite?${new Date().getTime()}`);


    return NextResponse.json({
      message: "Conteúdos do site atualizados com sucesso!",
    });
  } catch (error) {
    console.error("Error in API handler", error);
    return NextResponse.json(
      { message: "Unexpected error occurred." },
      { status: 500 }
    );
  }
};
