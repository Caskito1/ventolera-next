import { Footer } from "../components/Footer";

import { Navbar } from "../components/Navbar";
import HeaderPage from "../components/ui/HeaderPage";

import InfoSection from "../components/ui/InfoSection";

import bgEscuchanos from "@/public/media/navbar/cooperativa.webp";
const imagesInfoSection = [
  '/media/gallery/vento19.webp',
  '/media/gallery/vento11.webp',
  '/media/gallery/vento21.webp',  
 ]
export default function EscuelaPage() {
  return (
    <>
      <Navbar />
      <HeaderPage
        title="Nuestra Escuela"
        subtitle="Formación, comunidad y conocimiento"
        backgroundImage={bgEscuchanos}
      />
      <InfoSection
        imagesInfoSection={imagesInfoSection}
      />
      <Footer />
    </>
  );
}