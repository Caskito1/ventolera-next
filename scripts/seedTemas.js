/**
 * Seed de `temas` desde la colección REAL `partituras`.
 *
 * - Dry-run por defecto; escribe solo con `--apply`.
 * - Nunca lee `partituras.merged.json` ni `partituras.json` (artefactos
 *   derivados y desactualizados: DT-16, DT-17).
 * - Nunca escribe `partituras`: al terminar compara conteo y checksum de
 *   campos para demostrarlo.
 *
 * Uso:
 *   node scripts/seedTemas.js            # dry-run (reporte, no escribe)
 *   node scripts/seedTemas.js --apply    # crea los `temas` faltantes
 */

import admin from "firebase-admin";
import { readFileSync } from "fs";
import { createHash } from "crypto";
import { slugify } from "../lib/slug.js";

const APPLY = process.argv.includes("--apply");

const CHECKSUM_FIELDS = ["tema", "disco", "instrumento", "driveFileId"];
const BATCH_LIMIT = 400;

function checksum(docs) {
  const rows = docs
    .map((doc) => {
      const data = doc.data() ?? {};
      return [doc.id, ...CHECKSUM_FIELDS.map((field) => data[field] ?? null)].join(
        "\u0001"
      );
    })
    .sort();

  return createHash("sha256").update(rows.join("\n")).digest("hex").slice(0, 16);
}

function initAdmin() {
  let serviceAccount;
  try {
    serviceAccount = JSON.parse(
      readFileSync("./serviceAccountKey.json", "utf-8")
    );
  } catch {
    console.error(
      "❌ Falta ./serviceAccountKey.json (gitignored). Es el mismo que usan los demás scripts."
    );
    process.exit(1);
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  return admin.firestore();
}

async function main() {
  const db = initAdmin();

  const partiturasSnap = await db.collection("partituras").get();
  const before = {
    count: partiturasSnap.size,
    checksum: checksum(partiturasSnap.docs),
  };

  /** slug → { tema, disco, docs, sinPdf, variantes } */
  const porSlug = new Map();
  let sinTema = 0;

  for (const doc of partiturasSnap.docs) {
    const data = doc.data() ?? {};
    const tema = typeof data.tema === "string" ? data.tema.trim() : "";
    const slug = tema ? slugify(tema) : "";

    if (!slug) {
      sinTema += 1;
      continue;
    }

    const entry =
      porSlug.get(slug) ?? {
        tema,
        disco: data.disco ?? null,
        docs: 0,
        sinPdf: 0,
        variantes: new Set(),
      };

    entry.docs += 1;
    entry.variantes.add(tema);
    if (!data.driveFileId) entry.sinPdf += 1;
    porSlug.set(slug, entry);
  }

  const colisiones = [...porSlug.entries()].filter(
    ([, entry]) => entry.variantes.size > 1
  );

  const temasSnap = await db.collection("temas").get();
  const existentes = new Map(
    temasSnap.docs.map((doc) => [doc.id, doc.data() ?? {}])
  );

  const desalineados = temasSnap.docs.filter(
    (doc) => slugify(doc.data()?.tema ?? "") !== doc.id
  );

  const faltantes = [...porSlug.keys()].filter((slug) => !existentes.has(slug));
  const yaExisten = porSlug.size - faltantes.length;

  console.log("— partituras (colección real) —");
  console.log(`  documentos:            ${before.count}`);
  console.log(`  temas distintos (slug): ${porSlug.size}`);
  console.log(`  sin 'tema' utilizable:  ${sinTema}`);
  console.log(`  con algún PDF faltante: ${[...porSlug.values()].filter((e) => e.sinPdf > 0).length}`);

  console.log("\n— temas —");
  console.log(`  existentes en Firestore: ${temasSnap.size}`);
  console.log(`  ya cubiertos por slug:   ${yaExisten}`);
  console.log(`  a crear:                 ${faltantes.length}`);

  if (desalineados.length) {
    console.log(`\n  ⚠️  ${desalineados.length} tema(s) con id distinto de slug(tema):`);
    for (const doc of desalineados.slice(0, 10)) {
      console.log(`     ${doc.id} ≠ ${slugify(doc.data()?.tema ?? "")}`);
    }
  }

  if (colisiones.length) {
    console.log(`\n  ⚠️  ${colisiones.length} slug(s) con más de un string de tema:`);
    for (const [slug, entry] of colisiones.slice(0, 10)) {
      console.log(`     ${slug}: ${[...entry.variantes].map((v) => `"${v}"`).join(" / ")}`);
    }
  }

  if (!APPLY) {
    console.log(
      "\nDry-run: no se escribió nada. Para crear los temas faltantes: --apply"
    );
    return;
  }

  // Aplica SOLO los faltantes, en lotes. No pisa documentos existentes.
  const now = new Date().toISOString();
  for (let i = 0; i < faltantes.length; i += BATCH_LIMIT) {
    const batch = db.batch();
    for (const slug of faltantes.slice(i, i + BATCH_LIMIT)) {
      const entry = porSlug.get(slug);
      const ref = db.collection("temas").doc(slug);
      batch.set(ref, {
        tema: entry.tema,
        ...(entry.disco ? { disco: entry.disco } : {}),
        audio: null,
        createdAt: now,
        updatedAt: now,
      });
    }
    await batch.commit();
  }

  const partiturasDespues = await db.collection("partituras").get();
  const after = {
    count: partiturasDespues.size,
    checksum: checksum(partiturasDespues.docs),
  };
  const temasDespues = await db.collection("temas").get();

  console.log("\n— resultado —");
  console.log(`  temas creados:  ${faltantes.length}`);
  console.log(`  temas ya existían: ${yaExisten}`);
  console.log(`  temas en Firestore ahora: ${temasDespues.size}`);
  console.log(
    `  partituras sin cambios: ${
      before.count === after.count && before.checksum === after.checksum
        ? "✅ sí (conteo y checksum)"
        : "❌ NO — revisar"
    }`
  );

  if (before.count !== after.count || before.checksum !== after.checksum) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("❌ Error en el seed:", err?.message ?? err);
  process.exit(1);
});
