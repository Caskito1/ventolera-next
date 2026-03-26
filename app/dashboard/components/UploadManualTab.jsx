"use client";

import { useState } from "react";

export default function UploadManualTab({ user, month, onClose, onUploaded }) {

  const [file,setFile] = useState(null);
  const [dragActive,setDragActive] = useState(false);
  const [uploading,setUploading] = useState(false);
  const [overwriteModal,setOverwriteModal] = useState(false);
  const [done,setDone] = useState(false);

  /* ===============================
     ARCHIVO
  =============================== */

  const handleFile = (f) => {

    if(f.type !== "application/pdf") return;

    setFile(f);

  };

  const handleDrop = (e) => {

    e.preventDefault();
    setDragActive(false);

    const dropped = e.dataTransfer.files?.[0];
    if(dropped) handleFile(dropped);

  };

  /* ===============================
     SUBIR
  =============================== */

  const startUpload = async () => {

    if(!file) return;

    const check = await fetch("/api/check-recibo",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        uid:user.uid,
        periodo:month.value
      })
    });

    const data = await check.json();

    if(data.exists){
      setOverwriteModal(true);
      return;
    }

    upload(false);

  };

  const upload = async (overwrite=false) => {

    setUploading(true);

    const formData = new FormData();

    formData.append("file",file);
    formData.append("uid",user.uid);
    formData.append("nombre",user.nombre);
    formData.append("periodo",month.value);
    formData.append("folderId",user.folderRecibosId);
    formData.append("overwrite",overwrite);

    await fetch("/api/upload-recibo",{
      method:"POST",
      body:formData
    });
    onUploaded();
    setUploading(false);
    setDone(true);

  };

  const truncateFileName = (name, maxLength = 15) => {
  if (name.length <= maxLength) return name;
  return name.slice(0, maxLength) + "...";
};

  /* ===============================
     RESULTADO
  =============================== */

  if(done){

    return(

      <div className="text-center py-6">

        <div className="text-4xl mb-3">
          ✔
        </div>

        <p className="text-green-600 mb-4">
          Recibo cargado correctamente
        </p>

        <button
          onClick={onClose}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          Cerrar
        </button>

      </div>

    )

  }

  return (

    <div>

      {/* DROPZONE */}

      <div
        onDragOver={(e)=>{
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={()=>setDragActive(false)}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
          transition
          ${dragActive
            ? "border-orange-500 bg-orange-50"
            : "border-gray-300"}
        `}
      >

        {!file && (
          <p className="text-gray-600 mb-2">
            Arrastrá el PDF aquí
          </p>
        )}

        {!file && (
          <>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e)=>handleFile(e.target.files[0])}
              className="hidden"
              id="uploadManual"
            />

            <label
              htmlFor="uploadManual"
              className="text-orange-500 cursor-pointer"
            >
              Seleccionar archivo
            </label>
          </>
        )}

        {file && (

          <div className="flex  justify-between items-center text-sm">

            <span className="truncate">
                {truncateFileName(file.name)}
            </span>

            <button
              onClick={()=>setFile(null)}
              className="text-red-500 text-xs"
            >
              eliminar
            </button>
          </div>
        )}

      </div>

      {/* BOTONES */}

      <div className="flex justify-end gap-2 mt-4">

        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Cancelar
        </button>

        <button
          onClick={startUpload}
          disabled={!file || uploading}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 flex items-center gap-2"
        >

          {uploading && (
            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>
          )}

          {uploading ? "Subiendo..." : "Subir recibo"}

        </button>

      </div>

      {/* MODAL SOBRESCRIBIR */}

      {overwriteModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-lg p-6 w-[360px]">

            <h3 className="font-bold mb-3">
              Recibo existente
            </h3>

            <p className="text-sm mb-4">
              Ya existe un recibo para {user.nombre} en {month.label}.
              ¿Querés sobrescribirlo?
            </p>

            <div className="flex justify-end gap-2">

              <button
                className="px-3 py-2 bg-gray-200 rounded"
                onClick={()=>setOverwriteModal(false)}
              >
                Cancelar
              </button>

              <button
                className="px-3 py-2 bg-orange-500 text-white rounded"
                onClick={()=>{
                  setOverwriteModal(false);
                  upload(true);
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