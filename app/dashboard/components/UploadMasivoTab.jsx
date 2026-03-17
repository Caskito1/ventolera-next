"use client";

import { useState } from "react";

export default function UploadMasivoTab({ onClose, onUploaded }) {

  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [periodo, setPeriodo] = useState("");
  const [summary, setSummary] = useState(null);
  const [overwriteModal, setOverwriteModal] = useState(null);

// Sobreescribir duplicados
  const askOverwrite = (duplicados) => {
  return new Promise((resolve) => {
    setOverwriteModal({
      files: duplicados,
      resolve
    });
  });
};
  /* ===============================
     Analizar PDF
  =============================== */

  const analyzeFile = async (file, index) => {

    try {

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/preview-recibo", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      setFiles(prev => {

        const updated = [...prev];

        updated[index] = {
          ...updated[index],
          status: data.ci ? "ok" : "error",
          ci: data.ci || null,
          nombre: data.nombre || null,
          uid: data.uid || null,
          folderId: data.folderId || null
        };

        return updated;

      });

    } catch {

      setFiles(prev => {

        const updated = [...prev];
        updated[index].status = "error";
        return updated;

      });

    }

  };
/* ===============================
   Manejar archivos
=============================== */

const handleFiles = (fileList) => {

  const pdfFiles = Array.from(fileList).filter(
    file => file.type === "application/pdf"
  );

  const newFiles = pdfFiles.map(file => ({
    file,
    status: "analizando",
    ci: null,
    nombre: null,
    uid: null,
    folderId: null
  }));

  const startIndex = files.length;

  setFiles(prev => [...prev, ...newFiles]);

  newFiles.forEach((item, i) => {
    analyzeFile(item.file, startIndex + i);
  });

};

/* ===============================
   Drag & Drop
=============================== */

const handleDrop = (e) => {

  e.preventDefault();
  setDragActive(false);

  if (e.dataTransfer.files) {
    handleFiles(e.dataTransfer.files);
  }

};

/* ===============================
   Eliminar archivo
=============================== */

const removeFile = (index) => {
  setFiles(prev => prev.filter((_,i)=>i!==index));
};
  /* ===============================
     Manejar archivos
  =============================== */
const handleUpload = async () => {

  if (!periodo) return;
  if (files.some(f => f.status === "analizando")) {
    return;
  }

  let uploaded = 0;
  let ciNoEncontrado = [];
  let invalidos = [];

  try {

    setUploading(true);

    const duplicados = [];

    /* ========================
       CHECK DUPLICADOS
    ======================== */

    for (const item of files) {

      if (item.status === "error") {
        invalidos.push(item.file.name);
        continue;
      }

      if (!item.uid) {
        ciNoEncontrado.push(item.file.name);
        continue;
      }

      const check = await fetch("/api/check-recibo",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify({
          uid: item.uid,
          periodo
        })
      });

      const checkData = await check.json();

      if (checkData.exists) {
        duplicados.push(item);
      }

    }

    /* ========================
       MODAL SOBRESCRITURA
    ======================== */

    let overwriteAll = false;

    if (duplicados.length > 0) {
      overwriteAll = await askOverwrite(duplicados);
    }

    /* ========================
       SUBIR ARCHIVOS
    ======================== */

    for (const item of files) {

      if (item.status === "error") continue;
      if (!item.uid) continue;

      let overwrite = false;

      if (duplicados.includes(item)) {
        overwrite = overwriteAll;
      }

      if (duplicados.includes(item) && !overwriteAll) {
        continue;
      }

      const formData = new FormData();

      formData.append("file", item.file);
      formData.append("uid", item.uid);
      formData.append("folderId", item.folderId);
      formData.append("ci", item.ci);
      formData.append("nombre", item.nombre);
      formData.append("periodo", periodo);
      formData.append("overwrite", overwrite);

      await fetch("/api/upload-recibo", {
        method: "POST",
        body: formData,
      });

      uploaded++;
      item.status = "uploaded";

    }

    setFiles([...files]);

    setSummary({
      uploaded,
      ciNoEncontrado,
      invalidos
    });

  } catch (error) {

    console.error(error);

  } finally {
    onUploaded();
    setUploading(false);

  }

};
  /* ===============================
     PANTALLA RESULTADO
  =============================== */

