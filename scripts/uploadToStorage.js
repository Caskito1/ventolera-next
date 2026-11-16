/**
 * FUERA DE USO (16/11/2026).
 * Las partituras se sirven desde Google Drive vía `/api/downloadpdf`; este script
 * cargaba PDFs a Firebase Storage, algo que la app nunca consumió. Se conserva
 * solo como referencia y no forma parte de ningún flujo. Ver `context/deuda-tecnica.md`.
 */
import admin from "firebase-admin";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";

// Inicializa Admin con tu service account y bucket
const serviceAccount = JSON.parse(readFileSync("./serviceAccountKey.json", "utf-8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "ventolera-cc6ba.firebasestorage.app"
});

const bucket = admin.storage().bucket();

// Carpeta local donde están tus PDFs
const localPath = "./pdfs";
const files = readdirSync(localPath);

async function upload() {
  for (const fileName of files) {
    const filePath = join(localPath, fileName);
    const destination = `partituras/${fileName}`;

    await bucket.upload(filePath, {
      destination,
      metadata: { contentType: "application/pdf" },
    });

    const file = bucket.file(destination);
    const [url] = await file.getSignedUrl({
      action: "read",
      expires: "03-01-2030"
    });

    console.log(`✅ Subido: ${fileName} → ${url}`);

    await admin.firestore().collection("partituras").doc(fileName).set({
      name: fileName,
      storagePath: destination,
      url,
      createdAt: new Date().toISOString(),
    });
  }

  console.log("🎉 Todos los PDFs subidos a Storage y guardados en Firestore");
}

upload();
