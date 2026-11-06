export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { requirePermission, requireUser } from "@/lib/serverAuth";
import { isSlug, slugify } from "@/lib/slug";
import {
  MAX_AUDIO_BYTES,
  STORAGE_BUCKET,
  UPLOAD_URL_TTL_MS,
  buildAudioPath,
  isAllowedAudioMime,
} from "@/lib/storage";

/**
 * POST /api/audio/upload-url
 * Autenticado + canWrite(partituras). Emite una URL firmada de subida (10 min)
 * atada a un path y un MIME exactos. Los bytes van directo a Storage.
 */
export async function POST(req) {
  const auth = await requireUser(req);
  if (auth.response) return auth.response;

  const permission = await requirePermission(
    auth.admin,
    auth.uid,
    "partituras",
    "write"
  );
  if (permission.response) return permission.response;

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  const tema = typeof body?.tema === "string" ? body.tema.trim() : "";
  const mimeType = body?.mimeType;
  const sizeBytes = body?.sizeBytes;
  const slug =
    typeof body?.slug === "string" && body.slug ? body.slug : slugify(tema);

  if (!isSlug(slug)) {
    return NextResponse.json({ error: "Tema inválido" }, { status: 400 });
  }

  if (!isAllowedAudioMime(mimeType)) {
    return NextResponse.json(
      { error: "Formato no permitido (mp3 o m4a)" },
      { status: 400 }
    );
  }

  if (!Number.isInteger(sizeBytes) || sizeBytes <= 0) {
    return NextResponse.json(
      { error: "Tamaño de archivo inválido" },
      { status: 400 }
    );
  }

  if (sizeBytes > MAX_AUDIO_BYTES) {
    return NextResponse.json(
      { error: "El archivo supera el máximo de 25 MB" },
      { status: 413 }
    );
  }

  try {
    const storagePath = buildAudioPath(slug, mimeType);
    const expiresAt = Date.now() + UPLOAD_URL_TTL_MS;

    const [uploadUrl] = await auth.admin
      .storage()
      .bucket(STORAGE_BUCKET)
      .file(storagePath)
      .getSignedUrl({
        version: "v4",
        action: "write",
        expires: expiresAt,
        contentType: mimeType,
      });

    return NextResponse.json({
      uploadUrl,
      storagePath,
      expiresAt: new Date(expiresAt).toISOString(),
    });
  } catch (err) {
    console.error("Error firmando subida de audio:", err?.message);
    return NextResponse.json(
      { error: "No se pudo preparar la subida" },
      { status: 500 }
    );
  }
}
