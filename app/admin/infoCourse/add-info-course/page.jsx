import AddInfoCourseForm from "@/app/components/forms/AddInfoCourseForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/utils/authOptions";
import AdminLayout from "../../../components/admin/adminLayout/AdminLayout"

const AddInfoCourse = async () => {
  const session = await getServerSession(authOptions);

  // as i have the permissions i can see this page / routes

  const checkPermissions = session?.user?.permissions?.includes("CREATE_BLOG");

  const admin = session?.user?.role === "ADMIN";

  if (!admin && !checkPermissions) {
    console.log("YOU CANNOT CREATE!");
    redirect("/");
  }

  return (
    <AdminLayout>
      <AddInfoCourseForm />
    </AdminLayout>
  );
};

export default AddInfoCourse;
