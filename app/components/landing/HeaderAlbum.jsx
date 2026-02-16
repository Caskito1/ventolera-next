import { useEffect, useState } from "react";
import AlbumPlayer from "./AlbumPlayer";
import youtubeIcon from '@/public/media/icons/youtube.webp';
import spotifyIcon from '@/public/media/icons/spotify.webp';
import Image from "next/image";


const items = [
 
 
  
  { href: 'https://open.spotify.com/intl-es/artist/5hgeze6GTe8ckpSfdx3A5l?si=Ek-UhQZATOekLZiRwOnMUw', icon: spotifyIcon, alt: 'Spotify' },
  { href: 'https://www.youtube.com/@LaVentoleraCandombe', icon: youtubeIcon, alt: 'YouTube' },
 
];


const HeaderAlbum = () => {
    const [offsetY, setOffsetY] = useState(0);


    // Parallax
useEffect(() => {
  const handleScroll = () => setOffsetY(window.scrollY);
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

   return (
   <section className="relative w-full min-h-screen overflow-hidden">


      {/* Background Image */}
     <img
  src="/media/header/bg-sepica.webp"
  alt="Background"
  className="absolute inset-0 w-full h-[120%] object-cover will-change-transform"
  style={{ transform: `translateY(${offsetY * 0.7}px)` }}
/>


    {/* Glass base */}
<div className="absolute inset-0 backdrop-blur-md bg-black/75" />

{/* Violet subtle tint */}
<div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-purple-800/15 to-black/40" />



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
    <AlbumPlayer />
  </div>

</div>


 {/* Shadow */}
<div
  className="absolute left-1/2 -translate-x-1/2 z-0 pointer-events-none"
  style={{
    bottom: "-60px",
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

            <h1 className="text-4xl md:text-6xl font-normal leading-tight uppercase">
              Se Pica 
            </h1>
            <h1 className="text-4xl md:text-6xl font-black leading-tight uppercase">
             La Cantina
            </h1>
              <div className=" flex items-center justify-center sm:justify-start  gap-6 py-6 w-full">
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

          </div>

        </div>

      </div>
    </section>
  );
}

export default HeaderAlbum;