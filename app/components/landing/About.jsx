
  // components/QuienesSomos.jsx

'use client';
import { useState } from 'react';
import Link from 'next/link';


const cards = [
  {
    title: 'La Banda',
    description: 'Una comunidad musical con historia y pasión.',
    href: '/banda',
    image: '/media/navbar/bg-contacto.webp',
  },
  {
    title: 'Cooperativa',
    description: 'Un modelo de trabajo colectivo y autogestivo.',
    href: '/cooperativa',
    image: '/media/navbar/bg-cooperativa.webp',
  },
  {
    title: 'Talleres / Escuela',
    description: 'Espacios de formación y creación artística.',
    href: '/talleres',
    image: '/media/navbar/bg-escuchanos.webp',
  },
];



export const About = () => {
  
  const [activeIndex, setActiveIndex] = useState(null);

  const handleClick = (index) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id='quienes-somos' className="py-16 px-4 text-center bg-white">
      <h2 className="text-4xl font-bold mb-12">Quiénes Somos</h2>
      <div className="max-w-[1600px] mx-auto flex h-[400px] overflow-hidden rounded-xl">
        {cards.map((card, index) => {
          const isActive = activeIndex === index;
          const isInactive = activeIndex !== null && !isActive;

          const flexClass = isActive
            ? 'flex-[8]'
            : isInactive
            ? 'flex-[1]'
            : 'flex-1';

          return (
            <div
              key={index}
              onClick={() => handleClick(index)}
              className={`relative transition-all duration-500 ease-in-out cursor-pointer overflow-hidden group ${flexClass}`}
            >
              {/* Fondo con imagen y capas */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-500"
                style={{ backgroundImage: `url(${card.image})` }}
              />
              <div className="absolute inset-0 bg-gray-900/80" />
              <div className="absolute inset-0 bg-[url('/media/patterns/noise.webp')] opacity-30 mix-blend-overlay pointer-events-none" />

              {/* Contenido */}
              <div className="relative z-10 flex items-center justify-center h-full text-white px-4 transition-all duration-500">
                {isActive ? (
                  <div className="text-center">
                    <h3 className="text-2xl font-semibold mb-2">{card.title}</h3>
                    <p className="mb-4">{card.description}</p>
                    <Link
                      href={card.href}
                      className="inline-block text-sm font-bold text-white border border-white px-4 py-2 rounded hover:bg-white hover:text-black transition"
                    >
                      Ver más
                    </Link>
                  </div>
                ) : (
                  <h3
                    className={`text-xl font-bold transition-transform duration-500 ${
                      isInactive ? 'rotate-[-90deg]' : 'rotate-0'
                    }`}
                  >
                    {card.title}
                  </h3>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

  export default About;

