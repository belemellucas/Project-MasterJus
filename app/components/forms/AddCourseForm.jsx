"use client";
import Button from "@/app/ui/Button";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-tagsinput/react-tagsinput.css";
import Loading from "./../spinner/Spinner";

//import { fetchCategory } from "@/actions/actions"

const AddCourseForm = ({
  categoriesData,
  infoCourseData,
  teachersData,
  coordinatorsData,
}) => {
  const ref = useRef();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      items: [{ title: "", description: "" }],
    },
  });
  const { fields, append } = useFieldArray({
    control,
    name: "items",
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [imageBackground, setImageBackground] = useState([]);
  const [imageHome, setImageHome] = useState([]);
  const [loading, setLoading] = useState(false);
  // adicionar informações gerais do curso
  const [selectedInfoCourse, setSelectedInfoCourse] = useState([]);
  // adicionar módulos curso
  const [titleFields, setTitleFields] = useState([""]);
  const [descriptionFields, setDescriptionFields] = useState([""]);

  //selecionar professores
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [currentOption, setCurrentOption] = useState("");
  const [teacherIds, setTeacherIds] = useState("");
  //selecionar coordenador
  const [selectedCoordOptions, setSelectedCoordOptions] = useState([]);
  const [coordIds, setCoordIds] = useState("");

  const [showModules, setShowModules] = useState(true);

  const onSubmit = async (data) => {
    if (imageFiles.length === 0) {
      alert("Por favor, carregue imagens para o curso.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      imageFiles.forEach((file, index) => {
        formData.append(`imageCard`, file);
      });

      imageBackground.forEach((file, index) => {
        formData.append(`imageBackground`, file);
      });

      imageHome.forEach((file, index) => {
        formData.append(`imageHome`, file);
      });

      if (showModules) {
        //adicionar módulos do curso
        titleFields.forEach((field, index) => {
          formData.append(`title`, field);
        });

        descriptionFields.forEach((field, index) => {
          formData.append(`description`, field);
        });
      }

      // adicionar professores
      if (teacherIds.length > 0) {
        teacherIds.forEach((field, index) => {
          formData.append(`teachers`, field.id);
        });
      }
      // adicionar coordenadores
      if (coordIds.length > 0) {
        coordIds.forEach((field, index) => {
          formData.append(`coordinators`, field.id);
        });
      }

      formData.append("infoCard", data.infoCard || "");
      formData.append("valorAvista", data.valorAvista || "");
      formData.append("valorAntAvista", data.valorAntAvista || "");
      formData.append("valorAtualCartao", data.valorAtualCartao || "");
      formData.append("valorAntCartao", data.valorAntCartao || "");

      formData.append("numParcela", data.numParcela || "");
      formData.append("linkCurso", data.linkCurso || "");
      formData.append("linkCursoAvista", data.linkCursoAvista || "");
      formData.append("subCurso", data.subCurso || "");
      formData.append("DescCurso", data.DescCurso || "");
      formData.append("catId", data.catId || "");
      formData.append("infoId", data.infoId || "");
      formData.append("linkCursoGratuito", data.linkCursoGratuito || "");
      formData.append("discount", data.discount || "");

      const res = await fetch("/api/admin/add-course", {
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
        await fetch("/api/admin/all-courses");
        router.push(`/admin/courses?${new Date().getTime()}`);
      } else {
        const errorData = await res.json();
        console.log("Something went wrong in else block");
      }
      setImageFiles([]);
      setBase64Files([]);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e, type) => {
    const files = Array.from(e.target.files);
    setImageFiles([...imageFiles, ...files]);
  };

  const handleBackgroundImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageBackground([...files]);
  };

  const handleHomeImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageHome([...imageHome, ...files]);
  };

  const isFreeMaterialsCategory = (category) => {
    const normalizedCategory = category.replace(/\s+/g, "").toLowerCase();
    return normalizedCategory === "materiaisgratuitos";
  };

  const isEbookCategory = (category) => {
    const normalizedCategory = category.replace(/\s+/g, "").toLowerCase();
    return (
      normalizedCategory === "livros/e-books".replace(/\s+/g, "").toLowerCase()
    );
  };

  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    const category = categoriesData.find(
      (cat) => cat.id === selectedCategoryId
    );
    const categoryName = category ? category.NomeCat : "";
    setSelectedCategory(categoryName);
  };

  const handleInfoCourseChange = (e) => {
    const selectedInfoCourseId = e.target.value;
    const infoCourse = infoCourseData.find(
      (cat) => cat.id === selectedInfoCourseId
    );
    const infoName = infoCourse ? infoCourse.title : "";
    setSelectedInfoCourse(infoName);
  };

  const handleRemoveImage = () => {
    setImageFiles(null);
  };

  const handleRemoveImageBackground = () => {
    setImageBackground(null);
  };

  const handleRemoveImageCard = (indexToRemove) => {
    setImageHome((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleTitleChange = (index, value) => {
    const newFields = [...titleFields];
    newFields[index] = value;
    setTitleFields(newFields);
  };

  const handleDescriptionChange = (index, value) => {
    const newFields = [...descriptionFields];
    newFields[index] = value;
    setDescriptionFields(newFields);
  };

  const addField = () => {
    append({ title: "", description: "" });
  };

  const handleSelectChange = (e) => {
    const selectedId = e.target.value;
    if (
      selectedId &&
      !selectedOptions.some((option) => option.id === selectedId)
    ) {
      const selectedInfo = teachersData.find(
        (teacher) => teacher.id === selectedId
      );
      setSelectedOptions((prevOptions) => [...prevOptions, selectedInfo]);
      setTeacherIds((prevIds) => [...prevIds, selectedInfo]);
      setCurrentOption("");
    }
  };

  const handleSelectCoordChange = (e) => {
    const selectedId = e.target.value;
    if (
      selectedId &&
      !selectedCoordOptions.some((option) => option.id === selectedId)
    ) {
      const selectedInfo = coordinatorsData.find(
        (teacher) => teacher.id === selectedId
      );
      setSelectedCoordOptions((prevOptions) => [...prevOptions, selectedInfo]);
      setCoordIds((prevIds) => [...prevIds, selectedInfo]);
      setCurrentOption("");
    }
  };

  const handleRemoveOptionTeacher = (id) => {
    setSelectedOptions(selectedOptions.filter((option) => option.id !== id));
    setTeacherIds(teacherIds.filter((option) => option.id !== id));
  };

  const handleRemoveOptionCoordinator = (id) => {
    setSelectedCoordOptions(
      selectedCoordOptions.filter((option) => option.id !== id)
    );
    setCoordIds(coordIds.filter((option) => option.id !== id));
  };

  return (
    <div className="flex-grow md:ml-64">
      <div className="flex flex-col justify-center items-center mt-16">
        <form
          ref={ref}
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-md mx-auto p-8 bg-white rounded shadow-md flex flex-col items-center"
        >
          <h2 className="text-2xl text-green-500 font-semibold mb-6 flex justify-center">
            Adicionar Curso
          </h2>

          <div className="mb-4 w-full">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 pb-2"
            >
              Imagem do curso
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
            <label
              htmlFor="image"
              className="cursor-pointer block w-full max-w-xs mx-auto bg-blue-200 hover:bg-blue-300 text-blue-800 font-semibold py-2 px-4 rounded-lg text-center shadow-md"
            >
              Selecionar Imagem
            </label>
            <div className="flex justify-center">
              {imageFiles?.map((file, index) => (
                <div className="mt-4 relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                    className="w-20 h-20 mx-auto rounded-md"
                  />

                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-0 right-0 text-black rounded-full p-1 -mt-2 -mr-2"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4 w-full">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-600"
            >
              Titulo
            </label>
            <input
              type="text"
              id="infoCard"
              name="infoCard"
              {...register("infoCard", { required: true })}
              className="mt-1 p-2 w-full border text-gray-600 rounded-md"
              placeholder="Insira o título"
            />
            {errors?.title && <p role="alert">{errors?.title?.message}</p>}
          </div>

          <div className="mb-4 w-full">
            <label
              htmlFor="catId"
              className="block text-sm font-medium text-gray-600"
            >
              Categoria
            </label>
            <select
              id="catId"
              name="catId"
              {...register("catId", { required: true })}
              className="mt-1 p-2 text-gray-600 w-full border rounded-md"
              onChange={handleCategoryChange}
            >
              <option value="">Selecione uma categoria</option>
              {categoriesData.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.NomeCat}
                </option>
              ))}
            </select>
          </div>
          {!isFreeMaterialsCategory(selectedCategory) &&
            !isEbookCategory(selectedCategory) && (
              <>
                <div className="mb-4 w-full">
                  <label
                    htmlFor="imageBackground"
                    className="block text-sm font-medium text-gray-700 pb-2"
                  >
                    Imagem do background
                  </label>
                  <input
                    type="file"
                    id="imageBackground"
                    name="imageBackground"
                    onChange={handleBackgroundImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <label
                    htmlFor="imageBackground"
                    className="cursor-pointer block w-full max-w-xs mx-auto bg-blue-200 hover:bg-blue-300 text-blue-800 font-semibold py-2 px-4 rounded-lg text-center shadow-md"
                  >
                    Selecionar Imagem
                  </label>
                  <div className="flex justify-center">
                    {imageBackground?.map((file, index) => (
                      <div className="mt-4 relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt="Preview"
                          className="w-20 h-20 mx-auto rounded-md"
                        />

                        <button
                          type="button"
                          onClick={handleRemoveImageBackground}
                          className="absolute top-0 right-0 text-black rounded-full p-1 -mt-2 -mr-2"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-4 w-full">
                  <label
                    htmlFor="homeImage"
                    className="block text-sm font-medium text-gray-700 pb-2"
                  >
                    Imagens dos cards
                  </label>
                  <input
                    type="file"
                    id="homeImage"
                    name="homeImage"
                    onChange={handleHomeImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <label
                    htmlFor="homeImage"
                    className="cursor-pointer block w-full max-w-xs mx-auto bg-blue-200 hover:bg-blue-300 text-blue-800 font-semibold py-2 px-4 rounded-lg text-center shadow-md"
                  >
                    Selecionar Imagem
                  </label>

                  <div className="flex justify-center">
                    <div className="grid grid-cols-2 gap-4 w-50">
                      {imageHome.map((file, index) => (
                        <div key={index} className="relative mt-4">
                          <img
                            src={URL.createObjectURL(file)}
                            alt="Preview"
                            className="w-full h-20 object-cover rounded-md"
                          />

                          <button
                            type="button"
                            onClick={() => handleRemoveImageCard(index)}
                          >
                            Remover
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* adicionar informações gerais do curso  */}
                <div className="mb-4 w-full max-w-md">
                  <label
                    htmlFor="infoId"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Informações gerais
                  </label>
                  <select
                    id="infoId"
                    name="infoId"
                    {...register("infoId", { required: true })}
                    className="max-w-xs mt-1 p-2 text-gray-600 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    onChange={handleInfoCourseChange}
                  >
                    <option value="">Selecione uma opção</option>
                    {infoCourseData.map((info) => (
                      <option key={info.id} value={info.id}>
                        {info.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* adicionar módulos cursos */}
                {fields.map((field, index) => (
                  <div className="mb-4" key={field.id}>
                    <div className="flex justify-center">
                      <label
                        htmlFor={`topico-${index}`}
                        className="block mt-4 text-sm font-medium text-gray-600"
                      >
                        Módulo {index + 1}
                      </label>
                    </div>
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
                      {...register(`items.${index}.title`, { required: false })}
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
                      {...register(`items.${index}.description`, {
                        required: false,
                      })}
                      className="mt-1 p-2 text-gray-600 w-full border rounded-md"
                      placeholder="Insira a descrição"
                      onChange={(e) =>
                        handleDescriptionChange(index, e.target.value)
                      }
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
                  className="mb-8 text-blue-500 hover:text-blue-700"
                >
                  + Adicionar novo tópico
                </button>

                {/* adicionar professores do cursos */}
                <div className="mb-4 w-full">
                  <label
                    htmlFor="infoId"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Professores do curso
                  </label>
                  <select
                    id="infoId"
                    name="infoId"
                    value={currentOption}
                    onChange={handleSelectChange}
                    className="mt-1 p-2 text-gray-600 w-full border rounded-md"
                  >
                    <option value="">Selecione uma opção</option>
                    {teachersData.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </option>
                    ))}
                  </select>

                  <div className="mt-4">
                    {selectedOptions.map((option) => (
                      <div
                        key={option.id}
                        className="flex items-center justify-between bg-gray-100 p-2 rounded-md mb-2"
                      >
                        <span>{option.name}</span>
                        <button
                          onClick={() => handleRemoveOptionTeacher(option.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* adicionar coordenadores do cursos */}
                <div className="mb-4 w-full">
                  <label
                    htmlFor="coordeId"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Coordenadores do curso
                  </label>
                  <select
                    id="coordeId"
                    name="coordeId"
                    value={currentOption}
                    onChange={handleSelectCoordChange}
                    className="mt-1 p-2 text-gray-600 w-full border rounded-md"
                  >
                    <option value="">Selecione uma opção</option>
                    {coordinatorsData.map((coorde) => (
                      <option key={coorde.id} value={coorde.id}>
                        {coorde.name}
                      </option>
                    ))}
                  </select>

                  <div className="mt-4">
                    {selectedCoordOptions.map((option) => (
                      <div
                        key={option.id}
                        className="flex items-center justify-between bg-gray-100 p-2 rounded-md mb-2"
                      >
                        <span>{option.name}</span>
                        <button
                          onClick={() =>
                            handleRemoveOptionCoordinator(option.id)
                          }
                          className="text-red-500 hover:text-red-700"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-4 w-full">
                  <label
                    htmlFor="linkCurso"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Link do Curso (cartão)
                  </label>
                  <textarea
                    id="linkCurso"
                    name="linkCurso"
                    {...register("linkCurso", { required: true })}
                    rows="4"
                    className="mt-1 p-2 text-gray-600 w-full border rounded-md"
                    placeholder="Insira o link do curso"
                  ></textarea>
                </div>

                <div className="mb-4 w-full">
                  <label
                    htmlFor="linkCursoAvista"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Link do Curso (pix ou boleto)
                  </label>
                  <textarea
                    id="linkCursoAvista"
                    name="linkCursoAvista"
                    {...register("linkCursoAvista", { required: true })}
                    rows="4"
                    className="mt-1 p-2 text-gray-600 w-full border rounded-md"
                    placeholder="Insira o link do curso"
                  ></textarea>
                </div>
              </>
            )}

          {isEbookCategory(selectedCategory) && (
            <>
              <div className="mb-4 w-full">
                <label
                  htmlFor="imageBackground"
                  className="block text-sm font-medium text-gray-700 pb-2"
                >
                  Imagem do background
                </label>
                <input
                  type="file"
                  id="imageBackground"
                  name="imageBackground"
                  onChange={handleBackgroundImageChange}
                  accept="image/*"
                  className="hidden"
                />
                <label
                  htmlFor="imageBackground"
                  className="cursor-pointer block w-full max-w-xs mx-auto bg-blue-200 hover:bg-blue-300 text-blue-800 font-semibold py-2 px-4 rounded-lg text-center shadow-md"
                >
                  Selecionar Imagem
                </label>
                <div className="flex justify-center">
                  {imageBackground.map((file, index) => (
                    <div className="mt-4 relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt="Preview"
                        className="w-20 h-20 mx-auto rounded-md"
                      />

                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-0 right-0 text-black rounded-full p-1 -mt-2 -mr-2"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mb-4 w-full">
                <label
                  htmlFor="homeImage"
                  className="block text-sm font-medium text-gray-700 pb-2"
                >
                  Imagens dos cards
                </label>
                <input
                  type="file"
                  id="homeImage"
                  name="homeImage"
                  onChange={handleHomeImageChange}
                  accept="image/*"
                  className="hidden"
                />
                <label
                  htmlFor="homeImage"
                  className="cursor-pointer block w-full max-w-xs mx-auto bg-blue-200 hover:bg-blue-300 text-blue-800 font-semibold py-2 px-4 rounded-lg text-center shadow-md"
                >
                  Selecionar Imagem
                </label>

                <div className="flex justify-center">
                  <div className="grid grid-cols-2 gap-4 w-50">
                    {imageHome.map((file, index) => (
                      <div key={index} className="relative mt-4">
                        <img
                          src={URL.createObjectURL(file)}
                          alt="Preview"
                          className="w-full h-20 object-cover rounded-md"
                        />

                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                        >
                          Remover
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* adicionar informações gerais do curso  */}
              <div className="mb-4 w-full max-w-md">
                <label
                  htmlFor="infoId"
                  className="block text-sm font-medium text-gray-600"
                >
                  Informações gerais
                </label>
                <select
                  id="infoId"
                  name="infoId"
                  {...register("infoId", { required: true })}
                  className="max-w-xs mt-1 p-2 text-gray-600 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  onChange={handleInfoCourseChange}
                >
                  <option value="">Selecione uma opção</option>
                  {infoCourseData.map((info) => (
                    <option key={info.id} value={info.id}>
                      {info.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Condicionalmente renderizar campos de módulo */}
              {showModules &&
                fields.map((field, index) => (
                  <div className="mb-4" key={field.id}>
                    <div className="flex justify-center">
                      <label
                        htmlFor={`topico-${index}`}
                        className="block mt-4 text-sm font-medium text-gray-600"
                      >
                        Módulo {index + 1}
                      </label>
                    </div>
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
                      {...register(`items.${index}.title`)}
                      className="mt-1 p-2 text-gray-600 w-full border rounded-md"
                      placeholder="Insira o título (opcional)"
                      onChange={(e) => handleTitleChange(index, e.target.value)}
                    />

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
                      {...register(`items.${index}.description`)}
                      className="mt-1 p-2 text-gray-600 w-full border rounded-md"
                      placeholder="Insira a descrição (opcional)"
                      onChange={(e) =>
                        handleDescriptionChange(index, e.target.value)
                      }
                    />
                  </div>
                ))}
              {showModules && (
                <button
                  type="button"
                  onClick={addField}
                  className="mb-2 text-blue-500 hover:text-blue-700"
                >
                  + Adicionar novo módulo
                </button>
              )}

              {/* Checkbox para mostrar ou esconder os módulos */}
              <div className="flex w-full">
                <div className="mb-6 mt-2 flex">
                  <input
                    type="checkbox"
                    id="showModules"
                    checked={showModules}
                    onChange={() => setShowModules(!showModules)}
                    className="mr-2"
                  />
                  <label
                    htmlFor="showModules"
                    className="text-sm font-medium text-gray-600"
                  >
                    Adicionar módulos
                  </label>
                </div>
              </div>

              {/* adicionar autor do livro  */}
              <div className="mb-4 w-full">
                <label
                  htmlFor="infoId"
                  className="block text-sm font-medium text-gray-600"
                >
                  Autor do Livro/E-book
                </label>
                <select
                  id="infoId"
                  name="infoId"
                  value={currentOption}
                  onChange={handleSelectChange}
                  className="mt-1 p-2 text-gray-600 w-full border rounded-md"
                >
                  <option value="">Selecione uma opção</option>
                  {teachersData.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>

                <div className="mt-4">
                  {selectedOptions.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center justify-between bg-gray-100 p-2 rounded-md mb-2"
                    >
                      <span>{option.name}</span>
                      <button
                        onClick={() => handleRemoveOptionTeacher(option.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Links do E-book */}
              <div className="mb-4 w-full">
                <label
                  htmlFor="linkCurso"
                  className="block text-sm font-medium text-gray-600"
                >
                  Link do Livro/E-book (cartão)
                </label>
                <textarea
                  id="linkCurso"
                  name="linkCurso"
                  {...register("linkCurso", { required: false })}
                  rows="4"
                  className="mt-1 p-2 text-gray-600 w-full border rounded-md"
                  placeholder="Insira o link do curso"
                ></textarea>
              </div>

              <div className="mb-4 w-full">
                <label
                  htmlFor="linkCursoAvista"
                  className="block text-sm font-medium text-gray-600"
                >
                  Link do Livro/E-book (boleto)
                </label>
                <textarea
                  id="linkCursoAvista"
                  name="linkCursoAvista"
                  {...register("linkCursoAvista", { required: false })}
                  rows="4"
                  className="mt-1 p-2 text-gray-600 w-full border rounded-md"
                  placeholder="Insira o link do curso"
                ></textarea>
              </div>
            </>
          )}

          {/* adicionar valor cartão e boleto */}
          {!isFreeMaterialsCategory(selectedCategory) && (
            <>
              {/* valor pix ou boleto */}
              <div className="mb-4 w-full">
                <label
                  htmlFor="valorAvista"
                  className="block text-sm font-medium text-gray-600"
                >
                  Valor Avista (pix ou boleto)
                </label>
                <input
                  id="valorAvista"
                  name="valorAvista"
                  {...register("valorAvista", { required: true })}
                  className="mt-1 p-2 text-gray-600 w-full border rounded-md"
                  placeholder="Insira o valor avista"
                />
              </div>

              <div className="mb-4 w-full">
                <label
                  htmlFor="valorAntAvista"
                  className="block text-sm font-medium text-gray-600"
                >
                  Valor Anterior (pix ou boleto)
                </label>
                <input
                  id="valorAntAvista"
                  name="valorAntAvista"
                  {...register("valorAntAvista", { required: true })}
                  className="mt-1 p-2 text-gray-600 w-full border rounded-md"
                  placeholder="Insira o valor anterior"
                />
              </div>

              <div className="mb-4 w-full">
                <label
                  htmlFor="valorAtualCartao"
                  className="block text-sm font-medium text-gray-600"
                >
                  Valor Atual (cartão)
                </label>
                <input
                  id="valorAtualCartao"
                  name="valorAtualCartao"
                  {...register("valorAtualCartao", { required: true })}
                  className="mt-1 p-2 text-gray-600 w-full border rounded-md"
                  placeholder="Insira o valor atual"
                />
              </div>

              <div className="mb-4 w-full">
                <label
                  htmlFor="valorAntCartao"
                  className="block text-sm font-medium text-gray-600"
                >
                  Valor Anterior (cartão)
                </label>
                <input
                  id="valorAntCartao"
                  name="valorAntCartao"
                  {...register("valorAntCartao", { required: true })}
                  className="mt-1 p-2 text-gray-600 w-full border rounded-md"
                  placeholder="Insira o valor anterior"
                />
              </div>

              <div className="mb-4 w-full">
                <label
                  htmlFor="numParcela"
                  className="block text-sm font-medium text-gray-600"
                >
                  Número de Parcelas
                </label>
                <input
                  id="numParcela"
                  name="numParcela"
                  type="number"
                  {...register("numParcela", {
                    required: true,
                    valueAsNumber: true,
                    validate: (value) =>
                      Number.isInteger(value) ||
                      "O valor deve ser um número inteiro",
                  })}
                  className="mt-1 p-2 text-gray-600 w-full border rounded-md"
                  placeholder="Insira o número de parcelas"
                />
              </div>

              <div className="flex mb-4 w-full">
                <input
                  id="discount"
                  name="discount"
                  type="checkbox"
                  {...register("discount")}
                  className="mr-2"
                />
                <label
                  htmlFor="discount"
                  className="text-sm font-medium text-gray-600"
                >
                  Aplicar Desconto
                </label>
              </div>
            </>
          )}

          <div className="mb-4 w-full">
            <label
              htmlFor="subCurso"
              className="block text-sm font-medium text-gray-600"
            >
              Subtítulo do Curso
            </label>
            <textarea
              id="subCurso"
              name="subCurso"
              {...register("subCurso", { required: true })}
              rows="4"
              className="mt-1 p-2 text-gray-600 w-full border rounded-md"
              placeholder="Insira o subtítulo do curso"
            ></textarea>
          </div>

          <div className="mb-4 w-full">
            <label
              htmlFor="DescCurso"
              className="block text-sm font-medium text-gray-600"
            >
              Descrição do Curso
            </label>
            <textarea
              id="DescCurso"
              name="DescCurso"
              {...register("DescCurso", { required: true })}
              rows="4"
              className="mt-1 p-2 text-gray-600 w-full border rounded-md"
              placeholder="Insira a descrição do curso"
            ></textarea>
          </div>

          {isFreeMaterialsCategory(selectedCategory) && (
            <div className="mb-4 w-full">
              <label
                htmlFor="linkCursoGratuito"
                className="block text-sm font-medium text-gray-600"
              >
                Link do Material Gratuito
              </label>
              <textarea
                id="linkCursoGratuito"
                name="linkCursoGratuito"
                {...register("linkCursoGratuito", { required: true })}
                rows="4"
                className="mt-1 p-2 text-gray-600 w-full border rounded-md"
                placeholder="Insira o link do material gratuito"
              ></textarea>
            </div>
          )}

          <Button
            label={
              loading === true ? "Adicionando Curso..." : "Adicionar Curso"
            }
            color={"green"}
          />
          <div>
            {loading === true && (
              <div className="h-1 pt-8 inset-0 flex items-center justify-center bg-opacity-50 z-50">
                <Loading />
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourseForm;
