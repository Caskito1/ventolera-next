export const runtime = "nodejs";

import { requireUser, requirePermission } from "@/lib/serverAuth";

export async function GET(req) {

  const auth = await requireUser(req);
  if (auth.response) return auth.response;

  const permission = await requirePermission(
    auth.admin,
    auth.uid,
    "recibos",
    "read"
  );
  if (permission.response) return permission.response;

  const canManage = ["write", "admin"].includes(permission.permission);
  const db = auth.admin.firestore();

  const months = generateMonths();

  const recibosSnap = await db
    .collection("recibos_de_sueldo")
    .get();

  const recibos = recibosSnap.docs
    .map(doc => doc.data())
    .filter(r =>
      months.some(m => m.value === r.periodo)
    )
    .filter(r => canManage || r.userId === auth.uid);

  let users = [];

  if (canManage) {
    const usersSnap = await db.collection("usuarios").get();

    users = usersSnap.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    }));
  }

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
