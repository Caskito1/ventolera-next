/**
 * Constantes de audio en Firebase Storage.
 * Bucket por defecto del proyecto, creado el 16/11/2026 en us-east1 (Standard).
 * No es el legacy `appspot.com`: ese nunca se provisionó (ver EVIDENCIA-1.1 §1.2).
 */
export const STORAGE_BUCKET = "ventolera-cc6ba.firebasestorage.app";

export const AUDIO_PREFIX = "audio";

/** 25 MB: cubre un tema completo en mp3/m4a con margen. */
export const MAX_AUDIO_BYTES = 25 * 1024 * 1024;

/** MIME permitidos → extensión del objeto. */
export const AUDIO_MIME_EXTENSIONS = {
  "audio/mpeg": "mp3",
  "audio/mp4": "m4a",
};

/** Vida de la URL de subida (decisión §3.3 de la propuesta). */
export const UPLOAD_URL_TTL_MS = 10 * 60 * 1000;

/** Vida de la URL de reproducción (decisión §3.3 de la propuesta). */
export const READ_URL_TTL_MS = 60 * 60 * 1000;

export function isAllowedAudioMime(mimeType) {
  return Object.prototype.hasOwnProperty.call(
    AUDIO_MIME_EXTENSIONS,
    mimeType
  );
}

export function extensionForMime(mimeType) {
  return AUDIO_MIME_EXTENSIONS[mimeType] ?? null;
}

/** `audio/<slug>-<timestamp>.<ext>`: el timestamp permite reemplazar sin pisar. */
export function buildAudioPath(slug, mimeType) {
  const ext = extensionForMime(mimeType);
  return `${AUDIO_PREFIX}/${slug}-${Date.now()}.${ext}`;
}

/** El path que llega a `finalize` tiene que pertenecer al slug declarado. */
export function isAudioPathForSlug(storagePath, slug) {
  if (typeof storagePath !== "string") return false;
  const extensions = Object.values(AUDIO_MIME_EXTENSIONS).join("|");
  const pattern = new RegExp(
    `^${AUDIO_PREFIX}/${slug}-\\d{10,}\\.(${extensions})$`
  );
  return pattern.test(storagePath);
}
