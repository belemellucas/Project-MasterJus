"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import Spinner from "../spinner/Spinner";

const CourseItem = ({ card }) => {
  const { id, imageCard, infoCard, valorAvista, valorAntAvista, valorAtualCartao, numParcela } =
    card || {};

  const [loading, setLoading] = useState(true);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };
  const valorAtualFormatted = formatCurrency(parseFloat(valorAvista));
  const valorAntFormatted = formatCurrency(parseFloat(valorAntAvista));
  const valorParcela = formatCurrency(parseFloat(valorAtualCartao) / numParcela);

  return (
    <>
      <div className="flex flex-col md:max-w-[307px] max-w-full">
        <div className="flex flex-col justify-center text-2xl font-bold leading-8 text-center text-white whitespace-nowrap bg-zinc-100 relative"></div>
        <div className="flex flex-col mt-4 px-6 py-7 w-full bg-white rounded-2xl border border-solid border-zinc-100 max-md:px-5">
          <Link href={`/courses/${id}`}>
          <div className="relative w-full h-[260px] mb-4 rounded-md overflow-hidden">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                <Spinner /> 
              </div>
            )}
            {imageCard && (
              <Image
                src={imageCard[0]}
                alt={`Image ${imageCard[0]}`}
                layout="fill"
                objectFit="cover"
                className={`w-full h-full transition-opacity duration-500 ${
                  loading ? "opacity-0" : "opacity-100"
                }`}
                onLoadingComplete={() => setLoading(false)} // Atualiza o estado quando o carregamento termina
              />
            )}
          </div>
          </Link>
          <h3 className="text-lg font-bold text-center text-gray-900 overflow-hidden break-words line-clamp-2 h-15">
            {infoCard}
          </h3>
          <div className="flex gap-5 justify-between px-px mt-5 text-sm">
            <div className="flex flex-col my-auto leading-5 text-indigo-950">
              <div>
                De{" "}
                <span className="font-semibold line-through">
                  {valorAntFormatted}
                </span>
              </div>
              <div className="mt-3">
                por{" "}
                <span className="font-semibold">R$ {valorAtualFormatted}</span>
                <h1 className="mt-1 flex text-green-600">No Pix</h1>
              </div>
            </div>
            <div className="flex flex-col text-right text-rose-500 leading-[135%]">
              <div className="text-indigo-950">{numParcela} x de</div>
              <div className="mt-2 text-base font-bold">{valorParcela}</div>
              <div className="mt-2">sem juros</div>
            </div>
          </div>
          <div className="flex gap-5 justify-between px-0.5 w-full">
            <div className="flex gap-1.5 self-start text-sm font-semibold leading-7 text-center text-rose-500 whitespace-nowrap">
              <div className="flex justify-center mt-6">
                <Link href={`/courses/${id}`}>
                  <button className="px-4 py-2 text-sm font-semibold text-white bg-blue-800 rounded-full w-40 cursor-pointer transform transition-transform duration-300 hover:scale-105">
                    Saiba Mais
                  </button>
                </Link>
              </div>
            </div>
            <div className="flex gap-0">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/762c62323dcb14e78992f90024b9738e0f1da0799023b03410e90301c9a34dd0?"
                className="shrink-0 w-3.5 aspect-[1.08]"
              />
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/ebaaebb54b1056061a97dd735cee7dc37ac9b627d3e06e71cca04d6b1b2adacb?"
                className="shrink-0 aspect-square w-[13px]"
              />
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/94d8988a55db159696fc299a9d84ae3b4d57d357122a7372338123b322e07db9?"
                className="shrink-0 w-3.5 aspect-[1.08]"
              />
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/6462c7e3479c4d57e52094108ce6405dc4eb31e53ef82f04e69a2f21f35b9b2d?"
                className="shrink-0 aspect-square w-[13px]"
              />
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/365e4c6c16ce974cd06cbafe24150ffc4c0625a47e788fca08591151681423c3?"
                className="shrink-0 w-3.5 aspect-[1.08]"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseItem;
