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

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (
      session?.user?.role === "USER"
    ) {
    const formData = await req.formData();
    const depoimento = formData.get("depoimento");
    const autorDepo = formData.get("autorDepo");
    const userImg = formData.get("userImg");

    let imageUrl = null;

    if (userImg) {
       const buffer = Buffer.from(await userImg.arrayBuffer());
       imageUrl = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream(
            { folder: "uploads/users" },
            (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
            }
        );
        uploadStream.end(buffer);
       });
       await prisma.user.update({
        where: { id: session.user.id },
        data: { imgUser: [imageUrl]}
       });
    }
     const novoDepoimento = await prisma.depoimento.create({
        data: {
          imageDep: [imageUrl],
          depoimento,
          autorDepo
            },
      });

      revalidatePath("/admin/depositions");

      return NextResponse.json(
        { message: "Depoimento adicionado com sucesso!" },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { message: "Você é admin, para adicionar o depoimento acesse diretamente o Painel" },
        { status: 403 }
      );
    }
  } catch (error) {
    console.log("Error while Registeing", error);
    return NextResponse.json(
      { message: "Error Occured While Registering the user." },
      { status: 500 }
    );
  }
}
