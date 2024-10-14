//import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/utils/authOptions";

const prisma = new PrismaClient();

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    const id = params?.id || "";
    const type = params?.type || "";

    let successMessage = "";

    if (!id || !type) {
      return NextResponse.json(
        { message: "Id ou tipo não fornecido!" },
        { status: 400 }
      );
    }

    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Você não tem permissão para deletar informações!" },
        { status: 403 }
      );
    }

    if (type === "teacher") {
      await prisma.courseTeachers.deleteMany({
        where: {
          teacherId: id,
        },
      });

      /*const relatedCards = await prisma.cards.findMany({
        where: {
          teachers: {
            some: {
              teacherId: id,
            },
          },
        },
      });

      if (relatedCards.length > 0) {
      return NextResponse.json(
        { message: "Este professor está atribuído a cards, não pode ser excluído!" },
        { status: 400 }
      );
    } */

      await prisma.teachers.delete({
        where: {
          id: id,
        },
      });

      successMessage = "Professor deletado com sucesso!";
    } else if (type === "coordinator") {
      // Deletar primeiro da tabela de correlação CourseCoordinators
      await prisma.courseCoordinators.deleteMany({
        where: {
          coordinatorId: id,
        },
      });

      // Verificar se o coordinator está relacionado a algum card
      /*  const relatedCards = await prisma.cards.findMany({
        where: {
          coordinators: {
            some: {
              coordinatorId: id,
            },
          },
        },
      }); */

      /* if (relatedCards.length > 0) {
        return NextResponse.json(
          {
            message:
              "Este coordenador está atribuído a cards, não pode ser excluído!",
          },
          { status: 400 }
        );
      } */

      // Deletar o coordenador
      await prisma.coordinators.delete({
        where: {
          id: id,
        },
      });

      successMessage = "Coordenador deletado com sucesso!";
    } else {
      return NextResponse.json({ message: "Tipo inválido!" }, { status: 400 });
    }

    // Revalidar a página
    revalidatePath(`/admin/teachers`);

    return NextResponse.json({ message: successMessage }, { status: 200 });
  } catch (error) {
    console.log("Erro ao deletar", error);
    return NextResponse.json(
      { message: "Ocorreu um erro ao tentar deletar." },
      { status: 500 }
    );
  }
}
