export const runtime = "nodejs";

import { requireUser, requirePermission } from "@/lib/serverAuth";

export async function POST(req) {

  const auth = await requireUser(req);
  if (auth.response) return auth.response;

  const permission = await requirePermission(
    auth.admin,
    auth.uid,
    "recibos",
    "write"
  );
  if (permission.response) return permission.response;

  const db = auth.admin.firestore();

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
