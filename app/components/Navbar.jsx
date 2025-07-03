"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import logo from "@/public/media/LogoVentolera.png";
import bgDefault from "@/public/media/navbar/bg-default.webp";
import bgQuienesSomos from "@/public/media/navbar/quienes-somos.webp";
import bgCooperativa from "@/public/media/navbar/cooperativa.webp";
import bgEscuchanos from "@/public/media/navbar/bg-cooperativa.webp";
import bgContacto from "@/public/media/navbar/bg-escuchanos.webp";

const menuItems = [
  { label: "Quienes somos", bg: bgQuienesSomos },
  { label: "Cooperativa", bg: bgCooperativa },
  { label: "Escuchanos", bg: bgEscuchanos },
  { label: "Contacto", bg: bgContacto },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const backgroundImage = hoveredItem?.bg || bgDefault;

  return (
    <>
      {/* Header */}
<header
  className={`fixed top-0 left-0 w-full transition-all duration-300 px-4 py-3 flex items-center justify-between ${
    isScrolled ? "bg-black" : "bg-transparent"
  } ${menuOpen ? "opacity-0 pointer-events-none" : "z-50 opacity-100"}`}
>
  
  <Image
    src={logo}
    alt="Logo"
    width={120} 
    height={120}
    className={`transition-all duration-500 ${
      isScrolled ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-12"
    }`}
  />
  <button
    onClick={() => setMenuOpen(true)}
    className={` cursor-pointer z-50 transition-all duration-500 transform ${
      isScrolled ? "translate-y-0" : "translate-y-1"
    }`}
  >
    <div className="w-6 h-0.5 bg-white mb-1"></div>
    <div className="w-6 h-0.5 bg-white mb-1"></div>
    <div className="w-6 h-0.5 bg-white"></div>
  </button>
</header>


      {/* Menú lateral */}
      <div
         className={`fixed inset-0 z-40 fixed inset-0 z-60 transform transition-transform duration-900 ease-in-out ${
    menuOpen ? "translate-x-0" : "-translate-x-full"
  }`}
      >
{/* Fondo gris oscuro debajo de todo */}

<div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />


        {/* Imagen de fondo */}
        


<div className="absolute inset-0 overflow-hidden">
  {[bgDefault, ...menuItems.map(item => item.bg)].map((bg, index) => (
    <Image
      key={index}
      src={bg}
      alt={`Fondo ${index}`}
      fill
      className={`object-cover absolute inset-0 transition-all duration-1000 ease-in-out transform ${
        bg === backgroundImage
          ? "opacity-100 scale-110 translate-x-0 blur-0"
          : "opacity-0 scale-100 -translate-x-0 blur-sm"
      }`}
    />
  ))}
</div>

        {/* Capa oscura */}
       <div className="absolute inset-0 bg-gray-900/80" />
      <div className="absolute inset-0 bg-[url('@/public/media/patterns/noise.webp')] opacity-30 mix-blend-overlay pointer-events-none" />


        {/* Contenido del menú */}
        <div className="relative z-50 h-full flex flex-col justify-center pl-10 text-white space-y-6">
          {menuItems.map((item) => (
            <div
              key={item.label}
              onMouseEnter={() => setHoveredItem(item)}
              onMouseLeave={() => setHoveredItem(null)}
              className="text-3xl font-light tracking-widest hover:tracking-[0.4em] transition-all duration-500 cursor-pointer"
            >
              {item.label}
            </div>
          ))}

          {/* Botón cerrar */}
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-4 right-6  text-white text-4xl cursor-pointer"
          >
            ×
          </button>
        </div>
      </div>
    </>
  );
};