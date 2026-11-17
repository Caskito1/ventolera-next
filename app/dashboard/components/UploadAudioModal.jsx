"use client";

import { useEffect, useMemo, useState } from "react";
import { auth } from "@/firebase";
import { isSlug, slugify } from "@/lib/slug";
import { MAX_AUDIO_BYTES } from "@/lib/storage";

const NEW_TEMA = "__nuevo__";

const MIME_BY_EXTENSION = {
  mp3: "audio/mpeg",
  m4a: "audio/mp4",
};

/**
 * Normaliza el MIME que informa el navegador.
 * Windows/Chrome a veces informa `.m4a` como `audio/x-m4a`; el servidor solo
 * acepta `audio/mp4` (lib/storage.js), así que se declara ese valor.
 */
function normalizeAudioMime(file) {
  const type = String(file?.type ?? "").toLowerCase();
  if (type === "audio/mpeg" || type === "audio/mp3") return "audio/mpeg";
  if (["audio/mp4", "audio/m4a", "audio/x-m4a"].includes(type)) {
    return "audio/mp4";
  }

  const extension = String(file?.name ?? "").toLowerCase().split(".").pop();
  return MIME_BY_EXTENSION[extension] ?? null;
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Duración opcional: si el navegador no la informa, se guarda `null`. */
function readDuration(file) {
  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const audio = new Audio();
    let done = false;

    const finish = (value) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      URL.revokeObjectURL(objectUrl);
      audio.src = "";
      resolve(value);
    };

    const timer = setTimeout(() => finish(null), 4000);

    audio.preload = "metadata";
    audio.onloadedmetadata = () => {
      const duration = audio.duration;
      finish(Number.isFinite(duration) && duration > 0 ? Math.round(duration) : null);
    };
    audio.onerror = () => finish(null);
    audio.src = objectUrl;
  });
}

/** PUT directo al bucket con progreso (fetch no informa progreso de subida). */
function uploadToSignedUrl(uploadUrl, file, mimeType, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl, true);
    xhr.setRequestHeader("Content-Type", mimeType);

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      onProgress(Math.round((event.loaded / event.total) * 100));
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress(100);
        resolve();
        return;
      }
      reject(new Error(`La subida devolvió HTTP ${xhr.status}`));
    };
    xhr.onerror = () => reject(new Error("No se pudo conectar con el storage"));
    xhr.onabort = () => reject(new Error("La subida se canceló"));

    xhr.send(file);
  });
}

function apiErrorMessage(status, payload) {
  if (status === 401) return "Tu sesión venció. Volvé a iniciar sesión.";
  if (status === 403) return "No tenés permiso para cargar audio.";
  if (status === 413) return payload?.error ?? "El archivo supera el máximo de 25 MB.";
  return payload?.error ?? "No se pudo cargar el audio.";
}

