export const runtime = "nodejs";

import pdf from "pdf-parse";

export async function POST(req) {
  try {

    /* 🔥 Lazy import firebase-admin */
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

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json({ error: "No file" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const data = await pdf(buffer);

    const text = data.text.replace(/\s+/g, " ");

    /* =====================
       EXTRAER CI
    ===================== */

    let ci = null;

    const ciMatch = text.match(/C\.?\s*I\.?\s*:?\s*(\d{1,2}\.?\d{3}\.?\d{3}-?\d)/i);

    if (ciMatch) {
      ci = ciMatch[1].replace(/\D/g, "");
    }

    if (!ci) {
      return Response.json({ ci: null });
    }

    /* =====================
       BUSCAR USUARIO
    ===================== */

    const snapshot = await db
      .collection("usuarios")
      .where("ci", "==", ci)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return Response.json({
        ci,
        uid: null,
        nombre: null,
        folderId: null,
      });
    }

    const userDoc = snapshot.docs[0];

    const user = userDoc.data();

    return Response.json({
      ci,
      uid: userDoc.id,
      nombre: user.nombre,
      folderId: user.folderRecibosId,
    });

  } catch (error) {

    console.error("ERROR PREVIEW:", error);

    return Response.json(
      { error: "error leyendo pdf" },
      { status: 500 }
    );

  }
}