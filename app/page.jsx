import { Footer } from "./components/Footer";
import { About } from "./components/landing/About";
import About2 from "./components/landing/About copy";

import { Gallery } from "./components/landing/Gallery";
import { Hero } from "./components/landing/Hero";
import { Listen } from "./components/landing/Listen";
import { OthersSections } from "./components/landing/OthersSections";
import { Releases } from "./components/landing/Releases";
import { Navbar } from "./components/Navbar";

export default function Home() {
  return (
    <div className="w-full">
      <Navbar />
      <Hero />
      {/* <About /> */}
      <About2 />
      <Listen />
      <Releases />
      <OthersSections />
      <Gallery />
      <Footer />
    </div>
  );
}
