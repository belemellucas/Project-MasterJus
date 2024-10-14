"use client";

import Button from "@/app/ui/Button";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-tagsinput/react-tagsinput.css";

const AddBlogForm = () => {
  const ref = useRef();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState([]);

 /*
 função para salvar base 64 no banco de dados
 const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const promises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
          resolve(reader.result.split(",")[1]);
          setSelectedImage(reader.result);
          setValue("image", file, { shouldValidate: true });
        };

        reader.onerror = (error) => {
          reject(error);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises)
      .then((base64String) => {
        setImageFiles([...imageFiles, ...files]);
        setBase64Files([...base64Files, ...base64String]);
      })
      .catch((error) => console.error("Error converting images", error));
  }; */ 

  const handleImageChange = (e) =>{
    const files = Array.from(e.target.files);
    setImageFile([ ...files]);
  };

  const onSubmit = async (data) => {
    if (imageFile.length === 0) {
      alert("Por favor, carregue a imagem do blog.");
      return;
    }
    try {
      const formData = new FormData();
      imageFile.forEach((file) => {
        formData.append(`imageFile`, file);
      });

      formData.append("title", data.title || "");
      formData.append("subtitulo", data.subtitulo || "");
      formData.append("description", data.description || "");
      formData.append("autorBlog", data.autorBlog || "");
      formData.append("category", data.category || "");

      const res = await fetch("/api/admin/add-blog", {
        method: "POST",
     
        body: formData,
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
        await fetch('/api/admin/all-blogs');
        router.push(`/admin/blogs?${new Date().getTime()}`);
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

  const removeImage = () => {
    setImageFile(null);
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
            Adicionar Blog
          </h2>

          <div className="mb-4 w-60">
            <label
              htmlFor="imageFile"
              className="block text-sm font-medium text-gray-700 pb-2"
            >
              Carregar Imagem de perfil
            </label>

            <input
              type="file"
              id="imageFile"
              name="imageFile"
              onChange={(e) => handleImageChange(e)}
              accept="image/*"
              className="hidden"
            />

            <label
              htmlFor="imageFile"
              className="cursor-pointer block w-full max-w-xs mx-auto bg-blue-200 hover:bg-blue-300 text-blue-800 font-semibold py-2 px-4 rounded-lg text-center shadow-md"
            >
              Selecionar Imagem
            </label>

            <div className="flex flex-wrap mt-4 justify-center">
              {imageFile?.map((file, index) => (
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
                    onClick={removeImage}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-600"
            >
              Título
            </label>
            <input
              type="text"
              id="title"
              name="title"
              {...register("title", { required: "Título é obrigatório" })}
              className="mt-1 p-2 w-full border text-gray-600 rounded-md"
              placeholder="Entre com o título"
            />
            {errors?.title && <p role="alert">{errors?.title?.message}</p>}
          </div>

          <div className="mb-4">
            <label
              htmlFor="subtitulo"
              className="block text-sm font-medium text-gray-600"
            >
              Subtítulo
            </label>
            <input
              type="text"
              id="subtitulo"
              name="subtitulo"
              {...register("subtitulo", { required: "Subtítulo é obrigatório" })}
              className="mt-1 p-2 w-full border text-gray-600 rounded-md"
              placeholder="Entre com o subtítulo"
            />
            {errors?.subtitulo && <p role="alert">{errors?.subtitulo?.message}</p>}
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-600"
            >
              Descrição
            </label>
            <textarea
              id="description"
              name="description"
              {...register("description")}
              rows="4"
              className="mt-1 p-2 text-gray-600 w-full border rounded-md"
              placeholder="Entre com a descrição"
            ></textarea>
          </div>

          <div className="mb-4">
            <label
              htmlFor="autorBlog"
              className="block text-sm font-medium text-gray-600"
            >
              Autor
            </label>
            <input
              type="text"
              id="autorBlog"
              name="autorBlog"
              {...register("autorBlog", { required: "Autor do Blog é obrigatório" })}
              className="mt-1 p-2 w-full border text-gray-600 rounded-md"
              placeholder="Autor do Blog"
            />
            {errors?.subtitulo && <p role="alert">{errors?.subtitulo?.message}</p>}
          </div>

          <div className="mb-4">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-600"
            >
              Categoria
            </label>
            <input
              type="text"
              id="category"
              name="category"
              {...register("category", { required: "Categoria é obrigatória" })}
              className="mt-1 p-2 text-gray-600 w-full border rounded-md"
              placeholder="Entre com a categoria"
            />
            {errors?.category && <p role="alert">{errors?.category?.message}</p>}
          </div>
         <div className="flex justify-center">
          <Button label={"Adicionar Blog"} color={"green"} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBlogForm;
