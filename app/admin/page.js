import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
//import AdminLayoutComponent from "../admin/components/adminLayout/AdminLayoutComponent"
import { authOptions } from "../utils/authOptions";
import Courses from "./courses/page";
const Admin = async () => {
  // const session = await getServerSession(authOptions);

  // if (!session) {
  //   redirect("/auth/login");
  // }

  // if (session?.user?.role !== "ADMIN") {
  //   redirect("/");
  // }

  return (
    <>
      <Courses />
    </>
  );
};

export default Admin;
