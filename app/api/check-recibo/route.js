export const runtime = "nodejs";

export async function POST(req) {

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
     DATA
  =============================== */

  const { uid, periodo } = await req.json();

  const docId = `${uid}-${periodo}-sueldo`;

  const doc = await db
    .collection("recibos_de_sueldo")
    .doc(docId)
    .get();

  return Response.json({
    exists: doc.exists
  });

}