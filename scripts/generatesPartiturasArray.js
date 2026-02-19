// scripts/generatePartituras.js
import fs from "fs";
import path from "path";

const INSTRUMENTS = [
  { key: "saxo-alto", folderId: "1QZ8gd1JhOcPdS3uPYNYKFmwjaGzRKvhi" },
  { key: "saxo-tenor", folderId: "1dMSDqVMR1xmPCsufb4mM57zWHQ-Mh-2Y" },
  { key: "saxo-bari", folderId: "1CdmFjhg6H1dewxlgADX2T6k6vHMipdFu" },
  { key: "trombon", folderId: "1HiH2GyBS4-NLFrxO5dW79Xxd53zO_czB" },
  { key: "trompeta-01", folderId: "1oi9te5K25jn9E4Y_UsF_qIZRb3wub5dY" },
  { key: "trompeta-02", folderId: "1yq4esUpgeesqc2VQgLkrcCTUKjKD96SF" },
  { key: "tuba", folderId: "1TNm8cuKErsg4aRKRdyc1WV9qPOYLys9l" },
];

const DISCS = {
  Ventoelra: [
    "El lobo",
    "La Bajada",
    "Baile de los morenos",
    "Bomba H",
    "El Día que me quieras",
    "Trecktown Rock",
    "Campanas de mar de Fondo",
    "Dale Valor",
    "Shake Everything You've Got",
    "Sale el sol",
    "Batea de Tacuarí",
    "Se va la comparsa",
  ],

  Sabandija: [
    "Sabandija",
    "Don aguinaldo",
    "Them Belly Full",
    "Tal vez Cheché",
    "Candombe p'al Fatto",
    "El Grito de los olvidados",
    "Afroexpress",
    "Billie Jean",
    "Moaning",
    "Upa Nega",
    "Mi sangre t'al borotá",
    "Batuquembé",
    "Caminando",
  ],

  "Simples Mortales": [
    "Afrocele",
    "Simples Mortales",
    "Al espejo",
    "Walking",
    "Las calles",
    "Afroexpress",
  ],

  "Se pica la cantina": [
    "Oh ventolera",
    "Alacran y la llamada",
    "Funky",
    "Camaleón",
    "Que bien",
    "Bien de Bien",
    "Caravan",
    "Se Pica la cantina",
  ],

  "Sin Disco": [
    "Amandote",
    "Candombe para Gardel",
    "Mandanga",
    "Don't take my coconuts",
    "Mama vieja",
    "Las llaves",
    "Bueno que me voy",
    "Candombe para Javier",
    "Como me gusta",
    "Police Woman",
  ],

  "Enganchados Celestes": [
    "Enganchados Celestes",
  ],
};

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function generatePartituras() {
  const partituras = [];

  for (const [disco, temas] of Object.entries(DISCS)) {
    for (const tema of temas) {
      for (const instrument of INSTRUMENTS) {
        partituras.push({
          id: `${slugify(tema)}-${instrument.key}`,
          tema,
          disco,
          instrumento: instrument.key,
          driveFileId: null,
          driveUrl: `https://drive.google.com/drive/folders/${instrument.folderId}`,
          createdAt: new Date().toISOString(),
        });
      }
    }
  }

  return partituras;
}

// =====================
// WRITE JSON FILE
// =====================
const outputPath = path.join(process.cwd(), "partituras.json");
const partituras = generatePartituras();

fs.writeFileSync(outputPath, JSON.stringify(partituras, null, 2), "utf-8");

console.log(`✅ Archivo generado: ${outputPath}`);
console.log(`📄 Total de partituras: ${partituras.length}`);
