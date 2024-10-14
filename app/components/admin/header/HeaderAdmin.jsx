"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation"; 

const HeaderAdmin = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const subMenuRef = useRef(null); 
  const buttonRef = useRef(null);
  const router = useRouter();
  const handleMenu = (event) => {
    event.stopPropagation();
    setIsMenuOpen((prev) => !prev);
  }

  const handleClickOutside = (event) => {
    if (
      subMenuRef.current &&
      !subMenuRef.current.contains(event.target) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target)
    ) {
      setIsMenuOpen(false); 
    }
  }

  useEffect(() => {
    document.addEventListener("click", handleClickOutside); 
    return () => {
      document.removeEventListener("click", handleClickOutside); 
    };
  }, []);

  const handleLogout = async () => {
    await signOut({ redirect: false });
   // router.push('/'); 
    window.location.reload(); 
    //router.push('/'); 
  }

  return (
    <header className="fixed top-0 left-0 w-full flex justify-between items-center px-6 py-3 bg-gray-700 z-50">
      <div className="flex items-center pl-8">
        <Image
          src="/logo/logo-master.png" 
          alt="Logo"
          width={120} 
          height={40}
        />
      </div>
      {/* User Section */}
      <div className="flex gap-4">
        {/* User Image */}
        <div className="relative">
          <Image
            src="/icones/user-masterjus.svg" 
            alt="User"
            width={32}
            height={32}
            className="rounded-full cursor-pointer"
          />
        </div>

        {/* Tool Icon */}
        <div className="relative">
          <button
            onClick={handleMenu}
            className="text-white focus:outline-none"
            ref={buttonRef}
          >
            <Image
              src="/icones/settings.svg" // Substitua pelo caminho da imagem de configurações
              alt="Settings"
              width={32}
              height={32}
              className="rounded-full cursor-pointer"
            />
          </button>

          {/* Submenu */}
          {isMenuOpen && (
            <div ref={subMenuRef} className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 shadow-lg rounded-lg z-10">
              <ul className="py-1">
                <li>
                  <Link
                    href="/alterar-senha"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
                  >
                    Alterar Senha
                  </Link>
                </li>
                <li>
                  <Link
                    href="/alterar-email"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
                  >
                    Alterar Email
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
                  >
                    Adicionar Imagem
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
                  >
                    Painel
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-200 w-full text-left"
                  >
                    Deslogar
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderAdmin;
