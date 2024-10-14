"use client";

import Button from "@/app/ui/Button";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-tagsinput/react-tagsinput.css";
import { usePathname } from "next/navigation";

const UpdateCategoryForm = ({ categoriesData }) => {
  const ref = useRef();
  const pathname = usePathname();
  const id = pathname.split("/").pop();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm();
  const isExternalLinkChecked = watch("isExternalLink");

  const onSubmit = async (formData) => {
    try {
      formData.id = id;
      const res = await fetch("/api/admin/update-category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
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
        ref?.current?.reset();
      //  router.push(`/admin/categories?${new Date().getTime()}`);
        router.push(
          `/admin/categories/update-category/${id}?${new Date().getTime()}`
        );
      } else {
        const errorData = await res.json();
        console.log("API error response:", errorData); // Debug log
        toast.error(errorData.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    } catch (error) {
      console.error("API request error:", error); // Debug log
      toast.error("An unexpected error occurred.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        fetch("/api/admin/all-category").catch((error) => {
          console.error("Failed to fetch data:", error);
        });

        setValue("NomeCat", categoriesData.NomeCat);
        setValue("isExternalLink", categoriesData.isExternalLink);
        setValue("linkExternal", categoriesData.linkExternal);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchCourseData();
  }, [categoriesData, setValue]);

  return (
    <div className="flex-grow md:ml-64 mt-16">
      <div className="flex flex-col justify-center items-center">
        <form
          ref={ref}
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-md mx-auto p-8 bg-white rounded shadow-md"
        >
          <h2 className="text-2xl text-green-500 font-semibold mb-6">
            Atualizar Categoria
          </h2>

          <div className="mb-4">
            <label
              htmlFor="catId"
              className="block text-sm font-medium text-gray-600"
            >
              Categoria
            </label>
            <input
              id="NomeCat"
              name="NomeCat"
              {...register("NomeCat", { required: true })}
              rows="4"
              className="mt-1 p-2 text-gray-600 w-full border rounded-md"
              placeholder="Insira a categoria"
            ></input>
          </div>

          <div className="flex items-center justify-center mb-4 mt-4">
            <input
              id="isExternalLink"
              name="isExternalLink"
              type="checkbox"
              {...register("isExternalLink")}
              className="mr-2"
            />
            <label
              htmlFor="isExternalLink"
              className="text-sm font-medium text-gray-600"
            >
              Link Externo
            </label>
          </div>

          {isExternalLinkChecked && (
            <div className="mb-4">
              <label
                htmlFor="linkExternal"
                className="block text-sm font-medium text-gray-600"
              >
                URL do Link Externo
              </label>
              <input
                id="linkExternal"
                name="linkExternal"
                type="url"
                {...register("linkExternal", {
                  required: isExternalLinkChecked,
                })}
                placeholder="Insira o link"
                className="mt-1 p-2 text-gray-600 w-full border rounded-md"
              />
            </div>
          )}

          <div className="flex justify-center">
            <Button label={"Atualizar Categoria"} color={"green"} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCategoryForm;
