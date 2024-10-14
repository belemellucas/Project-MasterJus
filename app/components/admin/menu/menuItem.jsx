"use client";
import Image from "next/image";
import React from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const MenuItem = ({ menuItem }) => {
    const {
      id,
      name,
      type,
      rota, 
      category 
     } = menuItem || {};


   const NomeCat = category ? category.NomeCat : null;

  const router = useRouter();

  const deleteInfoHandler = async (id) => {
    try {
      const res = await fetch(`/api/admin/remove-menu/${id}`, {
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

  const updateInfoHandler = (id) => {
    router.push(`/admin/menu/update-menu/${id}`);
  };

  return (
    <div className="bg-gray-900 p-4 border-2 border-green-200 mx-2 my-2 rounded-lg shadow-md">
      <h2 className="text-xl text-white font-semibold mb-2 truncate">{name}</h2>

      <p className="text-gray-300 overflow-hidden text-ellipsis whitespace-nowrap">
        Tipo: {type ? type : "não existe tipo para esse item"}
      </p>
      <p className="text-gray-300 overflow-hidden text-ellipsis whitespace-nowrap">
        Rota: {rota ? rota : "não existe rota para esse item"}
      </p>
      <p className="text-gray-300 overflow-hidden text-ellipsis whitespace-nowrap">
        Categoria: {NomeCat ? NomeCat : "não existe categoria para esse item"}
      </p>

      <div className="flex justify-center gap-4">
        <button
          type="button"
          onClick={() => deleteInfoHandler(id)}
          className="rounded-lg bg-red-700 text-center px-2 py-1  mt-4"
        >
          delete
        </button>
        <button
          type="button"
          onClick={() => updateInfoHandler(id)}
          className="rounded-lg bg-green-700 text-center px-2 py-1  mt-4"
        >
          update
        </button>
      </div>
    </div>
  );
};

export default MenuItem;
