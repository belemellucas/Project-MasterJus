"use client";

import Button from "@/app/ui/Button";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-tagsinput/react-tagsinput.css";
import { usePathname } from "next/navigation";

const AddBlogForm = ({ blog }) => {
  const ref = useRef();
  const pathname = usePathname();

  const id = pathname.split("/").pop();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState([]); 
  const [imageUrl, setImageUrl] = useState([]);

  useEffect(() => {
    if (blog) {
      setValue("subtitulo", blog.subtitulo);
      setValue("title", blog.title);
      setValue("description", blog.description);
      setValue("category", blog.category);
      setValue("autorBlog", blog.autorBlog);

      setImageUrl(Array.isArray(blog.imageUrl) ? blog.imageUrl : [blog.imageUrl || ""]);
      setImagePreview(blog.imageUrl ? blog.imageUrl.map(url => url) : []); 
    }

  }, [blog, setValue]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setImageFiles(files); 
    setImagePreview(imageUrls);
   };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      if (
        (imageFiles?.length === 0 || !imageFiles) &&
        (imageUrl?.length === 0 || !imageUrl)
      ) {
        toast.error("Por favor, selecione uma imagem para o perfil.", {
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
    
      (imageUrl || []).forEach((url) => formData.append("imageUrl", url));
      (imageFiles || []).forEach((file) => formData.append("imageFiles", file));


      formData.append("id", id);
      formData.append("subtitulo", data.subtitulo || "");
      formData.append("title", data.title || "");
      formData.append("description", data.description || "");
      formData.append("category", data.category || "");
      formData.append("autorBlog", data.autorBlog || "");


      const res = await fetch("/api/admin/update-blog", {
        method: "POST",
       
        body: formData,
      });

      if (res.ok) {

        setImageUrl([]);
        setImageFiles([]);
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

        router.push(`/admin/blogs/update-blog/${id}?${new Date().getTime()}`);

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

  const handleRemoveImage = () => {
    setImageFiles(null);
    setImagePreview(null);
    setImageUrl(null);
  };

  return (
    <div className="flex-grow md:ml-64 mt-16">
      <div className="flex flex-col justify-center items-center">
        <form
          ref={ref}
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-md mx-auto p-8 bg-white rounded shadow-md"
        >
          <h2 className="flex justify-center text-2xl text-green-500 font-semibold mb-6">
            Atualizar blog
          </h2>

          <div className="mb-4 w-full">
            <label
              htmlFor="imageUrl"
              className="block text-sm font-medium text-gray-700 pb-2"
            >
              Carregar Imagens para Desktop
            </label>
            <input
              type="file"
              id="imageUrl"
              name="imageUrl"
              onChange={(e) => handleImageChange(e)}
              accept="image/*"
              className="hidden"
            />
            <label
              htmlFor="imageUrl"
              className="cursor-pointer block w-full max-w-xs mx-auto bg-blue-200 hover:bg-blue-300 text-blue-800 font-semibold py-2 px-4 rounded-lg text-center shadow-md"
            >
              Selecionar Imagens
            </label>
            <div className="flex justify-center">
              {imagePreview?.map((preview, index) => (
                <div key={index} style={{ display: "inline-block", margin: "10px" }}>
                  <img
                    src={preview}
                    alt=""
                    style={{ width: "100px", height: "auto" }}
                  />
                  <button type="button" onClick={() => handleRemoveImage(index)}>
                    Remover
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
              {...register("subtitulo", {
                required: "Subtítulo é obrigatório",
              })}
              className="mt-1 p-2 w-full border text-gray-600 rounded-md"
              placeholder="Entre com o subtítulo"
            />
            {errors?.subtitulo && (
              <p role="alert">{errors?.subtitulo?.message}</p>
            )}
          </div>


          <div className="mb-4">
            <label
              htmlFor="autorBlog"
              className="block text-sm font-medium text-gray-600"
            >
              Autor Blog
            </label>
            <input
              type="text"
              id="autorBlog"
              name="autorBlog"
              {...register("autorBlog", {
                required: "Autor é obrigatório",
              })}
              className="mt-1 p-2 w-full border text-gray-600 rounded-md"
              placeholder="Insira o autor"
            />
            {errors?.autorBlog && (
              <p role="alert">{errors?.autorBlog?.message}</p>
            )}
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
            {errors?.category && (
              <p role="alert">{errors?.category?.message}</p>
            )}
          </div>
          <div className="flex justify-center">
            <Button label={"Atualizar Blog"} color={"green"} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBlogForm;
