import Image from "next/image";
import Link from "next/link";
import React from "react";

const BlogPost = ({ blogs }) => {
  const { id, imageUrl, title, description, createdAt } = blogs;

  // Formatar a data para o formato desejado
  const formattedDate = new Date(createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    
    <div className="flex flex-col md:max-w-[307px] max-w-full">
    <div className="flex flex-col justify-center text-2xl font-bold leading-8 text-center text-white whitespace-nowrap bg-zinc-100 relative"></div>
    <div className="flex flex-col mt-4 px-6 py-7 w-full bg-white rounded-2xl border border-solid border-zinc-100 max-md:px-5 h-[618px]">
      <Link href={`/blogs/${id}`}>
        {imageUrl ? (
          <div className="relative w-full h-[260px] mb-4 rounded-md overflow-hidden">
            <Image
              src={`${imageUrl}`}
              alt={`Image ${imageUrl}`}
              layout="fill"
              objectFit="cover"
              className="w-full h-full"
            />
          </div>
        ) : null}
      </Link>
      <h2 className="text-lg font-bold text-center text-gray-900 overflow-hidden line-clamp-3">
        {title}
      </h2>
      <p className="mt-2 text-sm text-center text-neutral-600 overflow-hidden line-clamp-3">
        {description}
      </p>
      <time className="mt-4 text-xs text-center text-neutral-600">Publicado em {formattedDate}</time>
      <div className="flex justify-center mt-auto">
        <Link href={`/blogs/${id}`}>
          <button className="px-4 py-2 text-sm font-semibold text-white bg-blue-800 rounded-full w-40 cursor-pointer transform transition-transform duration-300 hover:scale-105">
            Leia mais...
          </button>
        </Link>
      </div>
    </div>
  </div>
  
  );
};

export default BlogPost;
