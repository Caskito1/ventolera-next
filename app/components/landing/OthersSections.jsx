'use client'
import { useState, useEffect, useRef  } from "react"
import { motion, AnimatePresence , useInView } from "framer-motion";

export const OthersSections = () => {
  const [active, setActive] = useState('escuela')
  const [isMobile, setIsMobile] = useState(false)
const sliderRef = useRef(null);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!isMobile || !sliderRef.current) return;

    const slider = sliderRef.current;

    const handleScroll = () => {
      const scrollLeft = slider.scrollLeft;
      const cardWidth = slider.offsetWidth;
      const currentIndex = Math.round(scrollLeft / cardWidth);
      const currentId = data[currentIndex]?.id;
      if (currentId && currentId !== active) {
        setActive(currentId);
      }
    };

    slider.addEventListener("scroll", handleScroll, { passive: true });
    return () => slider.removeEventListener("scroll", handleScroll);
  }, [isMobile, active]);

  const data = [
    {
      id: 'escuela',
      title: 'Escuela',
      shortText: 'Talleres, formación y cultura viva.',
      text: 'Nuestra escuela ofrece talleres de candombe, formación musical y espacios de aprendizaje colectivo para todas las edades. Promovemos la transmisión cultural desde la práctica y la experiencia.',
      cta: {
        label: 'Ver más',
        url: '/escuela',
      },
      img: '/media/gallery/vento.jpg'
    },
    {
      id: 'cooperativa',
      title: 'Cooperativa de viviendas',
      shortText: 'Convenio con FUCVAM, comunidad y valores cooperativos.',
      text: 'Somos parte de una red de trabajo cooperativo. Gracias a un convenio con FUCVAM, realizamos presentaciones en diferentes cooperativas de viviendas, fortaleciendo los valores cooperativos y llevando nuestra propuesta cultural directamente a los hogares.',
      cta: {
        label: 'Ver más',
        url: 'https://www.youtube.com/watch?v=TTj1TMhaeRU&t=15s',
      },
      img: '/media/otras/coope11.webp'
    }
  ]

  return (
    <section id="cooperativa" className="relative min-h-screen flex items-center justify-center text-white px-4 py-16">
      {/* Fondo */}
      <div className="absolute inset-0 -z-10">
        <div
          className="w-full h-full bg-fixed bg-center bg-cover"
          style={{ backgroundImage: "url('/media/bg-modales/coope-modal.webp')" }}
        />
        <div className="absolute inset-0 bg-gray-900/80" />
        <div className="absolute inset-0 bg-[url('/media/patterns/noise.webp')] opacity-30 mix-blend-overlay pointer-events-none" />
      </div>

      <div className="max-w-6xl w-full space-y-8">
        {/* Título y descripción general */}
        <div>
          <h2 className="text-4xl font-bold">Cooperativa</h2>
          <p className="mt-4 max-w-2xl text-lg text-white/90">
            Somos parte de una red de trabajo cooperativo. Realizamos actividades culturales y talleres a través de nuestra escuela y convenios con FUCVAM.
          </p>
        </div>

        {/* Mobile: slider */}
        {isMobile ? (
          <div>
            {/* Slider contenedor */}
            <div ref={sliderRef} className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scroll-smooth">
              {data.map((item, idx) => (
                <div
                  key={item.id}
                  className="min-w-full snap-center bg-white/10 backdrop-blur-sm p-6 rounded-xl"
                >
                  <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-white/90 mb-4">{item.text}</p>
                  <img src={item.img} alt={item.title} className="rounded-xl mb-4 w-full object-cover shadow-lg" />
                  <a
                    href={item.cta.url}
                    target="_blank"
                    className="inline-block bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition"
                  >
                    {item.cta.label}
                  </a>
                </div>
              ))}
            </div>
   {/* Puntitos */}
          <div className="flex justify-center gap-2 mt-2">
            {data.map((item) => (
              <div
                key={item.id}
                className={`w-2 h-2 rounded-full transition ${
                  active === item.id ? "bg-white" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
        ) : (
         // Desktop: tabs
<div className="flex flex-col gap-6 ">
 {/* Tabs */} 
<div className="flex w-full gap-6">
  {data.map((item, idx) => (
    <motion.div
      key={item.id}
      onClick={() => setActive(item.id)}
      initial={{ opacity: 0, x: item.id === 1 ? -100 : 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: idx * 0.1 }}
      className={`flex-1 cursor-pointer p-6 text-left transition border-b-4 rounded-xl ${
        active === item.id
          ? 'bg-white text-black border-white'
          : 'bg-white/10 text-white/80 border-transparent hover:bg-white/20'
      }`}
    >
      <h3 className="text-xl font-bold">{item.title}</h3>
      <p className="text-sm mt-1">{item.shortText}</p>
    </motion.div>
  ))}
</div>

  {/* Card activa */}
  
  {data.map(
    (item) =>
      item.id === active && (
         <motion.div
           key={item.id}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex w-full bg-white/10 p-6 rounded-xl backdrop-blur-sm gap-6"
        >
          {/* Texto */}
          <div className="w-1/2">
            <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
            <p className="mb-4">{item.text}</p>
            <a
              href={item.cta.url}
              target="_blank"
              className="inline-block bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition"
            >
              {item.cta.label}
            </a>
          </div>
          {/* Imagen */}
          <div className="w-1/2">
            <img
              src={item.img}
              alt={item.title}
              className="rounded-xl w-full h-[300px] object-cover shadow-lg"
            />
          </div>
        </motion.div>
      )
  )}

</div>
        )}
      </div>
    </section>
  )
}

export default OthersSections
