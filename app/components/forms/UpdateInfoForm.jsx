"use client";

import Button from "@/app/ui/Button";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { usePathname } from "next/navigation";

const UpdateInfoForm = ({ singleInfoSite }) => {
  const ref = useRef();
  const router = useRouter();
  const pathname = usePathname();
  const id = pathname.split("/").pop();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  // Estados para armazenar URLs e arquivos de imagem
  const [desktopImageFiles, setDesktopImageFiles] = useState([]);
  const [mobileImageFiles, setMobileImageFiles] = useState([]);
  const [desktopImagePreviews, setDesktopImagePreviews] = useState([]);
  const [mobileImagePreviews, setMobileImagePreviews] = useState([]);
  const [desktopImageUrls, setDesktopImageUrls] = useState([]);
  const [mobileImageUrls, setMobileImageUrls] = useState([]);

  const [courseLinksDesktop, setCourseLinksDesktop] = useState([]);
  const [courseLinksMobile, setCourseLinksMobile] = useState([]);

  useEffect(() => {
    if (singleInfoSite) {
      setValue("linkVideo", singleInfoSite.linkVideo || "");
      setValue("tituloVideo", singleInfoSite.tituloVideo || "");
      setValue("descVideo", singleInfoSite.descVideo || "");
      setCourseLinksDesktop(singleInfoSite.courseLinksDesktop || []);
      setCourseLinksMobile(singleInfoSite.courseLinksMobile || []);

      // Configure URLs existentes
      setDesktopImageUrls(Array.isArray(singleInfoSite.imageAnex) ? singleInfoSite.imageAnex : [singleInfoSite.imageAnex || ""]);
      setMobileImageUrls(Array.isArray(singleInfoSite.imageMob) ? singleInfoSite.imageMob : [singleInfoSite.imageMob || ""]);

      // Configure URLs para visualização
      setDesktopImagePreviews(singleInfoSite.imageAnex ? singleInfoSite.imageAnex.map(url => url) : []);
      setMobileImagePreviews(singleInfoSite.imageMob ? singleInfoSite.imageMob.map(url => url) : []);
    }
  }, [singleInfoSite, setValue]);

  const handleImageChange = (e, type) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    if (type === "desktop") {
      setDesktopImageFiles(prev => [...prev, ...files]);
      setDesktopImagePreviews(prev => [...prev, ...imageUrls]);
      setCourseLinksDesktop(prev => [...prev, ...Array(files.length).fill("")]);
    } else if (type === "mobile") {
      setMobileImageFiles(prev => [...prev, ...files]);
      setMobileImagePreviews(prev => [...prev, ...imageUrls]);
      setCourseLinksMobile(prev => [...prev, ...Array(files.length).fill("")]);
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
    try {
      const formData = new FormData();

      if (
        (desktopImageFiles?.length === 0 || !desktopImageFiles) &&
        (desktopImageUrls?.length === 0 || !desktopImageUrls)
      ) {
        toast.error("Por favor, selecione uma imagem para o desktop.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        return; // Interrompe o envio do formulário
      }
    
      (desktopImageUrls || []).forEach((url) => formData.append("desktopImageUrls", url));
      (desktopImageFiles || []).forEach((file) => formData.append("desktopImages", file));


      if (
        (mobileImageFiles?.length === 0 || !mobileImageFiles) &&
        (mobileImageUrls?.length === 0 || !mobileImageUrls)
      ) {
        toast.error("Por favor, selecione uma imagem para o mobile.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        return; // Interrompe o envio do formulário
      }
    
      (mobileImageUrls || []).forEach((url) => formData.append("mobileImageUrls", url));
      (mobileImageFiles || []).forEach((file) => formData.append("mobileImages", file));



     courseLinksDesktop.forEach(link => formData.append("courseLinksDesktop", link));
      courseLinksMobile.forEach(link => formData.append("courseLinksMobile", link));
      formData.append("linkVideo", data.linkVideo || "");
      formData.append("tituloVideo", data.tituloVideo || "");
      formData.append("descVideo", data.descVideo || "");
      formData.append("id", id || "");

      const res = await fetch("/api/admin/update-info", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        ref.current.reset();
        
        setDesktopImageFiles([]);
        setMobileImageFiles([]);
        setDesktopImagePreviews([]);
        setMobileImagePreviews([]);
        setDesktopImageUrls([]);
        setMobileImageUrls([]);
        setCourseLinksDesktop([]);
        setCourseLinksMobile([]);

        const responseData = await res.json();
        toast.success(`${responseData.message}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        router.push(`/admin/infoSite/update-info/${id}?${new Date().getTime()}`);

      } else {
        const errorData = await res.json();
        console.log("Something went wrong", errorData);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const removeDesktopImage = (index) => {
    setDesktopImageFiles(prev => prev.filter((_, i) => i !== index));
    setDesktopImagePreviews(prev => prev.filter((_, i) => i !== index));
    setDesktopImageUrls(prev => prev.filter((_, i) => i !== index));
    setCourseLinksDesktop(prev => prev.filter((_, i) => i !== index));
  };
  
  const removeMobileImage = (index) => {
    setMobileImageFiles(prev => prev.filter((_, i) => i !== index));
    setMobileImagePreviews(prev => prev.filter((_, i) => i !== index));
    setMobileImageUrls(prev => prev.filter((_, i) => i !== index));
    setCourseLinksMobile(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex-grow md:ml-64">
      <div className="flex flex-col justify-center items-center mt-16">
        <form
          ref={ref}
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-md mx-auto p-8 bg-white rounded shadow-md flex flex-col items-center"
        >
          <h2 className="text-2xl text-green-500 font-semibold mb-6">
            Editar imagens e vídeo
          </h2>

          {/* Campo para carregar imagens de desktop */}
          <div className="mb-4 w-full">
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
            <div className="flex flex-col justify-center w-full">
              {desktopImagePreviews.map((preview, index) => (
                <div key={index} style={{ display: "inline-block", margin: "10px" }}>
                 <div className="flex flex-col items-center justify-center">
                  <img
                    src={preview}
                    alt=""
                    style={{ width: "100px", height: "auto" }}
                  />
                  <button type="button" onClick={() => removeDesktopImage(index)}>
                    Remover
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

          {/* Campo para carregar imagens de mobile */}
          <div className="mb-4 w-full">
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
            <div className="flex flex-col justify-center w-full">
              {mobileImagePreviews.map((preview, index) => (
                <div key={index} style={{ display: "inline-block", margin: "10px" }}>
                <div className="flex flex-col items-center justify-center">
                  <img
                    src={preview}
                    alt=""
                    style={{ width: "100px", height: "auto" }}
                  />
                  <button type="button" onClick={() => removeMobileImage(index)}>
                    Remover
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

          {/* Campos de vídeo */}
          <div className="mb-4 w-full">
            <label
              htmlFor="linkVideo"
              className="block text-sm font-medium text-gray-700 pb-2"
            >
              Link do Vídeo
            </label>
            <input
              type="text"
              id="linkVideo"
              {...register("linkVideo")}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>

          <div className="mb-4 w-full">
            <label
              htmlFor="tituloVideo"
              className="block text-sm font-medium text-gray-700 pb-2"
            >
              Título do Vídeo
            </label>
            <input
              type="text"
              id="tituloVideo"
              {...register("tituloVideo")}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>

          <div className="mb-4 w-full">
            <label
              htmlFor="descVideo"
              className="block text-sm font-medium text-gray-700 pb-2"
            >
              Descrição do Vídeo
            </label>
            <textarea
              id="descVideo"
              {...register("descVideo")}
              rows="4"
              className="border border-gray-300 rounded-md p-2 w-full"
            ></textarea>
          </div>

          <div className="flex justify-center">
            <Button label={"Atualizar Conteúdos"} color={"green"} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateInfoForm;
