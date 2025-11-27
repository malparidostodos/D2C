import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

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
    const { email } = await request.json();

    if (!RESEND_API_KEY) {
      throw new Error("Missing RESEND_API_KEY");
    }
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase configuration");
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Generate the password reset link
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: "recovery",
      email: email,
      options: {
        redirectTo: `${request.headers.get("origin")}/reset-password`,
      },
    });

    if (linkError) {
      throw linkError;
    }

    const resetLink = linkData.properties.action_link;

    // Send email via Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Ta' To' Clean <onboarding@resend.dev>",
        to: [email],
        subject: "Recuperación de Contraseña - Ta' To' Clean",
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Recuperar Contraseña</title>
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
              <h2 style="margin: 0 0 20px; font-size: 24px; color: #ffffff;">Recuperación de Contraseña</h2>
              
              <p style="margin: 0 0 20px; line-height: 1.6; color: #cccccc;">
                Hemos recibido una solicitud para restablecer la contraseña de tu cuenta. Si no fuiste tú, puedes ignorar este correo.
              </p>

              <p style="margin: 0 0 30px; line-height: 1.6; color: #cccccc;">
                Para continuar con el proceso y crear una nueva contraseña, haz clic en el siguiente botón:
              </p>


              <!-- Button -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 30px 0;">
                <tr>
                  <td align="center" style="padding: 0;">
                    <table border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                      <tr>
                        <td align="center" bgcolor="#ffffff" style="border-radius: 50px; padding: 16px 40px;">
                          <a href="${resetLink}" target="_blank" style="font-size: 16px; font-family: Arial, sans-serif; color: #000000; text-decoration: none; font-weight: bold; display: inline-block;">Restablecer Contraseña</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin: 30px 0 0; font-size: 12px; color: #666666; text-align: center;">
                Este enlace expirará en 24 horas.
              </p>

              <!-- Fallback Link -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 20px;">
                <tr>
                  <td style="padding: 15px; background-color: #0a0a0a; border: 1px solid #222222; border-radius: 8px;">
                    <p style="margin: 0 0 8px; font-size: 12px; color: #888888; text-align: center;">
                      O también puedes hacer clic en este enlace:
                    </p>
                    <p style="margin: 0; font-size: 11px; text-align: center; word-break: break-all; line-height: 1.5;">
                      <a href="${resetLink}" target="_blank" style="color: #3b82f6; text-decoration: underline;">${resetLink}</a>
                    </p>
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

    if (!res.ok) {
      console.error("Resend API Error:", data);
      return new Response(JSON.stringify(data), { status: res.status, headers });
    }

    return new Response(JSON.stringify({ message: "Email sent successfully" }), {
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
