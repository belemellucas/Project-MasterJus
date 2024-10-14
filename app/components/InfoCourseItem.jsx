"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";

const InfoCourseItem = ({ info }) => {
  const { id, name, title, description } = info || {};
  const router = useRouter();
  const deleteInfoCourseHandler = async (id) => {
    try {
      const res = await fetch(`/api/admin/remove-info-course/${id}`, {
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

  const updateInfoCourseHandler = (id) => {
    router.push(`/admin/infoCourse/update-info-course/${id}`);
  };

  return (
    <div className="bg-gray-900 p-4 border-2 mx-2 my-2 rounded-lg shadow-md flex flex-col justify-between">
      <div className="flex-1">
      <div className="flex justify-center">
      <h3 className="text-lg font-semibold text-white">{name}</h3>
      </div>
        {title && title.length > 0 && description && description.length > 0 ? (
          title.slice(0, 4).map((item, index) => (
            <div key={index} className="text-white mb-2">
              <h3 className="text-lg font-semibold">Tópico {index + 1}:</h3>
              <p className="ml-4 truncate">Título: {item.slice(0, 50)}{item.length > 50 && '...'}</p>
              <p className="ml-4 line-clamp-2">Descrição: {description[index].slice(0, 100)}{description[index].length > 100 && '...'}</p>
            </div>
          ))
        ) : (
          <p className="text-white">Informações não disponíveis</p>
        )}
      </div>

      <div className="flex justify-center gap-4 mt-4">
        <button
          type="button"
          onClick={() => deleteInfoCourseHandler(id)}
          className="rounded-lg bg-red-700 text-center px-2 py-1"
        >
          Deletar
        </button>
        <button
          type="button"
          onClick={() => updateInfoCourseHandler(id)}
          className="rounded-lg bg-green-700 text-center px-2 py-1"
        >
          Atualizar
        </button>
      </div>
    </div>
  );
};

export default InfoCourseItem;
