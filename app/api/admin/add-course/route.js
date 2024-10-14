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

//export async function POST(request, { params }) {
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
    const infoCard = formData.get("infoCard");

    const valorAvista = formData.get("valorAvista");
    const valorAntAvista = formData.get("valorAntAvista");
    const valorAtualCartao = formData.get("valorAtualCartao");
    const valorAntCartao = formData.get("valorAntCartao");
    const discount = formData.get("discount");
    const isDiscount = discount === "true";

    const numParcela = parseInt(formData.get("numParcela")) || null;
    const linkCurso = formData.get("linkCurso");
    const linkCursoAvista = formData.get("linkCursoAvista");
    const subCurso = formData.get("subCurso");
    const DescCurso = formData.get("DescCurso");
    const catId = formData.get("catId");
    const title = formData.getAll("title");
    const description = formData.getAll("description");
    const linkCursoGratuito = formData.get("linkCursoGratuito");
    const teachers = formData.getAll("teachers");
    const coordinators = formData.getAll("coordinators");
    const infoId = formData.get("infoId");
    const imageCard = formData.getAll("imageCard");
    const imagePaths = await Promise.all(
      imageCard.map(async (image) => {
        if (!image) return undefined;
        const buffer = Buffer.from(await image.arrayBuffer());
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.v2.uploader.upload_stream(
            { folder: "uploads/courses" },
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

    const validImagePaths = imagePaths.filter((path) => path !== undefined);

    // adicionar image background
    const imageBackground = formData.getAll("imageBackground");
    const imageBackgroundPaths = await Promise.all(
      imageBackground.map(async (image) => {
        if (!image) return undefined;
        const buffer = Buffer.from(await image.arrayBuffer());
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.v2.uploader.upload_stream(
            { folder: "uploads/courses" },
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

    const validImageBackgroundPaths = imageBackgroundPaths.filter(
      (path) => path !== undefined
    );

    // adicionar image cards
    const imageHome = formData.getAll("imageHome");
    const imageHomePaths = await Promise.all(
      imageHome.map(async (image) => {
        if (!image) return undefined;
        const buffer = Buffer.from(await image.arrayBuffer());
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.v2.uploader.upload_stream(
            { folder: "uploads/courses" },
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

    const validImageHomePaths = imageHomePaths.filter(
      (path) => path !== undefined
    );

    // Verifica se os professores e coordenadores existem
    let teacherRecords = [];
    if (teachers.length > 0) {
      teacherRecords = await prisma.teachers.findMany({
        where: { id: { in: teachers } },
      });
      if (!teacherRecords.length) {
        throw new Error("Nenhum professor encontrado com os IDs fornecidos.");
      }
    }

    let coordinatorRecords = [];
    if (coordinators.length > 0) {
      coordinatorRecords = await prisma.coordinators.findMany({
        where: { id: { in: coordinators } },
      });
      if (!coordinatorRecords.length) {
        throw new Error("Nenhum coordenador encontrado com os IDs fornecidos.");
      }
    }

    const newCard = await prisma.cards.create({
      data: {
        imageCard: validImagePaths,
        imageBackground: validImageBackgroundPaths,
        imageHome: validImageHomePaths,
        infoCard,
        numParcela,
        linkCurso,
        subCurso,
        DescCurso,
        valorAvista,
        valorAntAvista,
        valorAtualCartao,
        valorAntCartao,
        discount: isDiscount,
      
        linkCursoAvista,
        linkCursoGratuito,
        courseInfo: infoId ? { connect: { id: infoId } } : undefined,
        categoria: {
          connect: { id: catId },
        },
        contentCourse: {
          create: {
            title: title,
            description: description,
          },
        },
      },
    });

    // Cria os registros nas tabelas intermediárias
    if (teacherRecords.length > 0) {
      await Promise.all(
        teacherRecords.map((teacher) =>
          prisma.courseTeachers.create({
            data: {
              cardId: newCard.id, // Usando o ID do novo Card
              teacherId: teacher.id,
            },
          })
        )
      );
    }

    if (coordinatorRecords.length > 0) {
      await Promise.all(
        coordinatorRecords.map(async (coordinator) => {
          const existingRelation = await prisma.courseCoordinators.findUnique({
            where: {
              cardId_coordinatorId: {
                cardId: newCard.id, // ID do novo Card
                coordinatorId: coordinator.id,
              },
            },
          });

          // Cria o registro apenas se a relação não existir
          if (!existingRelation) {
            await prisma.courseCoordinators.create({
              data: {
                cardId: newCard.id,
                coordinatorId: coordinator.id,
              },
            });
          }
        })
      );
    }

    revalidatePath("/admin/courses");

    return NextResponse.json(
      { message: "Curso adicionado com sucesso!" },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error while Registeing", error);
    return NextResponse.json(
      { message: "Ocorreu um erro ao cadastrar o curso." },
      { status: 500 }
    );
  }
};
