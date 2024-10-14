import { PrismaClient } from "@prisma/client";
import TeachersItem from "../../components/TeachersItem";
import Link from "next/link";
import AdminLayout from "../../components/admin/adminLayout/AdminLayout"

const prisma = new PrismaClient();

const Teachers = async () => {
  const teachers = await prisma.teachers.findMany();
  const coordinators = await prisma.coordinators.findMany();

  const combinedData = [...teachers, ...coordinators];

  return (
    <AdminLayout>
      <div className="flex-grow md:ml-64">
        <div className="flex justify-center items-center mt-5 pt-[30px]">
          <Link
            href="/admin/teachers/add-teacher"
            className='bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg'
          >
            Adicionar professor e coordenador 
          </Link>
        </div>
        <h2 className="text-center px-2 text-2xl py-2 font-bold">
          Professores e coordenadores
        </h2>
        {combinedData?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-5 mb-5 px-4 py-5">
            {combinedData.map((item) => (
              <TeachersItem key={item?.id}
               teacher={item} 
              className="max-w-sm p-4 bg-white rounded-lg shadow-md overflow-hidden"/>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            Não há professores cadastrados.
          </p>
        )} 
      </div>
    </AdminLayout>
  );
};

export default Teachers;
