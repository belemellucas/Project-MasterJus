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

//export async function POST(req, { params }) {
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
    const id = formData.get("id");
    const infoCard = formData.get("infoCard");
    const catId = formData.get("catId");
    const valorAvista = formData.get("valorAvista");
    const valorAntAvista = formData.get("valorAntAvista");
    const valorAtualCartao = formData.get("valorAtualCartao");
    const valorAntCartao = formData.get("valorAntCartao");
    const discount = formData.get("discount");

    const isDiscount = discount === "true";

    const numParcela = parseInt(formData.get("numParcela")) || null;

    const linkCurso = formData.get("linkCurso");
    const subCurso = formData.get("subCurso");
    const linkCursoGratuito = formData.get("linkCursoGratuito");

    const DescCurso = formData.get("DescCurso");
    //const valorPix = formData.get("valorPix");
    const linkCursoAvista = formData.get("linkCursoAvista");
    const title = formData.getAll("title");
    const description = formData.getAll("description");
    const teachers = formData.getAll("teachers");
    const coordinators = formData.getAll("coordinators");
    const infoId = formData.get("infoId");

    const imageUrls = formData.getAll("imageUrls") || [];
    const imageUrlsBackground = formData.getAll("imageUrlsBackground") || [];
    const imageUrlsHomeCard = formData.getAll("imageUrlsHomeCard") || [];
    const newImagePaths = await processImages(
      formData.getAll("imageCard"),
      "uploads/courses"
    );
    const validNewImagePaths = newImagePaths.filter(Boolean);
    // Processar imageBackground
    const newImageBackgroundPaths = await processImages(
      formData.getAll("imageBackground"),
      "uploads/courses"
    );
    const validNewImageBackgroundPaths =
      newImageBackgroundPaths.filter(Boolean);

    // Processar imageHome
    const newImageHomePaths = await processImages(
      formData.getAll("imageHome"),
      "uploads/courses"
    );
    const validNewImageHomePaths = newImageHomePaths.filter(Boolean);

    const existingCourse = await prisma.cards.findUnique({
      where: { id },
      select: {
        imageCard: true,
        imageBackground: true,
        imageHome: true,
      },
    });

    const updatedImages = [
      ...imageUrls.filter((url) => existingCourse?.imageCard.includes(url)),
      ...validNewImagePaths,
    ];


    const newUpdatedBackground = [
      ...imageUrlsBackground.filter((url) =>
        existingCourse?.imageBackground.includes(url)
      ),
      ...validNewImageBackgroundPaths,
    ];


    const newUpdatedHomeCard = [
      ...imageUrlsHomeCard.filter((url) =>
        existingCourse?.imageHome.includes(url)
      ),
      ...validNewImageHomePaths,
    ];


    const updateData = {
      infoCard: infoCard,
      // catId: catId,
      categoria: catId ? { connect: { id: catId } } : undefined,
     // valorAtual: valorAtual,
     // valorAnt: valorAnt,
      valorAvista: valorAvista,
      valorAntAvista: valorAntAvista,
      valorAtualCartao: valorAtualCartao,
      valorAntCartao: valorAntCartao,
      discount: isDiscount,
      numParcela: numParcela,
      linkCurso: linkCurso,
      subCurso: subCurso,
      DescCurso: DescCurso,
     // valorPix: valorPix,
      linkCursoAvista: linkCursoAvista,
      linkCursoGratuito: linkCursoGratuito,
      imageCard: [...new Set(updatedImages)],
      imageBackground: [...new Set(newUpdatedBackground)],
      imageHome: [...new Set(newUpdatedHomeCard)],
      contentCourse: {
        update: {
          title: title,
          description: description,
        },
      },
    };

    if (infoId) {
      updateData.courseInfo = { connect: { id: infoId } };
    }

    const updatedCourse = await prisma.cards.update({
      where: { id },
      data: updateData,
    });

   

    await prisma.courseTeachers.deleteMany({ where: { cardId: id } });
    await prisma.courseCoordinators.deleteMany({ where: { cardId: id } });

    if (teachers.length > 0) {
      await Promise.all(
        teachers.map((teacher) =>
          prisma.courseTeachers.create({
            data: {
              cardId: updatedCourse.id,
              teacherId: teacher,
            },
          })
        )
      );
    }

    if (coordinators.length > 0) {
      await Promise.all(
        coordinators.map((coordinator) =>
          prisma.courseCoordinators.create({
            data: {
              cardId: updatedCourse.id,
              coordinatorId: coordinator,
            },
          })
        )
      );
    }

    await Promise.all([
      revalidatePath(`/admin/courses/update-course/${id}?${new Date().getTime()}`),
      revalidatePath(`/admin/courses?${new Date().getTime()}`)

    ]);
      return NextResponse.json({
      message: "Curso atualizado com sucesso!",
    });
  } catch (error) {
    console.error("Error in API handler", error);
    return NextResponse.json(
      { message: "Unexpected error occurred." },
      { status: 500 }
    );
  }
};
