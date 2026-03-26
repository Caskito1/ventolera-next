"use client";

import { useEffect, useState } from "react";
import UploadReciboMasivoModal from "./UploadReciboMasivoModal";
import UploadReciboManualModal from "./UploadReciboManualModal";
import { canWrite } from "@/lib/permissions";
import { MODULES } from "@/lib/modules";
import { auth } from "@/firebase";


export default function AdministracionTab({ userData }) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [manualUploadUser, setManualUploadUser] = useState(null);
  const [data, setData] = useState(null);
  const [openUser, setOpenUser] = useState(null);
  const [selectedYear, setSelectedYear] = useState("2026");
  const [downloadingId, setDownloadingId] = useState(null);
  
const load = async () => {
  const token = await auth.currentUser.getIdToken();

  const res = await fetch("/api/recibos-dashboard", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json();
  setData(json);
};
  useEffect(() => {
    load();
  }, []);

  if (!data) return <p>Cargando...</p>;

  const { users, months, recibos } = data;
    const validUsers = users.filter(
    (u) => u.ci && u.folderRecibosId
  );

  const incompleteUsers = users.filter(
    (u) => !u.ci || !u.folderRecibosId
);

  const myMonths = months
  .slice()
  .sort((a, b) => b.value.localeCompare(a.value))
  .map((month) => {
    const recibo = recibos.find(
      (r) =>
        r.userId === userData.uid &&
        r.periodo === month.value
    );

    return {
      ...month,
      recibo,
    };
  });

  const getRecibo = (uid, periodo) => {
    return recibos.find((r) => r.userId === uid && r.periodo === periodo);
  };

  const formatMonth = (value) => {
    const [year, month] = value.split("-");

    const monthNames = [
      "ENE",
      "FEB",
      "MAR",
      "ABR",
      "MAY",
      "JUN",
      "JUL",
      "AGO",
      "SEP",
      "OCT",
      "NOV",
      "DIC",
    ];

    return `${monthNames[parseInt(month) - 1]}-${year}`;
  };

const years = [...new Set(months.map((m) => m.value.slice(0, 4)))]
  .sort((a, b) => b - a);

  const monthsByYear = months.filter((m) =>
    m.value.startsWith(selectedYear)
  );

  const handleDownload = async (fileId, fileName, nombreUsuario) => {

  try {

    setDownloadingId(fileId);
   const token = await auth.currentUser.getIdToken();
     const response = await fetch(
      `/api/downloadpdf?fileId=${fileId}&download=1`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `Recibo-Sueldo-${nombreUsuario}-${fileName}.pdf`;

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

const canManage = canWrite(userData, MODULES.RECIBOS);
if (!canManage) {

  const myMonths = months
    .slice()
    .sort((a, b) => b.value.localeCompare(a.value));
const monthsByYear = myMonths.reduce((acc, month) => {
  const year = month.value.slice(0, 4);

  if (!acc[year]) acc[year] = [];

  acc[year].push(month);

  return acc;
}, {});
  return (
    <div className="space-y-4">

      <h2 className="text-2xl font-bold">Mis recibos</h2>

      <div className="space-y-2">

 {Object.entries(monthsByYear)
  .sort((a, b) => b[0] - a[0])
  .map(([year, months]) => (

  <div key={year} className="space-y-2" >

    {/* TITULO AÑO */}

    <h3 className="text-lg font-semibold border-b pb-1">
      {year}
    </h3>

    {/* MESES */}

    {months.map((month) => {

      const recibo = recibos.find(
        (r) =>
          r.ci === userData.ci &&
          r.periodo === month.value
      );

      const isAvailable = !!recibo;

      return (

   <div
  key={month.value}
  onClick={() => {
    if (!isAvailable) return;
    handleDownload(
      recibo.driveFileId,
      recibo.periodo,
      userData.nombre
    );
  }}
  className={`flex justify-between items-center border p-3 rounded
    ${
      isAvailable
        ? "bg-white cursor-pointer hover:bg-gray-50 active:scale-95 transition-transform"
        : "bg-gray-100 opacity-60 cursor-not-allowed"
    }
  `}
>
  <span className="font-medium">
    {formatMonth(month.value)}
  </span>

  {isAvailable ? (
    downloadingId === recibo.driveFileId ? (
      <div className="w-4 h-4 border-2 border-gray-400 border-t-orange-600 rounded-full animate-spin" />
    ) : (
      <img
        src="/media/icons/download.webp"
        height={18}
        width={18}
        className="pointer-events-none"
      onClick={(e) => {
  if (!isAvailable) return;
  e.stopPropagation(); // ✅ ahora sí existe
  handleDownload(
    recibo.driveFileId,
    recibo.periodo,
    userData.nombre
  );
}}
      />
    )
  ) : (
    <img
      src="/media/icons/block.webp"
      height={18}
      width={18}
      className="pointer-events-none"
    />
  )}
</div>

      

      );

    })}

  </div>

))}

      </div>

    </div>
  );
}
  return (
    <>
      {showUploadModal && (
        <UploadReciboMasivoModal
          onClose={() => setShowUploadModal(false)}
          onUploaded={load}
        />
      )}

      {manualUploadUser && (
        <UploadReciboManualModal
          user={manualUploadUser}
          months={months}
            onUploaded={load}
          onClose={() => setManualUploadUser(null)}
        />
      )}

      {/* HEADER */}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Recibos de sueldo</h2>

       {canWrite(userData, MODULES.RECIBOS) && (
          <button
            onClick={() => setShowUploadModal(true)}
            className="cursor-pointer w-10 h-10 rounded-full bg-orange-500 text-white text-2xl flex items-center justify-center shadow-lg hover:bg-orange-600 transition"
          >
            +
          </button>
        )}
      </div>

      {/* USERS */}

      <div className="space-y-2">
        {validUsers.map((user) => {
          const isOpen = openUser === user.uid;

          return (
            <div
              key={user.uid}
              className="border rounded bg-white overflow-hidden"
            >
              {/* HEADER ACORDEON */}

              <button
                onClick={() =>
                  setOpenUser(isOpen ? null : user.uid)
                }
                className="w-full flex justify-between items-center p-3 hover:bg-gray-50 transition cursor-pointer"
              >
                <span className="font-medium">
                  {user.nombre}
                </span>

                <span
                  className={`transition-transform duration-300 ${
                    isOpen ? "rotate-270" : "rotate-180"
                  }`}
                >
                  <img src="/media/icons/arrow-left-black.webp" alt="" />
                </span>
              </button>

              {/* CONTENIDO */}

              <div
                className={`grid transition-all duration-300 ${
                  isOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="p-3 border-t space-y-4">
                    
                  <div className="flex justify-between items-center">

  {/* AÑOS */}

  <div className="flex gap-2">

    {years.map((year) => (

      <button
        key={year}
        onClick={() => setSelectedYear(year)}
        className={`px-3 py-1 rounded text-sm border transition cursor-pointer
        ${
          selectedYear === year
            ? "bg-orange-500 text-white border-orange-500"
            : "bg-white border-gray-300"
        }`}
      >
        {year}
      </button>

    ))}

  </div>


  {/* BOTON CARGAR */}

  {canWrite(userData, MODULES.RECIBOS) && (
    <button
     onClick={() => setManualUploadUser(user)}
      className="bg-orange-500 text-white text-sm px-3 py-1 rounded hover:bg-orange-600 transition cursor-pointer"
    >
      Cargar recibos
    </button>
  )}

</div>

                    {/* GRID MESES */}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {monthsByYear.map((month) => {
                        const recibo = getRecibo(user.uid, month.value);
                        const isAvailable = !!recibo;

                        return (
                          <button
                            key={month.value}
                            disabled={!isAvailable}
                            onClick={() =>
                                recibo &&
                                handleDownload(recibo.driveFileId, recibo.periodo, user.nombre)
                              }
                            className={`flex  items-center justify-center gap-2 p-3 border rounded transition 
                            ${
                              isAvailable
                                ? "bg-white border-gray-800 cursor-pointer   "
                                : "bg-gray-100 border-gray-200 cursor-not-allowed opacity-70"
                            }`}
                          >
                            <span className="text-xs font-medium">
                              {formatMonth(month.value)}
                            </span>

                            {downloadingId === recibo?.driveFileId ? (
  <div className="w-4 h-4 border-2 border-gray-400 border-t-orange-600 rounded-full animate-spin" />
) : (
  <img
    src={
      isAvailable
        ? "/media/icons/download.webp"
        : "/media/icons/block.webp"
    }
    height={18}
    width={18}
  />
)}
                          </button>
                        );
                      })}
                    </div>

                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {incompleteUsers.length > 0 && (

  <div className="mt-8 space-y-2">

    <h3 className="text-lg font-semibold text-gray-500">
      Usuarios con datos faltantes
    </h3>

    {incompleteUsers.map((user) => (

      <div
        key={user.uid}
        className="border rounded bg-gray-100 p-3 flex justify-between items-center opacity-70"
      >

        <span className="font-medium">
          {user.nombre}
        </span>

        <span className="text-xs text-gray-500">
          { !user.ci && "Falta cargar CI a base de datos "}
        </span>

      </div>

    ))}

  </div>

)}
    </>
  );
}