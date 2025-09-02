import { google } from "googleapis";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");

    if (!code) {
      return new Response("No code found in callback", { status: 400 });
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // Intercambiar el code por tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    console.log("✅ Tokens recibidos:", tokens);

    // TODO: acá guardar tokens.refresh_token en tu DB/Firebase
    // porque access_token expira en 1h, pero refresh_token sirve para renovarlo

    // Redirigimos a tu dashboard (o donde quieras en el frontend)
    return Response.redirect("http://localhost:3000/dashboard");
  } catch (err) {
    console.error("❌ Error en oauth2callback:", err);
    return new Response("OAuth2 error", { status: 500 });
  }
}