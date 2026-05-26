import { createMimeMessage } from "mimetext";
import { EmailMessage } from "cloudflare:email";

/**
 * Arabia Khaleej Contact Form Worker
 * Handles contact form submissions via email forwarding using Cloudflare Email Workers.
 * Uses Cloudflare's SEND_EMAIL binding rather than external SMTP to avoid deliverability
 * issues and ensure reliable delivery within the Cloudflare ecosystem.
 */
const RECIPIENT_EMAIL = process.env.CONTACT_RECIPIENT_EMAIL || "asishchilakapati@gmail.com";

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get("Origin");
    // Allow any origin for development flexibility, but restrict in production
    const corsHeaders = {
      "Access-Control-Allow-Origin": origin || "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle CORS preflight requests for cross-origin form submissions
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Only accept POST requests for form submissions - prevents accidental spam via GET
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
    }

    try {
      const body = await request.json();
      const { email, name, message } = body;

      // Email is required for contact form submission - we need a way to respond
      if (!email) {
        return new Response(JSON.stringify({ error: "Email is required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      console.log(`Processing contact form: ${email} | Name: ${name || 'N/A'}`);

      // Create a professional MIME email using mimetext library
      const msg = createMimeMessage();
      msg.setSender({ name: "Arabia Khaleej Service", addr: "connect@arabiakhaleej.com" });
      msg.setRecipient(RECIPIENT_EMAIL);
      msg.setSubject(`✨ New Inquiry: ${name || email}`);
      // HTML email template uses inline styles because many email clients strip <style> tags
      msg.addMessage({
        contentType: 'text/html',
        data: `
          <div style="font-family: sans-serif; padding: 40px; background-color: #f9f9f9; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px; border: 1px solid #D4AF37;">
              <h2 style="color: #D4AF37; margin-bottom: 20px;">Access Request</h2>
              <p>A new request has been received for the <strong>Arabia Khaleej</strong> reference portal.</p>
              <div style="margin: 30px 0; padding: 20px; background: #fafafa; border-radius: 8px; border-left: 4px solid #D4AF37;">
                <p style="margin: 0 0 10px 0; font-size: 16px;"><strong>Name:</strong> ${name || 'Not provided'}</p>
                <p style="margin: 0 0 10px 0; font-size: 16px;"><strong>Email:</strong> ${email}</p>
                <p style="margin: 0; font-size: 16px;"><strong>Message:</strong></p>
                <div style="margin-top: 10px; padding: 15px; background: white; border-radius: 6px; border: 1px solid #eee; white-space: pre-wrap;">
                  ${message || 'No message provided'}
                </div>
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

      // Internal Notification (To Owner)
      // Uses Cloudflare's Send Email binding for reliable delivery within the CF ecosystem
      if (env.SEND_EMAIL) {
        const emailMsg = new EmailMessage(
          "connect@arabiakhaleej.com",
          RECIPIENT_EMAIL,
          msg.asRaw()
        );
        await env.SEND_EMAIL.send(emailMsg);
        console.log("Internal notification sent successfully.");
      } else {
        throw new Error("SEND_EMAIL binding not found");
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    } catch (err) {
      console.error('Worker Error:', err.message);
      return new Response(JSON.stringify({
        error: "Internal Server Error",
        message: err.message
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  },

  // Email handler: forward direct emails to the recipient
  // Allows the worker to receive mail directly at contact@arabiakhaleej.com
  async email(message, env, ctx) {
    await message.forward(RECIPIENT_EMAIL);
    console.log(`Direct email forwarded from ${message.from}`);
  }
};