import { fetchSingleCategory } from "@/actions/actions";
//import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { authOptions } from "@/app/utils/authOptions";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import UpdateCategoryForm from "../../../../components/forms/UpdateCategoryForm";
import AdminLayout from "../../../../components/admin/adminLayout/AdminLayout"

const UpdateBlogPage = async ({ params }) => {
  const session = await getServerSession(authOptions);

  // as i have the permissions i can see this page / routes

  const checkPermissions = session?.user?.permissions?.includes("EDIT_BLOG");

  const admin = session?.user?.role === "ADMIN";

  if (!admin && !checkPermissions) {
    redirect("/");
  }

  const catId = params?.id;

  const categoriesData = await fetchSingleCategory(catId);

  return (
    <AdminLayout>
      <UpdateCategoryForm categoriesData={categoriesData} />
      </AdminLayout>
  );
};

export default UpdateBlogPage;
