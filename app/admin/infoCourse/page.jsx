import { PrismaClient } from "@prisma/client";
import InfoCourseItem from "../../components/InfoCourseItem";
import Link from "next/link";
import AdminLayout from "../../components/admin/adminLayout/AdminLayout"

const prisma = new PrismaClient();

const InfoCourse = async () => {
  const infoCourses = await prisma.infoCourse.findMany();
  return (
    <AdminLayout>
      <div className="flex-grow md:ml-64">
        <div className="flex justify-center items-center mt-5 pt-[30px]">
          <Link
            href="/admin/infoCourse/add-info-course"
            className='bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg'
          >
            Adicionar informações do curso
          </Link>
        </div>
        <h2 className="text-center px-2 text-2xl py-2 font-bold">
          Informações gerais
        </h2>
        {infoCourses?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-5 mb-5 px-4 py-5">
            {infoCourses.map((info) => (
              <InfoCourseItem key={info?.id} info={info} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            Não há informações gerais cadastradas.
          </p>
        )}  
      </div>
    </AdminLayout>
  );
};

export default InfoCourse;
