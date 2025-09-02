import { google } from "googleapis";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false, // para subir archivos
  },
};

export async function POST(req) {
  const refresh_token = process.env.GOOGLE_REFRESH_TOKEN;
  const client_id = process.env.GOOGLE_CLIENT_ID;
  const client_secret = process.env.GOOGLE_CLIENT_SECRET;

  const oauth2Client = new google.auth.OAuth2(client_id, client_secret);
  oauth2Client.setCredentials({ refresh_token });

  const drive = google.drive({ version: "v3", auth: oauth2Client });

  const form = new formidable.IncomingForm();

  const data = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });

  const file = data.files.file; // nombre del input 'file'

  const folderId = "TU_FOLDER_ID";

  const fileMetadata = {
    name: file.originalFilename,
    parents: [folderId],
  };
  const media = {
    mimeType: file.mimetype,
    body: fs.createReadStream(file.filepath),
  };

  const response = await drive.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: "id, name, webViewLink",
  });

  return new Response(JSON.stringify(response.data), { status: 200 });
}
