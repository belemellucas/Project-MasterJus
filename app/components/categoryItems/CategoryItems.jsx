"use client";
import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import CourseItemFree from "../../components/courseItemFree/CourseItemFree";
import Spinner from "../../components/spinner/Spinner";
import CourseItem from "../courseItem/CourseItem";
import { useRouter } from "next/navigation";

const CategoryItems = ({ category, groupedCards, showParams }) => {
  const [swiperReady, setSwiperReady] = useState(false);
  const swiperRef = useRef(null);
  const [showAll, setShowAll] = useState(showParams);
  useEffect(() => {
    const timeoutId = setTimeout(() => setSwiperReady(true), 500);
    return () => clearTimeout(timeoutId);
  }, []);

  const normalizedCategory = decodeURIComponent(category).trim().toLowerCase();
  const cardsInCategory = groupedCards[normalizedCategory] || [];

  const handleShowMore = () => {
    setShowAll(true);
  };
  return (
    <div className="flex flex-col items-center px-5 mx-auto w-full text-center leading-[150%] text-neutral-950 pt-8 pb-10">
      <div className="self-stretch w-full text-4xl font-extrabold leading-10 mb-6">
        {category.toUpperCase()}
      </div>

      {cardsInCategory.length > 0 ? (
        <>
          {showAll == true ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {cardsInCategory.map((card) => (
                  <div key={card.id} className="w-full max-w-sm">
                    {card.categoria &&
                    card.categoria.NomeCat === "MATERIAIS GRATUITOS" ? (
                      <CourseItemFree card={card} />
                    ) : (
                      <CourseItem card={card} />
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              {swiperReady ? (
                <div className="flex justify-center w-full px-4 lg:px-6">
                  {cardsInCategory.length <= 4 ? (
                    // Grid layout for 4 or fewer items
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {cardsInCategory.map((card) => (
                        <div key={card.id} className="w-full max-w-sm mx-auto">
                          {card.categoria &&
                          card.categoria.NomeCat === "MATERIAIS GRATUITOS" ? (
                            <CourseItemFree card={card} />
                          ) : (
                            <CourseItem card={card} />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    // Swiper layout for more than 4 items
                    <div className="w-full max-w-7xl">
                      <Swiper
                        ref={swiperRef}
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={true}
                        loop={true}
                        modules={[Autoplay, Navigation, Pagination]}
                        slidesPerView={1} // Show 1 slide at a time on mobile by default
                        spaceBetween={25} // Further increased space between slides
                        breakpoints={{
                          640: {
                            slidesPerView: 1, // 1 slide at a time on small screens
                            spaceBetween: 25, // Increased space between slides
                          },
                          768: {
                            slidesPerView: 2, // 2 slides at a time on tablets
                            spaceBetween: 25, // Increased space between slides
                          },
                          1024: {
                            slidesPerView: 3, // 3 slides at a time on desktops
                            spaceBetween: 25, // Increased space between slides
                          },
                          1280: {
                            slidesPerView: 4, // 4 slides at a time on larger screens
                            spaceBetween: 25, // Increased space between slides
                          },
                        }}
                      >
                        {cardsInCategory.map((card) => (
                          <SwiperSlide
                            key={card.id}
                            className="w-full max-w-sm mx-auto"
                          >
                            {card.categoria &&
                            card.categoria.NomeCat === "MATERIAIS GRATUITOS" ? (
                              <CourseItemFree card={card} />
                            ) : (
                              <CourseItem card={card} />
                            )}
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                  )}
                </div>
              ) : (
                <Spinner />
              )}
            </>
          )}
        </>
      ) : (
        <p className="ml-12 mt-4">Nenhum item nesta categoria.</p>
      )}
      {cardsInCategory.length >= 5 && !showAll && (
        <button
          onClick={handleShowMore}
          className="justify-center px-6 py-3 mt-10 text-base font-bold rounded-3xl border-2 border-solid border-neutral-950"
        >
         
          {
                   category === "MATERIAIS GRATUITOS" ? (
                      <>TODOS OS CONTEÚDOS</>
                    ) : (
                     <> TODOS OS CURSOS</>
                    )}
        </button>
      )}
    </div>
  );
};

export default CategoryItems;
