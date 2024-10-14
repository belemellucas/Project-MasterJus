import { fetchSingleBlog } from "@/actions/actions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/utils/authOptions"
import UpdateBlogForm from "@/app/components/forms/UpdateBlogForm";
import AdminLayout from "../../../../components/admin/adminLayout/AdminLayout";

const UpdateBlogPage = async ({ params }) => {


   

    const id = params?.id;

    // get the db info for each blog to fill forms

    const blog = await fetchSingleBlog(id);
    return (
        <AdminLayout>
            <UpdateBlogForm blog={blog} />
        </AdminLayout>
       
    )
}

export default UpdateBlogPage