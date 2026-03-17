"use client";

import { useEffect, useState } from "react";
import UploadManualTab from "./UploadManualTab";

export default function UploadReciboManualModal({
 user,
 months,
 onClose,
 onUploaded
}) {

const [month,setMonth] = useState(null);

const getLastClosedMonths = (months) => {

  const now = new Date();

  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const filtered = months.filter((m) => {

    const [year, month] = m.value.split("-").map(Number);

    if (year < currentYear) return true;

    if (year === currentYear && month < currentMonth) return true;

    return false;

  });

  return filtered.slice(0,3);

};

const availableMonths = getLastClosedMonths(months);
useEffect(()=>{

  if(availableMonths?.length){
    setMonth(availableMonths[0]);
  }

},[months]);


  if(!month) return null;

  return (

    <div className="fixed inset-0 z-40 bg-black/70 flex items-center justify-center">

      <div className="bg-white rounded-lg shadow-xl w-[420px] p-6 relative">

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
        >
          ✕
        </button>

       <h3 className="text-xl font-bold mb-4">
  Subir recibo de {user?.nombre}
        </h3>

        

<select
  value={month.value}
  onChange={(e)=>{
    const m = availableMonths.find(
      m => m.value === e.target.value
    );
    setMonth(m);
  }}
  className="border rounded w-full p-2 mb-4"
>

  {availableMonths.map(m => (

    <option
      key={m.value}
      value={m.value}
    >
      {m.label}
    </option>

  ))}

</select>

        <UploadManualTab  
          user={user}
          month={month}
          onClose={onClose}
          onUploaded={onUploaded}
        />

      </div>

    </div>

  );

}