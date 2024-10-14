"use client";

import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FiSearch } from 'react-icons/fi'; // Importando o ícone de pesquisa do react-icons

const SearchMobile = () => {

    const searchParams = useSearchParams();

    const pathName = usePathname(); // path of current url

    const { replace } = useRouter();

    const handleSearch = (query) => {
    
        const params = new URLSearchParams(searchParams);

        if (query) {
            params.set('query', query);
        } else {
            params.delete('query');
        }

        replace(`${pathName}?${params.toString()}`) //http://localhost:3000/blogs?query=science

    }


    return (
        <div className="flex items-center bg-white rounded-md border border-gray-300 w-[190px]"> {/* Ajuste o width conforme necessário */}
        <input
          id="search"
          type="text"
          className="block w-full py-2 px-3 text-black placeholder-gray-500 border-none rounded-l-md focus:ring-0"
          placeholder="Pesquise o Curso"
          onChange={(e) => handleSearch(e.target.value)}
        />
        <FiSearch className="text-black ml-2 mr-2" size={20} /> {/* Ícone de pesquisa */}
      </div>

    )
}

export default SearchMobile