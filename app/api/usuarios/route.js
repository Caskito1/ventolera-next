export const runtime = "nodejs";

export async function GET() {

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

  const snapshot = await db
    .collection("usuarios")
    .orderBy("nombre")
    .get();

  const usuarios = snapshot.docs.map(doc => ({
    uid: doc.id,
    nombre: doc.data().nombre,
    ci: doc.data().ci,
    folderId: doc.data().folderRecibosId
  }));

  return Response.json(usuarios);

}