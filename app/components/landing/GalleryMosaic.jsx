'use client';
import Image from 'next/image';
import { useState } from 'react';

export const GalleryMosaic = ({ images }) => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % images.length);
  const prev = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);

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
      <div className="md:hidden relative w-full h-64 overflow-hidden">
        <Image
          src={images[current]}
          alt={`Imagen ${current + 1}`}
          fill
          className="object-cover rounded-lg transition-all duration-500"
        />
        <button
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white px-2 py-1 rounded-full"
        >
          ‹
        </button>
        <button
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white px-2 py-1 rounded-full"
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default GalleryMosaic;
