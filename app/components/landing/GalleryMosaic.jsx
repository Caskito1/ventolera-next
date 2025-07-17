'use client';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export const GalleryMosaic = ({ images }) => {
  const [current, setCurrent] = useState(0);
  const sliderRef = useRef(null);
  const intervalRef = useRef(null);

  const goToSlide = (index) => {
    const slider = sliderRef.current;
    if (!slider) return;
    const width = slider.offsetWidth;
    slider.scrollTo({
      left: width * index,
      behavior: 'smooth',
    });
  };

  // Detecta slide visible al hacer scroll manual
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const handleScroll = () => {
      const scrollLeft = slider.scrollLeft;
      const width = slider.offsetWidth;
      const index = Math.round(scrollLeft / width);
      setCurrent(index);
    };

    slider.addEventListener('scroll', handleScroll, { passive: true });
    return () => slider.removeEventListener('scroll', handleScroll);
  }, []);

  // Autoplay cada 2 segundos
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (!isMobile || images.length <= 1) return;

    intervalRef.current = setInterval(() => {
      setCurrent((prevIndex) => {
        const nextIndex = (prevIndex + 1) % images.length;
        goToSlide(nextIndex);
        return nextIndex;
      });
    }, 2000);

    return () => clearInterval(intervalRef.current);
  }, [images.length]);

  return (
    <div className="w-full py-8 px-4">
      {/* Desktop Grid */}
      <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[150px] md:auto-rows-[200px]">
        {images.map((src, index) => {
          let layout = 'col-span-1 row-span-1';
          if (index === 0 || index === 6) layout = 'col-span-2 row-span-2';
          else if (index === 4 || index === 5) layout = 'col-span-1 row-span-2';
          else if (index % 5 === 0) layout = 'col-span-2 row-span-1';

          return (
            <div
              key={index}
              className={`relative overflow-hidden rounded-lg ${layout}`}
            >
              <Image
                src={src}
                alt={`Imagen ${index + 1}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          );
        })}
      </div>

      {/* Mobile Slider */}
      <div className="md:hidden w-full">
        <motion.div
          ref={sliderRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-4 scroll-smooth pb-2"
          whileTap={{ cursor: 'grabbing' }}
        >
          {images.map((src, index) => (
            <motion.div
              key={index}
              className="min-w-full snap-center relative h-64 flex-shrink-0 rounded-lg overflow-hidden min-h-[400px]"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.1 }}
            >
              <Image
                src={src}
                alt={`Imagen ${index + 1}`}
                fill
                className="object-cover transition-all duration-500"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Puntitos indicadores */}
        <div className="flex justify-center mt-4 gap-2">
          {images.map((_, index) => (
            <motion.div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === current ? 'bg-black' : 'bg-black/30'
              }`}
              animate={{ scale: index === current ? 1.2 : 1 }}
              transition={{ duration: 0.2 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryMosaic;
