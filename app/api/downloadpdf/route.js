import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const fileId = searchParams.get("fileId");

  if (!fileId) {
    return NextResponse.json(
      { error: "Falta fileId" },
      { status: 400 }
    );
  }

  try {
    // 🔐 Inicializar OAuth2
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    const drive = google.drive({
      version: "v3",
      auth: oauth2Client,
    });

    // 📁 Obtener metadata (nombre original)
    const fileMeta = await drive.files.get({
      fileId,
      fields: "name",
    });

    const originalName = fileMeta.data.name || "archivo.pdf";

    // 📥 Descargar archivo como arraybuffer
    const driveResponse = await drive.files.get(
      { fileId, alt: "media" },
      { responseType: "arraybuffer" }
    );

    // 🔄 Convertir a Buffer (CRÍTICO para iOS)
    const buffer = Buffer.from(driveResponse.data);

    // 📦 Headers optimizados para Safari + Chrome
    const headers = new Headers();

    headers.set("Content-Type", "application/pdf");
    headers.set("Content-Length", buffer.length.toString());

    // Forzar descarga compatible con iOS (UTF-8 seguro)
    headers.set(
      "Content-Disposition",
      `attachment; filename*=UTF-8''${encodeURIComponent(originalName)}`
    );

    // Evitar problemas de cache en iOS
    headers.set("Cache-Control", "no-store");

    return new Response(buffer, { headers });

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