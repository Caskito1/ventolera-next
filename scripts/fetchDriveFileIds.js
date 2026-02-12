import { google } from "googleapis";
import fs from "fs";

const auth = new google.auth.GoogleAuth({
  keyFile: "./serviceAccountKey.json",
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
});

const drive = google.drive({ version: "v3", auth });

const INSTRUMENT_FOLDERS = {
  "saxo-alto": "1QZ8gd1JhOcPdS3uPYNYKFmwjaGzRKvhi",
  "saxo-tenor": "1dMSDqVMR1xmPCsufb4mM57zWHQ-Mh-2Y",
  "saxo-bari": "1CdmFjhg6H1dewxlgADX2T6k6vHMipdFu",
  "trombon": "1HiH2GyBS4-NLFrxO5dW79Xxd53zO_czB",
  "trompeta-01": "1oi9te5K25jn9E4Y_UsF_qIZRb3wub5dY",
  "trompeta-02": "1yq4esUpgeesqc2VQgLkrcCTUKjKD96SF",
  "tuba": "1TNm8cuKErsg4aRKRdyc1WV9qPOYLys9l",
};

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function fetchFiles() {
  const result = [];

  for (const [instrumento, folderId] of Object.entries(INSTRUMENT_FOLDERS)) {
    const res = await drive.files.list({
      q: `'${folderId}' in parents and mimeType='application/pdf'`,
      fields: "files(id, name)",
    });

    for (const file of res.data.files) {
      result.push({
        instrumento,
        fileId: file.id,
        fileName: file.name,
        slug: slugify(file.name.replace(".pdf", "")),
      });
    }
  }

  fs.writeFileSync(
    "driveFiles.json",
    JSON.stringify(result, null, 2),
    "utf-8"
  );

  console.log("✅ driveFiles.json generado");
}

fetchFiles();
