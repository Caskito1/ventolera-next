import { google } from "googleapis";

const INSTRUMENT_FOLDER_IDS = {
  "saxo-alto": "1QZ8gd1JhOcPdS3uPYNYKFmwjaGzRKvhi",
  "saxo-bari": "1CdmFjhg6H1dewxlgADX2T6k6vHMipdFu",
  "saxo-tenor": "1dMSDqVMR1xmPCsufb4mM57zWHQ-Mh-2Y",
  "trombon": "1HiH2GyBS4-NLFrxO5dW79Xxd53zO_czB",
  "trompeta-01": "1oi9te5K25jn9E4Y_UsF_qIZRb3wub5dY",
  "trompeta-02": "1yq4esUpgeesqc2VQgLkrcCTUKjKD96SF",
  "tuba": "1TNm8cuKErsg4aRKRdyc1WV9qPOYLys9l",
};

// Cache simple en memoria del access_token
let cachedAccessToken = null;
let tokenExpiry = 0;

export async function GET(req) {
  try {
    const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } = process.env;

    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) {
      return new Response(JSON.stringify({ error: "Faltan variables de entorno de Google." }), { status: 500 });
    }

    const oauth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);
    oauth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });

    // Renovar access_token solo si expiró o no hay cache
    const now = Date.now();
    if (!cachedAccessToken || now >= tokenExpiry) {
      try {
        const tokenResponse = await oauth2Client.getAccessToken();
        if (!tokenResponse?.token) throw new Error("No se pudo renovar el access_token");
        cachedAccessToken = tokenResponse.token;
        tokenExpiry = now + 50 * 60 * 1000; // renovar antes de 1 hora (50 min)
      } catch (err) {
        console.error("💥 Error renovando access_token:", err);
        return new Response(JSON.stringify({ error: "Error al renovar access_token. Verificar refresh_token." }), { status: 401 });
      }
    }

    const drive = google.drive({ version: "v3", auth: oauth2Client });
    const { searchParams } = new URL(req.url);
    const instrumento = searchParams.get("instrumento");

    if (!instrumento || !INSTRUMENT_FOLDER_IDS[instrumento]) {
      return new Response(JSON.stringify({ error: "Instrumento no válido" }), { status: 400 });
    }

    const instrumentoFolderId = INSTRUMENT_FOLDER_IDS[instrumento];

    const resFiles = await drive.files.list({
      q: `'${instrumentoFolderId}' in parents and mimeType='application/pdf'`,
      fields: "files(id, name, webViewLink)",
      orderBy: "name",
    });

    return new Response(JSON.stringify(resFiles.data.files), { status: 200 });
  } catch (error) {
    console.error("💥 Error en /api/drivefiles:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
