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

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/log-in");
  };

  if (!userData) return <p className="p-6">Cargando...</p>;

  return (
    <div className="flex p-6 gap-6">
          {/* Fondo */}
      <div className="absolute inset-0 -z-10">
        <div
          className="w-full h-full bg-fixed bg-center bg-cover"
          style={{ backgroundImage: "url('/media/bg-modales/coope-modal.webp')" }}
        />
        <div className="absolute inset-0 bg-gray-900/80" />
        <div className="absolute inset-0 bg-[url('/media/patterns/noise.webp')] opacity-30 mix-blend-overlay pointer-events-none" />
      </div>
      {/* Columna izquierda - Tabs */}
      <div className="w-64 backdrop-blur-md bg-white/20 text-white p-4 rounded-lg shadow flex flex-col h-[95vh]">
        <h2 className="text-xl font-bold mb-2">{userData.nombre}</h2>
        <p className="text-sm text-white-600 mb-4 ">{userData.rol}</p>

        <div className="flex flex-col gap-2 mb-4">
          <button
            className={`py-2 px-3 rounded ${selectedTab === "partituras" ? "bg-orange-500/80 hover:bg-orange-600/90 text-white font-semibold py-2 rounded-md w-full transition-all duration-200 backdrop-blur-sm shadow-md hover:shadow-lg" : "bg-white text-gray-700"}`}
            onClick={() => setSelectedTab("partituras")}
          >
            Partituras
          </button>
          {userData.rol === "admin" && (
            <button
              className={`py-2 px-3 rounded ${selectedTab === "administracion" ? "bg-orange-500/80 hover:bg-orange-600/90 text-white font-semibold py-2 rounded-md w-full transition-all duration-200 backdrop-blur-sm shadow-md hover:shadow-lg" : "bg-white text-gray-700"}`}
              onClick={() => setSelectedTab("administracion")}
            >
              Administración
            </button>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="mt-auto py-2 px-3 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Cerrar sesión
        </button>
      </div>

      {/* Columna derecha - Contenido */}
      <div className="flex-1 bg-white p-4 rounded-lg shadow">
        {selectedTab === "partituras" && (
          <PartiturasTab
            userData={userData}
            favorites={favorites}
            setFavorites={setFavorites}
          />
        )}
        {selectedTab === "administracion" && <AdministracionTab userData={userData} />}
      </div>
    </div>
  );
}
