import { fetchSingleBlog } from "@/actions/actions";
import BlogsPage from "../../components/blogsPage/BlogsPage";

const BlogDetail = async ({ params }) => {
  const id = params?.id;

  const blog = await fetchSingleBlog(id);

  return (
    <>
      <BlogsPage blog={blog} />
    </>
  );
};

export default BlogDetail;
