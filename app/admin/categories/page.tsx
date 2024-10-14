import { PrismaClient } from "@prisma/client";
import Search from "../../components/Search";
import AdminLayout from "../../components/admin/adminLayout/AdminLayout"
import Link from "next/link";
import CategoryItem from "../../components/CategoryItem"
import { authOptions } from "@/app/utils/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import AdminLayoutComponent from "../components/adminLayout/AdminLayoutComponent";

const prisma = new PrismaClient();

const Categories = async ({ searchParams }) => {

  const query = searchParams?.query;
  
  // home blogs listing page

  const categories = await prisma.catCurso.findMany({
    where: query
      ? {
          OR: [
            { NomeCat: { contains: query } },
            // { category: { contains: query } },
          ],
        }
      : {}, // fetch all the data blogs
  });

  return (
    <div>
      <AdminLayoutComponent>
        <div className="flex-grow md:ml-64">
          <div className="flex justify-center items-center pt-[30px]">
            <Link
              href="/admin/categories/add-category"
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
            >
              Adicionar Categoria
            </Link>
          </div>
          <h2 className="text-center px-2 text-2xl py-2 font-bold">
            Categorias
          </h2>
          {categories?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-5 mb-5 px-4 py-5">
              {categories.map((category) => (
                <CategoryItem key={category?.id} cat={category} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              Não há categorias cadastradas.
            </p>
          )}
        </div>
      </AdminLayoutComponent>
    </div>
  );
};

export default Categories;
