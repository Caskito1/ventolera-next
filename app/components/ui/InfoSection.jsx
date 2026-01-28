export default function InfoSection({ imagesInfoSection }) {
  return (
    <section className="py-12 px-4 max-w-6xl mx-auto min-h-screen flex items-center">
      <div className="grid md:grid-cols-2 gap-8 items-center w-full">
        {/* Columna de imágenes */}
        <div className="flex flex-col gap-4 items-center">
          {imagesInfoSection.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Imagen ${i + 1}`}
              className="rounded shadow-md object-cover w-full max-w-xs h-80"
            />
          ))}
        </div>

        {/* Columna de texto */}
        <div className="space-y-4 text-gray-800 text-base leading-relaxed">
          <h2 className="text-2xl font-bold text-center md:text-left">
            Escuela de Música Popular La Ventolera
          </h2>
          <p>
            <strong>Aulas Ventoleras</strong> son espacios de aprendizaje
            músico–socio–culturales donde se comparten saberes en torno a la
            Música Popular Uruguaya, con énfasis en instrumentos de viento y
            percusión. Se parte del Candombe y los ritmos afroamericanos como
            eje central.
          </p>
          <p>
            <strong>Aula de Vientos:</strong> Trompeta, Trombón, Saxo Barítono,
            Tenor y Alto, Tuba, Ensamble, Armonía, Arreglos, Lectoescritura,
            Improvisación.
          </p>
          <p>
            <strong>Aula de Percusión:</strong> Chico, Repique, Piano, Campanas,
            Wiro, Shekere, Semillas, Pailas. Talleres de Candombe, Coordinación
            Corporal, Ritmos de América, entre otros.
          </p>
          <p>
            <strong>Aula de Candombe:</strong> Toques madre, historia,
            entrevistas, visitas guiadas, danza, personajes típicos y más.
          </p>
          <p>
            Además, la escuela podrá generar eventos abiertos como Coro,
            Talleres para niñes y Ventolera Masiva.
          </p>
          <p>
            En julio de 2025 comienzan los primeros dos cursos en{" "}
            <strong>Espacio La Peatonal</strong>:
          </p>
          <p>
            <strong>Ensamble de Vientos:</strong> dirigido a vientistas de nivel
            básico/intermedio con repertorio de música popular enfocada en
            ritmos de América. Dictado por el Prof. <strong>Leo Méndez</strong>,
            los viernes de 18 a 19:30 hs, durante 2 meses.
          </p>
          <p>
            <strong>Taller de Candombe:</strong> aprenderás los toques de chico,
            repique y piano en contextos de cuerda de calle y ensamble. Dictado
            por el Prof. <strong>Martín Gandoglia</strong>, los viernes de 18 a
            19:30 hs, durante 2 meses.
          </p>
        </div>
      </div>
    </section>
  );
}
