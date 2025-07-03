'use client'
import { useState } from "react";

export const OthersSections = () => {
  const [active, setActive] = useState('escuela')

  return (
    <section className="relative min-h-screen flex items-center justify-center text-white px-4 py-16">
      {/* Fondo con efecto parallax aislado */}
      <div className="absolute inset-0 -z-10">
        <div
          className="w-full h-full bg-fixed bg-center bg-cover"
          style={{ backgroundImage: "url('/media/bg-modales/coope-modal.webp')" }}
        />
        <div className="absolute inset-0 bg-gray-900/80" />
        <div className="absolute inset-0 bg-[url('/media/patterns/noise.webp')] opacity-30 mix-blend-overlay pointer-events-none" />
      </div>

      <div className="max-w-6xl w-full space-y-8">
        {/* Selector visual */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            onClick={() => setActive('escuela')}
            className={`cursor-pointer p-6 rounded-lg transition border-2 ${
              active === 'escuela'
                ? 'bg-white text-black border-white'
                : 'bg-white/10 border-white/30 hover:bg-white/20'
            }`}
          >
            <h3 className="text-2xl font-bold">Escuela</h3>
            <p className="text-sm mt-2">Talleres, formación y cultura viva.</p>
          </div>
          <div
            onClick={() => setActive('cooperativa')}
            className={`cursor-pointer p-6 rounded-lg transition border-2 ${
              active === 'cooperativa'
                ? 'bg-white text-black border-white'
                : 'bg-white/10 border-white/30 hover:bg-white/20'
            }`}
          >
            <h3 className="text-2xl font-bold">Cooperativa</h3>
            <p className="text-sm mt-2">Autogestión, comunidad y organización.</p>
          </div>
        </div>

        {/* Contenido dinámico */}
        <div className="bg-white/10 p-6 md:p-10 rounded-lg backdrop-blur-sm grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {active === 'escuela' && (
            <>
              <div>
                <h3 className="text-3xl font-bold mb-4">Escuela</h3>
                <p className="text-lg leading-relaxed mb-6">
                  Nuestra escuela ofrece talleres de candombe, formación musical y espacios de aprendizaje colectivo para todas las edades. Promovemos la transmisión cultural desde la práctica y la experiencia.
                </p>
                <a
                  href="/escuela"
                  className="inline-block bg-white text-black px-5 py-2 rounded hover:bg-gray-200 transition"
                  target="_blank"
                >
                  Ver más
                </a>
              </div>
              <div>
                <img
                  src="/media/gallery/vento.jpg"
                  alt="Escuela"
                  className="rounded-xl shadow-lg w-full object-cover"
                />
              </div>
            </>
          )}

          {active === 'cooperativa' && (
            <>
              <div>
                <h3 className="text-3xl font-bold mb-4">Cooperativa</h3>
                <p className="text-lg leading-relaxed mb-6">
                  La cooperativa es el corazón organizativo de La Ventolera. Funciona bajo principios de autogestión, economía solidaria y toma de decisiones colectiva, fortaleciendo el proyecto artístico y social.
                </p>
                <a
                  href="https://www.youtube.com/watch?v=TTj1TMhaeRU&t=15s"
                  className="inline-block bg-white text-black px-5 py-2 rounded hover:bg-gray-200 transition" 
                  target="_blank"
                >
                  Ver más
                </a>
              </div>
              <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg">
                <img
                  src="/media/otras/coope11.webp"
                  alt="Escuela"
                  className="rounded-xl shadow-lg w-full object-cover"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default OthersSections;
