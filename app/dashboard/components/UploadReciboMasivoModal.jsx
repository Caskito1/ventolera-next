"use client";

import UploadMasivoTab from "./UploadMasivoTab";

export default function UploadReciboMasivoModal({ onClose, onUploaded }) {

  return (

    <div className="fixed inset-0 z-30 bg-black/70 flex items-center justify-center">

      <div className="bg-white rounded-lg shadow-xl w-[560px] p-4 relative mx-4">

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
        >
          ✕
        </button>

        <h3 className="text-xl font-bold mb-4">
          Carga masiva de recibos
        </h3>

        <UploadMasivoTab onClose={onClose} onUploaded={onUploaded} />

      </div>

    </div>

  );

}