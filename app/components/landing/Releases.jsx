'use client'
import { useState } from "react";

export const Releases = () => {
  const [showVideo, setShowVideo] = useState(false);

  const handlePlayClick = () => {
    console.log("Video clicked");
    setShowVideo(true);
  };

  return (
    <section
      id="audiovisuales"
      className="flex justify-center items-center w-full  bg-white py-16 text-center"
    >
      <div className="max-w-4xl w-11/12 flex flex-col items-center">
        
        <h2 className="text-2xl sm:text-3xl font-bold">
          AUDIOVISUALES
        </h2>

        <p className="sm:mt-6 text-gray-700">
          Mantenete al tanto de todos nuestros lanzamientos.
        </p>

        <div className="w-full max-w-3xl mt-6 rounded-xl overflow-hidden relative aspect-[16/9]">
          {showVideo ? (
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/st8f5fXpDnE?autoplay=1&rel=0"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            ></iframe>
          ) : (
            <button
              onClick={handlePlayClick}
              className="w-full h-full relative group"
              aria-label="Reproducir video"
            >
              <img
                src="/media/gallery/vento23.webp"
                alt="Miniatura del video"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center group-hover:bg-black/60 transition">
                <img
                  src="/media/icons/youtube.webp"
                  alt="Play"
                  className="w-16 h-16 transition-transform group-hover:scale-110"
                />
              </div>
            </button>
          )}
        </div>

        <a
          href="https://www.youtube.com/@LaVentoleraCandombe"
          className="mt-6 flex items-center text-black hover:text-gray-700 transition"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/media/icons/youtube-negro.webp"
            alt="YouTube Logo"
            className="w-12 mr-4 transition-transform hover:scale-110"
          />
          <h3 className="text-lg font-semibold">SEGUINOS EN YOUTUBE</h3>
        </a>

      </div>
    </section>
  );
};

export default Releases;
