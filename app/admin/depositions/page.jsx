import { PrismaClient } from "@prisma/client"
import DepositionsItem from "../../components/DepositionsItem";
import AdminLayout from "../../components/admin/adminLayout/AdminLayout"
import Link from "next/link";

const prisma = new PrismaClient();

const Depositions = async () => {
   
    const depositions = await prisma.depoimento.findMany({});
    return (
        <AdminLayout>
        <div className="flex-grow md:ml-64">
     <div className="flex justify-center items-center mt-5 pt-[30px]">
     <Link href="/admin/depositions/add-depo" className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg">
        Adicionar Depoimentos
      </Link>
     </div>
     <h2 className="text-center px-2 text-2xl py-2 font-bold">Depoimentos</h2>

     {depositions?.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-5 mb-5 px-4 py-5">
        {depositions.map((deposition) => (
          <DepositionsItem key={deposition?.id} depositions={deposition} />
        ))}
      </div>
    ) : (
      <p className="text-center text-gray-500">Não há depoimentos cadastrados.</p>
    )}
     </div>
     </AdminLayout>
      
        
    )
}

export default Depositions