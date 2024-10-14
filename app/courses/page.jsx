import { PrismaClient } from "@prisma/client";
import { fetchCategory } from "@/actions/actions";
import Course from "../components/course/Course";

const prisma = new PrismaClient();

const Courses = async ({ searchParams }) => {
  const query = searchParams?.query;

  const fetchCards = async () => {
    const cards = await prisma.cards.findMany({
      include: { categoria: true },
      where: query
        ? {
            OR: [{ infoCard: { contains: query } }],
          }
        : {},
    });

    const categoriesData = await prisma.catCurso.findMany({});

    const groupedCards = {};
    categoriesData.forEach((category) => {
      groupedCards[category.NomeCat] = [];
    });

    cards.forEach((card) => {
      const categoryName = card.categoria?.NomeCat || "Sem Categoria";
      if (groupedCards[categoryName]) {
        groupedCards[categoryName].push(card);
      }
    });
    return groupedCards;
  };

  const groupedCards = await fetchCards();


  return (
    <Course groupedCards={groupedCards} />
  );
};

export default Courses;
