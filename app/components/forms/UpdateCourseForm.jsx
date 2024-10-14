"use client";
import Button from "@/app/ui/Button";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";
import { usePathname } from "next/navigation";
import Loading from "./../spinner/Spinner";

const UpdateCourseForm = ({
  categoriesData,
  singleCourse,
  infoCourseData,
  teachersData,
  coordinatorsData,
}) => {
  const ref = useRef();
  const router = useRouter();
  const pathname = usePathname();
  const id = pathname.split("/").pop();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    getValues,
    reset,
    watch,
  } = useForm({
    defaultValues: {
      items: [{ title: "", description: "" }],
    },
  });
  const { fields, append } = useFieldArray({
    control,
    name: "items",
  });

  const {
    infoCard,
    catId,
    valorAtual,
    valorAnt,
    numParcela,
    linkCurso,
    subCurso,
    DescCurso,
    valorPix,
    linkCursoAvista,
    infoId,
    linkCursoGratuito,
  } = singleCourse || {};

  const [categories, setCategories] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [base64Files, setBase64Files] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedInfoCourse, setSelectedInfoCourse] = useState("");
  const [selectedImage, setSelectedImage] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [imageFilesBackground, setImageFilesBackground] = useState([]);
  const [imagePreviewsBackground, setImagePreviewsBackground] = useState([]);
  const [imageUrlsBackground, setImageUrlsBackground] = useState([]);
  const [imageFilesHomeCard, setImageFilesHomeCard] = useState([]);
  const [imagePreviewsHomeCard, setImagePreviewsHomeCard] = useState([]);
  const [imageUrlsHomeCard, setImageUrlsHomeCard] = useState([]);
  const [currentOption, setCurrentOption] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedCoordOptions, setSelectedCoordOptions] = useState([]);
  const [teacherIds, setTeacherIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTeacherOptions, setSelectedTeacherOptions] = useState([]);
  const [currentOptionTeacher, setCurrentOptionTeacher] = useState([]);
  const [titleFields, setTitleFields] = useState([]);
  const [descriptionFields, setDescriptionFields] = useState([]);
  const [coordIds, setCoordIds] = useState([]);
  const [selectedIdInfoCourse, setSelectedIdInfoCourse] = useState([]);
  const [showFields, setShowFields] = useState(true);

  const [isFreeMaterial, setIsFreeMaterial] = useState([]);
  const [isEbook, setIsEbook] = useState([]);

  useEffect(() => {
    if (singleCourse) {
      const isFreeMaterial = isFreeMaterialsCategory(singleCourse.catId);
      const isEbook = isEbookCategory(singleCourse.catId);

      setIsFreeMaterial(isFreeMaterial);
      setIsEbook(isEbook);

      // Use setTimeout to ensure updates occur after render
      setTimeout(() => {
        setValue("infoCard", singleCourse.infoCard);
        setValue("catId", singleCourse.catId);
        setValue("valorAvista", singleCourse.valorAvista);
        setValue("valorAntAvista", singleCourse.valorAntAvista);
        setValue("valorAtualCartao", singleCourse.valorAtualCartao);
        setValue("valorAntCartao", singleCourse.valorAntCartao);
        setValue("discount", singleCourse.discount);

        setValue("numParcela", singleCourse.numParcela);
        setValue("linkCurso", singleCourse.linkCurso);
        setValue("subCurso", singleCourse.subCurso);
        setValue("DescCurso", singleCourse.DescCurso);
        setValue("valorPix", singleCourse.valorPix);
        setValue("linkCursoAvista", singleCourse.linkCursoAvista);
        setValue("infoId", singleCourse.infoId);
        setValue("linkCursoGratuito", singleCourse.linkCursoGratuito);

        setSelectedCategory(singleCourse.catId);
        setSelectedInfoCourse(singleCourse.infoId);
        setImageUrls(
          Array.isArray(singleCourse.imageCard)
            ? singleCourse.imageCard
            : [singleCourse.imageCard || ""]
        );
        setImagePreviews(
          singleCourse.imageCard ? singleCourse.imageCard.map((url) => url) : []
        );

        // edit imagem background
        setImageUrlsBackground(
          Array.isArray(singleCourse.imageBackground)
            ? singleCourse.imageBackground
            : [singleCourse.imageBackground || ""]
        );
        setImagePreviewsBackground(
          singleCourse.imageBackground
            ? singleCourse.imageBackground.map((url) => url)
            : []
        );

        // edit images card home
        setImageUrlsHomeCard(
          Array.isArray(singleCourse.imageHome)
            ? singleCourse.imageHome
            : [singleCourse.imageHome || ""]
        );
        setImagePreviewsHomeCard(
          singleCourse.imageHome ? singleCourse.imageHome.map((url) => url) : []
        );

        const coordinators = singleCourse.coordinators;
        if (Array.isArray(coordinators)) {
          const coordOptions = coordinators.map((coordinator) => ({
            id: coordinator.coordinatorId || coordinator.id,
            name: coordinator.coordinator?.name || coordinator.name,
          }));

          setCurrentOption(
            coordinators.map(
              (coordinator) => coordinator.coordinatorId || coordinator.id
            )
          );
          setSelectedCoordOptions(coordOptions);
        }

        const teachers = singleCourse.teachers;
        if (Array.isArray(teachers)) {
          const teacherOptions = teachers.map((teacher) => ({
            id: teacher.teacherId || teacher.id,
            name: teacher.teacher?.name || teacher.name,
          }));

          setCurrentOptionTeacher(
            teachers.map((teacher) => teacher.teacherId || teacher.id)
          );
          setSelectedTeacherOptions(teacherOptions);
        }

        const contentCourse = singleCourse.contentCourse;
        if (
          Array.isArray(contentCourse.title) &&
          Array.isArray(contentCourse.description)
        ) {
          const modules = contentCourse.title.map((title, index) => ({
            title,
            description: contentCourse.description[index] || "",
          }));

          reset({ items: [] });

          modules.forEach((module, index) => {
            append({ title: module.title, description: module.description });
          });
        }
      }, 1); // Set a timeout to delay the execution
    }
  }, [singleCourse]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();

      if (!isFreeMaterialsCategory(selectedCategory)) {
        if (
          (imageFilesBackground?.length === 0 || !imageFilesBackground) &&
          (imageUrlsBackground?.length === 0 || !imageUrlsBackground)
        ) {
          toast.error("Por favor, selecione uma imagem de background.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          setLoading(false);
          return;
        }
      }

      if (
        (imageFiles?.length === 0 || !imageFiles) &&
        (imageUrls?.length === 0 || !imageUrls)
      ) {
        toast.error("Por favor, selecione uma imagem para o curso.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setLoading(false);
        return; // Interrompe o envio do formulário
      }

      (imageUrls || []).forEach((url) => formData.append("imageUrls", url));
      (imageFiles || []).forEach((file) => formData.append("imageCard", file));

      imageUrlsBackground.forEach((url) =>
        formData.append("imageUrlsBackground", url)
      );
      imageFilesBackground.forEach((file) =>
        formData.append("imageBackground", file)
      );

      imageFilesHomeCard.forEach((file) => formData.append("imageHome", file));
      imageUrlsHomeCard.forEach((urls) =>
        formData.append("imageUrlsHomeCard", urls)
      );
      formData.append("infoCard", data.infoCard || "");
      formData.append("catId", data.catId || "");
      formData.append("id", id || "");
      formData.append("valorAvista", data.valorAvista || "");

      formData.append("valorAntAvista", data.valorAntAvista || "");
      formData.append("valorAtualCartao", data.valorAtualCartao || "");
      formData.append("valorAntCartao", data.valorAntCartao || "");

      formData.append("numParcela", data.numParcela || "");

      formData.append("discount", data.discount || "");

      formData.append("linkCurso", data.linkCurso || "");
      formData.append("subCurso", data.subCurso || "");
      formData.append("DescCurso", data.DescCurso || "");
      formData.append("linkCursoAvista", data.linkCursoAvista || "");
      formData.append("linkCursoGratuito", data.linkCursoGratuito || "");

      if (selectedIdInfoCourse) {
        formData.append("infoId", selectedIdInfoCourse);
      } else {
        formData.append("infoId", data.infoId || "");
      }

  

        if (selectedTeacherOptions.length > 0) {
          selectedTeacherOptions.forEach((teacher) => {
            formData.append("teachers", teacher.id);
          });
        }

        if (teacherIds.length > 0) {
          teacherIds.forEach((teacher) => {
            if (!selectedTeacherOptions.some(option => option.id === teacher.id)) {
              formData.append("teachers", teacher.id);
            }
          });
        }

        if (coordIds.length === 0 && selectedCoordOptions.length > 0) {
          selectedCoordOptions.forEach((coord) => {
            formData.append("coordinators", coord.id);
          });
        } else if (coordIds.length > 0) {
          coordIds.forEach((coord) => {
            if (!selectedCoordOptions.some(option => option.id === coord.id)) {
              formData.append("coordinators", coord.id);
            }
          });
        }

      titleFields.forEach((field, index) => {
        formData.append(`title`, field);
      });

      descriptionFields.forEach((field, index) => {
        formData.append(`description`, field);
      });

      const res = await fetch("/api/admin/update-course", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        ref?.current?.reset();

        setImageUrls([]);
        setImageFiles([]);
        setImageFilesBackground([]);
        setImageUrlsBackground([]);
        setImageFilesHomeCard([]);
        setImageUrlsHomeCard([]);

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

        router.push(
          `/admin/courses/update-course/${id}?${new Date().getTime()}`
        );
      } else {
        const errorData = await res.json();
        console.log("Something went wrong in else block");
      }
      setImageFiles([]);
      setImageFilesBackground([]);
      setImageFilesHomeCard([]);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  const addField = () => {
    append({ title: "", description: "" });
    setTitleFields((prev) => [...prev, ""]); 
    setDescriptionFields((prev) => [...prev, ""]);
  };

  useEffect(() => {
    setTitleFields(fields.map((field) => field.title || ""));
    setDescriptionFields(fields.map((field) => field.description || ""));
  }, [fields]);

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

  const handleSelectTeacherChange = (e) => {
    const selectedId = e.target.value;
    if (
      selectedId &&
      !selectedTeacherOptions.some((option) => option.id === selectedId)
    ) {
      const selectedInfo = teachersData.find(
        (teacher) => teacher.id === selectedId
      );
      setSelectedTeacherOptions((prevOptions) => [
        ...prevOptions,
        selectedInfo,
      ]);
      setTeacherIds((prevIds) => [...prevIds, selectedInfo]);
      setCurrentOptionTeacher("");
    }
  };

  const handleRemoveOptionTeacher = (id) => {
    setSelectedTeacherOptions(
      selectedTeacherOptions.filter((option) => option.id !== id)
    );
    setTeacherIds(teacherIds.filter((option) => option.id !== id));
  };

  const handleRemoveOptionCoordinator = (id) => {
    setSelectedCoordOptions(
      selectedCoordOptions.filter((option) => option.id !== id)
    );
    setCoordIds(coordIds.filter((option) => option.id !== id));
  };

  const handleImageChange = (e, type) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    if (type === "imageCard") {
      setImageFiles(files);
      setImagePreviews(imageUrls);
      setImageUrls(Array(files.length).fill(""));
    } else if (type === "imageBackground") {
      setImageFilesBackground(files);
      setImagePreviewsBackground(imageUrls);
      setImageUrlsBackground(Array(files.length).fill(""));
    } else if (type === "imageHome") {
      setImageFilesHomeCard((prev) => [...prev, ...files]);
      setImagePreviewsHomeCard((prev) => [...prev, ...imageUrls]);
      setImageFilesHomeCard((prev) => [
        ...prev,
        ...Array(files.length).fill(""),
      ]);
    }
  };

  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    const category = categoriesData.find(
      (cat) => cat.id === selectedCategoryId
    );
    const categoryName = category ? category.id : "";
    setSelectedCategory(categoryName);
    setIsEbook(isEbookCategory(categoryName));
    setIsFreeMaterial(isFreeMaterialsCategory(categoryName));
  };

  const handleInfoCourseChange = (e) => {
    const selectedInfoCourseId = e.target.value;
    setSelectedIdInfoCourse(selectedInfoCourseId);
    const infoCourse = infoCourseData.find(
      (info) => info.id === selectedInfoCourseId
    );
    const infoName = infoCourse ? infoCourse.name : "";
    setSelectedInfoCourse(infoName);
  };

  const handleRemoveImage = () => {
    setImageFiles(null);
    setImagePreviews(null);
    setImageUrls(null);
  };

  const handleRemoveImageBackground = () => {
    setImageFilesBackground(null);
    setImagePreviewsBackground(null);
    setImageUrlsBackground(null);
  };

  const removeImageCard = (indexToRemove) => {
    setImageFilesHomeCard((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
    setImagePreviewsHomeCard((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
    setImageUrlsHomeCard((prevUrls) =>
      prevUrls.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleTitleChange = (index, value) => {
    /*const newFields = [...titleFields];
    newFields[index] = value;
    setTitleFields(newFields); */

    setTitleFields((prev) => {
      const updatedTitles = [...prev];
      updatedTitles[index] = value;
      return updatedTitles;
    });
  };

  const handleDescriptionChange = (index, value) => {
    /*const newFields = [...descriptionFields];
    newFields[index] = value;
    setDescriptionFields(newFields); */
    setDescriptionFields((prev) => {
      const updatedDescriptions = [...prev];
      updatedDescriptions[index] = value;
      return updatedDescriptions;
    });
  };

  const getCategoryByName = (categoryId) => {
    const category = categoriesData.find((cat) => cat.id === categoryId);
    return category ? category.NomeCat.toLowerCase().replace(/\s+/g, "") : null;
  };

  // Função para verificar se é uma categoria de materiais gratuitos
  const isFreeMaterialsCategory = (categoryId) => {
    const categoryName = getCategoryByName(categoryId);
    return categoryName === "materiaisgratuitos";
  };

  // Função para verificar se é uma categoria de e-books
  const isEbookCategory = (categoryId) => {
    const categoryName = getCategoryByName(categoryId);

    return categoryName === "livros/e-books";
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
            Atualizar Curso
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
              onChange={(e) => handleImageChange(e, "imageCard")}
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
              {imagePreviews?.map((preview, index) => (
                <div
                  key={index}
                  style={{ display: "inline-block", margin: "10px" }}
                >
                  <img
                    src={preview}
                    alt=""
                    style={{ width: "100px", height: "auto" }}
                  />
                  <button type="button" onClick={handleRemoveImage}>
                    Remover
                  </button>
                </div>
              ))}
            </div>
          </div>

          {!isFreeMaterial && (
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
                  onChange={(e) => handleImageChange(e, "imageBackground")}
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
                  {imagePreviewsBackground?.map((preview, index) => (
                    <div
                      key={index}
                      style={{ display: "inline-block", margin: "10px" }}
                    >
                      <img
                        src={preview}
                        alt=""
                        style={{ width: "100px", height: "auto" }}
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImageBackground}
                      >
                        Remover
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
                  onChange={(e) => handleImageChange(e, "imageHome")}
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
                    {imagePreviewsHomeCard?.map((preview, index) => (
                      <div key={index} className="relative mt-2">
                        <img
                          src={preview}
                          alt=""
                          className="w-full h-20 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImageCard(index)}
                        >
                          Remover
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

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

          <div className="mb-4 w-full">
            <label
              htmlFor="subCurso"
              className="block text-sm font-medium text-gray-600"
            >
              {isEbook ? "Subtítulo do E-book" : "Subtítulo do Curso"}
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
              {isEbook ? "Descrição do E-book" : "Descrição do Curso"}
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

          {!isFreeMaterial && (
            <>
              {/* adicionar informações gerais do curso  */}
              <div className="mb-4 w-full">
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
                  className="mt-1 p-2 text-gray-600 w-full border rounded-md"
                  onChange={handleInfoCourseChange}
                >
                  <option value="">Selecione uma opção</option>
                  {infoCourseData.map((info, index) => (
                    <option key={`${info.id}-${index}`} value={info.id}>
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
                    value={titleFields[index] || ''} 
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
                    value={descriptionFields[index] || ''}
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
                  {...register("valorAvista", { required: false })}
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
                  {...register("valorAntAvista", { required: false })}
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
                  {...register("valorAtualCartao", { required: false })}
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
                  {...register("valorAntCartao", { required: false })}
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

          {!isFreeMaterial && !isEbook && (
            <>
              {/* adicionar professores do cursos */}
              <div className="mb-4 w-full">
                <label
                  htmlFor="teacherId"
                  className="block text-sm font-medium text-gray-600"
                >
                  Professores do curso
                </label>
                <select
                  id="teacherId"
                  name="teacherId"
                  value={currentOptionTeacher}
                  onChange={handleSelectTeacherChange}
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
                  {selectedTeacherOptions.map((option) => (
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
                        onClick={() => handleRemoveOptionCoordinator(option.id)}
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

          {isEbook && (
            <>
             
              {/* adicionar professores do cursos */}
              <div className="mb-4 w-full">
                <label
                  htmlFor="teacherId"
                  className="block text-sm font-medium text-gray-600"
                >
                  Autor do livro
                </label>
                <select
                  id="teacherId"
                  name="teacherId"
                  value={currentOptionTeacher}
                  onChange={handleSelectTeacherChange}
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
                  {selectedTeacherOptions.map((option) => (
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

              <div className="mb-4 w-full">
                <label
                  htmlFor="linkCurso"
                  className="block text-sm font-medium text-gray-600"
                >
                  Link do E-book (cartão)
                </label>
                <textarea
                  id="linkCurso"
                  name="linkCurso"
                  {...register("linkCurso", { required: false })}
                  rows="4"
                  className="mt-1 p-2 text-gray-600 w-full border rounded-md"
                  placeholder="Insira o link do ebook"
                ></textarea>
              </div>

              <div className="mb-4 w-full">
                <label
                  htmlFor="linkCursoAvista"
                  className="block text-sm font-medium text-gray-600"
                >
                  Link do E-book (boleto ou parcelado)
                </label>
                <textarea
                  id="linkCursoAvista"
                  name="linkCursoAvista"
                  {...register("linkCursoAvista", { required: false })}
                  rows="4"
                  className="mt-1 p-2 text-gray-600 w-full border rounded-md"
                  placeholder="Insira o link do ebook"
                ></textarea>
              </div>
            </>
          )}

          {isFreeMaterial === true && (
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
              loading === true ? "Atualizando Curso..." : "Atualizar Curso"
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

export default UpdateCourseForm;
