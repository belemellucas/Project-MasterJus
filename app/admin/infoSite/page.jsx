import { PrismaClient } from "@prisma/client";
import InfoItem from "../../components/InfoItem";
import Link from "next/link";
import AdminLayout from "../../components/admin/adminLayout/AdminLayout"

const prisma = new PrismaClient();

const infoSite = async () => {
  const infoSite = await prisma.infoSite.findMany();
  return (
    <AdminLayout>
      <div className="flex-grow md:ml-64">
        <div className="flex justify-center items-center mt-5 pt-[30px]">
          <Link
            href="/admin/infoSite/add-info"
            className={`bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg ${infoSite.length > 0 ? 'pointer-events-none opacity-50': ''}`}
          >
            Adicionar informações do Site
          </Link>
        </div>
        <h2 className="text-center px-2 text-2xl py-2 font-bold">
          Imagens do site
        </h2>
        {infoSite?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-5 mb-5 px-4 py-5">
            {infoSite.map((info) => (
              <InfoItem key={info?.id} infoSite={info} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            Não há Imagens cadastradas.
          </p>
        )}
      </div>
    </AdminLayout>
  );
};

export default infoSite;
