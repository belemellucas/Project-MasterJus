"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Spinner from "../spinner/Spinner";

const SlideImages = ({ infoSite }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [images, setImages] = useState([]);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    updateIsDesktop();

    window.addEventListener("resize", updateIsDesktop);
    return () => window.removeEventListener("resize", updateIsDesktop);
  }, []);

  useEffect(() => {
    if (infoSite && infoSite[0]) {
      const selectedImages = isDesktop
        ? infoSite[0]?.imageAnex || []
        : infoSite[0]?.imageMob || [];

      const selectedLinks = isDesktop
        ? infoSite[0]?.courseLinksDesktop || []
        : infoSite[0]?.courseLinksMobile || [];

      setImages(selectedImages);
      setLinks(selectedLinks);
      setLoading(false);
    }
  }, [isDesktop, infoSite]);

  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => {
        const nextSlide = (prevSlide + 1) % images.length;
        return nextSlide;
      });
    }, 4000); // Change slides every 3 seconds

    return () => clearInterval(interval);
  }, [images]);

  useEffect(() => {
    if (images.length === 0 || links.length === 0) return;
  }, [currentSlide, links]);

  if (!infoSite || !infoSite[0]) {
    return <div>Loading...</div>;
  }
  const handlePrev = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? images.length - 1 : prevSlide - 1
    );
  };

  const handleNext = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === images.length - 1 ? 0 : prevSlide + 1
    );
  };

  return (
    <div className="relative w-full h-[300px] md:w-full md:h-[352px] overflow-hidden md:mt-6">
    <div className="absolute inset-0 transition-opacity duration-1000">
      {loading == true ? (
        <div className="h-[400px] flex items-center">
          <Spinner />
        </div>
      ) : (
        <>
          {images.map((imageUrl, imageIndex) => (
            <div
              key={imageIndex}
              className={`absolute inset-0 ${
                imageIndex === currentSlide ? "opacity-100" : "opacity-0"
              } transition-opacity duration-1000`}
            >
              <Link href={links[currentSlide] || "#"} passHref>
                <Image
                  src={`${imageUrl}`}
                  alt={`Image ${imageIndex}`}
                  layout="fill"
                  objectFit="cover"
                  className="w-full h-full"
                />
              </Link>
            </div>
          ))}
        </>
      )}
    </div>
    <button
      onClick={handlePrev}
      className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg"
    >
      &lt;
    </button>
    <button
      onClick={handleNext}
      className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg"
    >
      &gt;
    </button>
  </div>
  
  );
};

export default SlideImages;
