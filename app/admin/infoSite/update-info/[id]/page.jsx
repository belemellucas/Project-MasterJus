//import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { authOptions } from "@/app/utils/authOptions";
import UpdateInfoForm from "@/app/components/forms/UpdateInfoForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { fetchCategory, fetchSingleCourse, fetchSingleInfoSite } from "@/actions/actions";
import AdminLayout from "../../../../components/admin/adminLayout/AdminLayout";

const UpdateInfo = async (infoId) => {
  const session = await getServerSession(authOptions);
  const checkPermissions = session?.user?.permissions?.includes("CREATE_BLOG");

  const admin = session?.user?.role === "ADMIN";

  if (!admin && !checkPermissions) {
    console.log("YOU CANNOT CREATE!");
    redirect("/");
  }
  const singleInfoSite = await fetchSingleInfoSite(infoId.params.id);
  return (
    <AdminLayout>
      <UpdateInfoForm singleInfoSite={singleInfoSite}/>
    </AdminLayout>
  );
};

export default UpdateInfo;
