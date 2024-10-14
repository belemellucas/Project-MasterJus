"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import Cropper from "react-easy-crop";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

function CoursePage({ course }) {
  const { data: session, status } = useSession();
  const {
    id,
    infoCard,
    catId,
    infoId,
    imageCard = [],
    imageBackground = [],
    imageHome = [],
    valorAvista,
    valorAntAvista,
    valorAtualCartao,
    valorAntCartao,
    numParcela,
    linkCurso,
    linkCursoAvista,
    discount,
    avaliacao,
    tituloCurso,
    subCurso,
    DescCurso,
    authorId,
    published,
    createdAt,
    updatedAt,
    categoria = {},
    courseInfo = {},
    contentCourse = {},
    teachers = [],
    coordinators = [],
  } = course || {};
  const [visibleDescriptionIndex, setVisibleDescriptionIndex] = useState(null);
  const people = [...teachers, ...coordinators];
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [showAll, setShowAll] = useState(false);

  const teachersPerPage = 3;
  const totalPages = Math.ceil(people.length / teachersPerPage);

  const router = useRouter();
  const titles = Array.isArray(contentCourse.title)
    ? contentCourse.title
    : contentCourse.title
    ? [contentCourse.title]
    : [];
  const descriptions = Array.isArray(contentCourse.description)
    ? contentCourse.description
    : contentCourse.description
    ? [contentCourse.description]
    : [];
  const toggleDescription = (index) => {
    setVisibleDescriptionIndex((prevIndex) =>
      prevIndex === index ? null : index
    );
  };

  const handleSelectPerson = (person) => {
    setSelectedPerson(person);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  useEffect(() => {
    if (selectedPerson?.imageTeacher?.[0]) {
      setImageUrl(selectedPerson.imageTeacher[0]);
      // fetchAdjustments();
    }
    if (session?.user.role === "ADMIN") {
      setIsAdmin(true);
    }
    if (!selectedPerson && people.length > 0) {
      const firstPerson = people[0];
      setSelectedPerson(firstPerson.teacher || firstPerson.coordinator || null);
    }

    //console.log(categoria.NomeCat, "CATEGORIA")
  }, [selectedPerson?.imageTeacher?.[0], session?.user?.role]);

  const toggleDescriptionInfo = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const isEbookCategory = (category) => {
    const normalizedCategory = category.replace(/\s+/g, "").toLowerCase();
    return (
      normalizedCategory === "livros/e-books".replace(/\s+/g, "").toLowerCase()
    );
  };

  const desconto = ((valorAvista - valorAntAvista) / valorAvista) * 100;

  const handleClick = () => {
    router.back();
  };
  return (
    <div className="flex flex-col bg-white">
      <div className="flex flex-col w-full max-md:max-w-full">
        {/* <CardLandingPage /> */}

        <div className="flex overflow-hidden relative flex-col items-center px-16 pb-2 w-full min-h-[666px] max-md:px-5 max-md:max-w-full">
          <img
            loading="lazy"
            srcSet={imageBackground[0]}
            className="object-cover absolute inset-0 size-full"
          />
          <div className="flex relative z-10 pt-8 flex-wrap gap-5 justify-between mt-0 w-full max-w-[1330px] max-md:max-w-full">
            <div className="flex flex-col my-auto max-md:max-w-full">
              <div className="flex gap-3.5 self-start ml-11 text-sm leading-loose text-center max-md:ml-2.5">
                <div className="px-5 py-2 font-semibold whitespace-nowrap bg-blue-800 text-white rounded-[50px] text-indigo-950">
                  {categoria?.NomeCat}
                </div>
              </div>
              <div className="flex flex-wrap gap-3.5 mt-5 text-4xl font-bold leading-10 text-white">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/d3dfa32fec49f2cd75a7aa0638c11b010804ad79cafd28b05238a469c9683533?placeholderIfAbsent=true&apiKey=d5f389c30afa450cb9eadac450c92a69"
                  className="object-contain shrink-0 self-start w-8 aspect-square cursor-pointer"
                  onClick={handleClick}
                />
                <div className="flex-auto w-[509px] max-md:max-w-full">
                  {infoCard}
                </div>
              </div>
              <div className="flex flex-col pr-5 pl-11 mt-5 w-full text-white max-md:pl-5 max-md:max-w-full">
                <div className="mt-4 text-base leading-6 max-md:max-w-full">
                  {subCurso}
                </div>
                <div className="flex gap-2 self-start px-12 py-1.5 mt-8 text-sm font-bold tracking-normal text-center bg-blue-800 text-white rounded text-indigo-950 max-md:px-5">
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/ff3437bb7d5ca36effbaab244ff464f75af3042b73fb06c1a813facbe0114882?placeholderIfAbsent=true&apiKey=d5f389c30afa450cb9eadac450c92a69"
                    className="object-contain shrink-0 aspect-[0.96] w-[23px]"
                  />
                  <div
                    className="my-auto basis-auto cursor-pointer"
                    onClick={() =>
                      document
                        .getElementById("target-section")
                        .scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    {categoria.NomeCat === "LIVROS/E-BOOKS"
                      ? "Garanta seu e-book"
                      : "Garanta sua vaga"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col pr-2.5 pl-20 pt-4 w-full bg-white max-md:pl-5 max-md:max-w-full">
          {categoria.NomeCat === "LIVROS/E-BOOKS" ? (
            <div className="self-start text-3xl leading-loose text-indigo-950">
              Conheça o <span className="font-bold">Ebook</span>
            </div>
          ) : (
            <div className="self-start text-3xl leading-loose text-indigo-950">
              Conheça o <span className="font-bold">curso</span>
            </div>
          )}

          <div className="flex flex-wrap gap-10 items-start self-end mt-4 w-full max-w-[1638px] max-md:max-w-full">
            <div className="flex-auto self-start max-md:max-w-full">
              <div className="flex gap-5 max-md:flex-col justify-center">
                {imageHome &&
                  imageHome.slice(0, 3).map((image, index) => (
                    <div
                      key={index}
                      className="flex flex-col w-[26%] max-md:ml-0 max-md:w-full"
                    >
                      <div className="relative flex flex-col grow items-center px-11 pt-12 pb-24 w-full text-lg font-bold leading-6 text-center text-white rounded-xl border border-solid bg-blue-800 max-md:px-5 max-md:mt-4 overflow-hidden h-[250px]">
                        <img
                          loading="lazy"
                          src={image} // Renderiza a imagem
                          className="absolute inset-0 w-full h-full object-cover z-0"
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          {imageHome && imageHome.length > 3 && (
            <div className="flex flex-wrap gap-10 items-start self-end mt-4 w-full max-w-[1638px] max-md:max-w-full">
              <div className="flex-auto self-start max-md:max-w-full">
                <div className="flex gap-5 max-md:flex-col justify-center">
                  {imageHome &&
                    imageHome.slice(3, 6).map((image, index) => (
                      <div
                        key={index}
                        className="flex flex-col w-[26%] max-md:ml-0 max-md:w-full"
                      >
                        <div className="relative flex flex-col grow items-center px-11 pt-12 pb-24 w-full text-lg font-bold leading-6 text-center text-white rounded-xl border border-solid bg-blue-800 max-md:px-5 max-md:mt-4 overflow-hidden h-[250px]">
                          <img
                            loading="lazy"
                            src={image} // Renderiza a imagem
                            className="absolute inset-0 w-full h-full object-cover z-0"
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-10 items-start self-end mt-9 w-full max-w-[1638px] max-md:max-w-full">
            <div className="flex-auto self-start max-md:max-w-full">
              <div className="flex gap-5 max-md:flex-col">
                {imageCard &&
                  imageCard?.slice(3, 6).map((image, index) => (
                    <div
                      key={index}
                      className="flex flex-col w-[33%] max-md:ml-0 max-md:w-full"
                    >
                      <div className="flex flex-col grow items-center px-11 pt-7 pb-16 w-full text-lg font-bold leading-6 text-center text-white whitespace-nowrap rounded-xl border border-teal-300 border-solid bg-blue-800 max-md:px-5 max-md:mt-4">
                        <img
                          loading="lazy"
                          src={image} // Renderiza a imagem
                          className="object-contain aspect-[0.94] w-[34px]"
                        />
                        <div className="mt-5">Unidades de ensino</div>
                        <div className="self-stretch mt-6 text-base leading-6">
                          O curso é composto por 12 unidades de ensino
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {course.contentCourse.title.length > 0 &&
          course.contentCourse.description.length > 0 && (
            <div className="flex flex-col justify-center items-center px-20 pb-8 w-full bg-stone-50 max-md:px-5 max-md:max-w-full">
              <div className="flex flex-col max-w-full w-[711px]">
                <div className="flex flex-wrap gap-5 justify-between w-full max-md:max-w-full">
                  <div className="my-auto text-2xl font-light leading-loose text-neutral-800">
                    Conteúdo programático do{" "}
                    {categoria.NomeCat === "LIVROS/E-BOOKS" ? (
                      <span className="font-bold">e-book</span>
                    ) : (
                      <span className="font-bold">curso</span>
                    )}
                  </div>
                </div>

                <div>
                  {titles.length > 0 &&
                    titles.map((title, index) => (
                      <div
                        key={index}
                        className="flex flex-col mt-6 w-full text-base font-light leading-tight text-white bg-white rounded-lg max-md:max-w-full"
                      >
                        <div className="flex flex-wrap gap-5 justify-between px-4 py-3 rounded-lg bg-blue-800 max-md:max-w-full">
                          <div className="my-auto">{title}</div>
                          <button
                            onClick={() => toggleDescription(index)}
                            className="bg-slate-800 text-white px-3 py-1 rounded"
                          >
                            {visibleDescriptionIndex === index
                              ? "Menos informações"
                              : "Mais informações"}
                          </button>
                        </div>

                        {visibleDescriptionIndex === index && (
                          <div className="px-4 py-3 bg-gray-100 text-black rounded-lg mt-2">
                            {descriptions[index]}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

        <div className="flex flex-col md:flex-row  px-5 py-10 w-full bg-blue-800 justify-center">
          <div className="flex flex-col items-center w-full md:w-[711px]">
            {/* teacher selected */}
            <div className="flex gap-1 text-xl font-bold">
              <div className="grow my-auto leading-3 text-white">
                {categoria.NomeCat === "LIVROS/E-BOOKS" ? (
                  <>Autor do e-book</>
                ) : (
                  <>
                    {selectedPerson?.type === "teacher"
                      ? "Professor do curso"
                      : "Coordenador do curso"}
                  </>
                )}
              </div>
              <div className="px-3.5 py-1.5 leading-none text-center whitespace-nowrap bg-blue-800 rounded-[50px] text-indigo-950">
                {categoria?.NomeCat}
              </div>
            </div>

            <div className="text-4xl font-bold leading-loose text-white max-w-full">
              {selectedPerson ? selectedPerson.name : "Nome não disponível"}
            </div>

            <div className="flex items-center justify-center w-full mt-4">
              <div className="relative flex justify-center w-[300px] h-[400px]">
                <img
                  src={imageUrl}
                  alt="Image"
                  layout="fill"
                  className="object-fit-custom"
                />
              </div>
            </div>

            {/* Corpo docente */}
            <div className="mt-4 text-3xl font-bold leading-loose text-white">
              Corpo docente
            </div>
            <div className="self-stretch w-full relative">
              {/* Setas de navegação nas laterais dos cards */}
              {!showAll && currentPage > 0 && (
                <button
                  onClick={handlePreviousPage}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white text-black p-2 rounded-full"
                >
                  &lt;
                </button>
              )}
              <div className="flex gap-5 md:gap-8 flex-wrap justify-center">
                {/* Exibe os professores, limitados por página */}
                {people
                  .slice(
                    showAll ? 0 : currentPage * teachersPerPage,
                    showAll
                      ? people.length
                      : (currentPage + 1) * teachersPerPage
                  )
                  .map((person, index) => {
                    const isTeacher = person.teacher !== undefined;
                    const isCoordinator = person.coordinator !== undefined;

                    const image = isTeacher
                      ? person.teacher.imageTeacher[0]
                      : person.coordinator.imageTeacher[0];
                    const name = isTeacher
                      ? person.teacher.name
                      : person.coordinator.name;
                    const description = isTeacher
                      ? person.teacher.description
                      : person.coordinator.description;

                    return (
                      <div
                        key={index}
                        className="flex flex-col items-center w-full md:w-[180px]"
                      >
                        <div
                          className="flex overflow-hidden relative cursor-pointer flex-col grow justify-end text-sm font-bold leading-4 text-white rounded-lg aspect-[1] w-[164px] mt-5"
                          onClick={() =>
                            handleSelectPerson(
                              isTeacher ? person.teacher : person.coordinator
                            )
                          }
                        >
                          <img
                            loading="lazy"
                            src={image}
                            className="object-cover w-full h-full"
                            alt={name}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
              {!showAll && currentPage < totalPages - 1 && (
                <button
                  onClick={handleNextPage}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white text-black p-2 rounded-full"
                >
                  &gt;
                </button>
              )}
            </div>

            {/* Botões Ver todos e Ver menos */}
            <div
              className="flex gap-2.5 self-center mt-5 text-base leading-none text-white cursor-pointer"
              onClick={() => setShowAll(!showAll)}
            >
              <div>{showAll ? "Ver menos" : "Ver todos"}</div>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/01cba0f25425abd9d1c984b320b6c0f56d2da27bc0a32f0b2e965033f9b3170d?placeholderIfAbsent=true&apiKey=d5f389c30afa450cb9eadac450c92a69"
                className="object-contain shrink-0 my-auto w-2 aspect-[2]"
              />
            </div>
          </div>

          {/* curriculo */}
          <div className="h-full md:mt-32">
            <div className="flex mt-4 md:mt-0 w-full md:w-[511px] h-auto bg-white p-6 rounded-lg shadow-lg md:self-start">
              <div>
                <div className="text-2xl font-bold text-indigo-950 mb-4">
                  Currículo do Professor
                </div>
                <p className="text-base text-neutral-800 mb-4">
                  {selectedPerson
                    ? selectedPerson.description || "Descrição não disponível"
                    : "Descrição não disponível"}
                </p>
                {/*  <div className="text-base text-neutral-800 mb-4">
                <strong>Formação Acadêmica:</strong>
                <ul className="list-disc list-inside ml-5 mt-2">
                  {selectedPerson &&
                  selectedPerson.academic &&
                  selectedPerson.academic.length > 0
                    ? selectedPerson.academic.map((formation, index) => (
                        <li key={index}>{formation}</li>
                      ))
                    : "Formação acadêmica não disponível"}
                </ul> 
              </div>*/}
              </div>
            </div>
          </div>
        </div>

        <div
          id="target-section"
          className="flex max-md:flex-col pt-8 pb-8 justify-center items-center px-24 w-full bg-white min-h-[652px] max-md:px-5 max-sm:px-3 max-md:max-w-full lg:justify-evenly"
        >
          <div
            className={`flex flex-col md:flex-row justify-center gap-10 ${
              !linkCursoAvista || !linkCurso
                ? "md:justify-center"
                : "md:justify-between"
            }`}
          >
            {(!isEbookCategory(categoria.NomeCat) || linkCursoAvista) && (
              <div className="flex flex-col items-center px-6 py-8 bg-white rounded-none max-w-[350px] w-full md:max-w-[400px] shadow-lg shadow-gray-300">
                <div className="flex gap-3 text-indigo-950 w-full">
                  <div className="grow my-auto text-lg leading-snug">
                    {categoria.NomeCat}
                  </div>
                  {discount ? (
                    <div className="px-4 py-2.5 text-sm flex items-center font-semibold leading-loose text-center bg-blue-800 text-white rounded-full whitespace-nowrap max-md:px-2 max-md:py-1 min-h-[44px]">
                      <div>{Math.round(desconto)}% de Desconto</div>
                    </div>
                  ) : (
                    <div className="min-h-[44px]"></div>
                  )}
                </div>
                <div className="mt-4 text-3xl w-22 font-bold leading-8 text-indigo-950 max-md:max-w-full">
                  {infoCard}
                </div>
                <div className="flex gap-3.5 mt-4">
                  <div className="text-base font-medium leading-snug text-indigo-950">
                    De
                  </div>
                  <div className="relative text-xl leading-none text-zinc-600">
                    <span className="line-through">
                      {Number(valorAntAvista).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 mt-2.5 font-bold leading-none text-blue-700">
                  <div className="my-auto text-base leading-snug text-indigo-950">
                    Por
                  </div>
                  <div className="text-5xl basis-auto max-md:text-4xl">
                    {Number(valorAvista).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </div>
                </div>
                <div className="mt-5 text-lg font-bold leading-normal text-indigo-950">
                  No boleto ou Pix
                </div>
                <div className="flex justify-center w-full">
                  <div className="flex flex-col justify-center items-center self-stretch px-6 py-3 mt-5 w-full md:w-60 h-14 cursor-pointer text-base font-bold tracking-normal text-center bg-blue-800 rounded-md text-white transition-transform duration-300 hover:scale-105">
                    <a
                      href={linkCursoAvista}
                      className="w-full flex justify-center"
                    >
                      Pagar no Pix ou Boleto
                    </a>
                  </div>
                </div>
                <div className="self-center mt-5 text-lg font-bold leading-normal text-center text-indigo-950">
                  Invista em você agora mesmo!
                </div>
              </div>
            )}

            {(!isEbookCategory(categoria.NomeCat) || linkCurso) && (
              <div className="flex flex-col items-center px-6 py-8 bg-white rounded-none max-w-[350px] w-full md:max-w-[400px] shadow-lg shadow-gray-300">
                <div className="flex gap-3 text-indigo-950 w-full">
                  <div className="grow my-auto text-lg leading-snug">
                    {categoria.NomeCat}
                  </div>
                  <div className="min-h-[44px]">
                    {/* Placeholder vazio para alinhar o card sem desconto */}
                  </div>
                  {/* <div className="px-4 py-2.5 text-sm font-semibold leading-loose text-center bg-blue-800 text-white rounded-full whitespace-nowrap max-md:px-2 max-md:py-1">
        {Math.round(desconto)}% de Desconto
      </div> */}
                </div>
                <div className="mt-4 text-3xl font-bold leading-8 text-indigo-950 max-md:max-w-full">
                  {infoCard}
                </div>
                <div className="flex gap-3.5 mt-4">
                  <div className="text-base font-medium leading-snug text-indigo-950">
                    De
                  </div>
                  <div className="relative text-xl leading-none text-zinc-600">
                    <span className="line-through">
                      {Number(valorAntCartao).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 mt-2.5 font-bold leading-none text-blue-700">
                  <div className="my-auto text-base leading-snug text-indigo-950">
                    Por
                  </div>
                  <div className="text-xl leading-none text-zinc-600 flex items-center">
                    {numParcela}x
                  </div>
                  <div className="text-5xl basis-auto max-md:text-4xl">
                    {Number(valorAtualCartao / numParcela).toLocaleString(
                      "pt-BR",
                      {
                        style: "currency",
                        currency: "BRL",
                      }
                    )}
                  </div>
                </div>
                <div className="mt-5 text-lg font-bold leading-normal text-indigo-950">
                  Parcelado no cartão de crédito
                </div>
                <div className="flex justify-center w-full">
                  <div className="flex flex-col justify-center items-center self-stretch px-6 py-3 mt-5 w-full md:w-60 h-14 cursor-pointer text-base font-bold tracking-normal text-center bg-blue-800 rounded-md text-white transition-transform duration-300 hover:scale-105">
                    <a href={linkCurso} className="w-full flex justify-center">
                      Pagar no cartão de crédito
                    </a>
                  </div>
                </div>
                <div className="self-center mt-5 text-lg font-bold leading-normal text-center text-indigo-950">
                  Invista em você agora mesmo!
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex relative flex-col items-center px-24 min-h-[40px] max-md:px-5">
          <img
            loading="lazy"
            srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/9d955b645c0a89efe0233cbb5d7400268029946c42be4b8855b00eadaaf52a0d?placeholderIfAbsent=true&apiKey=d5f389c30afa450cb9eadac450c92a69&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/9d955b645c0a89efe0233cbb5d7400268029946c42be4b8855b00eadaaf52a0d?placeholderIfAbsent=true&apiKey=d5f389c30afa450cb9eadac450c92a69&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/9d955b645c0a89efe0233cbb5d7400268029946c42be4b8855b00eadaaf52a0d?placeholderIfAbsent=true&apiKey=d5f389c30afa450cb9eadac450c92a69&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/9d955b645c0a89efe0233cbb5d7400268029946c42be4b8855b00eadaaf52a0d?placeholderIfAbsent=true&apiKey=d5f389c30afa450cb9eadac450c92a69&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/9d955b645c0a89efe0233cbb5d7400268029946c42be4b8855b00eadaaf52a0d?placeholderIfAbsent=true&apiKey=d5f389c30afa450cb9eadac450c92a69&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/9d955b645c0a89efe0233cbb5d7400268029946c42be4b8855b00eadaaf52a0d?placeholderIfAbsent=true&apiKey=d5f389c30afa450cb9eadac450c92a69&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/9d955b645c0a89efe0233cbb5d7400268029946c42be4b8855b00eadaaf52a0d?placeholderIfAbsent=true&apiKey=d5f389c30afa450cb9eadac450c92a69&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/9d955b645c0a89efe0233cbb5d7400268029946c42be4b8855b00eadaaf52a0d?placeholderIfAbsent=true&apiKey=d5f389c30afa450cb9eadac450c92a69"
            className="object-cover absolute inset-0 size-full"
          />
          <div className="flex relative flex-col px-5 pt-2 pb-20 w-full max-w-[960px] max-md:pl-5 max-md:max-w-full">
            <div className="flex flex-col justify-center ml-10 max-w-full min-h-[59px] w-[247px] max-md:ml-2.5">
              <div className="flex flex-col flex-1 justify-center w-full">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/424574ee919a1055e27d9faa25b170f8f1303c2303a4723ae38110798add543e?placeholderIfAbsent=true&apiKey=d5f389c30afa450cb9eadac450c92a69"
                  className="object-contain flex-1 w-full aspect-[4.18]"
                />
              </div>
            </div>
            <div className="mt-6 max-md:max-w-full">
              <div className="flex gap-5 max-md:flex-col">
                <div className="flex flex-col w-[38%] max-md:ml-0 max-md:w-full">
                  <div className="flex flex-col grow justify-center min-h-[351px] max-md:mt-2.5">
                    <div className="flex flex-col flex-1 justify-center w-full">
                      <img
                        loading="lazy"
                        srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/24ea99c815eb5e911ddba3cedd13e8cfa5772894a2e7aff62f5b9817dd657f72?placeholderIfAbsent=true&apiKey=d5f389c30afa450cb9eadac450c92a69&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/24ea99c815eb5e911ddba3cedd13e8cfa5772894a2e7aff62f5b9817dd657f72?placeholderIfAbsent=true&apiKey=d5f389c30afa450cb9eadac450c92a69&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/24ea99c815eb5e911ddba3cedd13e8cfa5772894a2e7aff62f5b9817dd657f72?placeholderIfAbsent=true&apiKey=d5f389c30afa450cb9eadac450c92a69&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/24ea99c815eb5e911ddba3cedd13e8cfa5772894a2e7aff62f5b9817dd657f72?placeholderIfAbsent=true&apiKey=d5f389c30afa450cb9eadac450c92a69&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/24ea99c815eb5e911ddba3cedd13e8cfa5772894a2e7aff62f5b9817dd657f72?placeholderIfAbsent=true&apiKey=d5f389c30afa450cb9eadac450c92a69&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/24ea99c815eb5e911ddba3cedd13e8cfa5772894a2e7aff62f5b9817dd657f72?placeholderIfAbsent=true&apiKey=d5f389c30afa450cb9eadac450c92a69&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/24ea99c815eb5e911ddba3cedd13e8cfa5772894a2e7aff62f5b9817dd657f72?placeholderIfAbsent=true&apiKey=d5f389c30afa450cb9eadac450c92a69&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/24ea99c815eb5e911ddba3cedd13e8cfa5772894a2e7aff62f5b9817dd657f72?placeholderIfAbsent=true&apiKey=d5f389c30afa450cb9eadac450c92a69"
                        className="object-contain flex-1 w-full aspect-[0.97]"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col ml-5 w-[62%] max-md:ml-0 max-md:w-full">
                  <div className="flex flex-col justify-center mt-14 text-2xl font-bold leading-snug text-white max-md:mt-10 max-md:max-w-full">
                    <div className="flex flex-col flex-1 w-full max-md:max-w-full">
                      <div className="flex flex-col pb-px w-full max-md:max-w-full">
                        <div className="max-md:max-w-full">
                          Aqui você tem garantia incondicional ao direito 
                        </div>
                        <div className="max-md:max-w-full">
                          de arrependimento da compra em 7 dias. 
                        </div>
                        <div className="max-md:max-w-full">
                          Independente do motivo tendo ou não assistido 
                        </div>
                        <div className="max-md:max-w-full">
                          o conteúdo, você tem 7 dias após a compra para 
                        </div>
                        <div className="max-md:max-w-full">
                          solicitar o cancelamento do seu pedido 
                        </div>

                        <div className="max-md:max-w-full">
                          Mas, temos a certeza de que você não vai se 
                        </div>
                        <div>arrepender.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col text-xl font-bold leading-tight text-black pt-10 pb-10">
          <div className="flex justify-center">
            <h1>O que você precisa saber?</h1>
          </div>
          {courseInfo?.title.map((title, index) => (
            <div
              key={index}
              className="flex flex-wrap gap-5 justify-between px-6 py-4 w-[85%] mx-auto rounded-3xl bg-zinc-50 shadow-[0px_8px_16px_rgba(29,29,29,0.24)] max-md:px-5 max-md:max-w-full mt-4"
            >
              <div className="my-auto">{title}</div>
              <button
                onClick={() => toggleDescriptionInfo(index)}
                className="focus:outline-none"
              >
                <img
                  src={
                    expandedIndex === index
                      ? "/icones/angulo-da-seta-para-cima.png"
                      : "/icones/divisa-para-baixo (1).png"
                  }
                  alt="Toggle"
                  className="object-contain shrink-0 w-8 aspect-square text-blue-900"
                />
              </button>
              {expandedIndex === index && (
                <div className="w-full mt-4 text-neutral-800">
                  <div className="px-6 py-4 bg-gray-100 rounded-lg">
                    {courseInfo.description[index]}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CoursePage;
