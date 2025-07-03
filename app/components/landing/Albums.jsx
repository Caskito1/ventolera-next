
"use client";


const albums = [
  {
    src: "/media/albums/La Ventolera Candombe.webp",
    alt: "La Ventolera Candombe",
  },
  {
    src: "/media/albums/Sabandija.webp",
    alt: "Sabandija",
  },
  {
    src: "/media/albums/SimplesMortales.webp",
    alt: "Simples Mortales",
  },
  {
    src: "/media/albums/EnganchadoCeleste.webp",
    alt: "Enganchado Celeste",
  },
];

export const Albums = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
      {albums.map((album, index) => (
        <div
          key={index}
          className="relative group overflow-hidden rounded-lg shadow-lg cursor-pointer"
        >
          <img
            src={album.src}
            alt={album.alt}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-80 transition-opacity duration-300 flex items-center justify-center text-center p-4">
            <p className="text-white font-semibold">{album.alt}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Albums;
