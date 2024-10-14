"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";

const CategoryItem = ({ cat }) => {
  const { id, NomeCat } = cat || {};

  const router = useRouter();

  const deleteCategoryHandler = async (catId) => {
    try {
      const res = await fetch(`/api/admin/remove-category/${catId}`, {
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

  const updateCategoryHandler = (id) => {
    router.push(`/admin/categories/update-category/${id}`);
  };

  return (
    <div className="bg-gray-900 p-4 border-2 border-green-200 mx-2 my-2 rounded-lg shadow-md">
      <Link href={`/categories/update-category/${id}`}>
        <h2 className="text-xl text-white font-semibold mb-2">{NomeCat}</h2>
      </Link>

      <div className="flex justify-center gap-4">
        <button
          type="button"
          onClick={() => deleteCategoryHandler(id)}
          className="rounded-lg bg-red-700 text-center px-2 py-1  mt-4"
        >
          delete
        </button>
        <button
          type="button"
          onClick={() => updateCategoryHandler(id)}
          className="rounded-lg bg-green-700 text-center px-2 py-1  mt-4"
        >
          atualizar
        </button>
      </div>
    </div>
  );
};

export default CategoryItem;