if (summary) {

  const hasErrors =
    summary.ciNoEncontrado.length > 0 ||
    summary.invalidos.length > 0;

  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">

      <div className="text-5xl mb-4">
        {hasErrors ? "⚠" : "✔"}
      </div>

      <h3 className="text-xl font-bold mb-6">
        {hasErrors
          ? "Carga completada con advertencias"
          : "Carga completada"}
      </h3>

      <div className="space-y-4 text-sm max-w-md">

        <div className="text-green-600 text-lg">
          ✔ {summary.uploaded} recibos cargados
        </div>

        {summary.ciNoEncontrado.length > 0 && (
          <div className="text-yellow-600 text-left">

            <div className="font-semibold mb-1">
              ⚠ CI no encontrados
            </div>

            <ul className="list-disc list-inside text-xs">
              {summary.ciNoEncontrado.map((file,i)=>(
                <li key={i}>{file}</li>
              ))}
            </ul>

          </div>
        )}

        {summary.invalidos.length > 0 && (
          <div className="text-red-600 text-left">

            <div className="font-semibold mb-1">
              ❌ Archivos inválidos
            </div>

            <ul className="list-disc list-inside text-xs">
              {summary.invalidos.map((file,i)=>(
                <li key={i}>{file}</li>
              ))}
            </ul>

          </div>
        )}

      </div>

      <button
        onClick={onClose}
        className="mt-6 px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
      >
        Cerrar
      </button>

    </div>
  );
}

  /* ===============================
     UI NORMAL
  =============================== */

  return (

    <div>

      {/* SELECT MES */}

      <div className="mb-4">

        <label className="text-sm font-medium block mb-1">
          Mes del recibo
        </label>

        <select
          value={periodo}
          onChange={(e)=>setPeriodo(e.target.value)}
          className="w-full border rounded p-2"
        >
          <option value="">Seleccionar mes</option>
          <option value="2026-01">Enero 2026</option>
          <option value="2026-02">Febrero 2026</option>
          <option value="2026-03">Marzo 2026</option>
        </select>

      </div>

      {/* DROP ZONE */}

      <div
        onDragOver={(e)=>{
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={()=>setDragActive(false)}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition
          ${dragActive
            ? "border-orange-500 bg-orange-50"
            : "border-gray-300"}
        `}
      >

        <p className="text-gray-600">
          Arrastrá PDFs aquí o hacé click
        </p>

        <input
          type="file"
          multiple
          accept="application/pdf"
          onChange={(e)=>handleFiles(e.target.files)}
          className="hidden"
          id="fileUploadMasivo"
        />

        <label
          htmlFor="fileUploadMasivo"
          className="text-orange-500 cursor-pointer"
        >
          Seleccionar archivos
        </label>

      </div>

      {/* LISTA */}

      {files.length>0 && (

        <div className="mt-4 max-h-52 overflow-y-auto border rounded p-2">

          {files.map((item,index)=>(

            <div
              key={index}
              className="flex flex-col border-b py-2 text-sm"
            >

              <div className="flex justify-between items-center">

                <span className="truncate font-medium">
                  {item.file.name}
                </span>

                <button
                  onClick={()=>removeFile(index)}
                  className="text-red-500 text-xs"
                >
                  eliminar
                </button>

              </div>

              {item.status==="analizando" && (
                <span className="text-gray-400">
                  Analizando PDF...
                </span>
              )}

              {item.status==="ok" && item.uid && (
                <span className="text-green-600">
                  CI {item.ci} — {item.nombre}
                </span>
              )}

              {item.status==="ok" && !item.uid && (
                <span className="text-yellow-600">
                  CI {item.ci} — usuario no encontrado
                </span>
              )}

              {item.status==="error" && (
                <span className="text-red-600">
                  Archivo inválido
                </span>
              )}

              {item.status==="uploaded" && (
                <span className="text-blue-600">
                  cargado ✔
                </span>
              )}

            </div>

          ))}

        </div>

      )}

      {/* BOTONES */}

      <div className="flex justify-end gap-2 mt-4">

        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Cancelar
        </button>

        <button
          onClick={handleUpload}
          disabled={uploading || files.length===0}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 flex items-center gap-2"
        >

          {uploading && (
            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>
          )}

          {uploading ? "Subiendo..." : "Subir archivos"}

        </button>

      </div>
{overwriteModal && (

<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

  <div className="bg-white rounded-lg p-6 w-[420px]">

    <h3 className="text-lg font-bold mb-3">
      Recibos ya existentes
    </h3>

    <p className="text-sm mb-3">
      Los siguientes recibos ya existen para este mes:
    </p>

    <ul className="text-sm max-h-40 overflow-y-auto mb-4 list-disc list-inside">

      {overwriteModal.files.map((f,i)=>(
        <li key={i}>
          {f.nombre} — {f.file.name}
        </li>
      ))}

    </ul>

    <div className="flex justify-end gap-2">

      <button
        className="px-3 py-2 bg-gray-200 rounded"
        onClick={()=>{
          overwriteModal.resolve(false);
          setOverwriteModal(null);
        }}
      >
        No sobrescribir
      </button>

      <button
        className="px-3 py-2 bg-orange-500 text-white rounded"
        onClick={()=>{
          overwriteModal.resolve(true);
          setOverwriteModal(null);
        }}
      >
        Sobrescribir
      </button>

    </div>

  </div>

</div>

)}
    </div>

  );

}