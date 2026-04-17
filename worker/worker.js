import { EmailMessage } from "cloudflare:email";
import { createMimeMessage } from "mimetext";

export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    let email;
    try {
      const body = await request.json();
      email = body.email?.trim();
    } catch {
      return new Response("Invalid JSON", { status: 400 });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response("Invalid email", { status: 400 });
    }

    const msg = createMimeMessage();
    msg.setSender({ name: "Arabia Khaleej", addr: "connect@arabiakhaleej.com" });
    msg.setRecipient("asishchilakapati@gmail.com");
    msg.setSubject("New Invite Request");
    msg.addMessage({ contentType: "text/plain", data: `Invite request from: ${email}` });

    const message = new EmailMessage(
      "connect@arabiakhaleej.com",
      "asishchilakapati@gmail.com",
      msg.asRaw()
    );

    try {
      await env.SEND_EMAIL.send(message);
    } catch (err) {
      return new Response("Failed to send email", { status: 500 });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "https://arabiakhaleej.com",
      },
    });
  },
};
