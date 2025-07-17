// components/ui/HeaderPage.jsx

import Image from "next/image";

export default function HeaderPage({ title, subtitle, backgroundImage }) {
  return (
    <header className="relative h-[600px] w-full overflow-hidden">
      {/* Imagen de fondo */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt="Fondo de sección"
          fill
          className="object-cover object-center scale-110 transition-transform duration-1000 ease-in-out"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"

        />
      </div>

      {/* Capa oscura y ruido */}
      <div className="absolute inset-0 bg-gray-900/70 z-10" />
      <div className="absolute inset-0 bg-[url('/media/patterns/noise.webp')] opacity-30 mix-blend-overlay z-20 pointer-events-none" />

      {/* Contenido centrado */}
      <div className="relative z-30 h-full flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-white text-5xl md:text-6xl font-bold">{title}</h1>
        {subtitle && (
          <p className="text-white text-lg md:text-xl mt-4 max-w-3xl">{subtitle}</p>
        )}
      </div>
    </header>
  );
}
