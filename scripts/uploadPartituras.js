// scripts/uploadPartituras.js
import admin from "firebase-admin";
import { readFileSync } from "fs";
import path from "path";

// =============================
// 🔐 INIT FIREBASE ADMIN
// =============================
const serviceAccount = JSON.parse(
  readFileSync("./serviceAccountKey.json", "utf-8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// =============================
// 📂 LOAD MERGED JSON
// =============================
const filePath = path.join(process.cwd(), "partituras.merged.json");

const partituras = JSON.parse(
  readFileSync(filePath, "utf-8")
);

console.log(`📄 Total a subir: ${partituras.length}`);

// =============================
// 🚀 UPLOAD
// =============================
async function upload() {
  try {
    for (const partitura of partituras) {
      await db.collection("partituras")
        .doc(partitura.id)
        .set({
          ...partitura,
          updatedAt: new Date().toISOString(),
        }, { merge: true }); // 🔥 importante para no pisar todo

      console.log(`✅ Subida: ${partitura.id}`);
    }

    console.log("🎉 Todas las partituras subidas correctamente.");
  } catch (error) {
    console.error("💥 Error al subir:", error);
  }
}

upload();