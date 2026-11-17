import { useEffect, useRef, useState } from "react";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";
import { usePartituras } from "@/app/hooks/usePartituras";
import { useTemas } from "@/app/hooks/useTemas";
import { buildTemaRows } from "@/lib/temaRows";
import UploadPartituraModal from "./UploadPartiturasModal";
import UploadAudioModal from "./UploadAudioModal";
import TemaRow from "./TemaRow";
import { canWrite } from "@/lib/permissions";
import { MODULES } from "@/lib/modules";

export default function PartiturasTab({ userData, favorites, setFavorites }) {
  const { partituras, loading, refetch } = usePartituras(userData?.subrol);
  const { temas, loading: temasLoading, refetch: refetchTemas } = useTemas();

  const [searchTerm, setSearchTerm] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState("todos");
  const [downloadingId, setDownloadingId] = useState(null);
  const [animatingId, setAnimatingId] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAudioModal, setShowAudioModal] = useState(false);

  // Reproductor único del tab: una sola fila suena a la vez.
  const [audioSlug, setAudioSlug] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioStatus, setAudioStatus] = useState("idle"); // idle | loading | playing | paused | error
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [downloadingAudioSlug, setDownloadingAudioSlug] = useState(null);
  const audioRef = useRef(null);

  const handleDownload = async (fileId, fileName) => {
    try {
      setDownloadingId(fileId);

      const response = await fetch(
        `/api/downloadpdf?fileId=${fileId}&download=1`,
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
      pdfId,
    );

    const isFav = favorites.includes(pdfId);

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

  const handleToggleAudio = async (row) => {
    if (!row?.audio?.storagePath) return;

    // Misma fila: play/pausa sin volver a firmar la URL.
    if (audioSlug === row.slug) {
      const el = audioRef.current;
      if (!el) return;

      if (audioStatus === "playing") {
        el.pause();
        setAudioStatus("paused");
      } else {
        try {
          await el.play();
          setAudioStatus("playing");
        } catch (error) {
          console.error("No se pudo reproducir:", error?.message);
          setAudioStatus("error");
        }
      }
      return;
    }

    try {
      setAudioSlug(row.slug);
      setAudioUrl(null);
      setAudioStatus("loading");
      setAudioDuration(0);
      setAudioCurrentTime(0);

      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        setAudioStatus("error");
        return;
      }

      const res = await fetch(
        `/api/audio/url?slug=${encodeURIComponent(row.slug)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) {
        setAudioStatus("error");
        return;
      }

      const data = await res.json();
      setAudioUrl(data.url);
      setAudioStatus("playing");
    } catch (error) {
      console.error("Error obteniendo el audio:", error?.message);
      setAudioStatus("error");
    }
  };

  useEffect(() => {
    const el = audioRef.current;
    if (!el || !audioUrl || audioStatus !== "playing") return;

    el.play().catch((error) => {
      console.error("No se pudo reproducir:", error?.message);
      setAudioStatus("error");
    });
  }, [audioUrl, audioStatus]);

  const handleSeek = (time) => {
    const el = audioRef.current;
    if (!el || !Number.isFinite(time)) return;

    el.currentTime = time;
    setAudioCurrentTime(time);
  };

  const handleDownloadAudio = async (row) => {
    if (!row?.slug) return;

    try {
      setDownloadingAudioSlug(row.slug);

      const token = await auth.currentUser?.getIdToken();
      if (!token) return;

      const res = await fetch(
        `/api/audio/url?slug=${encodeURIComponent(row.slug)}&download=1`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        console.error(
          "No se pudo descargar el audio:",
          data?.error ?? res.status,
        );
        return;
      }

      const data = await res.json();
      if (!data?.url) return;

      // La URL firmada trae `response-content-disposition: attachment`.
      const a = document.createElement("a");
      a.href = data.url;
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Error descargando el audio:", error?.message);
    } finally {
      setDownloadingAudioSlug(null);
    }
  };

  const partiturasPorInstrumento = partituras.filter((p) =>
    selectedInstrument === "todos" ? true : p.instrumento === selectedInstrument,
  );

  const rows = buildTemaRows(temas, partiturasPorInstrumento)
    .map((row) => ({
      ...row,
      partituras: showFavorites
        ? row.partituras.filter((p) => favorites.includes(p.id))
        : row.partituras,
    }))
    .filter((row) => (showFavorites ? row.partituras.length > 0 : true))
    .filter((row) =>
      String(row.tema)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    );

  return (
    <>
      {showUploadModal && (
        <UploadPartituraModal
          onClose={() => setShowUploadModal(false)}
          instrumentos={userData.subrol}
          onUploadSuccess={async () => {
            await refetch();
            await refetchTemas();
            setShowUploadModal(false);
          }}
        />
      )}
      {showAudioModal && (
        <UploadAudioModal
          temas={temas}
          onClose={() => setShowAudioModal(false)}
          onUploadSuccess={async () => {
            await refetchTemas();
            setShowAudioModal(false);
          }}
        />
      )}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold mb-4">Partituras</h2>
        {canWrite(userData, MODULES.PARTITURAS) && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAudioModal(true)}
              title="Cargar audio del tema"
              aria-label="Cargar audio del tema"
              className="cursor-pointer w-10 h-10 rounded-full bg-orange-500 text-white text-xl flex items-center justify-center shadow-lg hover:bg-orange-600 transition"
            >
              ♪
            </button>
            <button
              onClick={() => setShowUploadModal(true)}
              className="cursor-pointer w-10 h-10 rounded-full bg-orange-500 text-white text-2xl flex items-center justify-center shadow-lg hover:bg-orange-600 transition"
            >
              +
            </button>
          </div>
        )}
      </div>
      {userData.subrol.length > 1 && (
        <div className="mb-4 flex gap-2 items-center ">
          <label>Elegir instrumento:</label>
          <select
            className="border p-1 rounded "
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

      {loading || temasLoading ? (
        <p>Cargando partituras...</p>
      ) : rows.length === 0 ? (
        <p>No hay partituras disponibles.</p>
      ) : (
        <ul className="space-y-2">
          {rows.map((row) => (
            <TemaRow
              key={row.slug}
              row={row}
              favorites={favorites}
              isPlaying={audioSlug === row.slug && audioStatus === "playing"}
              isLoading={audioSlug === row.slug && audioStatus === "loading"}
              isActive={audioSlug === row.slug}
              currentTime={audioSlug === row.slug ? audioCurrentTime : 0}
              duration={audioSlug === row.slug ? audioDuration : 0}
              onSeek={handleSeek}
              onToggleAudio={handleToggleAudio}
              onToggleFavorite={toggleFavorite}
              onDownload={handleDownload}
              onDownloadAudio={handleDownloadAudio}
              downloadingAudio={downloadingAudioSlug === row.slug}
              downloadingId={downloadingId}
              animatingId={animatingId}
            />
          ))}
        </ul>
      )}

      <audio
        ref={audioRef}
        src={audioUrl ?? undefined}
        preload="metadata"
        className="hidden"
        onLoadedMetadata={(event) => {
          const value = event.currentTarget.duration;
          setAudioDuration(Number.isFinite(value) && value > 0 ? value : 0);
        }}
        onDurationChange={(event) => {
          const value = event.currentTarget.duration;
          setAudioDuration(Number.isFinite(value) && value > 0 ? value : 0);
        }}
        onTimeUpdate={(event) => setAudioCurrentTime(event.currentTarget.currentTime)}
        onEnded={() => {
          if (audioRef.current) audioRef.current.currentTime = 0;
          setAudioCurrentTime(0);
          setAudioStatus("paused");
        }}
        onError={() => {
          if (audioUrl) setAudioStatus("error");
        }}
      />
    </>
  );
}
