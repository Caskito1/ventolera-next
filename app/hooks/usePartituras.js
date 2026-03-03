"use client";

import { useEffect, useState, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

export function usePartituras(subroles) {
  const [partituras, setPartituras] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPartituras = useCallback(async () => {
    try {
      setLoading(true);

      const snapshot = await getDocs(collection(db, "partituras"));

      const all = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filtered = subroles?.length
        ? all.filter((p) => subroles.includes(p.instrumento))
        : all;

      setPartituras(filtered);

    } catch (error) {
      console.error("Error al obtener partituras:", error);
    } finally {
      setLoading(false);
    }
  }, [subroles]);

  useEffect(() => {
    fetchPartituras();
  }, [fetchPartituras]);

  return {
    partituras,
    loading,
    refetch: fetchPartituras, // 🔥 ahora sí existe
  };
}