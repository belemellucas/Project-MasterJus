"use client";
import Image from "next/image";
import React, { useState } from "react";
import Card from "../course/Course";
import Search from "../Search";
import Link from "next/link";
import MenuItems from "../menuItems/MenuItems";
import HamburgerMenu from "../HamburgerMenu";

function Header({ categoriesData, menuItems }) {
  const [showSearch, setShowSearch] = useState(false);
  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  return (
    <>
      <div className="w-full overflow-hidden bg-[#0402a7] hidden md:flex md:pr-12 md:pl-12 justify-evenly fixed top-0 left-0 right-0 z-50">
        <div className="flex justify-center items-center px-16 py-3 w-full text-base text-white max-md:px-5">
          <div className="flex gap-5 justify-between max-w-full w-full">
            <div className="flex gap-5 my-auto whitespace-nowrap leading-[100%]">
              <div>
                <Link href="https://www.facebook.com/profile.php?id=100090001441335">
                  <Image
                    loading="lazy"
                    src="/icones/icone-facebook.svg"
                    alt="Icon 1"
                    width={19}
                    height={19}
                  />
                </Link>
              </div>
              <div>
                <Link href="https://www.instagram.com/masterjus_prev/">
                  <Image
                    loading="lazy"
                    src="/icones/icone-instagram.svg"
                    alt="Icon 2"
                    width={19}
                    height={19}
                  />
                </Link>
              </div>
              <div>
                <Link href="https://www.youtube.com/@profpriscilamachado/">
                  <Image
                    loading="lazy"
                    src="/icones/icone-youtube.svg"
                    alt="Icon 3"
                    width={19}
                    height={19}
                  />
                </Link>
              </div>
            </div>
            <div className="flex gap-5 items-center text-right leading-[150%]">
              {showSearch && <Search />}
              <Image
                loading="lazy"
                src="/icones/Icon2.svg"
                alt="Icon 3"
                width={19}
                height={19}
                onClick={toggleSearch}
                className="cursor-pointer"
              />
              <div className="flex gap-3 items-center">
                <Link href="https://portal.masterjus.online/">
                  <Image
                    loading="lazy"
                    src="/icones/Icon.svg"
                    alt="Icon 3"
                    width={22}
                    height={22}
                  />
                </Link>
                <Link href="https://portal.masterjus.online/">
                <div className="font-poppins">PORTAL DO ALUNO</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <header className="flex justify-between items-center fixed md:top-12 left-0 right-0 px-4 md:px-16 py-3 bg-white z-40">
        <div className="flex items-center md:hidden">
          <Image
            src="/logo/logo-master.png"
            alt="Logo"
            width={120}
            height={40}
          />
        </div>

        {/* Menu completo para telas grandes */}
        <div className="hidden md:flex flex-grow justify-evenly items-center">
          <MenuItems categoriesData={categoriesData} menuItems={menuItems} />
        </div>

        {/* Menu hamburger para telas pequenas */}
        <div className="flex md:hidden items-center">
          <HamburgerMenu categoriesData={categoriesData} />
        </div>
      </header>
    </>
  );
}

export default Header;
