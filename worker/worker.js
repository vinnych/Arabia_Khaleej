import { EmailMessage } from "cloudflare:email";
import { createMimeMessage } from "mimetext";

export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "https://arabiakhaleej.com",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
    }

    try {
      const body = await request.json();
      const email = body.email?.trim();
      
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return new Response(JSON.stringify({ error: "Invalid email" }), { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        });
      }

      const timestamp = new Date().toLocaleString("en-US", { timeZone: "Asia/Dubai" });
      const ip = request.headers.get("cf-connecting-ip") || "Unknown";

      // Construct Email
      const msg = createMimeMessage();
      msg.setSender({ name: "Arabia Khaleej Portal", addr: "connect@arabiakhaleej.com" });
      msg.setRecipient("asishchilakapati@gmail.com");
      msg.setSubject(`[Arabia Khaleej] New Invite Request: ${email}`);
      
      msg.addMessage({
        contentType: "text/html",
        data: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; background-color: #f9f9f9;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px; border: 1px solid #e0e0e0; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
              <h2 style="color: #d4af37; margin-top: 0; font-weight: 300; letter-spacing: 1px; text-transform: uppercase;">New Invite Request</h2>
              <p style="color: #333; font-size: 16px; line-height: 1.6;">You have received a new subscription or invite request from the portal.</p>
              
              <div style="margin: 30px 0; padding: 20px; background-color: #fdfaf2; border-left: 4px solid #d4af37;">
                <p style="margin: 0; font-size: 18px; color: #1a1a1a;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #d4af37; text-decoration: none;">${email}</a></p>
              </div>

              <div style="font-size: 12px; color: #999; border-top: 1px solid #eeeeee; padding-top: 20px;">
                <p style="margin: 5px 0;"><strong>Timestamp (Dubai):</strong> ${timestamp}</p>
                <p style="margin: 5px 0;"><strong>Origin IP:</strong> ${ip}</p>
              </div>
            </div>
          </div>
        `
      });

      const message = new EmailMessage(
        "connect@arabiakhaleej.com",
        "asishchilakapati@gmail.com",
        msg.asRaw()
      );

      await env.SEND_EMAIL.send(message);

      return new Response(JSON.stringify({ ok: true }), { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });

    } catch (err) {
      console.error(err);
      return new Response(JSON.stringify({ error: "Internal Server Error" }), { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }
  },
};
