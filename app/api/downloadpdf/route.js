import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const fileId = searchParams.get("fileId");
  const download = searchParams.get("download"); // opcional, si quieres forzar descarga

  if (!fileId) {
    return NextResponse.json({ error: "Falta fileId" }, { status: 400 });
  }

  try {
    // Inicializa OAuth2
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    console.log("🔑 Credenciales cargadas correctamente");
    console.log("📁 Solicitando archivo:", fileId);

    const drive = google.drive({ version: "v3", auth: oauth2Client });

    // Descargar PDF como arraybuffer
    const response = await drive.files.get(
      { fileId, alt: "media" },
      { responseType: "arraybuffer" }
    );

    console.log("✅ Archivo encontrado en Drive, enviando datos...");

    const headers = new Headers();
    headers.set("Content-Type", "application/pdf");
    headers.set(
      "Content-Disposition",
      download === "1"
        ? `attachment; filename="${fileId}.pdf"`
        : "inline"
    );

    return new Response(response.data, { headers });
  } catch (err) {
    console.error("❌ Error descargando PDF:", err);

    return NextResponse.json(
      { error: "No se pudo descargar", details: err.message },
      { status: 500 }
    );
  }
}
