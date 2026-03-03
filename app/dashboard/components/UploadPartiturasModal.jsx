"use client";

import { useEffect, useState } from "react";

export default function UploadPartituraModal({  
  onClose,
  instrumentos,
  onUploadSuccess }) {

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

  setError("");
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

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error("Upload failed");
      }
    }

    setUploadStatus("success");

    // 🔥 Esto va fuera del try principal
    if (onUploadSuccess) {
      try {
        await onUploadSuccess();
      } catch (err) {
        console.error("Error refrescando listado:", err);
      }
    }

  } catch (err) {
    console.error("Upload error:", err);
    setUploadStatus("error");
  }
};



const truncateFileName = (name, maxLength = 20) => {
  if (!name) return "";
  return name.length > maxLength
    ? name.slice(0, maxLength) + "..."
    : name;
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
       onClick={uploadStatus === "uploading" ? undefined : onClose}
      />

     <div className="relative bg-white sm:w-full w-[90%] max-w-md rounded-xl shadow-xl p-6 z-10 min-h-[510px] flex flex-col ">
 
        {/* Header */}
     {step !== 4 && (
  <div className="relative flex items-center justify-center mb-6">
    {step > 1 && (
      <button
        onClick={prevStep}
        className="absolute left-0 p-2 pl-0 rounded-full transition cursor-pointer"
      >
        <img src="/media/icons/arrow-left-black.webp" alt="back-icon"  width={32} />
      </button>
    )}

    <p className="text-sm font-medium text-gray-600">
      Paso {step}/3
    </p>

    <button
      onClick={onClose}
      className="absolute right-0 p-2 rounded-full transition cursor-pointer"
    >
      <img src="/media/icons/close.webp" alt="" width={16}/>
    </button>
  </div>
)}
 <div className="flex-1 flex flex-col justify-center">
        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-center">Ingresá el nombre del tema</p>
            <input
              type="text"
              value={tema}
              onChange={(e) => setTema(e.target.value)}
              placeholder="Nombre del tema"
              className="w-full border rounded-lg p-2 text-center"
            />

          
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
           

          
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-4">
          {selectedInstruments.map((inst) => {
  const hasFile = !!files[inst];

  return (
    <div
      key={inst}
      className="bg-gray-50 border rounded-lg pl-4 py-2 "
    >
      <div className="grid grid-cols-[1fr_50px] items-center gap-4">
        
        {/* COLUMNA IZQUIERDA (TEXTO) */}
        <div className="flex flex-col">
          <p className="font-medium uppercase">
            {inst}
          </p>

          {hasFile ? (
            <p className="text-sm text-gray-600 truncate">
             {truncateFileName(files[inst].name)}
            </p>
          ) : (
            <p className="text-sm text-gray-400">
              No hay archivo seleccionado
            </p>
          )}
        </div>

        {/* COLUMNA DERECHA (ICONO) */}
        <div className="flex justify-center items-center h-full">
          {hasFile ? (
            <button
              onClick={() => removeFile(inst)}
              className="text-red-500 hover:scale-110 transition"
            >
              ✕
            </button>
          ) : (
            <label
              htmlFor={`file-${inst}`}
              className="cursor-pointer hover:scale-105 transition"
            >
              <img
                src="/media/icons/upload-orange.webp"
                alt="upload"
                width={24}
              />
            </label>
          )}
        </div>
      </div>

      <input
        id={`file-${inst}`}
        type="file"
        accept="application/pdf"
        onChange={(e) => handleFileChange(inst, e)}
        className="hidden"
      />
    </div>
  );
})}

          
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
      {step !== 4 && (
    <div className="pt-4">
      {step < 3 && (
        <button
          onClick={nextStep}
          className="w-full bg-orange-500 text-white py-2 rounded-lg flex justify-center gap-2 cursor-pointer"
        >
          Siguiente <img src="media/icons/arrow-right-white.webp" alt="next-icon" width={24} />
        </button>
      )}

      {step === 3 && (
        <button
          onClick={handleSubmit}
          disabled={uploadStatus === "uploading"}
          className="w-full bg-orange-500 text-white py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {uploadStatus === "uploading" ? "Subiendo..." : "Subir Partituras"}
        </button>
      )}
    </div>
  )}

      </div>
    </div>
  );
}