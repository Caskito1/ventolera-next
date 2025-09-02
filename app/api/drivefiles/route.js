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

export async function GET(req) {
  try {
    const refresh_token = process.env.GOOGLE_REFRESH_TOKEN;
    const client_id = process.env.GOOGLE_CLIENT_ID;
    const client_secret = process.env.GOOGLE_CLIENT_SECRET;

    const oauth2Client = new google.auth.OAuth2(client_id, client_secret);
    oauth2Client.setCredentials({ refresh_token });

    const drive = google.drive({ version: "v3", auth: oauth2Client });

    const { searchParams } = new URL(req.url);
    const instrumento = searchParams.get("instrumento");

    if (!instrumento || !INSTRUMENT_FOLDER_IDS[instrumento]) {
      return new Response(JSON.stringify({ error: "Instrumento no válido" }), { status: 400 });
    }

    const instrumentoFolderId = INSTRUMENT_FOLDER_IDS[instrumento];

    // Listar PDFs dentro de la carpeta
    const resFiles = await drive.files.list({
      q: `'${instrumentoFolderId}' in parents and mimeType='application/pdf'`,
      fields: "files(id, name, webViewLink)",
      orderBy: "name",
    });

    return new Response(JSON.stringify(resFiles.data.files), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
