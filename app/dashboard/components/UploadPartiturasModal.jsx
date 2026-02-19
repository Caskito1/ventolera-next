"use client";

import { useEffect, useState } from "react";


export default function UploadPartituraModal({ onClose, instrumentos = [] }) {
  const [tema, setTema] = useState("");
  const [loading, setLoading] = useState(false);
  const [instrumento, setInstrumento] = useState(
    instrumentos.length ? instrumentos[0] : ""
  );
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  // 🔒 Bloquear scroll + cerrar con ESC
  useEffect(() => {
    document.body.style.overflow = "hidden";

    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];

    if (!selected) return;

    if (selected.type !== "application/pdf") {
      setError("Solo se permiten archivos PDF.");
      return;
    }

    setError("");
    setFile(selected);
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!tema || !instrumento || !file) {
    setError("Todos los campos son obligatorios.");
    return;
  }

  try {
    setError("");
    setLoading(true); // 🔥 ARRANCA loading

    const formData = new FormData();
    formData.append("file", file);
    formData.append("tema", tema);
    formData.append("instrumento", instrumento);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Error al subir archivo");
    }

    console.log("✅ Respuesta del server:", data);

    onClose();
  } catch (err) {
    console.error("❌ Error:", err);
    setError(err.message);
  } finally {
    setLoading(false); // 🔥 TERMINA loading SIEMPRE
  }
};


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-md rounded-xl shadow-xl p-6 z-10 animate-fadeIn">
        <h3 className="text-xl font-bold mb-5 text-gray-800">
          Nueva Partitura
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre del tema */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Nombre del tema
            </label>
            <input
              type="text"
              value={tema}
              onChange={(e) => setTema(e.target.value)}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="Ej: Candombe para Gardel"
            />
          </div>

          {/* Instrumento */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Instrumento
            </label>
            <select
              value={instrumento}
              onChange={(e) => setInstrumento(e.target.value)}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-500 outline-none"
            >
              {instrumentos.map((inst) => (
                <option key={inst} value={inst}>
                  {inst}
                </option>
              ))}
            </select>
          </div>

          {/* Subir PDF */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Cargar PDF
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="w-full"
            />
            {file && (
              <p className="text-xs text-gray-500 mt-1">
                Archivo seleccionado: {file.name}
              </p>
            )}
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-500 font-medium">{error}</p>
          )}

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4">
         <button
  type="submit"
  disabled={loading}
  className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition shadow-md disabled:opacity-50"
>
  {loading ? "Subiendo..." : "Subir"}
</button>

           <button
  type="button"
  onClick={onClose}
  className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100 transition"
>
  Cancelar
</button>

          </div>
        </form>
      </div>
    </div>
  );
}
