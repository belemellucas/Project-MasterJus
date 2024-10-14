"use client";

import Button from "@/app/ui/Button";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";

const AddCategoryForm = () => {
  const ref = useRef();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch
  } = useForm();
  const isExternalLinkChecked = watch("isExternalLink");

  const onSubmit = async (data) => {

    const eventData = {
      ...data,
      isExternalLink: data.isExternalLink || false
     
    };


    try {
      const res = await fetch("/api/admin/add-category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        ref?.current?.reset();
        //router.push("/categories");
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
        await fetch('/api/admin/all-category');
        router.push(`/admin/categories?${new Date().getTime()}`);
      } else {
        const errorData = await res.json();
        console.log("Something went wrong in else block");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="flex-grow md:ml-64 mt-16">
      <div className="flex flex-col justify-center items-center">
        <form
          ref={ref}
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-md mx-auto p-8 bg-white rounded shadow-md"
        >
         <h2 className="text-2xl text-green-500 font-semibold mb-6">
            Adicionar Categoria
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
                      required: isExternalLinkChecked
                     })}
                     placeholder="Insira o link"
                     className="mt-1 p-2 text-gray-600 w-full border rounded-md"
                     />
 
                </div>
              )}
          <div className="flex justify-center">
            <Button label={"Adicionar Categoria"} color={"green"} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryForm;
