"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";

const DepositionsItem = ({ depositions }) => {
  const { id, imageDep, autorDepo, depoimento, approved } = depositions || {};
  const router = useRouter();
  const deleteDepositionHandler = async (id) => {
    try {
      const res = await fetch(`/api/admin/remove-deposition/${id}`, {
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
  const updateDepositionHandler = (id) => {
    router.push(`/admin/depositions/update-depo/${id}`);
  };

  const approveDepositionHandler = async (formData, isApproved) => {
    try {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("approved", isApproved);
      formData.append("imageDep", imageDep);
      formData.append("autorDepo", autorDepo);
      formData.append("depoimento", depoimento);

      const res = await fetch("/api/admin/update-depositions", {
        method: "POST",

        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(
          isApproved ? "Depoimento aprovado com sucesso!"
          : "Depoimento rejeitado com sucesso!"
          , {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        await fetch("/api/admin/all-depositions");
        router.push(`/admin/depositions?${new Date().getTime()}`);
      } else {
        const errorData = await res.json();
        console.log("Something went wrong in else block");
      }
     
    } catch (error) {
      console.log("error", error);
    }
  };

 

  return (
    <div className="bg-gray-900 p-4 border-2 border-green-200 mx-2 my-2 rounded-lg shadow-md h-[350px] flex flex-col justify-between">
      <div className="flex items-center mb-4 flex-col">
        {imageDep ? (
          <Image
            loading="lazy"
            width="600"
            height="400"
            quality={100}
            src={depositions?.imageDep[0]}
            // src={`data:image/jpeg;base64,${imageDep}`}
            className="w-24 h-24 rounded-full object-cover mr-4"
          />
        ) : null}

        <div className="text-white text-center mt-4">
          <h2 className="text-xl font-semibold">{autorDepo?.slice(0, 100)}</h2>
        </div>
      </div>

      <div className="flex-1 max-h-[150px]">
        <p className="text-white break-words overflow-hidden">
          {depoimento?.slice(0, 100)}
        </p>
      </div>

      <div className="flex justify-center gap-2 md:gap-4">
        <button
          type="button"
          onClick={() => deleteDepositionHandler(id)}
          className="rounded-lg bg-red-700 text-center px-2 py-1 mt-4"
        >
          deletar
        </button>
        <button
          type="button"
          onClick={() => updateDepositionHandler(id)}
          className="rounded-lg bg-green-700 text-center px-2 py-1 mt-4"
        >
          atualizar
        </button>
        {approved === false && (
          <button
            type="button"
            onClick={() => approveDepositionHandler(id, true)}
            className="rounded-lg bg-cyan-700 text-center px-2 py-1 mt-4"
          >
            Aprovar
          </button>
        )}
        {approved === true && (
          <button
            type="button"
            onClick={() => approveDepositionHandler(id, false)}
            className="rounded-lg bg-slate-600 text-center px-2 py-1 mt-4"
          >
            Rejeitar
          </button>
        )}
      </div>
    </div>
  );
};

export default DepositionsItem;
