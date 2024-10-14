import { useEffect, useState } from "react";
import ConfirmationModal from "../components/ConfirmationModal";
import { toast } from "react-toastify";
import FormData from "form-data";
import { useRef } from "react";

function TestimonyModal({ isOpen, onClose, user }) {
  const ref = useRef();
  const [testimony, setTestimony] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };
  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!testimony.trim()) {
      alert("Por favor, escreva um depoimento.");
      return;
    }

    if (!selectedImage) {
      alert("Por favor, selecione sua foto de perfil.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("userImg", selectedImage);
      formData.append("depoimento", testimony);
      formData.append("autorDepo", user.username);

      const res = await fetch("/api/add-depositions-user", {
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

        ref.current.reset();
        onClose();
      } else {
        const errorData = await res.json();
        console.log("Something went wrong in else block");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
          <h2 className="text-xl font-semibold mb-4">Escreva um depoimento</h2>
          {imagePreview ? (
            <div className="flex items-center justify-center mb-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-20 h-20 rounded-full"
              />
            </div>
          ) : user.imgUser && typeof user.imgUser === "string" ? (
            <div className="flex items-center justify-center mb-4">
              <img
                src={user.imgUser}
                alt="User"
                className="w-20 h-20 rounded-full"
              />
            </div>
          ) : null}

          <form
            ref={ref}
            onSubmit={handleSubmit}
            className="flex flex-col items-center"
          >
            <div className="mb-4">
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700 pb-2"
              >
                Carregar Imagem
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
            </div>
            <textarea
              rows="4"
              value={testimony}
              onChange={(e) => setTestimony(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
              placeholder="Escreva seu depoimento aqui..."
            ></textarea>
            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-blue-800 text-white rounded"
                type="submit"
              >
                Enviar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default TestimonyModal;
