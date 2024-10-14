import { PrismaClient } from "@prisma/client";
import TableLead from "../../components/LeadItem/TableLead";
import Link from "next/link";
import AdminLayout from "../../components/admin/adminLayout/AdminLayout";

const prisma = new PrismaClient();

const Leads = async () => {
  const infoleads = await prisma.lead.findMany();
  return (
    <AdminLayout>
      <div className="flex-grow md:ml-64">
        {infoleads?.length > 0 ? (
          <div className="mt-10">
            <h2 className="text-center mb-2 px-2 text-2xl py-2 font-bold">
              Leads
            </h2>
            <TableLead infoleads={infoleads} />
          </div>
        ) : (
          <p className="text-center mt-14 text-gray-500">Não há leads cadastrados.</p>
        )}
      </div>
    </AdminLayout>
  );
};

export default Leads;
