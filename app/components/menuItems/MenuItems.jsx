"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

function MenuItems({ categoriesData, menuItems }) {
  const updatedMenuOptions = menuItems.map((option) => {
    console.log(option)
    if (option.type === "page") {
      if (option.isExternalLink) {
        return {
          ...option,
          href: option.rota,
        };
      }

      return {
        ...option,
        href: option.rota === "/" ? "/" : `/${option.rota}/`,
      };
    } else if (option.type === "category") {
      if (option.isExternalLink) {
        return {
          ...option,
          href: option.rota,
        };
      }
      return {
        ...option,
        href: `/category/${encodeURIComponent(option.category?.NomeCat)}`,
      };
    } else if (option.type === "submenu") {
     
      return {
        ...option,
        href: "",
      };
    }
    return option;
  });

  const categoriesInMenu = updatedMenuOptions
    .filter((option) => option.type === "category")
    .map((option) => option.category?.NomeCat);
    
  const filteredSubMenuOptions = Array.isArray(categoriesData)  
    ? categoriesData
        .filter((category) => 
          category.NomeCat !== "LIVROS/E-BOOKS" &&
          category.NomeCat !== "MATERIAIS GRATUITOS"
         )
        .map((category) => ({
          id: category.id,
          name: category.NomeCat,
          href: category.isExternalLink
          ? category?.linkExternal
          : "/category/" + encodeURIComponent(category.NomeCat),
        }))
    : []; 


  const [isCursosSubMenu, setIsCursosSubMenu] = useState(false);

  const subMenuRef = useRef(null);
  const buttonRef = useRef(null);

  const handleCursosClick = (event) => {
    event.stopPropagation();
    setIsCursosSubMenu((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (
      subMenuRef.current &&
      !subMenuRef.current.contains(event.target) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target)
    ) {
      setIsCursosSubMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex gap-5 justify-between items-start w-full max-w-[1160px] max-md:flex-wrap max-md:max-w-full items-center">
      <Link href="/">
        <Image
          loading="lazy"
          src="/logo/logo-master.png"
          alt="Logo"
          width={200}
          height={50}
        />
      </Link>
      <div className="flex flex-wrap max-w-[900px] text-sm font-semibold tracking-wider leading-5 uppercase text-neutral-700">
        <ul className="flex gap-x-4 gap-y-2 whitespace-nowrap">
          {updatedMenuOptions.map((option, index) => (
            <li
              key={index}
              className="relative flex-shrink-0 mr-4 hover:text-neutral-900"
            >
              {option.type === "submenu" ? (
                <>
                  <button
                    onClick={handleCursosClick}
                    ref={buttonRef}
                    className="flex items-center"
                  >
                    {option.name}
                  </button>
                  {isCursosSubMenu && (
                    <ul
                      ref={subMenuRef}
                      className="absolute top-full left-0 mt-2 bg-gray-200 border border-gray-300 shadow-lg rounded-lg w-48 z-10"
                    >
                      {filteredSubMenuOptions.map((subItem, subIndex) => (
                        <li key={subIndex} className="p-2 hover:bg-gray-300">
                          <Link href={subItem.href || "/"}>{subItem.name}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <Link href={option.href || "/"}>{option.name}</Link>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-4">
        <Link href="">
          <Image
            loading="lazy"
            src="/icones/carrinho.svg"
            alt="Icone Carrinho"
            width={24}
            height={24}
            className="w-6 h-8"
          />
        </Link>

        <Link href="https://portal.masterjus.online/">
          <Image
            loading="lazy"
            src="/icones/user.svg"
            alt="Icone Usuário"
            width={24}
            height={24}
            className="w-6 h-8"
          />
        </Link>
      </div>
    </div>
  );
}

export default MenuItems;
