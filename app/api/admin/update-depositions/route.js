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

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (
            !session ||
            (session.user?.role !== "ADMIN" &&
              !session.user?.permissions?.includes("CREATE_BLOG"))
          ) {
            return NextResponse.json(
              { message: "You do not have permission to update teacher!" },
              { status: 403 }
            );
          }
        
        const formData = await request.formData();
        const id = formData.get("id");
        const depoimento = formData.get("depoimento");
        const autorDepo = formData.get("autorDepo");
        const approved = formData.get("approved") === "true"; 
        const imageDepUrls = formData.getAll("imageDepUrls") || []; 
        
        const newImageDepPaths = await processImages(
            formData.getAll("imageDep"),
            "uploads/depositions"
        ); 

        const finalImagePaths = newImageDepPaths.length
           ? newImageDepPaths 
           : imageDepUrls; 

        const updateData = {
            depoimento: depoimento,
            autorDepo: autorDepo,
            approved: approved,
            imageDep: finalImagePaths
        };

  

            const updated_deposition = await prisma.depoimento.update({
                where: { id: id },
                data: updateData,
            });

            revalidatePath(`/admin/depositions?${new Date().getTime()}`);

            return NextResponse.json({ message: 'Depoimento atualizado com sucesso!' }, { status: 200 });
        
    } catch (error) {
        console.log("Error while updating deposition", error);
        return NextResponse.json({ message: 'Ocorreu um erro ao atualizar o depoimento.' }, { status: 500 });
    }
}
