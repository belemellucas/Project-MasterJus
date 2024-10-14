"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import SearchMobile from "./SearchMobile";

const HamburgerMenu = ({ categoriesData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const [isCursosSubMenuOpen, setIsCursosSubMenuOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const toggleCursosSubMenu = () =>
    setIsCursosSubMenuOpen(!isCursosSubMenuOpen);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative">
      <button className="text-gray-700 focus:outline-none" onClick={toggleMenu}>
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start bg-black bg-opacity-50 transition-opacity duration-500 ease-in-out">
          <div
            ref={menuRef}
            className={`bg-black w-64 h-full p-5 transform transition-transform duration-500 ease-in-out ${
              isOpen ? "translate-x-0 scale-100" : "translate-x-full scale-95"
            }`}
          >
            <button
              className="text-white focus:outline-none"
              onClick={toggleMenu}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <ul className="flex flex-col mt-5 space-y-2">
              <li>
                <Link
                  href="/"
                  className="block px-4 py-2 text-white hover:bg-gray-800 transition-colors duration-200"
                >
                  HOME
                </Link>
              </li>
              <li>
                <button
                  onClick={toggleCursosSubMenu}
                  className={`block px-4 py-2 text-white w-full text-left transition-colors duration-200 ${
                    isCursosSubMenuOpen ? "bg-gray-800" : "hover:bg-gray-800"
                  }`}
                >
                  CURSOS
                </button>
                {isCursosSubMenuOpen && (
                  <ul className="flex flex-col space-y-1 pl-4 mt-2 bg-gray-900">
                    {Array.isArray(categoriesData) &&
                    categoriesData.length > 0 ? (
                      categoriesData.map((category, index) => (
                        <li key={index}>
                          <Link
                            href={
                              "/category/" +
                              encodeURIComponent(category.NomeCat)
                            }
                            className="block px-4 py-2 text-white"
                          >
                            {category.NomeCat}
                          </Link>
                        </li>
                      ))
                    ) : (
                      <></>
                    )}
                  </ul>
                )}
              </li>
              <li>
                <Link
                  href={"/category/" + encodeURIComponent("PREVEVOLUTION")}
                  className="block px-4 py-2 text-white hover:bg-gray-800 transition-colors duration-200"
                >
                  PREVEVOLUTION
                </Link>
              </li>
              <li>
                <Link
                  href={
                    "/category/" + encodeURIComponent("MATERIAIS GRATUITOS")
                  }
                  className="block px-4 py-2 text-white hover:bg-gray-800 transition-colors duration-200"
                >
                  MATERIAIS GRATUITOS
                </Link>
              </li>
              <li>
                <Link
                  href="/blogs"
                  className="block px-4 py-2 text-white hover:bg-gray-800 transition-colors duration-200"
                >
                  BLOG
                </Link>
              </li>
              <li>
                <Link
                  href={"/category/" + encodeURIComponent("LIVROS/E-BOOKS")}
                  className="block px-4 py-2 text-white hover:bg-gray-800 transition-colors duration-200"
                >
                  LIVROS/E-BOOKS
                </Link>
              </li>
              <li>
                <Link
                  href="/contact-us"
                  className="block px-4 py-2 text-white hover:bg-gray-800 transition-colors duration-200"
                >
                  FALE CONOSCO
                </Link>
              </li>
              <li>
                <Link
                  href="https://portal.masterjus.online/"
                  className="block px-4 py-2 text-white hover:bg-gray-800 transition-colors duration-200"
                >
                  PORTAL DO ALUNO
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/register"
                  className="block px-4 py-2 text-white hover:bg-gray-800 transition-colors duration-200"
                >
                  DEIXE SEU CADASTRO
                </Link>
              </li>
              <li className="mt-auto pl-3">
                <SearchMobile />
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;
