//import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { authOptions } from "@/app/utils/authOptions";
import AdminLayout from "../../../components/admin/adminLayout/AdminLayout"

import AddCategoryForm from "@/app/components/forms/AddCategoryForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const AddBlog = async () => {
  const session = await getServerSession(authOptions);

  // as i have the permissions i can see this page / routes

  const checkPermissions = session?.user?.permissions?.includes("CREATE_BLOG");

  const admin = session?.user?.role === "ADMIN";

  if (!admin && !checkPermissions) {
    redirect("/");
  }

  return (
    <AdminLayout>
      <AddCategoryForm />
      </AdminLayout>
  );
};

export default AddBlog;
