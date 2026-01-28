import admin from "firebase-admin";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";

// Inicializa Admin con tu service account y bucket
const serviceAccount = JSON.parse(readFileSync("./serviceAccountKey.json", "utf-8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "ventolera-cc6ba.appspot.com" // nombre exacto
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
