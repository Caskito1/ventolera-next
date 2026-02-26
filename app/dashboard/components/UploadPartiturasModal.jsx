"use client";

import { useEffect, useState } from "react";

export default function UploadPartituraModal({ onClose, instrumentos = [] }) {
  const [step, setStep] = useState(1);
  const [tema, setTema] = useState("");
  const [selectedInstruments, setSelectedInstruments] = useState([]);
  const [files, setFiles] = useState({});

  const [error, setError] = useState("");
  const [uploadStatus, setUploadStatus] = useState("idle"); 

  /* ===============================
     🔒 Lock scroll + ESC
  ================================ */
  useEffect(() => {
  document.body.style.overflow = "hidden";

  const handleEsc = (e) => {
    if (e.key === "Escape" && uploadStatus !== "uploading") {
      onClose();
    }
  };

  window.addEventListener("keydown", handleEsc);

  return () => {
    document.body.style.overflow = "auto";
    window.removeEventListener("keydown", handleEsc);
  };
}, [onClose, uploadStatus]);

  /* ===============================
     🎼 Toggle instrumento
  ================================ */
  const toggleInstrument = (inst) => {
    setSelectedInstruments((prev) =>
      prev.includes(inst)
        ? prev.filter((i) => i !== inst)
        : [...prev, inst]
    );
  };

  /* ===============================
     📄 Manejo archivos
  ================================ */
  const handleFileChange = (inst, e) => {
    const selected = e.target.files[0];

    if (!selected) return;

    if (selected.type !== "application/pdf") {
      setError("Solo se permiten archivos PDF.");
      return;
    }

    setFiles((prev) => ({
      ...prev,
      [inst]: selected,
    }));
  };

  const removeFile = (inst) => {
    setFiles((prev) => {
      const copy = { ...prev };
      delete copy[inst];
      return copy;
    });
  };

  /* ===============================
     ➡️ Navegación pasos
  ================================ */
  const nextStep = () => {
    if (step === 1 && !tema) {
      setError("Ingresá el nombre del tema.");
      return;
    }

    if (step === 2 && selectedInstruments.length === 0) {
      setError("Seleccioná al menos un instrumento.");
      return;
    }

    setError("");
    setStep(step + 1);
  };

  const prevStep = () => {
    setError("");
    setStep(step - 1);
  };

  /* ===============================
     🚀 Submit final
  ================================ */
  const handleSubmit = async () => {
  if (Object.keys(files).length !== selectedInstruments.length) {
    setError("Faltan archivos por cargar");
    return;
  }

  setStep(4); 
  setUploadStatus("uploading");

  try {
    for (const inst of selectedInstruments) {
      const formData = new FormData();
      formData.append("file", files[inst]);
      formData.append("tema", tema);
      formData.append("instrumento", inst);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error();
    }

    setUploadStatus("success");
  } catch (err) {
    setUploadStatus("error");
  }
};

useEffect(() => {
  if (uploadStatus === "success") {
    const timer = setTimeout(() => {
      onClose();
    }, 1500);

    return () => clearTimeout(timer);
  }
}, [uploadStatus]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
       onClick={uploadStatus === "uploading" ? undefined : onClose}
      />

      <div className="relative bg-white w-full max-w-md rounded-xl shadow-xl p-6 z-10">
 
        {/* Header */}
     {step !== 4 && (
  <div className="relative flex items-center justify-center mb-6">
    {step > 1 && (
      <button
        onClick={prevStep}
        className="absolute left-0 p-2 rounded-full hover:bg-gray-100 transition"
      >
        ←
      </button>
    )}

    <p className="text-sm font-medium text-gray-600">
      Paso {step}/3
    </p>

    <button
      onClick={onClose}
      className="absolute right-0 p-2 rounded-full hover:bg-gray-100 transition"
    >
      ✕
    </button>
  </div>
)}

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <input
              type="text"
              value={tema}
              onChange={(e) => setTema(e.target.value)}
              placeholder="Nombre del tema"
              className="w-full border rounded-lg p-2"
            />

            <button
              onClick={nextStep}
              className="w-full bg-orange-500 text-white py-2 rounded-lg"
            >
              Siguiente →
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-4">
           
             <div className="grid  gap-2">
  {instrumentos.map((inst) => {
    const selected = selectedInstruments.includes(inst);

    return (
      <div
        key={inst}
        onClick={() => toggleInstrument(inst)}
        className={`
          cursor-pointer p-2 rounded-lg border transition text-center
          ${selected
            ? "bg-orange-500 text-white border-orange-500"
            : "bg-white hover:bg-gray-50"}
        `}
      >
        {inst}
      </div>
    );
  })}
</div>
           

            <div className="flex justify-center pt-4">
             

              <button
                onClick={nextStep}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg"
              >
                Siguiente →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-4">
            {selectedInstruments.map((inst) => (
              <div
                key={inst}
                className="bg-gray-50 border rounded-lg p-3"
              >
                <p className="font-medium mb-2">{inst}</p>

            <div className="flex flex-col gap-2">
  <label
    htmlFor={`file-${inst}`}
    className="inline-block w-fit px-4 py-2 bg-orange-500 text-white rounded-lg cursor-pointer hover:bg-orange-600 transition"
  >
    Seleccionar archivo
  </label>

  <input
    id={`file-${inst}`}
    type="file"
    accept="application/pdf"
    onChange={(e) => handleFileChange(inst, e)}
    className="hidden"
  />

  {files[inst] ? (
    <div className="flex justify-between items-center text-sm bg-white border rounded-lg px-3 py-2">
      <span className="truncate">{files[inst].name}</span>
      <button
        onClick={() => removeFile(inst)}
        className="text-red-500 hover:text-red-700"
      >
        ✕
      </button>
    </div>
  ) : (
    <p className="text-xs text-gray-400">
      No hay archivo seleccionado
    </p>
  )}
</div>

              </div>
            ))}

           <div className="flex justify-center pt-4">
             

             <button
  onClick={handleSubmit}
  disabled={uploadStatus === "uploading"}
  className="px-4 py-2 bg-orange-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
>
  {uploadStatus === "uploading" ? "Subiendo..." : "Subir Partituras"}
</button>
            </div>
          </div>
        )}

        {error && (
          <p className="text-red-500 text-sm mt-4">{error}</p>
        )}
        {/* STEP 4 */}
{step === 4 && (
  <div className="flex flex-col items-center justify-center py-10">

    {uploadStatus === "uploading" && (
      <>
       <div className="w-10 h-10 border-4 border-gray-300 border-t-orange-500 rounded-full animate-spin" />
        <p className="mt-4 text-sm text-gray-600">
          Subiendo partituras...
        </p>
      </>
    )}

    {uploadStatus === "success" && (
      <>
        <div className="text-4xl text-green-600">✔</div>
        <p className="mt-3 font-medium text-green-600 text-center">
          Se cargó el tema correctamente
        </p>

        <button
          onClick={onClose}
          className="mt-5 px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          Cerrar
        </button>
      </>
    )}

    {uploadStatus === "error" && (
      <>
        <div className="text-4xl text-red-600">✖</div>
        <p className="mt-3 font-medium text-red-600 text-center">
          Error al subir
        </p>

        <button
          onClick={() => setStep(3)}
          className="mt-5 px-4 py-2 bg-orange-500 text-white rounded-lg"
        >
          Volver
        </button>
      </>
    )}

  </div>
)}
      </div>
    </div>
  );
}