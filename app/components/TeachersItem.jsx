"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";

const TeachersItem = ({ teacher }) => {
  const { id, name, description, academic, imageTeacher, type } = teacher || {};
  const router = useRouter();


  const deleteTeacherHandler = async (id, type) => {
    try { 
      const res = await fetch(`/api/admin/remove-teacher/${id}/${type}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-cache",
      });

      if (res.ok) {
        router.refresh();
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
      } else {
        const errorData = await res.json();
        console.log("Something went wrong in else block");
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  const updateTeacherHandler = (id) => {
    router.push(`/admin/teachers/update-teacher/${id}`);
  };

  
  return (
    <div className="bg-gray-900 p-4 border-2 border-green-200 mx-2 my-2 rounded-lg shadow-md h-[450px] flex flex-col justify-between">
  <div className="flex items-center mb-4 flex-col">
    {imageTeacher ? (
      <Image
        loading="lazy"
        width="600"
        height="400"
        quality={100}
        src={imageTeacher[0]}
       // src={`data:image/jpeg;base64,${imageDep}`}
        className="w-24 h-24 rounded-full object-cover"
      />
    ) : null}

    <div className="text-white text-center mt-4">
      <h2 className="text-xl font-semibold">    {name ? name.slice(0, 100) : "Nome não disponível"}</h2>
    </div>
  </div>

  <div className="flex-1 max-h-[150px]">
    <p className="text-white break-words overflow-hidden"> {description ? description.slice(0, 100) : "Descrição não disponível"}</p>
  </div>

  <div className="flex-1 max-h-[150px]">
    <p className="text-white break-words overflow-hidden"> {type}</p>
  </div>

  
  <div className="flex-1 max-h-[150px]">
  <div className="text-white flex flex-wrap gap-2">
  {academic && academic.length > 0 && academic.some(item => item && item.trim() !== "") ? (
    academic
    .slice(0, 4).map((item, index) => (
      <p
        key={index}
        className="bg-gray-700 px-2 py-1 rounded-md max-w-[200px] truncate"
        title={item} // Mostra o texto completo ao passar o mouse
      >
        {item}
      </p>
    ))
  ) : (
    <p>Formação não disponível</p>
  )}
</div>
</div>

  <div className="flex justify-center gap-4">
    <button
      type="button"
      onClick={() => deleteTeacherHandler(id, type)}
      className="rounded-lg bg-red-700 text-center px-2 py-1 mt-4"
    >
      deletar
    </button>
    <button
      type="button"
      onClick={() => updateTeacherHandler(id)}
      className="rounded-lg bg-green-700 text-center px-2 py-1 mt-4"
    >
      atualizar
    </button>
   
  </div>
</div>

  
  
  );
};

export default TeachersItem;
