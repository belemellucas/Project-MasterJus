"use client";

import Button from "@/app/ui/Button";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import React, { useState } from "react";

const AddInfoSiteForm = () => {
  const ref = useRef();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [desktopImageFiles, setDesktopImageFiles] = useState([]);
  const [mobileImageFiles, setMobileImageFiles] = useState([]);
  const [courseLinksDesktop, setCourseLinksDesktop] = useState([]);
  const [courseLinksMobile, setCourseLinksMobile] = useState([]);

  const handleImageChange = (e, type) => {
    const files = Array.from(e.target.files);
    if (type === "desktop") {
      setDesktopImageFiles([...desktopImageFiles, ...files]);
      setCourseLinksDesktop([...courseLinksDesktop, ""]); // Adiciona um campo de link em branco
    } else if (type === "mobile") {
      setMobileImageFiles([...mobileImageFiles, ...files]);
      setCourseLinksMobile([...courseLinksMobile, ""]); // Adiciona um campo de link em branco
    }
  };

  const handleLinkChangeDesktop = (e, index) => {
    const newLinks = [...courseLinksDesktop];
    newLinks[index] = e.target.value;
    setCourseLinksDesktop(newLinks);
  };

  const handleLinkChangeMobile = (e, index) => {
    const newLinks = [...courseLinksMobile];
    newLinks[index] = e.target.value;
    setCourseLinksMobile(newLinks);
  };

  const onSubmit = async (data) => {
    if (desktopImageFiles.length === 0 || mobileImageFiles.length === 0) {
      alert("Por favor, carregue imagens para desktop e mobile.");
      return;
    }
    try {
      const formData = new FormData();
      desktopImageFiles.forEach((file, index) => {
        formData.append(`desktopImages`, file);
        formData.append(`courseLinksDesktop`, courseLinksDesktop[index] || "");
      });

      mobileImageFiles.forEach((file, index) => {
        formData.append(`mobileImages`, file);
        formData.append(`courseLinksMobile`, courseLinksMobile[index] || "");
      });

      formData.append("linkVideo", data.linkVideo || "");
      formData.append("tituloVideo", data.tituloVideo || "");
      formData.append("descVideo", data.descVideo || "");

      const res = await fetch("/api/admin/add-info", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        ref?.current?.reset();
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
        router.push(`/admin/infoSite?${new Date().getTime()}`);
      } else {
        const errorData = await res.json();
        console.log("Something went wrong in else block");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const removeDesktopImage = (index) => {
    const newImageFiles = [...desktopImageFiles];
    newImageFiles.splice(index, 1);
    setDesktopImageFiles(newImageFiles);

    const newLinks = [...courseLinksDesktop];
    newLinks.splice(index, 1);
    setCourseLinksDesktop(newLinks);
  };

  const removeMobileImage = (index) => {
    const newImageFiles = [...mobileImageFiles];
    newImageFiles.splice(index, 1);
    setMobileImageFiles(newImageFiles);

    const newLinks = [...courseLinksMobile];
    newLinks.splice(index, 1);
    setCourseLinksMobile(newLinks);
  };

  return (
    <div className="flex-grow md:ml-64">
      <div className="flex flex-col justify-center items-center mt-16">
        <form
          ref={ref}
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-md mx-auto p-8 bg-white rounded shadow-md flex flex-col items-center"
        >
          <h2 className="text-2xl text-green-500 font-semibold mb-6 flex justify-center">
            Adicionar novas imagens e links de cursos
          </h2>

          <div className="mb-4 w-60">
            <label
              htmlFor="desktop-file"
              className="block text-sm font-medium text-gray-700 pb-2"
            >
              Carregar Imagens para Desktop
            </label>

            <input
              type="file"
              id="desktop-file"
              name="desktop-file"
              onChange={(e) => handleImageChange(e, "desktop")}
              accept="image/*"
              className="hidden"
            />

            <label
              htmlFor="desktop-file"
              className="cursor-pointer block w-full max-w-xs mx-auto bg-blue-200 hover:bg-blue-300 text-blue-800 font-semibold py-2 px-4 rounded-lg text-center shadow-md"
            >
              Selecionar Imagens
            </label>

            <div className="flex flex-wrap mt-4">
              {desktopImageFiles.map((file, index) => (
                <div
                  key={index}
                  style={{ display: "inline-block", margin: "10px" }}
                >
                  <div className="flex flex-col items-center justify-center">
                  <img
                    src={URL.createObjectURL(file)}
                    alt=""
                    style={{ width: "100px", height: "auto" }}
                  />
                 
                  <button
                    type="button"
                    
                    onClick={() => removeDesktopImage(index)}
                  >
                    Remove
                  </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Link do Curso"
                    value={courseLinksDesktop[index] || ""}
                    onChange={(e) => handleLinkChangeDesktop(e, index)}
                    className="mt-2 p-2 w-full border rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4 w-60">
            <label
              htmlFor="mobile-file"
              className="block text-sm font-medium text-gray-700 pb-2"
            >
              Carregar Imagens para dispositivos móveis
            </label>

            <input
              type="file"
              id="mobile-file"
              name="mobile-file"
              onChange={(e) => handleImageChange(e, "mobile")}
              accept="image/*"
              className="hidden"
            />

            <label
              htmlFor="mobile-file"
              className="cursor-pointer block w-full max-w-xs mx-auto bg-blue-200 hover:bg-blue-300 text-blue-800 font-semibold py-2 px-4 rounded-lg text-center shadow-md"
            >
              Selecionar Imagens
            </label>

            <div className="flex flex-wrap mt-4">
              {mobileImageFiles.map((file, index) => (
                <div
                  key={index}
                  style={{ display: "inline-block", margin: "10px" }}
                >
                   <div className="flex flex-col items-center justify-center">
                  <img
                    src={URL.createObjectURL(file)}
                    alt=""
                    style={{ width: "100px", height: "auto" }}
                  />
                  <button
                    type="button"
                    onClick={() => removeMobileImage(index)}
                  >
                    Remove
                  </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Link do Curso"
                    value={courseLinksMobile[index] || ""}
                    onChange={(e) => handleLinkChangeMobile(e, index)}
                    className="mt-2 p-2 w-full border rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="linkVideo"
              className="block text-sm font-medium text-gray-600"
            >
              Link do Vídeo
            </label>
            <input
              id="linkVideo"
              name="linkVideo"
              type="text"
              {...register("linkVideo", { required: true })}
              className="mt-1 p-2 text-gray-600 w-full border rounded-md"
              placeholder="Insira o link do vídeo"
            />
            {errors.linkVideo && (
              <p className="text-red-500 text-sm mt-1">
                Este campo é obrigatório
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="tituloVideo"
              className="block text-sm font-medium text-gray-600"
            >
              Título área do vídeo
            </label>
            <input
              id="tituloVideo"
              name="tituloVideo"
              type="text"
              {...register("tituloVideo", { required: true })}
              className="mt-1 p-2 text-gray-600 w-full border rounded-md"
              placeholder="Insira título área do vídeo"
            />
            {errors.linkVideo && (
              <p className="text-red-500 text-sm mt-1">
                Este campo é obrigatório
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="descVideo"
              className="block text-sm font-medium text-gray-600"
            >
              Descrição área do vídeo
            </label>
            <input
              id="descVideo"
              name="descVideo"
              type="text"
              {...register("descVideo", { required: true })}
              className="mt-1 p-2 text-gray-600 w-full border rounded-md"
              placeholder="Insira descrição área do vídeo"
            />
            {errors.linkVideo && (
              <p className="text-red-500 text-sm mt-1">
                Este campo é obrigatório
              </p>
            )}
          </div>

          <div className="flex justify-center">
            <Button label={"Adicionar Conteúdos"} color={"green"} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInfoSiteForm;
