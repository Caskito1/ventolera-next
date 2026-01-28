import { useState } from "react";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";
import { usePartituras } from "@/app/hooks/usePartituras";

export default function PartiturasTab({ userData, favorites, setFavorites }) {
  const { partituras, loading } = usePartituras(userData?.subrol);

  const [searchTerm, setSearchTerm] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState("todos");

  const toggleFavorite = async (pdfId, pdfName) => {
    const favRef = doc(db, "usuarios", auth.currentUser.uid, "favoritos", pdfId);

    if (favorites.includes(pdfId)) {
      await deleteDoc(favRef);
      setFavorites((prev) => prev.filter((id) => id !== pdfId));
    } else {
      await setDoc(favRef, { name: pdfName, addedAt: new Date() });
      setFavorites((prev) => [...prev, pdfId]);
    }
  };

  const filteredPDFs = partituras
    .filter((p) => p.tema.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((p) => (showFavorites ? favorites.includes(p.id) : true))
    .filter((p) =>
      selectedInstrument === "todos" ? true : p.instrumento === selectedInstrument
    );

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Partituras</h2>

      {userData.rol === "admin" && (
        <div className="mb-4 flex gap-2 items-center">
          <label>Elegir instrumento:</label>
          <select
            className="border p-1 rounded"
            value={selectedInstrument}
            onChange={(e) => setSelectedInstrument(e.target.value)}
          >
            <option value="todos">Todos</option>
            {userData.subrol.map((inst) => (
              <option key={inst} value={inst}>
                {inst}
              </option>
            ))}
          </select>
        </div>
      )}

      <input
        type="text"
        placeholder="Buscar partituras..."
        className="border p-2 rounded w-full mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="flex gap-2 mb-4">
        <button
          className={`py-1 px-3 rounded ${
            !showFavorites ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setShowFavorites(false)}
        >
          Todas
        </button>
        <button
          className={`py-1 px-3 rounded ${
            showFavorites ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setShowFavorites(true)}
        >
          Favoritas
        </button>
      </div>

      {loading ? (
        <p>Cargando partituras...</p>
      ) : filteredPDFs.length === 0 ? (
        <p>No hay partituras disponibles.</p>
      ) : (
        <ul className="space-y-2">
          {filteredPDFs.map((p) => (
            <li
              key={p.id}
              className="flex justify-between items-center border p-2 rounded"
            >
              <span>
                {p.tema} ({p.instrumento})
              </span>
              <div className="flex gap-2 items-center">
                <button onClick={() => toggleFavorite(p.id, p.tema)}>
                  {favorites.includes(p.id) ? "⭐" : "☆"}
                </button>
                <a href={`/api/downloadpdf?fileId=${p.driveFileId}`} target="_blank">
  Leer
</a>
           <a href={`/api/downloadpdf?fileId=${p.driveFileId}&download=1`}>
  Descargar
</a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
