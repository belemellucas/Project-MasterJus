import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../../utils/authOptions";
import AdminLayout from "../../../components/admin/adminLayout/AdminLayout"

const AdminLayoutComponent = async ({ children }) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  if (session?.user?.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div>
    <AdminLayout />
      {children}
    </div>
  );
};

export default AdminLayoutComponent;
