import { slugify } from "./slug.js";

/**
 * Une `temas` (fuente canónica) con las partituras del usuario.
 *
 * Reglas (PROPUESTA-ETAPA-1 §2.2):
 * - Todos los documentos de `temas` generan una fila, tengan PDFs, audio o nada.
 * - La unión es por slug normalizado.
 * - Una partitura sin tema no desaparece: se agrupa en una fila sintética.
 */
export function buildTemaRows(temas, partituras) {
  const rows = new Map();

  for (const tema of temas ?? []) {
    const slug = tema?.slug ?? slugify(tema?.tema);
    if (!slug) continue;

    rows.set(slug, {
      slug,
      tema: tema?.tema ?? slug,
      disco: tema?.disco ?? null,
      audio: tema?.audio ?? null,
      partituras: [],
    });
  }

  const huerfanas = [];

  for (const partitura of partituras ?? []) {
    const slug = slugify(partitura?.tema);

    if (slug && rows.has(slug)) {
      rows.get(slug).partituras.push(partitura);
    } else {
      huerfanas.push({ slug, partitura });
    }
  }

  for (const { slug, partitura } of huerfanas) {
    const key = slug || `partitura:${partitura?.id}`;
    const row =
      rows.get(key) ?? {
        slug: key,
        tema: partitura?.tema ?? partitura?.id ?? "Sin título",
        disco: partitura?.disco ?? null,
        audio: null,
        partituras: [],
      };

    row.partituras.push(partitura);
    rows.set(key, row);
  }

  return [...rows.values()].sort((a, b) =>
    String(a.tema).localeCompare(String(b.tema), "es")
  );
}
