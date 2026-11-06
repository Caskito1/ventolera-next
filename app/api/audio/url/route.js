export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { requirePermission, requireUser } from "@/lib/serverAuth";
import { isSlug } from "@/lib/slug";
import { READ_URL_TTL_MS, STORAGE_BUCKET } from "@/lib/storage";

/**
 * GET /api/audio/url?slug=<slug>
 * Autenticado + canRead(partituras). Devuelve una URL firmada de lectura
 * (60 min) para el audio del tema. Sin sesión no hay audio.
 */
export async function GET(req) {
  const auth = await requireUser(req);
  if (auth.response) return auth.response;

  const permission = await requirePermission(
    auth.admin,
    auth.uid,
    "partituras",
    "read"
  );
  if (permission.response) return permission.response;

  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!isSlug(slug)) {
    return NextResponse.json({ error: "Tema inválido" }, { status: 400 });
  }

  try {
    const snap = await auth.admin
      .firestore()
      .collection("temas")
      .doc(slug)
      .get();

    const audio = snap.exists ? snap.data()?.audio : null;

    if (!audio?.storagePath) {
      return NextResponse.json(
        { error: "Este tema no tiene audio" },
        { status: 404 }
      );
    }

    const expiresAt = Date.now() + READ_URL_TTL_MS;

    const [url] = await auth.admin
      .storage()
      .bucket(STORAGE_BUCKET)
      .file(audio.storagePath)
      .getSignedUrl({
        version: "v4",
        action: "read",
        expires: expiresAt,
      });

    return NextResponse.json({
      url,
      expiresAt: new Date(expiresAt).toISOString(),
    });
  } catch (err) {
    console.error("Error firmando audio:", err?.message);
    return NextResponse.json(
      { error: "No se pudo abrir el audio" },
      { status: 500 }
    );
  }
}
