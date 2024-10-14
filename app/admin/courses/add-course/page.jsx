//import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { authOptions } from "@/app/utils/authOptions"
import AddCourseForm from "@/app/components/forms/AddCourseForm"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { fetchCategory, fetchCoordinators, fetchInfoCourse, fetchTeachers } from "@/actions/actions"
import AdminLayout from "../../../components/admin/adminLayout/AdminLayout"


const AddBlog = async () => {
    const session = await getServerSession(authOptions)

    // as i have the permissions i can see this page / routes

    const checkPermissions = session?.user?.permissions?.includes('CREATE_BLOG');

    const admin = session?.user?.role === 'ADMIN';

    if (!admin && !checkPermissions) {
        console.log('YOU CANNOT CREATE!!')
        redirect('/')
    }
    const categoriesData = await fetchCategory();
    const infoCourseData = await fetchInfoCourse();
    const teachersData = await fetchTeachers();
    const coordinatorsData = await fetchCoordinators();
    return (
        <AdminLayout>
            <AddCourseForm categoriesData={categoriesData} infoCourseData={infoCourseData} teachersData={teachersData} coordinatorsData={coordinatorsData}/>
        </AdminLayout>
    )
}

export default AddBlog