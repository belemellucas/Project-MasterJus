"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const BlogItem = ({ blog }) => {
  const { id, title, subititulo, imageUrl, description, category } = blog || {};
  const router = useRouter();
  const [blogs, setBlogs] = useState();
  const deleteBlogHandler = async (blogId) => {
    try {
      const res = await fetch(`/api/admin/remove-blog/${blogId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-cache",
      });

      if (res.ok) {
        router.refresh();
        const data = await res.json();
        toast.success(`${data.message}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else {
        const errorData = await res.json();
        console.log("Something went wrong in else block");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const updateBlogHandler = (id) => {
    router.push(`/admin/blogs/update-blog/${id}`);
  };


  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/admin/all-blogs");
      const data = await res.json();
      setBlogs(data.blogs); 
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []); 


  return (
    <div className="bg-gray-900 p-4 border-2 border-green-200 mx-2 my-2 rounded-lg shadow-md flex flex-col justify-between h-full">
    <div>
      {imageUrl ? (
        <Image
          loading="lazy"
          width="600"
          height="400"
          quality={100}
          src={imageUrl[0]}
          className="w-full h-[200px] lg:h-[250px] object-cover mb-4 rounded-md"
        />
      ) : null}
  
      <h2 className="text-xl text-white font-semibold mb-2">{title.slice(0, 20)}</h2>
  
      <p className="mb-2 max-w-md text-green-500 inline-block ">
        {category.slice(0, 100)}
      </p>
      <p className="text-gray-300">{description.slice(0, 100)}...</p>
    </div>
  
    <div className="flex justify-center gap-4">
      <button
        type="button"
        onClick={() => deleteBlogHandler(id)}
        className="rounded-lg bg-red-700 text-center px-2 py-1"
      >
        delete
      </button>
      <button
        type="button"
        onClick={() => updateBlogHandler(id)}
        className="rounded-lg bg-green-700 text-center px-2 py-1"
      >
        update
      </button>
    </div>
  </div>
  
  );
};

export default BlogItem;
