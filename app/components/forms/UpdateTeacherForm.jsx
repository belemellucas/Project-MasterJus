"use client";

import Button from "@/app/ui/Button";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import React, { useState } from "react";
import { usePathname } from "next/navigation";

const UpdateTeacherForm = ({ singleTeacher }) => {
  const ref = useRef();
  const pathname = usePathname();

  const id = pathname.split("/").pop();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    reset,
  } = useForm({
    defaultValues: {
      academic: [],
    },
  });
  const {
    fields: academicFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "academic",
  });
  const [profileImageFiles, setProfileImageFiles] = useState([]);
  const [imageTeacherUrls, setImageTeacherUrls] = useState([]);
  const [imageTeacherPreviews, setImageTeacherPreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);

  useEffect(() => {
    if (singleTeacher) {
      setValue("name", singleTeacher.name);
      setValue("description", singleTeacher.description);
      setValue("type", singleTeacher.type);

      setImageTeacherUrls(
        Array.isArray(singleTeacher.imageTeacher)
          ? singleTeacher.imageTeacher
          : [singleTeacher.imageTeacher || ""]
      );
      setImageTeacherPreviews(
        singleTeacher.imageTeacher
          ? singleTeacher.imageTeacher.map((url) => url)
          : []
      );

      if (Array.isArray(singleTeacher.academic)) {
        reset({ academic: [] });

        singleTeacher.academic.forEach((academic) => {
          append({ academic });
        });
      }

    }
  }, [singleTeacher, setValue, reset, append]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));

    setImageFiles(files);
    setImageTeacherPreviews(imageUrls);
    setImageTeacherUrls(Array(files.length).fill(""));
  };

  const addField = () => {
    append({ academic: "" });
  };

  const handleRemoveImage = () => {
    setImageFiles(null);
    setImageTeacherPreviews(null);
    setImageTeacherUrls(null);
  };

  const onSubmit = async (data) => {
  
    try {
      const formData = new FormData();

      if (
        (imageFiles?.length === 0 || !imageFiles) &&
        (imageTeacherUrls?.length === 0 || !imageTeacherUrls)
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
      formData.append("name", data.name || "");
      formData.append("description", data.description || "");
      formData.append("type", data.type || "");
      data.academic.forEach((academic) => {
        formData.append(`academic`, academic.academic);
      });

      if (imageTeacherUrls) {
        imageTeacherUrls.forEach((url) => formData.append("imageTeacherUrls", url));
      }

      if (imageFiles) {
        imageFiles.forEach((file) => formData.append("imageTeacher", file));
      }

      const res = await fetch("/api/admin/update-teacher", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        ref?.current?.reset();
        setImageFiles([]);
        setImageTeacherUrls([]);
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
          `/admin/teachers/update-teacher/${id}?${new Date().getTime()}`
        );
      } else {
        const errorData = await res.json();
        console.log("Something went wrong in else block");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const removeProfileImage = () => {
    setImageFiles(null);
    setImageTeacherPreviews(null);
    setImageTeacherUrls(null)
  };



  return (
    <div className="flex-grow md:ml-64">
      <div className="flex flex-col justify-center items-center mt-16">
        <form
          ref={ref}
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-md mx-auto p-8 bg-white rounded shadow-md flex flex-col items-center"
        >
          <h2 className="md:w-[250px] text-2xl text-green-500 font-semibold mb-6 flex justify-center">
            Atualizar professor e coordenador
          </h2>

          <div className="mb-4 w-60">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-600"
            >
              Nome
            </label>
            <input
              id="name"
              name="name"
              type="text"
              {...register("name", { required: true })}
              className="mt-1 p-2 text-gray-600 w-full border rounded-md"
              placeholder="Insira o nome"
            />
            {errors.linkVideo && (
              <p className="text-red-500 text-sm mt-1">
                Este campo é obrigatório
              </p>
            )}
          </div>

          <div className="mb-4 w-60">
            <label
              htmlFor="imageTeacher"
              className="block text-sm font-medium text-gray-700 pb-2"
            >
              Carregar Imagem de perfil
            </label>

            <input
              type="file"
              id="imageTeacher"
              name="imageTeacher"
              onChange={(e) => handleImageChange(e)}
              accept="image/*"
              className="hidden"
            />

            <label
              htmlFor="imageTeacher"
              className="cursor-pointer block w-full max-w-xs mx-auto bg-blue-200 hover:bg-blue-300 text-blue-800 font-semibold py-2 px-4 rounded-lg text-center shadow-md"
            >
              Selecionar Imagem
            </label>

            <div className="flex flex-wrap mt-2 justify-center">
              {imageTeacherPreviews?.map((file, index) => (
                <div
                  key={index}
                  style={{ display: "inline-block", margin: "10px" }}
                >
                  <img
                    src={file}
                    alt=""
                    style={{ width: "100px", height: "auto" }}
                  />
                  <button
                    type="button"
                    onClick={removeProfileImage}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4 w-60">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-600"
            >
              Descrição
            </label>
            <input
              id="description"
              name="description"
              type="text"
              {...register("description", { required: true })}
              className="mt-1 p-2 text-gray-600 w-full border rounded-md"
              placeholder="Insira a descrição"
            />
            {errors.linkVideo && (
              <p className="text-red-500 text-sm mt-1">
                Este campo é obrigatório
              </p>
            )}
          </div>
          <div className="mb-4 w-60">
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-600"
            >
              Função
            </label>
            <select
              id="type"
              name="type"
              {...register("type", { required: true })}
              className="mt-1 p-2 text-gray-600 w-full border rounded-md"
            >
              <option value="">Selecione a função</option>
              <option value="teacher" selected={singleTeacher.type === "teacher"}>
      Professor
    </option>
    <option value="coordinator" selected={singleTeacher.type === "coordinator"}>
      Coordenador
    </option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-sm mt-1">
                Este campo é obrigatório
              </p>
            )}
          </div>

          {academicFields.map((field, index) => (
            <div className="mb-4 w-60" key={field.id}>
              <label
                htmlFor={`academic-${index}`}
                className="block text-sm font-medium text-gray-600"
              >
                Formação Acadêmica {index + 1}
              </label>
              <input
                id={`academic-${index}`}
                name={`academic[${index}].academic`}
                type="text"
                {...register(`academic.${index}.academic`, { required: true })}
                className="mt-1 p-2 text-gray-600 w-full border rounded-md"
                placeholder="Insira a formação"
              />
              {errors.academic?.[index]?.academic && (
                <p className="text-red-500 text-sm mt-1">
                  Este campo é obrigatório
                </p>
              )}
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-500 hover:text-red-700 mt-2"
              >
                - Remover formação
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addField}
            className="mb-4 text-blue-500 hover:text-blue-700"
          >
            + Adicionar nova formação
          </button>

          <div className="flex justify-center">
            <Button label={"Atualizar Professor"} color={"green"} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateTeacherForm;
