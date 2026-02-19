export const runtime = "nodejs";

import { google } from "googleapis";
import { NextResponse } from "next/server";

/* ===============================
   📁 Carpetas por instrumento
================================ */
const INSTRUMENT_FOLDERS = {
  "saxo-alto": "1QZ8gd1JhOcPdS3uPYNYKFmwjaGzRKvhi",
  "saxo-tenor": "1dMSDqVMR1xmPCsufb4mM57zWHQ-Mh-2Y",
  "saxo-bari": "1CdmFjhg6H1dewxlgADX2T6k6vHMipdFu",
  "trombon": "1HiH2GyBS4-NLFrxO5dW79Xxd53zO_czB",
  "trompeta-01": "1oi9te5K25jn9E4Y_UsF_qIZRb3wub5dY",
  "trompeta-02": "1yq4esUpgeesqc2VQgLkrcCTUKjKD96SF",
  "tuba": "1TNm8cuKErsg4aRKRdyc1WV9qPOYLys9l",
};

/* ===============================
   🔤 Slugify
================================ */
function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/* ===============================
   🚀 POST
================================ */
export async function POST(req) {
  try {
    const formData = await req.formData();

    const file = formData.get("file");
    const tema = formData.get("tema");
    const instrumento = formData.get("instrumento");

    /* ===============================
       🔎 Validaciones básicas
    ================================ */
    if (!file || !tema || !instrumento) {
      return NextResponse.json(
        { error: "Faltan datos" },
        { status: 400 }
      );
    }

    const folderId = INSTRUMENT_FOLDERS[instrumento];

    if (!folderId) {
      return NextResponse.json(
        { error: "Instrumento inválido" },
        { status: 400 }
      );
    }

    /* ===============================
       🔐 OAuth2
    ================================ */
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    const drive = google.drive({ version: "v3", auth: oauth2Client });

    /* ===============================
       📄 Preparar archivo
    ================================ */
    const buffer = Buffer.from(await file.arrayBuffer());

    const slug = `${slugify(tema)}-${instrumento}`;
    const fileName = `${slug}.pdf`;

    console.log("📤 Subiendo:", fileName);
    console.log("📁 Carpeta destino:", folderId);

    /* ===============================
       ☁ Subir a Drive
    ================================ */
    const driveResponse = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [folderId],
      },
      media: {
        mimeType: "application/pdf",
        body: buffer,
      },
      fields: "id, name",
    });

    console.log("✅ Archivo subido:", driveResponse.data.id);

    /* ===============================
       📦 Respuesta al frontend
    ================================ */
    return NextResponse.json({
      instrumento,
      fileId: driveResponse.data.id,
      fileName: driveResponse.data.name,
      slug,
    });

  } catch (error) {
    console.error("❌ Error subiendo a Drive:", error);

    return NextResponse.json(
      { error: "Error subiendo archivo", details: error.message },
      { status: 500 }
    );
  }
}
