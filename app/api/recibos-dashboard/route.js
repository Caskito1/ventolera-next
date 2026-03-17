export const runtime = "nodejs";

export async function GET() {

  const admin = (await import("firebase-admin")).default;

  if (!admin.apps.length) {

    const {
      FIREBASE_PROJECT_ID,
      FIREBASE_CLIENT_EMAIL,
      FIREBASE_PRIVATE_KEY
    } = process.env;

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey: FIREBASE_PRIVATE_KEY?.replace(/\\n/g,"\n")
      })
    });

  }

  const db = admin.firestore();

  const usersSnap = await db.collection("usuarios").get();

  const users = usersSnap.docs.map(doc => ({
    uid: doc.id,
    ...doc.data()
  }));

  const months = generateMonths();

  const recibosSnap = await db
    .collection("recibos_de_sueldo")
    .get();

  const recibos = recibosSnap.docs
    .map(doc => doc.data())
    .filter(r =>
      months.some(m => m.value === r.periodo)
    );

  return Response.json({
    users,
    months,
    recibos
  });

}

function generateMonths(){

  const months = [];

  const start = new Date(2025,10); // noviembre 2025
  const now = new Date();

  const lastMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1
  );

  let current = new Date(start);

  while(current <= lastMonth){

    const value =
      current.getFullYear() +
      "-" +
      String(current.getMonth()+1).padStart(2,"0");

    const label = current.toLocaleDateString("es-UY",{
      month:"long",
      year:"numeric"
    });

    months.push({ value,label });

    current.setMonth(current.getMonth()+1);

  }

  return months.reverse();

}