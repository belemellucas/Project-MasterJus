"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const Search = () => {

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
        <div className="flex flex-1 w-[170px] h-[24px] flex-shrink-0">
    <label htmlFor="search" className="sr-only">
        Pesquisar
    </label>
    <input
        className="peer block mt-0 py-1.5 rounded-md text-gray-200 bg-[#0402A7] pl-4 text-xs placeholder:text-gray-400 border border-white"
        placeholder="Pesquise o Curso"
        onChange={(e) => {
            handleSearch(e.target.value);
        }}
    />
</div>

    )
}

export default Search