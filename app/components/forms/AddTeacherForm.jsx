"use client";

import Button from "@/app/ui/Button";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import React, { useState } from "react";

const AddTeacherForm = () => {
  const ref = useRef();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [profileImageFiles, setProfileImageFiles] = useState([]);
  const [academicFields, setAcademicFields] = useState([""]); 

  const handleImageChange = (e, type) => {
    const files = Array.from(e.target.files);
    setProfileImageFiles([...profileImageFiles, ...files]);
  };

  const addField = () => {
    setAcademicFields([...academicFields, ""]);
  }

  const onSubmit = async (data) => {
    if (profileImageFiles.length === 0 || profileImageFiles.length === 0) {
      alert("Por favor, carregue a imagem do professor.");
      return;
    }
    try {
      const formData = new FormData();
      profileImageFiles.forEach((file, index) => {
        formData.append(`imageTeacher`, file);
      });

      formData.append("name", data.name || "");
      formData.append("description", data.description || "");
      academicFields.forEach((field, index) => {
        formData.append(`academic`, field);
      })

      formData.append("type", data.type || "");
      
      const res = await fetch("/api/admin/add-teacher", {
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
        router.push(`/admin/teachers?${new Date().getTime()}`);
      } else {
        const errorData = await res.json();
        console.log("Something went wrong in else block");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const removeProfileImage = (index) => {
    const newImageFiles = [...profileImageFiles];
    newImageFiles.splice(index, 1);
    setProfileImageFiles(newImageFiles);
  };

  const handleAcademicChange = (index, value) => {
    const newFields = [...academicFields];
    newFields[index] = value;
    setAcademicFields(newFields); 
  }

  return (
    <div className="flex-grow md:ml-64">
      <div className="flex flex-col justify-center items-center mt-16">
        <form
          ref={ref}
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-md mx-auto p-8 bg-white rounded shadow-md flex flex-col items-center"
        >
          <div>
          <h2 className="md:w-[250px] text-2xl text-green-500 font-semibold mb-6 flex justify-center">
            Adicionar professor e coordenador 
          </h2>
          </div>
          <div className="mb-4 w-full">
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

          <div className="mb-4 w-full">
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

            <div className="flex justify-center mt-4">
              {profileImageFiles.map((file, index) => (
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
                    onClick={() => removeProfileImage(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
 
          <div className="mb-4 w-full">
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
          <div className="mb-4 w-full">
        <label
          htmlFor="role"
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
          <option value="teacher">Professor</option>
          <option value="coordinator">Coordenador</option>
        </select>
        {errors.role && (
          <p className="text-red-500 text-sm mt-1">
            Este campo é obrigatório
          </p>
        )}
      </div>

          {academicFields.map((field, index) => (
             <div className="mb-4 w-full" key={index}>
             <label
               htmlFor={`academic-${index}`}
               className="block text-sm font-medium text-gray-600"
             >
               Formação Acadêmica {index + 1}
             </label>
             <input
               id={`academic-${index}`}
               name={`academic[${index}]`}
               type="text"
               {...register(`academic.${index}`, { required: false })}
               className="mt-1 p-2 text-gray-600 w-full border rounded-md"
               placeholder="Insira a formação"
               onChange={(e) => handleAcademicChange(index, e.target.value)}
             />
             {errors.academic?.[index] && (
               <p className="text-red-500 text-sm mt-1">
                 Este campo é obrigatório
               </p>
             )}
               
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
            <Button label={"Adicionar Professor"} color={"green"} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTeacherForm;
