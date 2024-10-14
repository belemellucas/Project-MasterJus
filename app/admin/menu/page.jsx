import { PrismaClient } from "@prisma/client";
import InfoItem from "../../components/InfoItem";
import Link from "next/link";
import AdminLayout from "../../components/admin/adminLayout/AdminLayout"
import MenuItem from "../../components/admin/menu/menuItem";

const prisma = new PrismaClient();

const MenuItems = async () => {

const menuItens = await prisma.menuItems.findMany({
  include: {
    category: {
      select: {
        NomeCat: true, 
      }, 
    },
  },
});
  return (
    <AdminLayout>
      <div className="flex-grow md:ml-64">
        <div className="flex justify-center items-center mt-5 pt-[30px]">
          <Link
            href="/admin/menu/add-menu"
            className={`bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg ${menuItens.length >= 7 ? 'pointer-events-none opacity-50': ''}`}
          >
            Adicionar Items no Menu
          </Link>
        </div>
        <h2 className="text-center px-2 text-2xl py-2 font-bold">
          Itens do Menu
        </h2>
        {menuItens?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-5 px-4 py-5">
            {menuItens.map((menuItem) => (
              <MenuItem key={menuItem?.id} menuItem={menuItem} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            Não há Items cadastrados.
          </p>
        )}
      </div>
    </AdminLayout>
  );
};

export default MenuItems;
