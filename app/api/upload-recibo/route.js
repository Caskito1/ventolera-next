export const runtime = "nodejs";

import { google } from "googleapis";
import { NextResponse } from "next/server";
import { Readable } from "stream";

export async function POST(req) {
  try {

    /* ===============================
       🔥 Firebase Admin
    =============================== */

    const admin = (await import("firebase-admin")).default;

    if (!admin.apps.length) {

      const {
        FIREBASE_PROJECT_ID,
        FIREBASE_CLIENT_EMAIL,
        FIREBASE_PRIVATE_KEY,
      } = process.env;

      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: FIREBASE_PROJECT_ID,
          clientEmail: FIREBASE_CLIENT_EMAIL,
          privateKey: FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
      });

    }

    const db = admin.firestore();

    /* ===============================
       📦 FORM DATA
    =============================== */

    const formData = await req.formData();

    const file = formData.get("file");
    const uid = formData.get("uid");
    const ci = formData.get("ci");
    const nombre = formData.get("nombre");
    const folderId = formData.get("folderId");
    const periodo = formData.get("periodo");
    const overwrite = formData.get("overwrite") === "true";

    if (!file || !uid || !folderId || !periodo) {
      return NextResponse.json(
        { error: "Faltan datos" },
        { status: 400 }
      );
    }

    const tipo = "sueldo";

    const [anio, mes] = periodo.split("-");

    /* ===============================
       🗂 FIRESTORE DOC ID
    =============================== */

    const docId = `${uid}-${periodo}-${tipo}`;

    const docRef = db.collection("recibos_de_sueldo").doc(docId);

    const existingDoc = await docRef.get();

    if (existingDoc.exists && !overwrite) {

      return NextResponse.json(
        { error: "recibo-existe" },
        { status: 409 }
      );

    }

    /* ===============================
       🔐 Google OAuth
    =============================== */

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    const drive = google.drive({
      version: "v3",
      auth: oauth2Client,
    });

    /* ===============================
       🧹 SI EXISTE Y SE SOBREESCRIBE
    =============================== */

    if (existingDoc.exists && overwrite) {

      const oldData = existingDoc.data();

      if (oldData?.driveFileId) {

        try {
          await drive.files.delete({
            fileId: oldData.driveFileId
          });
        } catch (err) {
          console.warn("No se pudo borrar archivo anterior de Drive");
        }

      }

    }

    /* ===============================
       📄 Preparar PDF
    =============================== */

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const stream = Readable.from(buffer);

    const fileName = `${uid}-${periodo}.pdf`;

    /* ===============================
       ⬆ Subir a Drive
    =============================== */

    const driveResponse = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [folderId],
      },
      media: {
        mimeType: "application/pdf",
        body: stream,
      },
      fields: "id",
    });

    const driveFileId = driveResponse.data.id;

    /* ===============================
       💾 Guardar en Firestore
    =============================== */

    const reciboData = {

      userId: uid,
      ci,
      nombre,

      anio: Number(anio),
      mes: Number(mes),

      periodo,
      tipo,

      driveFileId,
      fileName,

      updatedAt: new Date().toISOString(),

    };

    await docRef.set(reciboData, { merge: true });

    return NextResponse.json({
      success: true,
      overwrite: existingDoc.exists,
      ...reciboData
    });

  } catch (error) {

    console.error("❌ Error subiendo recibo:", error);

    return NextResponse.json(
      {
        error: "Error subiendo recibo",
        details: error.message,
      },
      { status: 500 }
    );

  }
}