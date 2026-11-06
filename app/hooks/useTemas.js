"use client";

import { useCallback, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

/**
 * Lee la colección `temas` (una fila por canción).
 *
 * Si la regla de `temas` todavía no está desplegada, la lectura falla: se
 * devuelve `temas: []` y `error` para que el listado use el fallback desde
 * `partituras` (PROPUESTA-ETAPA-1 §2.2, riesgo declarado).
 */
export function useTemas() {
  const [temas, setTemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTemas = useCallback(async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(collection(db, "temas"));

      setTemas(
        snapshot.docs.map((doc) => ({
          ...doc.data(),
          slug: doc.id,
        }))
      );
      setError(null);
    } catch (err) {
      console.error("Error al obtener temas:", err?.message ?? err);
      setTemas([]);
      setError("temas-no-disponibles");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemas();
  }, [fetchTemas]);

  return { temas, loading, error, refetch: fetchTemas };
}
