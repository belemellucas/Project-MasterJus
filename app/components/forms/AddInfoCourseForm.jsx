"use client";

import Button from "@/app/ui/Button";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";
import React, { useState } from "react";

const AddInfoCourseForm = () => {
  const ref = useRef();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      items: [{ title: "", description: "" }]
    }
  });
  const { fields, append } = useFieldArray({
    control,
    name: "items"
  });
  const [titleFields, setTitleFields] = useState([""]);
  const [descriptionFields, setDescriptionFields] = useState([""]);
  const [nameInfo, setNameInfo] = useState([""]);

  const addField = () => {
    append({ title: "", description: "" });
  };

  const onSubmit = async (data) => {
  
    try {
      const formData = new FormData();

      titleFields.forEach((field, index) => {
        formData.append(`title`, field);
      })

      descriptionFields.forEach((field, index) => {
        formData.append(`description`, field)
      })

      formData.append('name', nameInfo)

      const res = await fetch("/api/admin/add-info-course", {
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
        router.push(`/admin/infoCourse?${new Date().getTime()}`);
      } else {
        const errorData = await res.json();
        console.log("Something went wrong in else block");
      }
    } catch (error) {
      console.log("error", error);
    }
  };


  const handleTitleChange = (index, value) => {
    const newFields = [...titleFields];
    newFields[index] = value;
    setTitleFields(newFields);
  }

  const handleDescriptionChange = (index, value) => {
    const newFields = [...descriptionFields];
    newFields[index] = value;
    setDescriptionFields(newFields);
  }

  const handleNameInfoChange = (value) => {
    setNameInfo(value);
  } 

  return (
    <div className="flex-grow md:ml-64">
      <div className="flex flex-col justify-center items-center mt-16">
        <form
          ref={ref}
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-md mx-auto p-8 bg-white rounded shadow-md flex flex-col items-center"
        >
          <h2 className="text-2xl text-green-500 font-semibold mb-6 flex justify-center">
            Adicionar informações gerais
          </h2>
         <div className="mb-4">
      
              <label
                htmlFor={'nameId'}
                className="block text-sm font-medium text-gray-600"
              >
                Nome 
              </label>
              <input
                id={'nameId'}
                name={'nameId'}
                type="text"
                {...register('nameId', { required: true })}
                className="mt-1 p-2 text-gray-600 w-full border rounded-md"
                placeholder="Insira o nome ao conjunto"
                onChange={(e) => handleNameInfoChange(e.target.value)}
              />
              {errors.items?.name && (
                <p className="text-red-500 text-sm mt-1">
                  Este campo é obrigatório
                </p>
              )}
         </div>

          {fields.map((field, index) => (
            <div className="mb-4" key={field.id}>
              

              <label
                htmlFor={`title-${index}`}
                className="block text-sm font-medium text-gray-600"
              >
                Título 
              </label>
              <input
                id={`title-${index}`}
                name={`title[${index}]`}
                type="text"
                {...register(`items.${index}.title`, { required: true })}
                className="mt-1 p-2 text-gray-600 w-full border rounded-md"
                placeholder="Insira o título"
                onChange={(e) => handleTitleChange(index, e.target.value)}
              />
              {errors.items?.[index]?.title && (
                <p className="text-red-500 text-sm mt-1">
                  Este campo é obrigatório
                </p>
              )}

              <label
                htmlFor={`description-${index}`}
                className="block text-sm font-medium text-gray-600"
              >
                Descrição 
              </label>
              <input
                id={`description-${index}`}
                name={`description[${index}]`}
                type="text"
                {...register(`items.${index}.description`, { required: true })}
                className="mt-1 p-2 text-gray-600 w-full border rounded-md"
                placeholder="Insira a descrição"
                onChange={(e) => handleDescriptionChange(index, e.target.value)}
              />
              {errors.items?.[index]?.description && (
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
            + Adicionar novo tópico
          </button>

          <div className="flex justify-center">
            <Button label={"Adicionar informações"} color={"green"} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInfoCourseForm;
