import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/app/utils/authOptions";
import cloudinary from "cloudinary";

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// const { imageDep, depoimento, autorDepo } = await req.json();

export async function POST(resquest) {
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
    
    const formData = await resquest.formData();
    const depoimento = formData.get("depoimento");
    const autorDepo = formData.get("autorDepo");
    const approved = formData.get("approved") === "true"; 
    const imageDep = formData.getAll("imageDep"); 
    const imageDepPaths = await Promise.all(
      imageDep.map(async (image) => {
        if (!image) return undefined;
        const buffer = Buffer.from(await image.arrayBuffer());
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.v2.uploader.upload_stream(
            { folder: "uploads/depositions" },
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

    const validImageDep = imageDepPaths.filter(
      (path) => path !== undefined
    ); 

      // push the data into the DB
      const new_depo = await prisma.depoimento.create({
        data: {
          imageDep: validImageDep,
          depoimento,
          autorDepo,
          approved
        },
      });

      revalidatePath("/admin/depositions");

      return NextResponse.json(
        { message: "Depoimento adicionado com sucesso!" },
        { object: new_depo},
        { status: 201 }
      );
    } catch (error) {
    console.log("Error while Registeing", error);
    return NextResponse.json(
      { message: "Error Occured While Registering the user." },
      { status: 500 }
    );
  }
}
