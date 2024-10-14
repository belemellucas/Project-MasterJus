//import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { authOptions } from "@/app/utils/authOptions";
import UpdateTeacherForm from "@/app/components/forms/UpdateTeacherForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { fetchSingleTeacher, fetchSingleCoordinator } from "@/actions/actions";
import AdminLayout from "../../../../components/admin/adminLayout/AdminLayout";

const UpdateTeacher = async (teacherId) => {
  
  let singleTeacher = null; 
  let singleCoordinator = null; 

  try {
    singleTeacher = await fetchSingleTeacher(teacherId.params.id); 
  } catch (error) {
    console.log("Teacher not found or error occurred", error);
  }

  if (!singleTeacher) {
    try {
        singleCoordinator = await fetchSingleCoordinator(teacherId.params.id);
    } catch (error) {
        console.log("Coordinator not found or error occurred", error);
      }
  }
 

  return (
    <AdminLayout>
      <UpdateTeacherForm singleTeacher={singleTeacher || singleCoordinator} />
    </AdminLayout>
  );
};

export default UpdateTeacher;
