 export const Releases = () => {
    return (
      <section id="lanzamientos" className="flex justify-center items-center w-full bg-white py-16 text-center">
        <div className="max-w-4xl w-11/12 flex flex-col items-center">
          <h2 className="text-3xl font-bold">SIMPLES MORTALES</h2>
          <iframe
            className="w-full max-w-xl h-[20rem] mt-6 rounded-lg"
            src="https://www.youtube.com/embed/LqA4x7qMqYs?si=sDRFdShXg6VPDj1R"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
          <p className="mt-6 text-gray-700 ">
            Breve descripción de Simples Mortales. Lorem Ipsum is simply dummy text of the printing and
            typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
          </p>
          <a
            href="https://www.youtube.com/@LaVentoleraCandombe"
            className="mt-6 flex items-center text-black hover:text-gray-700 transition"
          >
            <img src="/media/icons/youtube-negro.webp" alt="YouTube Logo" className="w-12 mr-4 transition-transform hover:scale-110" />
            <h3 className="text-lg font-semibold">SEGUINOS EN YOUTUBE</h3>
          </a>
        </div>
      </section>
    );
  };
  
  export default Releases;
  