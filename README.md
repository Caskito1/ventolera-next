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

```bash
npm install
npm run dev
```

### Variables de entorno

Crear `.env.local` (no se versiona) con las claves de Firebase y Google Drive. `serviceAccountKey.json` también es local y no se versiona.

## Seguridad

- `.env.local` y `serviceAccountKey.json` no se versionan.
- La API key web de Firebase es pública por diseño; se restringe por dominio.
- El panel requiere autenticación y permisos.

## Capturas

_(pendiente: agregar en `docs/screenshots/`)_
