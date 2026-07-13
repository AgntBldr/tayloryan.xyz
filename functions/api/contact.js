const jsonHeaders = {
  "Content-Type": "application/json",
};

function jsonResponse(body, init = {}) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      ...jsonHeaders,
      ...(init.headers || {}),
    },
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function cleanString(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();
    const name = cleanString(data.name, 120);
    const email = cleanString(data.email, 180);
    const subject = cleanString(data.subject, 160) || "Portfolio Contact Form";
    const message = cleanString(data.message, 5000);
    const honeycomb = cleanString(data.honeycomb, 120);

    if (honeycomb) {
      return jsonResponse({ success: true, message: "Thanks. Your message was sent." });
    }

    if (!name || !email || !message) {
      return jsonResponse(
        { success: false, error: "Please complete your name, email, and message." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return jsonResponse(
        { success: false, error: "Please enter a valid reply email." },
        { status: 400 }
      );
    }

    if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL || !env.CONTACT_FROM_EMAIL) {
      return jsonResponse(
        { success: false, error: "The contact form is temporarily unavailable." },
        { status: 503 }
      );
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message).replaceAll("\n", "<br>");
    const submittedAt = new Date().toISOString();

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM_EMAIL,
        to: [env.CONTACT_TO_EMAIL],
        reply_to: email,
        subject: `TaylorRyan.xyz: ${subject}`,
        html: `
          <h2>New portfolio contact form message</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Reply email:</strong> ${safeEmail}</p>
          <p><strong>Topic:</strong> ${safeSubject}</p>
          <p><strong>Submitted:</strong> ${escapeHtml(submittedAt)}</p>
          <hr>
          <p>${safeMessage}</p>
        `,
        text: [
          "New portfolio contact form message",
          "",
          `Name: ${name}`,
          `Reply email: ${email}`,
          `Topic: ${subject}`,
          `Submitted: ${submittedAt}`,
          "",
          message,
        ].join("\n"),
        tags: [
          { name: "source", value: "tayloryan_xyz" },
          { name: "type", value: "contact_form" },
        ],
      }),
    });

    if (!resendResponse.ok) {
      const errorBody = await resendResponse.text();
      console.error("Resend contact form error", resendResponse.status, errorBody);
      return jsonResponse(
        { success: false, error: "Message could not be sent. Please try again later." },
        { status: 502 }
      );
    }

    return jsonResponse({
      success: true,
      message: "Thanks. Your message was sent.",
    });
  } catch (err) {
    console.error("Contact form error", err);
    return jsonResponse(
      { success: false, error: "Server error handling contact form." },
      { status: 500 }
    );
  }
}
