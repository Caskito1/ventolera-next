import { google } from "googleapis";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const fileId = searchParams.get("fileId");

  if (!fileId) {
    return new Response(JSON.stringify({ error: "fileId requerido" }), { status: 400 });
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

    const drive = google.drive({ version: "v3", auth: oauth2Client });

    const res = await drive.files.get(
      { fileId, alt: "media" },
      { responseType: "stream" }
    );

    return new Response(res.data, {
      headers: { "Content-Type": "application/pdf" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
