import fs from "fs";
import path from "path";

const partiturasPath = path.join(process.cwd(), "partituras.json");
const driveFilesPath = path.join(process.cwd(), "driveFiles.json");
const outputPath = path.join(process.cwd(), "partituras.merged.json");

// leer archivos
const partituras = JSON.parse(fs.readFileSync(partiturasPath, "utf-8"));
const driveFiles = JSON.parse(fs.readFileSync(driveFilesPath, "utf-8"));

// indexar driveFiles por slug
const driveMap = {};
for (const file of driveFiles) {
  driveMap[file.slug] = file.fileId;
}

// fusionar
const merged = partituras.map((p) => {
  const driveFileId = driveMap[p.id] || null;

  return {
    ...p,
    driveFileId,
  };
});

// guardar resultado
fs.writeFileSync(outputPath, JSON.stringify(merged, null, 2), "utf-8");

// stats útiles
const encontrados = merged.filter(p => p.driveFileId).length;
const faltantes = merged.length - encontrados;

console.log("✅ Merge completado");
console.log(`📄 Total partituras: ${merged.length}`);
console.log(`🎼 Con PDF: ${encontrados}`);
console.log(`⚠️ Faltantes: ${faltantes}`);
console.log(`📁 Archivo generado: ${outputPath}`);
