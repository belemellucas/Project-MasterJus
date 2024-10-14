"use client";
import React, { useState } from "react";
import BlogPost from "../blogsItem/BlogItem";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

function Blogs({ searchParams, blogs }) {
  const [showAll, setShowAll] = useState();
  const handleShowMore = () => {
    setShowAll(true);
  };
  return (
    <>
      <div className="flex flex-col items-center px-5 mx-auto w-full text-center leading-[150%] text-neutral-950 pt-8 pb-10">
        <div className="self-stretch w-full text-4xl font-extrabold leading-10 md:mb-6">
          BLOGS
        </div>

        {blogs.length > 0 ? (
          <>
            {showAll == true ? (
              <>
                <div className="flex justify-center w-full px-4 lg:px-6">
                  <div className="grid grid-cols-1 w-full sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {blogs.map((post) => (
                      <div key={post.id} className="w-full max-w-sm mx-auto">
                        <BlogPost blogs={post} />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                {blogs.length <= 4 ? (
                  <>
                    <div className="flex justify-center w-full px-4 lg:px-6">
                      <div className="grid grid-cols-1 w-full sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {blogs.map((post, index) => (
                          <div
                            key={post.id}
                            className="w-full max-w-sm mx-auto"
                          >
                            <BlogPost blogs={post} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-full max-w-7xl">
                      <Swiper
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={true}
                        loop={true}
                        modules={[Autoplay, Navigation, Pagination]}
                        slidesPerView={1} // Mostrar 1 slide por vez em mobile por padrão
                        spaceBetween={10}
                        breakpoints={{
                          640: {
                            slidesPerView: 1, // 1 slide por vez em telas pequenas
                            spaceBetween: 10,
                          },
                          768: {
                            slidesPerView: 2, // 2 slides por vez em tablets
                            spaceBetween: 10,
                          },
                          1024: {
                            slidesPerView: 3, // 3 slides por vez em desktops
                            spaceBetween: 10,
                          },
                          1280: {
                            slidesPerView: 4, // 4 slides por vez em telas maiores
                            spaceBetween: 10,
                          },
                        }}
                      >
                        {blogs.map((post, index) => (
                          <SwiperSlide
                            key={post.id}
                            className="w-full max-w-sm mx-auto"
                          >
                            <BlogPost blogs={post} />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                  </>
                )}
              </>
            )}
          </>
        ) : (
          <p className="ml-12 mt-4">Nenhum blog encontrado.</p>
        )}

        {blogs.length >= 5 && (
          <button
            onClick={handleShowMore}
            className="justify-center px-6 py-3 mt-10 text-base font-bold rounded-3xl border-2 border-solid border-neutral-950"
          >
            TODOS OS BLOGS
          </button>
        )}
      </div>
    </>
  );
}

export default Blogs;
