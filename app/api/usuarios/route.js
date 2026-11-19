export const runtime = "nodejs";

import { requireUser, requirePermission } from "@/lib/serverAuth";

export async function GET(req) {

  const auth = await requireUser(req);
  if (auth.response) return auth.response;

  const permission = await requirePermission(
    auth.admin,
    auth.uid,
    "usuarios",
    "admin"
  );
  if (permission.response) return permission.response;

  const db = auth.admin.firestore();

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
