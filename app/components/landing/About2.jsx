
'use client';


export const About2 = () => {
  


  return (

    <section id="quienes-somos" className="bg-white py-16 min-h-[100vh]  flex justify-center items-center">
      <div className="max-w-6xl mx-auto px-4 flex flex-col gap-12 items-center">
        {/* Imagen */}
        <div className="group relative overflow-hidden rounded-xl shadow-lg max-w-[600px]  ">
          <img
            src="/media/contacto.webp"
            alt="La Ventolera en acción"
            className="w-full h-auto object-cover rounded-xl transition duration-300 group-hover:brightness-90 transition-transform duration-300 hover:scale-105"
          />
        </div>
          {/* Texto */}
        <div className="text-center">
          <h2 className=" text-2xl sm:text-3xl font-bold text-gray-900 mb-4 uppercase">Quiénes somos</h2>
          <div className="text-sm  sm:text-[18px] text-gray-700 leading-relaxed">
            <p className="pb-4">La Ventolera es una orquesta marchante de candombe cuya sonoridad original expresa la música de una generación de artistas que lleva el candombe hacia un nuevo lugar, un nuevo sentir. Rescatando los orígenes del género, la banda propone una mirada fresca y actual de nuestra música más autóctona.</p>
            <p  className="pb-4">Trompetas, trombones, tubas, saxos y tambores se unen para hacer sonar un repertorio que abarca tanto composiciones propias como exquisitas versiones, sumergiendo al público en una experiencia sensorial única de disfrute.</p>
            <p  className="pb-4">Ya sea desfilando o sobre el escenario, con o sin amplificación, de día o de noche, con nuestro formato reducido de once músicos o con el formato completo de veinte: La Ventolera es todo sonido, energía y pasión.</p>
          </div>
        </div>
      </div>
       
    </section>
  );
}



  export default About2;

