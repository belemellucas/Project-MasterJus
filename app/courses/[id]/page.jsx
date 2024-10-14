import { fetchSingleCourse } from "@/actions/actions";
import Image from "next/image";
import Link from "next/link";
import CoursePage from "../../components/coursePage/CoursePage"
const CourseDetail = async ({ params }) => {
  const id = params?.id;

  const course = await fetchSingleCourse(id);
  
  return (
    <CoursePage course={course}/>
  );
};

export default CourseDetail;
