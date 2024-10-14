"use client";

import Button from "@/app/ui/Button";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";
import React, { useState } from "react";

const AddDepositionForm = () => {
  const ref = useRef();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const [categories, setCategories] = useState([]);
  const [imageProfile, setImageProfile] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const router = useRouter();

  const handleImageChange = (e) => {
     const files = Array.from(e.target.files);
     setImageProfile([ ...files]);
  };

  const onSubmit = async (data) => {
    if (imageProfile.length === 0 || imageProfile.length === 0) {
      alert("Por favor, carregue a imagem de perfil.");
      return;
    }
    try {
      const formData = new FormData();
      imageProfile.forEach((file, index) => {
        formData.append(`imageDep`, file); 
      });

      formData.append("depoimento", data.depoimento)
      formData.append("autorDepo", data.autorDepo)
      formData.append("approved", true)

      const res = await fetch("/api/admin/add-depositions", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        ref?.current?.reset();
        // router.push("/depositions");
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
        await fetch('/api/admin/all-depositions');
        router.push(`/admin/depositions?${new Date().getTime()}`);
      } else {
        const errorData = await res.json();
        console.log("Something went wrong in else block");
      }
      setBase64Files([]);
    } catch (error) {
      console.log("error", error);
    }
  };

  const removeImageFile = () => {
    setImageProfile(null);
  };

  return (
    <div className="flex-grow md:ml-64 ">
      <div className="flex flex-col justify-center items-center mt-16">
        <form
          ref={ref}
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-md mx-auto p-8 bg-white rounded shadow-md"
        >
          <h2 className="text-2xl text-green-500 font-semibold mb-6">
            Adicionar Depoimento
          </h2>
          <div className="mb-4">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-600"
            >
              Carregar Imagem
            </label>
            <input
             type="file"
             id="image"
             name="image"
             onChange={handleImageChange}
             accept="image/*"
             className="hidden"
            />
            <label
              htmlFor="image"
              className=" cursor-pointer block w-full max-w-xs mx-auto bg-blue-200 hover:bg-blue-300 text-blue-800 font-semibold py-2 px-4 rounded-lg text-center shadow-md"
            >
              Selecionar Imagem
            </label>
            <div className="flex justify-center mt-4">
              {imageProfile?.map((file, index) => (
                <div
                  key={index}
                  style={{ display: "inline-block", margin: "10px" }}
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt=""
                    style={{ width: "100px", height: "auto" }}
                  />
                  <button
                    type="button"
                    onClick={removeImageFile}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="depoimento"
              className="block text-sm font-medium text-gray-600"
            >
              Depoimento
            </label>
            <input
              type="text"
              id="depoimento"
              name="depoimento"
              {...register("depoimento", { required: true })}
              className="mt-1 p-2 w-full border text-gray-600 rounded-md"
              placeholder="Insira o depoimento"
            />
            {errors?.title && <p role="alert">{errors?.title?.message}</p>}
          </div>
          <div className="mb-4">
            <label
              htmlFor="autorDepo"
              className="block text-sm font-medium text-gray-600"
            >
              Autor
            </label>
            <input
              type="text"
              id="autorDepo"
              name="autorDepo"
              {...register("autorDepo", { required: true })}
              className="mt-1 p-2 w-full border text-gray-600 rounded-md"
              placeholder="Insira o autor"
            />
            {errors?.title && <p role="alert">{errors?.title?.message}</p>}
          </div>
          <div className="flex justify-center">
            <Button label={"Adicionar Depoimento"} color={"green"} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDepositionForm;
