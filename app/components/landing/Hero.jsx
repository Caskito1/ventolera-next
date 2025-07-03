export const Hero = () => {
  return (
    <section className="relative flex items-center justify-center w-full h-screen">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src="/media/background-video.mp4" type="video/mp4" />
        Tu navegador no soporta este video
      </video>
      <div className="absolute inset-0 bg-gray-900/50" />
        <div className="absolute inset-0 bg-[url('/media/patterns/noise.webp')] opacity-10 mix-blend-overlay pointer-events-none" />
      <div className="absolute flex flex-col items-center text-center text-white z-20">
        <img
          src="/media/LogoVentolera.png"
          alt="Logo"
          className="max-w-[600px] w-4/5 mb-5"
        />
      </div>
    </section>
  );
};

export default Hero;
