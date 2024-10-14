import UpdateCourseForm from "@/app/components/forms/UpdateCourseForm";
import { fetchCategory, fetchCoordinators, fetchInfoCourse, fetchSingleCourse, fetchTeachers } from "@/actions/actions";
import AdminLayout from "../../../../components/admin/adminLayout/AdminLayout";

const UpdateCourse = async (cardId) => {


  const categoriesData = await fetchCategory();
  const singleCourse = await fetchSingleCourse(cardId.params.id);
  const infoCourseData = await fetchInfoCourse();
  const teachersData = await fetchTeachers();
  const coordinatorsData = await fetchCoordinators();
  return (
    <AdminLayout>
      <UpdateCourseForm categoriesData={categoriesData} 
      singleCourse={singleCourse} 
      infoCourseData={infoCourseData}
      teachersData={teachersData}
      coordinatorsData={coordinatorsData}
      />
    </AdminLayout>
  );
};

export default UpdateCourse;
