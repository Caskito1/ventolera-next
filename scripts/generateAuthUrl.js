import { google } from "googleapis";
import 'dotenv/config';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Generar URL para loguearse y autorizar
const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline", // 👈 Esto fuerza a que te devuelva el refresh_token
  prompt: "consent",      // 👈 Fuerza que pida permiso cada vez
  scope: [
    "https://www.googleapis.com/auth/drive.readonly",
    "https://www.googleapis.com/auth/calendar.readonly"
  ],
});

console.log("👉 Abre esta URL en el navegador:\n");
console.log(authUrl);
