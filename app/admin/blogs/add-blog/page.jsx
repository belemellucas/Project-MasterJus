//import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { authOptions } from "@/app/utils/authOptions";

import AddBlogForm from "@/app/components/forms/AddBlogForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import AdminLayout from "../../../components/admin/adminLayout/AdminLayout";

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
      <AddBlogForm />
    </AdminLayout>
  );
};

export default AddBlog;
