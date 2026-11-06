/**
 * Slug de tema/partitura.
 * Única implementación compartida por cliente, servidor y scripts.
 * Debe producir exactamente el mismo resultado que el alta de partituras
 * histórica (`app/api/upload/route.js` antes de extraerse a este archivo),
 * porque los doc IDs de `partituras` ya están construidos con esa regla.
 */
export function slugify(text) {
  return String(text ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Valida un slug ya generado (doc ID seguro para Firestore y path de Storage). */
export function isSlug(value) {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.length <= 120 &&
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
  );
}
