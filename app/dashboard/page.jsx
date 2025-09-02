"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/firebase";
import { doc, getDoc, setDoc, deleteDoc, collection, getDocs } from "firebase/firestore";

export default function DashboardPage() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [selectedTab, setSelectedTab] = useState("partituras");
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState([]); // array de pdf.id

  // Cargar usuario
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/log-in");
      } else {
        const ref = doc(db, "usuarios", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          console.log("Datos del usuario desde Firestore:", data);
          setUserData(data);

          // Cargar favoritos desde Firestore
          const favCol = collection(db, "usuarios", user.uid, "favoritos");
          const favSnap = await getDocs(favCol);
          setFavorites(favSnap.docs.map(doc => doc.id));
        } else {
          console.error("No existe el documento de usuario en Firestore");
        }
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Cargar PDFs según subroles
  useEffect(() => {
    if (!userData) return;

    async function fetchPDFs() {
      setLoading(true);
      try {
        const instrumentos = userData.subrol;
        let allFiles = [];

        for (let instrumento of instrumentos) {
          const res = await fetch(`/api/drivefiles?instrumento=${instrumento}`);
          const files = await res.json();
          if (!files.error) allFiles = allFiles.concat(files);
        }

        setPdfs(allFiles);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }

    fetchPDFs();
  }, [userData]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/log-in");
  };

  // Marcar/desmarcar favoritos y guardar en Firestore
  const toggleFavorite = async (pdfId, pdfName) => {
    if (!userData) return;

    const favRef = doc(db, "usuarios", auth.currentUser.uid, "favoritos", pdfId);

    if (favorites.includes(pdfId)) {
      await deleteDoc(favRef);
      setFavorites(prev => prev.filter(id => id !== pdfId));
    } else {
      await setDoc(favRef, { name: pdfName, addedAt: new Date() });
      setFavorites(prev => [...prev, pdfId]);
    }
  };

  if (!userData) return <p className="p-6">Cargando...</p>;

  // Filtrado según buscador y categoría
  const filteredPDFs = pdfs
    .filter(pdf => pdf.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(pdf => (showFavorites ? favorites.includes(pdf.id) : true));

  return (
    <div className="flex p-6 gap-6">
      {/* Columna izquierda */}
      <div className="w-64 bg-gray-100 p-4 rounded-lg shadow flex flex-col">
        <h2 className="text-xl font-bold mb-2">{userData.nombre}</h2>
        <p className="text-sm text-gray-600 mb-4">{userData.rol}</p>

        <div className="flex flex-col gap-2 mb-4">
          <button
            className={`py-2 px-3 rounded ${selectedTab === "partituras" ? "bg-blue-500 text-white" : "bg-white text-gray-700"}`}
            onClick={() => setSelectedTab("partituras")}
          >
            Partituras
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="mt-auto py-2 px-3 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Cerrar sesión
        </button>
      </div>

      {/* Columna derecha */}
      <div className="flex-1 bg-white p-4 rounded-lg shadow">
        {selectedTab === "partituras" && (
          <>
            <h2 className="text-2xl font-bold mb-4">Partituras</h2>

            {userData.rol === "admin" && (
              <div className="mb-6">
                <h3 className="text-xl mb-2">Subir archivo</h3>
                {/* UploadFile aquí */}
              </div>
            )}

            {/* Buscador */}
            <input
              type="text"
              placeholder="Buscar partituras..."
              className="border p-2 rounded w-full mb-4"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Botones Todas / Favoritas */}
            <div className="flex gap-2 mb-4">
              <button
                className={`py-1 px-3 rounded ${!showFavorites ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                onClick={() => setShowFavorites(false)}
              >
                Todas
              </button>
              <button
                className={`py-1 px-3 rounded ${showFavorites ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                onClick={() => setShowFavorites(true)}
              >
                Favoritas
              </button>
            </div>

            {loading ? (
              <p>Cargando PDFs...</p>
            ) : filteredPDFs.length === 0 ? (
              <p>No hay partituras disponibles.</p>
            ) : (
              <ul className="space-y-2">
                {filteredPDFs.map((pdf) => (
                  <li key={pdf.id} className="flex justify-between items-center border p-2 rounded">
                    <span>{pdf.name}</span>
                    <div className="flex gap-2 items-center">
                      <button onClick={() => toggleFavorite(pdf.id, pdf.name)}>
                        {favorites.includes(pdf.id) ? "⭐" : "☆"}
                      </button>
                      <a
                        href={`/api/downloadpdf?fileId=${pdf.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        Leer
                      </a>
                      <a
                        href={`/api/downloadpdf?fileId=${pdf.id}`}
                        download
                        className="text-green-500 hover:underline"
                      >
                        Descargar
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}
