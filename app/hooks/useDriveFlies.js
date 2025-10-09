// hooks/useDriveFiles.js
import { useState, useEffect } from "react";

export function useDriveFiles(instrumentos) {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!instrumentos) return;

    async function fetchPDFs() {
      setLoading(true);
      try {
        let allFiles = [];
        for (let instrumento of instrumentos) {
          const res = await fetch(`/api/drivefiles?instrumento=${instrumento}`);
          const files = await res.json();
          if (!files.error) allFiles = allFiles.concat(files);
        }
        setPdfs(allFiles);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }

    fetchPDFs();
  }, [instrumentos]);

  return { pdfs, loading };
}
