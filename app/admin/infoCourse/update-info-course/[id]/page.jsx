//import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { authOptions } from "@/app/utils/authOptions";
import UpdateInfoCourseForm from "@/app/components/forms/UpdateInfoCourseForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { fetchSingleInfoCourse } from "@/actions/actions";
import AdminLayout from "../../../../components/admin/adminLayout/AdminLayout";

const UpdateInfoCourse = async (infoId) => {
  const session = await getServerSession(authOptions);
  const checkPermissions = session?.user?.permissions?.includes("CREATE_BLOG");

  const admin = session?.user?.role === "ADMIN";

  if (!admin && !checkPermissions) {
    console.log("YOU CANNOT CREATE!");
    redirect("/");
  }
  const singleInfoCourse = await fetchSingleInfoCourse(infoId.params.id);
  return (
    <AdminLayout>
      <UpdateInfoCourseForm singleCourse={singleInfoCourse}/>
    </AdminLayout>
  );
};

export default UpdateInfoCourse;
