import { createMimeMessage } from "mimetext";

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin");
    const corsHeaders = {
      "Access-Control-Allow-Origin": origin || "*",
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
      const { email } = await request.json();

      if (!email) {
        return new Response(JSON.stringify({ error: "Email is required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Create a professional MIME email
      const msg = createMimeMessage();
      msg.setSender({ name: "Arabia Khaleej", addr: "connect@arabiakhaleej.com" });
      msg.setRecipient("asishchilakapati@gmail.com");
      msg.setSubject("✨ New Inquiry: Arabia Khaleej");
      msg.addMessage({
        contentType: 'text/html',
        data: `
          <div style="font-family: sans-serif; padding: 40px; background-color: #f9f9f9; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px; border: 1px solid #D4AF37;">
              <h2 style="color: #D4AF37; margin-bottom: 20px;">Community Inquiry</h2>
              <p>A new inquiry has been received for the <strong>Arabia Khaleej</strong> portal.</p>
              <div style="margin: 30px 0; padding: 20px; background: #fafafa; border-radius: 8px; border-left: 4px solid #D4AF37;">
                <p style="margin: 0; font-size: 16px;"><strong>Email:</strong> ${email}</p>
              </div>
              <p style="font-size: 12px; color: #999;">Date: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Dubai' })} GST</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
              <p style="font-size: 10px; color: #aaa; text-align: center; text-transform: uppercase; letter-spacing: 1px;">
                Arabia Khaleej — Premier Digital Experience
              </p>
            </div>
          </div>
        `
      });

      // Send the email using Cloudflare's Email Routing binding
      await env.SEND_EMAIL.send(msg);

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: "Internal Server Error", details: err.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }
};
