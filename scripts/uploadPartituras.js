// scripts/uploadPartituras.js
import admin from "firebase-admin";
import { readFileSync } from "fs";

// ⚡ Inicializa Admin con tu Service Account
const serviceAccount = JSON.parse(readFileSync("./serviceAccountKey.json", "utf-8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// ⚡ Array de partituras iniciales
const partituras = [
  {
    id: "sabandija-trombon",
    tema: "Sabandija",
    disco: "Sabandija",
    instrumento: "trombon",
    driveFileId: "1j3omdjJwbPehbdoEKMlDDEamKG6ORIAm",
   
  },
  {
    id: "afrocele-trombon",
    tema: "Afrocele",
    disco: "Simples Mortales",
    instrumento: "trombon",
    driveFileId: "1oAuIWfloL8n9IDphS-1UPFu-IyECBfwZ",
    
  },
  {
    id: "sabandija-trompeta-01",
    tema: "Sabandija",
    disco: "Sabandija",
    instrumento: "trompeta-01",
    driveFileId: "1oi9te5K25jn9E4Y_UsF_qIZRb3wub5dY",
   
  },
  // ...agrega el resto de partituras aquí
];

async function upload() {
  try {
    for (const partitura of partituras) {
      await db.collection("partituras").doc(partitura.id).set({
        ...partitura,
        createdAt: new Date().toISOString(),
      });
      console.log(`✅ Subida: ${partitura.id}`);
    }
    console.log("🎉 Todas las partituras subidas correctamente.");
  } catch (error) {
    console.error("💥 Error al subir:", error);
  }
}

upload();