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
    const {
      clientName,
      clientEmail,
      bookingDate,
      bookingTime,
      serviceName,
      vehicleType,
      vehiclePlate,
      totalPrice
    } = await request.json();

    console.log("Sending booking confirmation email to:", clientEmail);

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
        to: [clientEmail],
        subject: "¡Reserva Confirmada! - Ta' To' Clean",
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Reserva Confirmada</title>
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

          <!-- Success Icon -->
          <tr>
            <td align="center" style="padding: 30px 0 20px;">
              <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 0 40px 40px;">
              <h2 style="margin: 0 0 10px; font-size: 28px; text-align: center; color: #ffffff;">¡Reserva Confirmada!</h2>
              
              <p style="margin: 0 0 30px; text-align: center; line-height: 1.6; color: #cccccc;">
                Hola <strong style="color: #ffffff;">${clientName}</strong>, hemos recibido tu reserva. Aquí están los detalles:
              </p>

              <!-- Booking Details Box -->
              <div style="background-color: #1a1a1a; border: 1px solid #333333; border-radius: 12px; padding: 24px; margin: 30px 0;">
                <p style="margin: 0 0 16px; font-size: 12px; text-transform: uppercase; color: #666666; letter-spacing: 1px;">Detalles de tu Reserva</p>
                
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding-bottom: 12px;">
                      <span style="color: #888888; font-size: 14px;">📅 Fecha:</span>
                    </td>
                    <td align="right" style="padding-bottom: 12px;">
                      <span style="color: #ffffff; font-size: 14px; font-weight: bold;">${bookingDate}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 12px; border-top: 1px solid #333333; padding-top: 12px;">
                      <span style="color: #888888; font-size: 14px;">🕐 Hora:</span>
                    </td>
                    <td align="right" style="padding-bottom: 12px; border-top: 1px solid #333333; padding-top: 12px;">
                      <span style="color: #ffffff; font-size: 14px; font-weight: bold;">${bookingTime}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 12px; border-top: 1px solid #333333; padding-top: 12px;">
                      <span style="color: #888888; font-size: 14px;">✨ Servicio:</span>
                    </td>
                    <td align="right" style="padding-bottom: 12px; border-top: 1px solid #333333; padding-top: 12px;">
                      <span style="color: #ffffff; font-size: 14px; font-weight: bold;">${serviceName}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 12px; border-top: 1px solid #333333; padding-top: 12px;">
                      <span style="color: #888888; font-size: 14px;">🚗 Vehículo:</span>
                    </td>
                    <td align="right" style="padding-bottom: 12px; border-top: 1px solid #333333; padding-top: 12px;">
                      <span style="color: #ffffff; font-size: 14px; font-weight: bold;">${vehicleType}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 12px; border-top: 1px solid #333333; padding-top: 12px;">
                      <span style="color: #888888; font-size: 14px;">🏷️ Placa:</span>
                    </td>
                    <td align="right" style="padding-bottom: 12px; border-top: 1px solid #333333; padding-top: 12px;">
                      <span style="color: #ffffff; font-size: 14px; font-weight: bold;">${vehiclePlate}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-top: 12px; border-top: 1px solid #333333;">
                      <span style="color: #888888; font-size: 14px;">💰 Total:</span>
                    </td>
                    <td align="right" style="padding-top: 12px; border-top: 1px solid #333333;">
                      <span style="color: #10b981; font-size: 18px; font-weight: bold;">$${totalPrice.toLocaleString('es-CO')}</span>
                    </td>
                  </tr>
                </table>
              </div>

              <p style="margin: 30px 0 0; line-height: 1.6; color: #cccccc; text-align: center; font-size: 14px;">
                Nos vemos pronto. Estamos listos para darte el mejor servicio de detailing premium.
              </p>

              <p style="margin: 20px 0 0; line-height: 1.6; color: #888888; text-align: center; font-size: 12px;">
                ¿Necesitas modificar o cancelar tu reserva? Puedes hacerlo fácilmente desde tu <strong style="color: #3b82f6;">Dashboard</strong>.
              </p>

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

    return new Response(JSON.stringify({ message: "Booking confirmation email sent successfully" }), {
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
