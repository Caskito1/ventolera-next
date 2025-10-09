// /app/hooks/usePartituras.js
"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

export function usePartituras(subroles) {
  const [partituras, setPartituras] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPartituras() {
      try {
        const snapshot = await getDocs(collection(db, "partituras"));
        const all = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Si el usuario tiene subroles, filtramos solo esas
        const filtered = subroles?.length
          ? all.filter((p) => subroles.includes(p.instrumento))
          : all;

        setPartituras(filtered);
      } catch (error) {
        console.error("Error al obtener partituras:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPartituras();
  }, [subroles]);

  return { partituras, loading };
}
