export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { requirePermission, requireUser } from "@/lib/serverAuth";
import { isSlug } from "@/lib/slug";
import {
  MAX_AUDIO_BYTES,
  STORAGE_BUCKET,
  isAllowedAudioMime,
  isAudioPathForSlug,
} from "@/lib/storage";

/**
 * POST /api/audio/finalize
 * Autenticado + canWrite(partituras). Verifica el objeto recién subido con el
 * Admin SDK (MIME y tamaño reales), escribe `temas/{slug}.audio` y recién
 * entonces borra el audio anterior. Sin este paso no hay documento: un upload
 * abortado no deja estado inconsistente.
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

  const slug = body?.slug;
  const storagePath = body?.storagePath;
  const tema = typeof body?.tema === "string" ? body.tema.trim() : "";
  const disco = typeof body?.disco === "string" ? body.disco.trim() : "";
  const durationSec = Number.isFinite(body?.durationSec)
    ? Math.round(body.durationSec)
    : null;

  if (!isSlug(slug)) {
    return NextResponse.json({ error: "Tema inválido" }, { status: 400 });
  }

  if (!isAudioPathForSlug(storagePath, slug)) {
    return NextResponse.json({ error: "Path inválido" }, { status: 400 });
  }

  const db = auth.admin.firestore();
  const bucket = auth.admin.storage().bucket(STORAGE_BUCKET);
  const file = bucket.file(storagePath);

  try {
    // Metadata real del objeto: acá se valida lo que el cliente declaró.
    const [metadata] = await file.getMetadata();

    const contentType = metadata?.contentType;
    const sizeBytes = Number(metadata?.size) || 0;

    if (!isAllowedAudioMime(contentType)) {
      await file.delete().catch(() => {});
      return NextResponse.json(
        { error: "El archivo subido no es mp3 ni m4a" },
        { status: 400 }
      );
    }

    if (sizeBytes <= 0 || sizeBytes > MAX_AUDIO_BYTES) {
      await file.delete().catch(() => {});
      return NextResponse.json(
        { error: "El archivo subido no es válido" },
        { status: 400 }
      );
    }

    const docRef = db.collection("temas").doc(slug);
    const snap = await docRef.get();

    if (!snap.exists && !tema) {
      await file.delete().catch(() => {});
      return NextResponse.json(
        { error: "Falta el nombre del tema" },
        { status: 400 }
      );
    }

    const previousPath = snap.exists
      ? snap.data()?.audio?.storagePath ?? null
      : null;

    const uploadedAt = new Date().toISOString();

    const data = {
      audio: {
        storagePath,
        mimeType: contentType,
        sizeBytes,
        durationSec,
        uploadedAt,
        uploadedBy: auth.uid,
      },
      updatedAt: uploadedAt,
    };

    // Un tema puede existir solo por su audio: se crea si no está.
    if (!snap.exists) {
      data.tema = tema;
      if (disco) data.disco = disco;
      data.createdAt = uploadedAt;
    }

    await docRef.set(data, { merge: true });

    // Recién con el documento escrito se borra el audio anterior.
    if (previousPath && previousPath !== storagePath) {
      await bucket
        .file(previousPath)
        .delete()
        .catch((err) =>
          console.warn("No se pudo borrar el audio anterior:", err?.message)
        );
    }

    return NextResponse.json({
      ok: true,
      slug,
      tema: snap.exists ? snap.data()?.tema ?? tema : tema,
    });
  } catch (err) {
    // Objeto inexistente, credenciales o Storage no disponible.
    const notFound =
      err?.code === 404 ||
      String(err?.message || "").includes("No such object");

    console.error("Error finalizando audio:", err?.message);

    return NextResponse.json(
      { error: notFound ? "El archivo no está en Storage" : "No se pudo guardar el audio" },
      { status: notFound ? 404 : 500 }
    );
  }
}
