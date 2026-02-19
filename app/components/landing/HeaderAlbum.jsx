import { useEffect, useState } from "react";
import AlbumPlayer from "./AlbumPlayer";
import youtubeIcon from '@/public/media/icons/youtube.webp';
import spotifyIcon from '@/public/media/icons/spotify.webp';
import Image from "next/image";


const items = [
 
 
  
  { href: 'https://open.spotify.com/intl-es/album/6Km0TYPUSTVzIjllyWcMba?si=16KJ439PSmSo8J-Ygxfc_A', icon: spotifyIcon, alt: 'Spotify' },
  { href: 'https://www.youtube.com/watch?v=JaFuA-M2Ngo&list=OLAK5uy_mnq1QigoEMaxs3tzMn22sCC8copbFitM8', icon: youtubeIcon, alt: 'YouTube' },
 
];


 const HeaderAlbum = ({ activePlayer, setActivePlayer }) => {
    const [offsetY, setOffsetY] = useState(0);

  const isPlaying = activePlayer === "album";

  const handleToggle = () => {
    if (isPlaying) {
      setActivePlayer(null);
    } else {
      setActivePlayer("album");
    }
  };


    // Parallax
useEffect(() => {
  const handleScroll = () => setOffsetY(window.scrollY);
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

   return (
   <section className="relative w-full min-h-screen overflow-hidden">


     {/* Background Wrapper (parallax) */}
<div
  className="absolute inset-0 will-change-transform"
  style={{ transform: `translateY(${offsetY * 0.7}px)` }}
>
  {/* Imagen que respira */}
  <img
    src="/media/header/bg-sepica.webp"
    alt="Background"
    className={`
      w-full h-[120%] object-cover
      transition-transform duration-[4000ms] ease-in-out
      ${isPlaying ? "animate-bg-breath" : ""}
    `}
  />
</div>


    {/* Glass base */}
<div className="absolute inset-0 backdrop-blur-md bg-black/75" />

{/* Violet subtle tint */}
<div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-purple-800/15 to-black/40" />
{isPlaying && (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">

    {/* 🟣 Foco violeta - movimiento curvo */}
    <div className="absolute inset-0 animate-spotlight-left">
      <div
        className="
          absolute top-[-40%] left-[20%]
          w-[8%] h-[240%]
          bg-gradient-to-b
          from-violet-400/60
          via-violet-500/35
          to-transparent
          blur-2xl
          mix-blend-screen
          rotate-12
          rounded-full
        "
      />
    </div>

    {/* 🟠 Foco naranja - movimiento curvo opuesto */}
    <div className="absolute inset-0 animate-spotlight-right">
      <div
        className="
          absolute top-[-40%] right-[20%]
          w-[8%] h-[240%]
          bg-gradient-to-b
          from-orange-400/60
          via-orange-500/35
          to-transparent
          blur-2xl
          mix-blend-screen
          -rotate-12
          rounded-full
        "
      />
    </div>

    {/* ✨ Glow ambiente dinámico más natural */}
    <div className="absolute inset-0 animate-glow-stage">
      <div
        className="
          w-full h-full
          bg-gradient-to-br
          from-transparent
          via-violet-500/30
          to-transparent
          blur-3xl
          mix-blend-screen
        "
      />
    </div>

  </div>
)}



      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 h-full flex items-center min-h-[100vh] ">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">

          {/* Col 1 – Cover */}
          <div className="flex justify-center lg:justify-start">
 <div className="relative flex justify-center lg:justify-start items-center">

  {/* Wrapper para controlar profundidad */}
  <div className="relative flex flex-col items-center">

    {/* Cover */}
<div className="relative z-10 w-[250px] md:w-[400px] lg:w-[520px] aspect-square rounded-2xl overflow-hidden shadow-2xl bounce-album group">

  <img
    src="/media/header/se-pica-cover.webp"
    alt="Se Pica La Cantina"
    className="w-full h-full object-cover"
  />

 

  {/* Play centrado */}
  <div className="absolute inset-0 flex items-center justify-center z-20">
 <AlbumPlayer 
  isPlaying={isPlaying} 
  onToggle={handleToggle} 
/>
  </div>

</div>


 {/* Shadow */}
<div
  className="absolute left-1/2 -translate-x-1/2 z-0 pointer-events-none"
  style={{
    bottom: "-40px",
    width: "85%",
    height: "20px",
  }}
>
  <div
    className="w-full h-full rounded-full opacity-70"
    style={{
    background:
        "radial-gradient(ellipse at center, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.2) 70%, rgba(0,0,0,0) 100%)",
    filter: "blur(2px)",
   
    }}
  />
</div>



  </div>
</div>





          
          </div>

          {/* Col 2 – Info */}
          <div className="text-white text-center lg:text-left">

            <span className="inline-block mb-4 px-4 py-1 text-xs sm:text-sm  tracking-widest uppercase bg-white/10 rounded-full backdrop-blur-md">
              Nuevo Lanzamiento
            </span>

            <h1 className="text-4xl md:text-6xl font-normal uppercase leading-[1]">
              Se Pica 
            </h1>
            <h1 className="text-4xl md:text-6xl font-black  uppercase leading-[1]">
             La Cantina
            </h1>
              <div className=" flex items-center justify-center md:justify-start  gap-6 py-6 w-full">
                <p className="">Escuchalo por: </p>
                     {items.map(({ href, icon, alt }) => (
                       <a key={alt} href={href} target="_blank" rel="noopener noreferrer">
                         <Image
                           src={icon}
                           alt={alt}
                           width={30}
                           height={30}
                           className="hover:scale-110 transition-transform"
                         />
                       </a>
                     ))}
            </div>
            <div className="flex justify-center items-center md:items-start md:justify-start">
            <img src="/media/LogoVentolera.png" alt="Logo ventolearr" width={150} />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default HeaderAlbum;