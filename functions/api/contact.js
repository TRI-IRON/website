// Cloudflare Pages Function — POST /api/contact
// Receives the site's contact form and forwards it to CONTACT_TO via Resend.
//
// Required env var (set in Cloudflare Pages dashboard → Settings → Environment variables):
//   RESEND_API_KEY  — API key from https://resend.com/api-keys
// Optional env vars (sensible defaults below):
//   CONTACT_TO      — recipient (default: benrobertsheriff@gmail.com)
//   CONTACT_FROM    — sender    (default: Tri-Iron site <onboarding@resend.dev>)
//
// Note on CONTACT_FROM: Resend's default `onboarding@resend.dev` works without
// domain verification, but only lets you send to the email you registered with.
// Once tri-iron.co.uk is verified in Resend, switch CONTACT_FROM to something
// like `Tri-Iron <hello@tri-iron.co.uk>` to send to any recipient.

export async function onRequestPost({ request, env }) {
  let data;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: "bad request" }, 400);
  }

  const name = str(data.name);
  const org = str(data.org);
  const msg = str(data.msg);
  const hp = str(data.hp);

  // Honeypot: bots fill hidden fields. Pretend success and drop.
  if (hp) return json({ ok: true });

  if (!name || !msg) return json({ ok: false, error: "missing fields" }, 400);
  if (name.length > 200 || org.length > 200 || msg.length > 5000) {
    return json({ ok: false, error: "too long" }, 400);
  }

  if (!env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set");
    return json({ ok: false, error: "not configured" }, 500);
  }

  const to = env.CONTACT_TO || "benrobertsheriff@gmail.com";
  const from = env.CONTACT_FROM || "Tri-Iron site <onboarding@resend.dev>";

  const subject = `Tri-Iron enquiry: ${name}${org ? " · " + org : ""}`;
  const textBody = [
    `From: ${name}`,
    org ? `Organisation: ${org}` : null,
    "",
    msg,
  ]
    .filter((x) => x !== null)
    .join("\n");
  const htmlBody = `
    <p><strong>From:</strong> ${esc(name)}</p>
    ${org ? `<p><strong>Organisation:</strong> ${esc(org)}</p>` : ""}
    <hr>
    <p>${esc(msg).replace(/\n/g, "<br>")}</p>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      text: textBody,
      html: htmlBody,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("Resend error", res.status, body);
    return json({ ok: false, error: "send failed" }, 502);
  }

  return json({ ok: true });
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function str(v) {
  return typeof v === "string" ? v.trim() : "";
}

function esc(s) {
  return s.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[c]);
}
