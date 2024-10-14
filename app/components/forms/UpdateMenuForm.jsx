"use client";
import Button from "@/app/ui/Button";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";
import { usePathname } from "next/navigation";

const UpdateMenuForm = ({ singleMenuSite, categories }) => {
  const ref = useRef();
  const router = useRouter();
  const pathname = usePathname();

  const id = pathname.split("/").pop();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  const [selectedCategory, setSelectedCategory] = useState("");

  const watchedTypeMenu = useWatch({ control, name: "typeMenu" });

  const onSubmit = async (event) => {
    try {
      event.id = id;
      const res = await fetch("/api/admin/update-menu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
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
        await fetch("/api/admin/all-menu");
        router.push(`/admin/menu?${new Date().getTime()}`);
      } else {
        const errorData = await res.json();
        console.log("Something went wrong in else block");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    const category = categories.find((cat) => cat.id === selectedCategoryId);
    const categoryName = category ? category.NomeCat : "";
    setSelectedCategory(categoryName);
  };

  useEffect(() => {
    if (singleMenuSite) {
      setValue("nameItem", singleMenuSite.name);
      setValue("typeMenu", singleMenuSite.type);
      setValue("catId", singleMenuSite.catId);
      setValue("rotaMenu", singleMenuSite.rota);
      setValue("isExternalLink", singleMenuSite.isExternalLink);

    }
  }, [singleMenuSite, setValue]);

  return (
    <div className="flex-grow md:ml-64">
      <div className="flex flex-col justify-center items-center mt-16">
        <form
          ref={ref}
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-md mx-auto p-8 bg-white rounded shadow-md flex flex-col items-center"
        >
          <h2 className="text-2xl text-green-500 font-semibold mb-6 flex justify-center">
            Atualizar item do menu
          </h2>

          <div className="mb-4">
            <label
              htmlFor="nameItem"
              className="block text-sm font-medium text-gray-600"
            >
              Nome do item
            </label>
            <input
              id="nameItem"
              name="nameItem"
              type="text"
              {...register("nameItem", { required: true })}
              className="mt-1 p-2 text-gray-600 w-full border rounded-md"
              placeholder="Insira o nome do menu"
            />
            {errors.nameItem && (
              <p className="text-red-500 text-sm mt-1">
                Este campo é obrigatório
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="typeMenu"
              className="block text-sm font-medium text-gray-600"
            >
              Tipo do menu
            </label>
            <select
              id="typeMenu"
              name="typeMenu"
              {...register("typeMenu", { required: true })}
              className="mt-1 p-2 text-gray-600 w-56 border rounded-md"
            >
              <option value="">Selecione um tipo</option>
              <option value="page">Página</option>
              <option value="submenu">Submenu</option>
              <option value="category">Categoria</option>
            </select>
            {errors.typeMenu && (
              <p className="text-red-500 text-sm mt-1">
                Este campo é obrigatório
              </p>
            )}
          </div>

          {watchedTypeMenu === "category" && (
            <div className="mb-4">
              <label
                htmlFor="catId"
                className="block text-sm font-medium text-gray-600"
              >
                Categoria
              </label>
              <select
                id="catId"
                name="catId"
                {...register("catId", {
                  required: watchedTypeMenu === "category",
                })}
                className="mt-1 p-2 text-gray-600 w-full border rounded-md"
                onChange={handleCategoryChange}
                //value={selectedCategory || singleMenuSite?.category?.id || ""}
              >
                <option value="">Selecione uma categoria</option>
                {categories && categories.length > 0 ? (
                  <>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.NomeCat}
                      </option>
                    ))}
                  </>
                ) : (
                  <option disabled>Nenhuma categoria disponível</option>
                )}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">
                  Este campo é obrigatório
                </p>
              )}
            </div>
          )}

          {watchedTypeMenu !== "submenu" && watchedTypeMenu !== "category" && (
            <div className="mb-4">
              <label
                htmlFor="rotaMenu"
                className="block text-sm font-medium text-gray-600"
              >
                Rota do menu
              </label>
              <input
                id="rotaMenu"
                name="rotaMenu"
                type="text"
                {...register("rotaMenu", {
                  required:
                    watchedTypeMenu !== "submenu" &&
                    watchedTypeMenu !== "category",
                })}
                className="mt-1 p-2 text-gray-600 w-full border rounded-md"
                placeholder="Insira a rota do menu"
              />
              {errors.rotaMenu && (
                <p className="text-red-500 text-sm mt-1">
                  Este campo é obrigatório
                </p>
              )}
            </div>
          )}

          <div className="flex items-center mb-4">
            <input
              id="isExternalLink"
              name="isExternalLink"
              type="checkbox"
              {...register("isExternalLink")}
              className="mr-2"
            />
            <label
              htmlFor="isExternalLink"
              className="text-sm font-medium text-gray-600"
            >
              Link Externo
            </label>
          </div>

          <div className="flex justify-center">
            <Button label={"Atualizar Item"} color={"green"} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateMenuForm;
