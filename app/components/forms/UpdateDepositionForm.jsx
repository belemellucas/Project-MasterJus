"use client";

import Button from "@/app/ui/Button";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";
import React, { useState } from "react";
import { usePathname } from "next/navigation";

const UpdateDepositionForm = ({ singleDeposition }) => {
  const ref = useRef();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();

  const [categories, setCategories] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [base64Files, setBase64Files] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const router = useRouter();
  const pathname = usePathname();
  const id = pathname.split("/").pop();
  const [imageProfile, setImageProfile] = useState([]);
  const [imageProfilePreviews, setImageProfilePreviews] = useState([]);
  const [imageProfileUrls, setImageProfileUrls] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));

    setImageProfile(files);
    setImageProfilePreviews(imageUrls);
    setImageProfileUrls(Array(files.length).fill(""));
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      if (
        (imageProfile?.length === 0 || !imageProfile) &&
        (imageProfileUrls?.length === 0 || !imageProfileUrls)
      ) {
        toast.error("Por favor, selecione uma imagem de perfil.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        return;
      }

      formData.append("id", id || "");
      formData.append("depoimento", data.depoimento);
      formData.append("autorDepo", data.autorDepo);
      formData.append("approved", true);

      if (imageProfileUrls) {
        imageProfileUrls.forEach((url) => formData.append("imageDepUrls", url));
      }

      if (imageProfile) {
        imageProfile.forEach((file) => formData.append("imageDep", file));
      }

      const res = await fetch("/api/admin/update-depositions", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        ref?.current?.reset();
        setImageProfileUrls([]);
        setImageProfile([]);
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
        router.push(
          `/admin/depositions/update-depo/${id}?${new Date().getTime()}`
        );
      } else {
        const errorData = await res.json();
        console.log("Something went wrong in else block");
      }
      setImageFiles([]);
      setBase64Files([]);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleRemoveImage = () => {
    setImageProfile(null);
    setImageProfilePreviews(null);
    setImageProfileUrls(null);
  };

  useEffect(() => {
    if (singleDeposition) {
      setValue("depoimento", singleDeposition.depoimento);
      setValue("autorDepo", singleDeposition.autorDepo);

      setImageProfileUrls(
        Array.isArray(singleDeposition.imageDep)
          ? singleDeposition.imageDep
          : [singleDeposition.imageDep || ""]
      );

      setImageProfilePreviews(
        singleDeposition.imageDep
          ? singleDeposition.imageDep.map((url) => url)
          : []
      );
    }
  }, [singleDeposition, setValue]);

  return (
    <div className="flex-grow md:ml-64 mt-16">
      <div className="flex flex-col justify-center items-center">
        <form
          ref={ref}
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-md mx-auto p-8 bg-white rounded shadow-md"
        >
          <h2 className="text-2xl text-green-500 font-semibold mb-6">
            Editar Depoimento
          </h2>
          <div className="mb-4">
            <label
              htmlFor="imageProfile"
              className="block text-sm font-medium text-gray-600"
            >
              Carregar Imagem
            </label>
            <input
              type="file"
              id="imageProfile"
              name="imageProfile"
              onChange={(e) => handleImageChange(e)}
              accept="image/*"
              className="hidden"
            />
            <label
              htmlFor="imageProfile"
              className=" cursor-pointer block w-full max-w-xs mx-auto bg-blue-200 hover:bg-blue-300 text-blue-800 font-semibold py-2 px-4 rounded-lg text-center shadow-md"
            >
              Selecionar Imagem
            </label>
            <div className="flex flex-wrap mt-2 justify-center">
              {imageProfilePreviews?.map((file, index) => (
                <div
                  key={index}
                  style={{ display: "inline-block", margin: "10px" }}
                >
                  <img
                    src={file}
                    alt=""
                    style={{ width: "100px", height: "auto" }}
                  />
                  <button type="button" onClick={handleRemoveImage}>
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
            <Button label={"Atualizar Depoimento"} color={"green"} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateDepositionForm;
