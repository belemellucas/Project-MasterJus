"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function Footer() {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const res = await fetch("/api/admin/all-category", {
          method: "GET",
        });
        
        if (!res.ok) {
          throw new Error("Failed to fetch menu items");
        }

        const data = await res.json();
        setMenuItems(data.data); 
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }

    
  }
  fetchMenuItems();
  }, [])
  return (
    <div className="bg-blue-800 text-white overflow-hidden">
      <div className="text-center px-16 py-3.5 text-2xl font-medium leading-7 bg-gray-800 max-md:px-5">
        Transforme sua carreira previdenciária com a Masterjus!
      </div>

      <div className="flex flex-col md:flex-row w-full">
        <div className="flex flex-col items-center md:w-1/2 max-w-7xl pt-8 mx-auto">
          {" "}
          {/* Definindo w-1/2 aqui */}
          <div className="flex flex-col items-center justify-between lg:justify-around gap-3 w-full max-w-full">
            <Image
              loading="lazy"
              src="/logo/logo-master.png"
              alt="Logo"
              width={200}
              height={50}
            />
            <div className="flex gap-2 mt-4 items-center flex-col">
              <Link href="https://wa.me/11954665200">
                <Image
                  loading="lazy"
                  src="/icones/iconewhatsapp.svg"
                  alt="localizacao"
                  width={34}
                  height={34}
                />
              </Link>
              <div className="text-xl font-semibold text-white">
                (11) 95466-5200
              </div>
              <div className="flex flex-col items-center gap-2 text-center text-white">
                <div className="text-base font-semibold">
                  SIGA A GENTE NAS <br /> REDES SOCIAIS
                </div>
                <div className="flex gap-x-4">
                  <Link href="https://www.facebook.com/profile.php?id=100090001441335">
                    <Image
                      loading="lazy"
                      src="/icones/icone-novo-facebook.svg"
                      alt="icone-facebook"
                      width={24}
                      height={24}
                    />
                  </Link>
                  <Link href="https://www.instagram.com/masterjus_prev/">
                    <Image
                      loading="lazy"
                      src="/icones/icone-novo-instagram.svg"
                      alt="icone-instagram"
                      width={24}
                      height={24}
                    />
                  </Link>
                  <Link href="https://www.youtube.com/@profpriscilamachado/">
                    <Image
                      loading="lazy"
                      src="/icones/icone-novo-youtube.svg"
                      alt="icone-youtube"
                      width={24}
                      height={24}
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6 bg-blue-800 text-white justify-around text-neutral-600 flex-col p-10 md:w-1/2">
          {" "}
          {/* Definindo w-1/2 aqui */}
          <div className="flex justify-around">
             <div className="flex flex-col">
              <div className="text-base font-semibold">Nossos Cursos</div>
              {menuItems
            .map(option => {
              const href = `/category/${encodeURIComponent(option.NomeCat)}`;
              return (
                <Link key={option.id} href={href} passHref>
                  <div className="mt-5 text-sm hover:underline cursor-pointer">
                    {option.NomeCat}
                  </div>
                </Link>
              );
            })}
            </div> 
            <div className="flex flex-col">
              <div className="text-base font-semibold">Acesso Rápido</div>
              <Link href="https://portal.masterjus.online/">
              <div className="mt-5 text-sm">PORTAL DO ALUNO</div>
              </Link>
            </div>
            <div className="flex flex-col">
              <div className="text-base font-semibold">Suporte</div>
              <div className="mt-5 text-sm hover:underline cursor-pointer">
                <Link href="/talk-to-us">
                Contato
                </Link>
                </div>
            </div>
          </div>
         
        </div>
      </div>

      <div className="flex justify-center items-center px-16 py-10 w-full bg-blue-600 text-sm font-light text-center max-md:px-5">
        <div className="flex flex-wrap items-center gap-3 text-white">
          <div>Copyright © 2024</div>
          <div>•</div>
          <div>MasterJus editora e inteligência educacional LTDA</div>
          <div>•</div>
          <div>CNPJ 41.708.941/0001-61</div>
          <div>•</div>
          <div>Todos os direitos reservados</div>
          <div>•</div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
