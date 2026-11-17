# Ventolera — Sitio y panel de gestión

Sitio web de la banda **La Ventolera** y panel privado para administrar temas, partituras, audios y recibos.

> Proyecto de portfolio. No incluye datos reales ni credenciales.

## Funcionalidades

- Landing pública: portada, historia, álbumes, galería, plataformas y lanzamientos.
- Panel privado: temas, partituras en PDF, audios, recibos y administración.
- Carga de archivos a Firebase Storage y Google Drive.
- Autenticación y permisos por rol.
- Reproductor de audio y navegación por tema.

## Stack

- Next.js 16 (App Router) + React 19
- Firebase (Auth, Firestore, Storage) + Firebase Admin
- Google Drive API (OAuth)
- Tailwind CSS 4, Framer Motion, Swiper
- pdf-parse / pdfjs-dist para procesar partituras
- API Routes para audio, PDFs, Drive y recibos

## Estructura

```
app/
├── page.jsx        landing pública
├── dashboard/      panel de gestión
├── escuela/        sección de escuela
├── ventoapp/       acceso a la app
└── api/            audio, Drive, PDFs, recibos, usuarios
lib/                auth, permisos, storage, slugs
pdfs/               partituras
scripts/            carga de partituras y storage
```

## Puesta en marcha

Requisitos: Node.js 20 o superior (requisito de Next.js 16) y npm.

```bash
npm install
cp .env.example .env.local     # Windows PowerShell: Copy-Item .env.example .env.local
npm run dev
```

Abrir `http://localhost:3000`.

### Variables de entorno

`.env.local` no se versiona; [`.env.example`](.env.example) lista solo los nombres. Se necesitan dos grupos:

- **Google Drive / OAuth:** `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI` y `GOOGLE_REFRESH_TOKEN`. El refresh token se obtiene con el flujo OAuth: `node scripts/generateAuthUrl.js` y el callback de `/api/oauth2callback`.
- **Firebase Admin SDK:** `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL` y `FIREBASE_PRIVATE_KEY` (con los saltos de línea escapados como `\n`).

### Credenciales de los scripts

`serviceAccountKey.json`, en la raíz de la app, no se versiona. Lo usan **solo los scripts**: `npm run upload:partituras`, `npm run upload:tostorage` y los de `scripts/` que inicializan el Admin SDK.

## Seguridad

- `.env.local` y `serviceAccountKey.json` no se versionan.
- La API key web de Firebase es pública por diseño; se restringe por dominio.
- El panel requiere autenticación y permisos.

## Capturas

_(pendiente: agregar en `docs/screenshots/`)_
