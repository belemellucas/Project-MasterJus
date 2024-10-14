"use client";
import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import CourseItem from "../courseItem/CourseItem";
import Spinner from "../spinner/Spinner";
import Link from "next/link";

const Course = ({ groupedCards }) => {
  const [swiperReady, setSwiperReady] = useState(false);
  const swiperRef = useRef(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => setSwiperReady(true), 500); // Increased delay for better initialization
    return () => clearTimeout(timeoutId);
  }, []);


  return (
    <div className="px-4 md:px-16 pb-6 mt-14 mx-auto bg-zinc-100">
      <div className="flex">
        <div className="flex flex-col justify-start items-center md:items-start w-full max-md:px-5 max-md:mt-10">
          {Object.entries(groupedCards).map(
            ([categoryName, cardsInCategory]) => {
              if (
                cardsInCategory.length > 0 &&
                categoryName !== "MATERIAIS GRATUITOS" &&
                categoryName !== "LIVROS/E-BOOKS"
              ) {
                const categorySlug = cardsInCategory[0].categoria.NomeCat;
                return (
                  <div
                    key={categoryName}
                    className="w-full mb-6 flex flex-col items-center sm:flex-row sm:flex-col sm:items-start"
                  >
                    <div className="flex w-full items-center justify-between">
                      <div className="relative w-full mt-4 max-w-[278.2px] h-[50px] bg-[#F1F1F1] whitespace-nowrap max-md:whitespace-normal">
                        <div className="absolute w-full max-w-[272.2px] h-[50px] left-0 top-0 bg-[#200140] rounded-[7px] flex items-center justify-center">
                          <span
                            className="w-full max-w-[230.58px] h-[42px] font-poppins font-bold text-[20px] md:text-[24px] leading-[30px] md:leading-[36px] text-center text-white flex items-center"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            {categoryName}
                          </span>
                        </div>
                      </div>

                      <Link
                        href={`/category/${categorySlug}?show=true`}
                        className="text-black font-poppins text-xs md:text-sm ml-2 mr-2 bg-blue-800 py-1 px-2 md:py-2 md:px-4 rounded transition-transform duration-200 hover:scale-105 whitespace-nowrap"
                      >
                        <div className="text-xs md:text-sm text-white">Ver mais</div>
                      </Link>
                    </div>

                    {swiperReady ? (
                      <div className="relative w-full">
                        <Swiper
                          ref={swiperRef}
                          navigation
                          pagination={{ clickable: true }}
                          autoplay={true}
                          loop={true}
                          modules={[Autoplay, Navigation, Pagination]}
                          slidesPerView={1} // Show 1 slide per view on mobile by default
                          spaceBetween={10}
                          breakpoints={{
                            640: {
                              slidesPerView: 1, // Still 1 slide per view on small screens
                              spaceBetween: 10,
                            },
                            768: {
                              slidesPerView: 2, // 2 slides per view on tablets
                              spaceBetween: 10,
                            },
                            1024: {
                              slidesPerView: 3, // 3 slides per view on desktops
                              spaceBetween: 10,
                            },
                            1280: {
                              slidesPerView: 4, // 4 slides per view on larger screens
                              spaceBetween: 10,
                            },
                          }}
                        >
                          {cardsInCategory.map((card) => (
                            <SwiperSlide key={card.id} className="w-full">
                              <CourseItem card={card} />
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      </div>
                    ) : (
                      <Spinner />
                    )}
                  </div>
                );
              }
            }
          )}
        </div>
      </div>
    </div>
  );
};

export default Course;
