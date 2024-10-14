import UpdateDepositionForm from "@/app/components/forms/UpdateDepositionForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/utils/authOptions";
import AdminLayout from "../../../../components/admin/adminLayout/AdminLayout"
import { fetchSingleDeposition } from "@/actions/actions";

const AddDepositions = async (depoId) => {
  const session = await getServerSession(authOptions);

  // as i have the permissions i can see this page / routes

  const checkPermissions = session?.user?.permissions?.includes("CREATE_BLOG");

  const admin = session?.user?.role === "ADMIN";

  if (!admin && !checkPermissions) {
    console.log("YOU CANNOT CREATE!");
    redirect("/");
  }

  const singleDeposition = await fetchSingleDeposition(depoId.params.id);


  return (
    <AdminLayout>
      <UpdateDepositionForm singleDeposition={singleDeposition} />
    </AdminLayout>
  );
};

export default AddDepositions;
