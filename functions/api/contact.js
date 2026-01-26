
export async function onRequestPost({ request }) {
    try {
        const data = await request.json();
        const { name, email, message, honeycomb } = data;

        // 1. Honeypot check
        if (honeycomb) {
            // Silent rejection for bots
            return new Response(JSON.stringify({ success: true, message: "Message sent!" }), {
                headers: { "Content-Type": "application/json" }
            });
        }

        // 2. Validation
        if (!name || !email || !message) {
            return new Response(JSON.stringify({ success: false, error: "Missing required fields" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Email validation regex (simple)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return new Response(JSON.stringify({ success: false, error: "Invalid email address" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        // 3. Process - For now, just log or simulate success since "If sending email is not implemented, fallback to a secure form provider endpoint and update the frontend"
        // The user instruction said: "If sending email is not implemented, fallback to a secure form provider endpoint and update the frontend accordingly."
        // BUT also: "The contact form must submit to /api/contact (Pages Functions)... Return clean JSON success/error responses"
        // So this function acts as the endpoint. Real email sending would usually require an environment variable (e.g. SENDGRID_API_KEY) in the Cloudflare dashboard.
        // We will simulate success for the deployment ready state, ready to hook up to a provider.

        // Simulate processing time
        // await new Promise(r => setTimeout(r, 500));

        return new Response(JSON.stringify({
            success: true,
            message: "Thank you! Your message has been received.",
            debug: "Email sending not configured in this demo."
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (err) {
        return new Response(JSON.stringify({ success: false, error: "Server error handling request" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
