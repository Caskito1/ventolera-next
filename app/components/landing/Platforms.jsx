"use client";

export const Platforms = () => {
  return (
    <div className="mt-10 text-center flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8">
      <h4 className="text-lg font-semibold ">Otras plataformas:</h4>
      <div className="flex justify-center gap-8 ">
        <a
          href="https://www.youtube.com/@LaVentoleraCandombe"
          className="transition-transform duration-300 hover:scale-110"
          target="_blank"
        >
          <img
            src="/media/icons/youtube.webp"
            alt="YouTube"
            className="w-10 h-10"
          />
        </a>
        <a
          href="https://laventoleracandombe.bandcamp.com/"
          className="transition-transform duration-300 hover:scale-110"
          target="_blank"
        >
          <img
            src="/media/icons/bandcamp.webp"
            alt="Bandcamp"
            className="w-10 h-10"
          />
        </a>
      </div>
    </div>
  );
};

export default Platforms;
