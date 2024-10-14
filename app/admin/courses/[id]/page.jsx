import { fetchSingleCourse } from "@/actions/actions";

const CourseDetail = async ({ params }) => {
  const id = params?.id;
  try {
    const cardItem = await fetchSingleCourse(id);
    if (res.ok) {
      const rawData = await res.json();
      const cardItem = rawData.data;
      return cardItem;
    }
  } catch (error) {
    console.log("error", error);
  }
};

export default CourseDetail;
