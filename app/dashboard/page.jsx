"use client";

import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { useState } from "react";
import PartiturasTab from "./components/PartiturasTab";
import AdministracionTab from "./components/AdministracionTab";
import { useUserData } from "../hooks/useUserData";

export default function DashboardPage() {
  const router = useRouter();
  const { userData, favorites, setFavorites } = useUserData();

  const [selectedTab, setSelectedTab] = useState("partituras");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/ventoapp");
  };

  if (!userData) return <p className="p-6">Cargando...</p>;
  console.log(userData);
  
  return (
    <div className="min-h-screen  flex relative">
      {/* ================= FONDO FIJO ================= */}
      <div className="fixed inset-0 -z-10">
        <div
          className="w-full h-full bg-center bg-cover"
          style={{
            backgroundImage: "url('/media/bg-modales/coope-modal.webp')",
          }}
        />
        <div className="absolute inset-0 bg-gray-900/80" />
        <div className="absolute inset-0 bg-[url('/media/patterns/noise.webp')] opacity-30 mix-blend-overlay pointer-events-none" />
      </div>

      {/* ================= HEADER MOBILE ================= */}
   <header
  className="
    lg:hidden
    fixed top-0 left-0 right-0 z-30
    flex items-center justify-between px-4 h-14
    bg-black/40 backdrop-blur-lg
    text-white
    border-b border-white/10
  "
>
        <span className="font-black">VENTOAPP</span>
        <button onClick={() => setMenuOpen(true)} className="text-2xl">
          ☰
        </button>
      </header>

      {/* ================= OVERLAY MOBILE ================= */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

    
   {/* ================= SIDEBAR ================= */}
<aside
  className={`
    fixed z-30 top-0 left-0 h-screen w-64 p-4 shadow flex flex-col
    transform transition-transform duration-300
    ${menuOpen ? "translate-x-0" : "-translate-x-full"}
    lg:translate-x-0
    bg-white text-gray-900
    lg:bg-white/20 lg:text-white lg:backdrop-blur-md
  `}
>
  {/* BOTÓN CERRAR (solo mobile) */}
  <button
    onClick={() => setMenuOpen(false)}
    className="absolute top-5 right-4 lg:hidden"
  >
    <img
      src="/media/icons/close.webp"
      alt="Cerrar menú"
      height={16}
      width={16}
    />
  </button>

  <h2 className="text-xl font-bold mb-2">{userData.nombre}</h2>
  <p className="text-sm mb-4 uppercase">{userData.instrumento}</p>

  <div className="flex flex-col gap-2 mb-4">
    <button
      className={`py-2 px-3 rounded transition-all cursor-pointer ${
        selectedTab === "partituras"
          ? "bg-orange-500/80 text-white font-semibold shadow-md"
          : "bg-white text-gray-700"
      }`}
      onClick={() => {
        setSelectedTab("partituras");
        setMenuOpen(false);
      }}
    >
      Partituras
    </button>

    {userData.rol === "admin" && (
      <button
        className={`py-2 px-3 rounded transition-all cursor-pointer ${
          selectedTab === "administracion"
            ? "bg-orange-500/80 text-white font-semibold shadow-md"
            : "bg-white text-gray-700"
        }`}
        onClick={() => {
          setSelectedTab("administracion");
          setMenuOpen(false);
        }}
      >
        Administración
      </button>
    )}
  </div>

  <button
    onClick={handleLogout}
    className="mt-auto py-2 px-3 bg-red-500 text-white rounded hover:bg-red-600 transition"
  >
    Cerrar sesión
  </button>
</aside>



      {/* ================= CONTENIDO ================= */}
      <main
        className="
    pt-20 px-4
    lg:pt-6 lg:pl-80 lg:pr-6 w-full pb-6
  "
      >
       <div className="bg-white rounded-lg shadow flex-1 overflow-hidden">
  <div className="p-4 h-full overflow-y-auto">


          {selectedTab === "partituras" && (
            <PartiturasTab
              userData={userData}
              favorites={favorites}
              setFavorites={setFavorites}
            />
          )}

          {selectedTab === "administracion" && (
            <AdministracionTab userData={userData} />
          )}
        </div>
        </div>
      </main>
    </div>
  );
}
