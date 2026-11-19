export const runtime = "nodejs";

import { google } from "googleapis";
import { NextResponse } from "next/server";
import { requireUser, requirePermission } from "@/lib/serverAuth";

/** Sirve un PDF de Drive con los headers históricos (iOS-safe). */
async function serveDrivePdf(fileId) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  const drive = google.drive({ version: "v3", auth: oauth2Client });

  const fileMeta = await drive.files.get({ fileId, fields: "name" });
  const originalName = fileMeta.data.name || "archivo.pdf";

  const driveResponse = await drive.files.get(
    { fileId, alt: "media" },
    { responseType: "arraybuffer" }
  );

  const buffer = Buffer.from(driveResponse.data);

  const headers = new Headers();
  headers.set("Content-Type", "application/pdf");
  headers.set("Content-Length", buffer.length.toString());
  headers.set(
    "Content-Disposition",
    `attachment; filename*=UTF-8''${encodeURIComponent(originalName)}`
  );
  headers.set("Cache-Control", "no-store");

  return new Response(buffer, { headers });
}

export async function GET(req) {
  const auth = await requireUser(req);
  if (auth.response) return auth.response;

  const { searchParams } = new URL(req.url);
  const fileId = searchParams.get("fileId");

  if (!fileId) {
    return NextResponse.json({ error: "Falta fileId" }, { status: 400 });
  }

  const db = auth.admin.firestore();

  try {
    // ¿Es un recibo? → scoping estricto por userId.
    const reciboSnap = await db
      .collection("recibos_de_sueldo")
      .where("driveFileId", "==", fileId)
      .limit(1)
      .get();

    if (!reciboSnap.empty) {
      const permission = await requirePermission(
        auth.admin,
        auth.uid,
        "recibos",
        "read"
      );
      if (permission.response) return permission.response;

      const recibo = reciboSnap.docs[0].data();
      const canManage = ["write", "admin"].includes(permission.permission);

      if (!canManage && recibo.userId !== auth.uid) {
        return NextResponse.json({ error: "Sin permiso" }, { status: 403 });
      }

      return await serveDrivePdf(fileId);
    }

    // ¿Es una partitura? → canRead + subrol.
    const partituraSnap = await db
      .collection("partituras")
      .where("driveFileId", "==", fileId)
      .limit(1)
      .get();

    if (!partituraSnap.empty) {
      const permission = await requirePermission(
        auth.admin,
        auth.uid,
        "partituras",
        "read"
      );
      if (permission.response) return permission.response;

      const partitura = partituraSnap.docs[0].data();
      const canManage = ["write", "admin"].includes(permission.permission);
      const subroles = permission.userData?.subrol ?? [];

      if (!canManage && !subroles.includes(partitura.instrumento)) {
        return NextResponse.json({ error: "Sin permiso" }, { status: 403 });
      }

      return await serveDrivePdf(fileId);
    }

    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  } catch (err) {
    console.error("❌ Error descargando PDF:", err);

    return NextResponse.json(
      {
        error: "No se pudo descargar",
        details: err?.message || "Error desconocido",
      },
      { status: 500 }
    );
  }
}
