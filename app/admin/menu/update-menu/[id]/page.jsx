//import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { authOptions } from "@/app/utils/authOptions";
import UpdateMenuForm from "@/app/components/forms/UpdateMenuForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { fetchCategory, fetchSingleCourse, fetchSingleMenu } from "@/actions/actions";
import AdminLayout from "../../../../components/admin/adminLayout/AdminLayout";
import { PrismaClient } from "@prisma/client";

const UpdateMenu = async (menuId) => {
  const prisma = new PrismaClient();

  const session = await getServerSession(authOptions);
  const checkPermissions = session?.user?.permissions?.includes("CREATE_BLOG");

  const admin = session?.user?.role === "ADMIN";

  if (!admin && !checkPermissions) {
    console.log("YOU CANNOT CREATE!");
    redirect("/");
  }
  const singleMenuSite = await fetchSingleMenu(menuId.params.id);

  const categories = await prisma.catCurso.findMany({})

  return (
    <AdminLayout>
      <UpdateMenuForm singleMenuSite={singleMenuSite} categories={categories}/>
    </AdminLayout>
  );
};

export default UpdateMenu;
