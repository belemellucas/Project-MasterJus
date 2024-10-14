"use client";

import { useRef, useState } from "react";
import { toast } from "react-toastify";

const Lead = () => {
  const ref = useRef();
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
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
      } else {
        toast.error("Ocorreu um erro. Tente novamente.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        console.log("Something went wrong");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="flex justify-center items-center px-8 py-4 w-full text-xs text-black bg-gray-600 max-md:px-5 max-md:max-w-full">
      <form
        ref={ref}
        onSubmit={handleSubmit}
        className="flex gap-2 justify-between items-center max-w-full w-[1169px] max-md:flex-wrap max-md:justify-center"
      >
        <div className="text-sm md:text-sm leading-5 whitespace-nowrap text-center md:text-left text-white">
          Fique por dentro de tudo que acontece no Direito!
        </div>
        <div className="flex flex-col justify-start items-start px-4 py-3 bg-white rounded-3xl border border-solid text-black max-md:pr-5 w-80 h-10 max-md:w-64 max-md:h-10">
          <input
            placeholder="Nome"
            className="w-full h-full bg-transparent focus:outline-none"
            type="text"
            value={formData.nome}
            name="nome"
            onChange={handleInputChange}
          />
        </div>
        <div className="flex flex-col justify-start items-start px-4 py-3 bg-white rounded-3xl border border-solid text-black max-md:pr-5 w-80 h-10 max-md:w-64 max-md:h-10">
          <input
            placeholder="E-mail"
            className="w-full h-full bg-transparent focus:outline-none"
            type="email"
            value={formData.email}
            name="email"
            onChange={handleInputChange}
          />
        </div>
        <button
          type="submit"
          className="flex justify-center text-base leading-6 text-center text-white bg-gray-800 rounded-[40px] py-2 px-16 max-md:px-8 max-md:h-10 transition-transform duration-200 hover:scale-105 active:scale-105"
        >
          ENVIAR
        </button>
      </form>
    </div>
  );
};

export default Lead;
