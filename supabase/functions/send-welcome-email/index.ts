import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const handler = async (request: Request): Promise<Response> => {
    // CORS headers
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
        "Content-Type": "application/json",
    };

    if (request.method === "OPTIONS") {
        return new Response("ok", { headers });
    }

    try {
        const { email, name, password } = await request.json();
        console.log("Attempting to send email to:", email);

        if (!RESEND_API_KEY) {
            console.error("RESEND_API_KEY is missing");
            throw new Error("Missing RESEND_API_KEY environment variable");
        }

        const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: "Ta' To' Clean <onboarding@resend.dev>",
                to: [email],
                subject: "Bienvenido a la Experiencia Elite",
                html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Bienvenido a Ta' To' Clean</title>
</head>
<body style="margin: 0; padding: 0; background-color: #050505; font-family: 'Arial', sans-serif; color: #ffffff;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #050505;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        
        <!-- Main Container -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #111111; border: 1px solid #333333; border-radius: 16px; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 40px 0; background: linear-gradient(180deg, #1a1a1a 0%, #111111 100%);">
              <h1 style="margin: 0; font-size: 32px; font-weight: bold; letter-spacing: -1px; color: #ffffff;">
                Ta' <span style="color: #3b82f6;">To'</span> Clean
              </h1>
              <p style="margin: 10px 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #888888;">Cuidado Automotriz Premium</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 40px;">
              <h2 style="margin: 0 0 20px; font-size: 24px; color: #ffffff;">Hola, ${name || 'Cliente VIP'}</h2>
              
              <p style="margin: 0 0 20px; line-height: 1.6; color: #cccccc;">
                Bienvenido a la familia. Has dado el primer paso para transformar el cuidado de tu vehículo. Tu cuenta ha sido creada exitosamente.
              </p>

              <!-- Credentials Box -->
              <div style="background-color: #1a1a1a; border: 1px solid #333333; border-radius: 12px; padding: 20px; margin: 30px 0;">
                <p style="margin: 0 0 10px; font-size: 12px; text-transform: uppercase; color: #666666; letter-spacing: 1px;">Tus Credenciales de Acceso</p>
                
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding-bottom: 8px;">
                      <span style="color: #888888; font-size: 14px;">Correo:</span>
                    </td>
                    <td align="right" style="padding-bottom: 8px;">
                      <span style="color: #ffffff; font-size: 14px; font-weight: bold;">${email}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="border-top: 1px solid #333333; padding-top: 8px;">
                      <span style="color: #888888; font-size: 14px;">Contraseña:</span>
                    </td>
                    <td align="right" style="border-top: 1px solid #333333; padding-top: 8px;">
                      <span style="color: #ffffff; font-size: 14px; font-weight: bold;">${password}</span>
                    </td>
                  </tr>
                </table>
              </div>

              <p style="margin: 0 0 30px; line-height: 1.6; color: #cccccc;">
                Ya puedes acceder a tu panel para gestionar tus vehículos y agendar tu próxima cita premium.
              </p>

              <!-- Button -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="https://tu-dominio.com/login" style="display: inline-block; padding: 16px 32px; background-color: #ffffff; color: #000000; font-weight: bold; text-decoration: none; border-radius: 50px; font-size: 16px;">
                      Iniciar Sesión
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #0a0a0a; border-top: 1px solid #222222; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #444444;">
                &copy; ${new Date().getFullYear()} Ta' To' Clean. Todos los derechos reservados.
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>
        `,
            }),
        });

        const data = await res.json();
        console.log("Resend API response:", data);

        if (!res.ok) {
            console.error("Resend API Error:", data);
            return new Response(JSON.stringify(data), { status: res.status, headers });
        }

        return new Response(JSON.stringify(data), {
            status: 200,
            headers,
        });
    } catch (error: any) {
        console.error("Edge Function Error:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers,
        });
    }
};

serve(handler);