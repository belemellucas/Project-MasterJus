import { fetchCategory } from "@/actions/actions";
import Header from "../components/header/Header";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const HeaderInitial = async () => {
  const categoriesData = await fetchCategory();
  const prisma = new PrismaClient();

  const menuItems = await prisma.menuItems.findMany({
    include: {
      category: {
        select: {
          NomeCat: true,
        },
      },
    },
  });

  return (
    <div className="md:pb-24 pb-14">
      <>
        <Header categoriesData={categoriesData} menuItems={menuItems} />
      </>
    </div>
  );
};

export default HeaderInitial;
