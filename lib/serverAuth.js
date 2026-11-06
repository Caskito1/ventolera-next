import { NextResponse } from "next/server";
import { STORAGE_BUCKET } from "./storage";

/**
 * Autenticación y autorización de servidor para las routes NUEVAS de la Etapa 1.
 *
 * No se aplica a las routes existentes: siguen abiertas (DT-01) y se cierran
 * en la Etapa 2. Acá solo se autentica lo nuevo.
 */

const LEVELS = {
  read: ["read", "write", "admin"],
  write: ["write", "admin"],
};

/** Inicializa firebase-admin una vez, con credencial y bucket de Storage. */
export async function getAdminApp() {
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
      storageBucket: STORAGE_BUCKET,
    });
  }

  return admin;
}

/**
 * Verifica el ID token del header `Authorization: Bearer <idToken>`.
 * Devuelve `{ admin, uid, email }` o `{ response }` con el 401 listo.
 */
export async function requireUser(req) {
  const header = req.headers.get("authorization") || "";
  const match = header.match(/^Bearer\s+(.+)$/i);

  if (!match) {
    return {
      response: NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      ),
    };
  }

  try {
    const admin = await getAdminApp();
    const decoded = await admin.auth().verifyIdToken(match[1]);
    return { admin, uid: decoded.uid, email: decoded.email ?? null };
  } catch {
    // Token inválido o vencido: no se filtra el detalle (DT-32).
    return {
      response: NextResponse.json(
        { error: "Token inválido" },
        { status: 401 }
      ),
    };
  }
}

/**
 * Lee `usuarios/{uid}.permissions[module]` y aplica el mismo predicado que
 * `lib/permissions.js`: read = read|write|admin · write = write|admin.
 * Devuelve `{ permission }` o `{ response }` con el 403 listo.
 */
export async function requirePermission(admin, uid, moduleId, level = "read") {
  const allowed = LEVELS[level] ?? LEVELS.read;

  try {
    const snap = await admin.firestore().collection("usuarios").doc(uid).get();
    const permission = snap.exists
      ? snap.data()?.permissions?.[moduleId] ?? null
      : null;

    if (!allowed.includes(permission)) {
      return {
        response: NextResponse.json(
          { error: "Sin permiso" },
          { status: 403 }
        ),
      };
    }

    return { permission };
  } catch (err) {
    console.error("Error leyendo permisos:", err?.message);
    return {
      response: NextResponse.json(
        { error: "No se pudo verificar el permiso" },
        { status: 500 }
      ),
    };
  }
}
