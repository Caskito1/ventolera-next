
 export const Hero = () => {
    return (
      <section className="relative flex items-center justify-center w-full h-screen">
        <video
          src="/media/background-video.mp4"
          muted
          loop
          autoPlay
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-[-1] "
        ></video>
   <div className="absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-70 z-10"></div>
        <div className="absolute flex flex-col items-center text-center text-white z-20">
          <img src="/media/LogoVentolera.png" alt="Logo" className="max-w-[600px] w-4/5 mb-5" />
        </div>
      </section>
    );
  }
  


export default Hero;