//import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import AddMenuForm from "@/app/components/forms/AddMenuForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/utils/authOptions";
import AdminLayout from "../../../components/admin/adminLayout/AdminLayout"
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const AddItemMenu = async () => {
  const session = await getServerSession(authOptions);

  // as i have the permissions i can see this page / routes

  const checkPermissions = session?.user?.permissions?.includes("CREATE_BLOG");

  const admin = session?.user?.role === "ADMIN";

  if (!admin && !checkPermissions) {
    console.log("YOU CANNOT CREATE!");
    redirect("/");
  }

  const categories = await prisma.catCurso.findMany({})


  return (
    <AdminLayout>
      <AddMenuForm categories={categories} />
    </AdminLayout>
  );
};

export default AddItemMenu;
