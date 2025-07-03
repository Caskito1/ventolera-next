import Albums from "./Albums";
import Platforms from "./Platforms";

export const Listen = () => {
  return (
    <section
      id="escuchanos"
      className="w-full text-white relative overflow-hidden min-h-[100dvh] flex items-center justify-center"
    >
      {/* Imagen fija en el fondo */}
      <div className="fixed inset-0 -z-500">
        <img
          src="/media/bg-modales/escuchanos-modal.webp"
          alt="Fondo Escuchanos"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gray-900/80" />
        <div className="absolute inset-0 bg-[url('/media/patterns/noise.webp')] opacity-30 mix-blend-overlay pointer-events-none" />
      </div>

      {/* Contenido */}
      <div className="relative z-10 px-4 max-w-6xl w-full text-center">
        <h2 className="text-3xl font-bold">ESCUCHANOS</h2>
        <h3 className="text-lg mt-2">Escuchá nuestros discos en Spotify</h3>

        <Albums />
        <Platforms />
      </div>
    </section>
  );
};

export default Listen;
