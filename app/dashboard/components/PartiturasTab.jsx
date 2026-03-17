import { useState } from "react";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";
import { usePartituras } from "@/app/hooks/usePartituras";
import UploadPartituraModal from "./UploadPartiturasModal";
import { canWrite } from "@/lib/permissions";
import { MODULES } from "@/lib/modules";

export default function PartiturasTab({ userData, favorites, setFavorites }) {
  const { partituras, loading, refetch } = usePartituras(userData?.subrol);

  const [searchTerm, setSearchTerm] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState("todos");
  const [downloadingId, setDownloadingId] = useState(null);
  const [animatingId, setAnimatingId] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleDownload = async (fileId, fileName) => {
  try {
    setDownloadingId(fileId);

    const response = await fetch(
      `/api/downloadpdf?fileId=${fileId}&download=1`
    );

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error descargando:", error);
  } finally {
    setDownloadingId(null);
  }
};

  const toggleFavorite = async (pdfId, pdfName) => {
  const favRef = doc(
    db,
    "usuarios",
    auth.currentUser.uid,
    "favoritos",
    pdfId
  );

  const isFav = favorites.includes(pdfId);

  // 🔥 Optimistic update
  if (isFav) {
    setFavorites((prev) => prev.filter((id) => id !== pdfId));
  } else {
    setFavorites((prev) => [...prev, pdfId]);
  }

  // Activar animación
  setAnimatingId(pdfId);
  setTimeout(() => setAnimatingId(null), 300);

  try {
    if (isFav) {
      await deleteDoc(favRef);
    } else {
      await setDoc(favRef, { name: pdfName, addedAt: new Date() });
    }
  } catch (error) {
    console.error("Error favorito:", error);
  }
};


  const filteredPDFs = partituras
    .filter((p) => p.tema.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((p) => (showFavorites ? favorites.includes(p.id) : true))
    .filter((p) =>
      selectedInstrument === "todos"
        ? true
        : p.instrumento === selectedInstrument,
    );

  return (
    <>
    {showUploadModal && (
  <UploadPartituraModal
    onClose={() => setShowUploadModal(false)}
    instrumentos={userData.subrol}
    onUploadSuccess={async () => {
      await refetch();      
      setShowUploadModal(false); 
    }}
  
  />
)}
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold mb-4">Partituras</h2>
       {canWrite(userData, MODULES.PARTITURAS) && (
    <button
      onClick={() => setShowUploadModal(true)}
      className="cursor-pointer w-10 h-10 rounded-full bg-orange-500 text-white text-2xl flex items-center justify-center shadow-lg hover:bg-orange-600 transition"
    >
      +
    </button>
  )}
 </div>
      {(userData.subrol.length > 1) && (
        <div className="mb-4 flex gap-2 items-center ">
          <label>Elegir instrumento:</label>
          <select
            className="border p-1 rounded "
            value={selectedInstrument}
            onChange={(e) => setSelectedInstrument(e.target.value)}
          >
            <option value="todos">Todos</option>
            {userData.subrol.map((inst) => (
              <option key={inst} value={inst} >
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
          className={`py-1 px-3 rounded cursor-pointer ${
            !showFavorites ? "bg-orange-500/80 text-white" : "bg-gray-200"
          }`}
          onClick={() => setShowFavorites(false)}
        >
          Todas
        </button>
        <button
          className={`py-1 px-3 rounded cursor-pointer ${
            showFavorites ? "bg-orange-500/80 text-white" : "bg-gray-200"
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
          {filteredPDFs.map((p) => {
            const isAvailable = !!p.driveFileId;

            return (
              <li
                key={p.id}
                className={`flex justify-between items-center border p-3 rounded transition
          ${isAvailable ? "bg-white" : "bg-gray-100 opacity-60"}
        `}
              >
                <span className={`${!isAvailable && "text-gray-500"}`}>
                  {p.tema} ({p.instrumento})
                </span>

                <div className="flex gap-3 items-center ">
                  {/* ⭐ FAVORITO */}
                  <button
  onClick={() => toggleFavorite(p.id, p.tema)}
  disabled={!isAvailable}
  className={`${!isAvailable && "cursor-not-allowed opacity-50 "}`}
>
  <img
    src={
      favorites.includes(p.id)
        ? "/media/icons/star-yellow.webp"
        : "/media/icons/star.webp"
    }
    alt="Favorito"
    height={16}
    width={16}
    className={`
      transition-transform duration-200 cursor-pointer
      ${animatingId === p.id ? "scale-125" : "scale-100"}
      ${favorites.includes(p.id) ? "" : ""}
    `}
  />
</button>


                  {/* ⬇ DESCARGA */}
                  {isAvailable ? (
                    <button
  onClick={() => handleDownload(p.driveFileId, p.tema)}
  disabled={downloadingId === p.driveFileId}
  className="flex items-center justify-center w-6 h-6"
>
  {downloadingId === p.driveFileId ? (
    <div className="w-4 h-4 border-2 border-gray-400 border-t-orange-600 rounded-full animate-spin" />
  ) : (
    <img
      src="/media/icons/download.webp"
      height={20}
      width={20}
      className="cursor-pointer"
    />
  )}
</button>
                  ) : (
                    <div className="flex items-center gap-1 text-gray-400 cursor-not-allowed">
                        <img src="/media/icons/block.webp" alt="Star Selected" height={16} width={16} />
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
     
    </>
  );
}
