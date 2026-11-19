import { google } from "googleapis";
import "dotenv/config";

/**
 * Canjea el `code` de OAuth2 por tokens y los muestra en consola (local).
 * Reemplaza al endpoint retirado `/api/oauth2callback` (DT-06): los tokens
 * ya no salen por HTTP, solo se imprimen acá para copiarlos a `.env.local`.
 *
 * Uso:
 *   node scripts/exchangeOAuthToken.js <code>
 *   GOOGLE_CODE=<code> node scripts/exchangeOAuthToken.js
 *
 * El `code` sale de autorizar la URL que imprime `scripts/generateAuthUrl.js`.
 */

const code = process.argv[2] || process.env.GOOGLE_CODE;

if (!code) {
  console.error(
    "❌ Falta el code. Uso: node scripts/exchangeOAuthToken.js <code>"
  );
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

try {
  const { tokens } = await oauth2Client.getToken(code);
  console.log("✅ Tokens obtenidos (copiá el refresh_token a .env.local):\n");
  console.log(JSON.stringify(tokens, null, 2));
} catch (err) {
  console.error("❌ Error canjeando el code:", err?.message ?? err);
  process.exit(1);
}