export default function UploadAudioModal({ temas = [], onClose, onUploadSuccess }) {
  const [selected, setSelected] = useState("");
  const [newTema, setNewTema] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle"); // idle | uploading | success | error
  const [progress, setProgress] = useState(0);

  const busy = status === "uploading";

  const themeOptions = useMemo(
    () => [...temas].sort((a, b) => String(a.tema).localeCompare(String(b.tema), "es")),
    [temas]
  );

  const isNew = selected === NEW_TEMA;
  const temaName = isNew ? newTema.trim() : "";
  const slug = isNew ? slugify(temaName) : selected;
  const existing = temas.find((tema) => tema.slug === slug) ?? null;
  const hasAudio = Boolean(existing?.audio?.storagePath);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const handleEsc = (event) => {
      if (event.key === "Escape" && status !== "uploading") onClose();
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose, status]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0] ?? null;
    setError("");
    if (!selectedFile) {
      setFile(null);
      return;
    }

    const mimeType = normalizeAudioMime(selectedFile);
    if (!mimeType) {
      setError("Solo se permiten archivos mp3 o m4a.");
      setFile(null);
      return;
    }

    if (selectedFile.size > MAX_AUDIO_BYTES) {
      setError("El archivo supera el máximo de 25 MB.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async () => {
    if (busy) return;

    if (!slug || !isSlug(slug)) {
      setError("Elegí un tema o ingresá un nombre válido.");
      return;
    }

    if (!file) {
      setError("Seleccioná un archivo de audio.");
      return;
    }

    const mimeType = normalizeAudioMime(file);
    if (!mimeType) {
      setError("Solo se permiten archivos mp3 o m4a.");
      return;
    }

    if (file.size > MAX_AUDIO_BYTES) {
      setError("El archivo supera el máximo de 25 MB.");
      return;
    }

    setError("");
    setStatus("uploading");
    setProgress(0);

    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        setStatus("error");
        setError("Tu sesión venció. Volvé a iniciar sesión.");
        return;
      }

      const temasRef = existing?.tema ?? temaName;

      const urlRes = await fetch("/api/audio/upload-url", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tema: temasRef,
          slug,
          mimeType,
          sizeBytes: file.size,
        }),
      });

      const urlData = await urlRes.json().catch(() => null);

      if (!urlRes.ok || !urlData?.uploadUrl || !urlData?.storagePath) {
        setStatus("error");
        setError(apiErrorMessage(urlRes.status, urlData));
        return;
      }

      const durationSec = await readDuration(file);

      await uploadToSignedUrl(urlData.uploadUrl, file, mimeType, setProgress);

      const finalizeRes = await fetch("/api/audio/finalize", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug,
          tema: temasRef,
          storagePath: urlData.storagePath,
          durationSec,
        }),
      });

      const finalizeData = await finalizeRes.json().catch(() => null);

      if (!finalizeRes.ok) {
        setStatus("error");
        setError(apiErrorMessage(finalizeRes.status, finalizeData));
        return;
      }

      setStatus("success");
      if (onUploadSuccess) {
        try {
          await onUploadSuccess();
        } catch (refreshError) {
          console.error("Error refrescando los temas:", refreshError);
        }
      }
    } catch (uploadError) {
      console.error("Error subiendo audio:", uploadError);
      setStatus("error");
      setError(uploadError?.message ?? "No se pudo cargar el audio.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={busy ? undefined : onClose}
      />

      <div className="relative bg-white sm:w-full w-[90%] max-w-md rounded-xl shadow-xl p-6 z-10">
        <div className="relative flex items-center justify-center mb-6">
          <p className="text-sm font-medium text-gray-600">Cargar audio</p>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="absolute right-0 p-2 rounded-full transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Cerrar"
          >
            <img src="/media/icons/close.webp" alt="" width={16} />
          </button>
        </div>

        {status === "success" ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="text-4xl text-green-600">✔</div>
            <p className="mt-3 font-medium text-green-600 text-center">
              Se cargó el audio del tema
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-5 px-4 py-2 bg-green-600 text-white rounded-lg cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="audio-tema">
                Tema
              </label>
              <select
                id="audio-tema"
                value={selected}
                onChange={(event) => {
                  setSelected(event.target.value);
                  setError("");
                }}
                disabled={busy}
                className="w-full border rounded-lg p-2 bg-white"
              >
                <option value="">Elegí un tema…</option>
                {themeOptions.map((tema) => (
                  <option key={tema.slug} value={tema.slug}>
                    {tema.tema}
                    {tema.audio?.storagePath ? " (con audio)" : ""}
                  </option>
                ))}
                <option value={NEW_TEMA}>Otro tema (nuevo)…</option>
              </select>
            </div>

            {isNew && (
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="audio-tema-nuevo">
                  Nombre del tema nuevo
                </label>
                <input
                  id="audio-tema-nuevo"
                  type="text"
                  value={newTema}
                  onChange={(event) => {
                    setNewTema(event.target.value);
                    setError("");
                  }}
                  disabled={busy}
                  placeholder="Nombre del tema"
                  className="w-full border rounded-lg p-2"
                />
                {slug && existing && (
                  <p className="text-xs text-gray-500 mt-1">
                    Ya existe «{existing.tema}»: el audio se agrega a ese tema.
                  </p>
                )}
                {slug && !existing && (
                  <p className="text-xs text-gray-500 mt-1">Se creará el tema «{temaName}».</p>
                )}
              </div>
            )}

            {slug && hasAudio && (
              <p className="text-xs text-gray-500">
                Este tema ya tiene audio: el nuevo archivo lo reemplaza.
              </p>
            )}

            <div className="bg-gray-50 border rounded-lg p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium">Archivo</p>
                  {file ? (
                    <p className="text-sm text-gray-600 truncate">
                      {file.name} · {formatBytes(file.size)}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400">No hay archivo seleccionado</p>
                  )}
                </div>

                <label
                  htmlFor="audio-file"
                  className={`shrink-0 cursor-pointer transition ${
                    busy ? "opacity-40 pointer-events-none" : "hover:scale-105"
                  }`}
                >
                  <img src="/media/icons/upload-orange.webp" alt="Elegir archivo" width={24} />
                </label>
              </div>

              <input
                id="audio-file"
                type="file"
                accept=".mp3,.m4a,audio/mpeg,audio/mp4"
                onChange={handleFileChange}
                disabled={busy}
                className="hidden"
              />
            </div>

            {busy && (
              <div>
                <div className="h-2 w-full bg-gray-200 rounded overflow-hidden">
                  <div
                    className="h-full bg-orange-500 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1 text-center">
                  {progress < 100 ? `Subiendo… ${progress}%` : "Guardando…"}
                </p>
              </div>
            )}

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={busy || !slug || !file}
              className="w-full bg-orange-500 text-white py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {busy ? "Subiendo..." : "Subir audio"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
