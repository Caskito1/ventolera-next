"use client";

export const Platforms = () => {
  return (
    <div className="mt-10 text-center flex justify-center items-center">
      <h4 className="text-lg font-semibold mr-4">Otras plataformas:</h4>
      <div className="flex justify-center gap-8 ">
        <a
          href="#"
          className="transition-transform duration-300 hover:scale-110"
        >
          <img
            src="/media/icons/youtube.webp"
            alt="YouTube"
            className="w-10 h-10"
          />
        </a>
        <a
          href="#"
          className="transition-transform duration-300 hover:scale-110"
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
