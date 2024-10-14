"use client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { Icons } from "react-toastify";

const BlogsPage = ({ blog }) => {
  const formattedDate = format(blog.createdAt, "EEEE, dd 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  });
  return (
    <div className="flex justify-center items-center px-16 py-12 bg-white max-md:px-5">
      <div className="flex flex-col max-w-full w-[1070px]">
        <div className="text-4xl font-extrabold leading-10 text-neutral-950 max-md:max-w-full">
          {blog.title}
        </div>
        <div className="flex gap-5 mt-9 text-base text-zinc-800 max-md:flex-wrap max-md:max-w-full">
          <div className="flex-auto">{formattedDate}</div>
          {/* <div className="flex-auto">Leitura: 03</div> */}
        </div>
        <div className="mt-5 max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col justify-center">
            <div className="flex flex-col w-[74%] max-md:ml-0 max-md:w-full">
              <div className="flex flex-col grow max-md:mt-8 max-md:max-w-full">
                <img
                  src={`${blog.imageUrl}`}
                  alt={`Image ${blog.imageUrl}`}
                  layout="fill"
                  objectFit="cover"
                  className="w-[80%] h-[80%] object-cover mx-auto max-md:w-full max-md:h-auto" 
                />
                <div className="mt-16 text-lg text-zinc-800 max-md:mt-10 max-md:max-w-full">
                  {blog.description}
                </div>
                <div className="flex items-start self-start mt-5 max-md:flex-wrap">
                  <a
                    href="https://www.facebook.com/people/Masterjus-Prev/pfbid0jRpPWtHH2METn455QhgG5AdBpU2wvWCS5kEFkXb4oE44Rbx1X6W9QMCscJRgdn5bl/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      loading="lazy"
                      src="/icons/icons-facebook.png"
                      className="shrink-0 aspect-[0.98] w-[52px]"
                    />
                  </a>
                  <a
                    href="https://www.instagram.com/masterjus_prev/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      loading="lazy"
                      src="/icons/icons-instagram.png"
                      className="shrink-0 aspect-[0.98] w-[52px]"
                    />
                  </a>
                  <a
                    href="https://wa.me/11954665200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      loading="lazy"
                      src="/icons/icons-whatsapp.gif"
                      className="shrink-0 aspect-[0.98] w-[52px]"
                    />
                  </a>
                 
                  <div className="flex flex-col self-stretch justify-center pl-2">
                  
                    <div className=" text-xl font-medium text-zinc-800">
                      Autor: {blog.autorBlog}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogsPage;
