"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const albums = [
  {
    src: "/media/albums/SePicaLaCantina.webp",
    alt: "Se Pica la Cantina",
    link: "https://open.spotify.com/intl-es/album/6Km0TYPUSTVzIjllyWcMba?si=16KJ439PSmSo8J-Ygxfc_A",
  },
  {
    src: "/media/albums/SimplesMortales.webp",
    alt: "Simples Mortales",
    link: "https://open.spotify.com/intl-es/album/369r9epbzChKt2axZ5NSuB?si=weGiKlhVRDqpxj9pjiHrxw",
  },
  {
    src: "/media/albums/EnganchadoCeleste.webp",
    alt: "Enganchado Celeste",
    link: "https://open.spotify.com/intl-es/album/2YhM6rdQZCUm4j2W0SSYCq?si=caD0g48OQke07tCyYjaiOQ",
  },
  {
    src: "/media/albums/Sabandija.webp",
    alt: "Sabandija",
    link: "https://open.spotify.com/intl-es/album/5yQrUigZPadsQ3n96m32Oz?si=GICDKt6ARpa2nq6D5s4aqw",
  },
  {
    src: "/media/albums/La Ventolera Candombe.webp",
    alt: "La Ventolera Candombe",
    link: "https://open.spotify.com/intl-es/album/1ki4ZcTVLvXOdgMEXNyBuv?si=T-TJaXAQR9uC_Q-AbD6Zng",
  },
];

export const Albums = () => {
  const [current, setCurrent] = useState(0);
  const sliderRef = useRef(null);
  const intervalRef = useRef(null);

  const goToSlide = (index) => {
    const slider = sliderRef.current;
    if (!slider) return;
    const width = slider.offsetWidth;
    slider.scrollTo({
      left: width * index,
      behavior: "smooth",
    });
  };

  // Detect scroll manual
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const handleScroll = () => {
      const scrollLeft = slider.scrollLeft;
      const width = slider.offsetWidth;
      const index = Math.round(scrollLeft / width);
      setCurrent(index);
    };

    slider.addEventListener("scroll", handleScroll, { passive: true });
    return () => slider.removeEventListener("scroll", handleScroll);
  }, []);

  // Autoplay mobile
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (!isMobile || albums.length <= 1) return;

    intervalRef.current = setInterval(() => {
      setCurrent((prev) => {
        const next = (prev + 1) % albums.length;
        goToSlide(next);
        return next;
      });
    }, 5000);

    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center mt-10">

      {/* Desktop Grid */}
      <div className="hidden md:grid grid-cols-2 md:grid-cols-3 gap-6">
        {albums.map((album, index) => (
          <a
            key={index}
            href={album.link}
            target="_blank"
            rel="noopener noreferrer"
            className="relative group overflow-hidden rounded-lg shadow-lg"
          >
            <img
              src={album.src}
              alt={album.alt}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-90 transition duration-300 flex items-center justify-center">
              <p className="text-white font-semibold text-center px-4">
                {album.alt}
              </p>
            </div>
          </a>
        ))}
      </div>

{/* Mobile Slider */}
<div className="md:hidden w-full max-w-[250px] ">
   <motion.div
    ref={sliderRef}
    className="flex snap-x snap-mandatory scroll-smooth overflow-x-auto"
    whileTap={{ cursor: "grabbing" }}
  >
    {albums.map((album, index) => (
      <motion.div
        key={index}
        className="min-w-full snap-center flex justify-center"
      >
        <a
          href={album.link}
          target="_blank"
          rel="noopener noreferrer"
          className="relative w-[250px] h-[250px] rounded-lg overflow-hidden shadow-lg"
        >
          <img
            src={album.src}
            alt={album.alt}
            className="w-full h-full object-cover"
          />
        </a>
      </motion.div>
    ))}
  </motion.div>

  {/* Dots */}
  <div className="flex justify-center mt-4 gap-2">
    {albums.map((_, index) => (
      <div
        key={index}
        className={`w-2 h-2 rounded-full transition-all ${
          index === current ? "bg-white scale-125" : "bg-white/30"
        }`}
      />
    ))}
  </div>
</div>

    </div>
  );
};

export default Albums;
