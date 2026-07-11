/**
 * THE SYSTEM — AI Coach proxy worker.
 *
 * This is the ONLY piece of this project that touches your real Anthropic API key.
 * It runs on Cloudflare's free tier, holds your key as a secret (never visible to
 * anyone visiting your site), and forwards requests from the app to Claude.
 *
 * Deploy steps are in AI_COACH_SETUP.md — you do not need to understand Cloudflare
 * to follow them, just copy/paste commands.
 */

const ALLOWED_ORIGIN = "*"; // tighten to your github.io URL once it's working, e.g. "https://adityathakurchess2023-netizen.github.io"

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders() });
    }

    if (request.method !== "POST") {
      return json({ error: "Only POST is supported." }, 405);
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return json({ error: "Invalid JSON body." }, 400);
    }

    const { model, system, messages, max_tokens } = body;

    if (!messages || !Array.isArray(messages)) {
      return json({ error: "Missing 'messages' array." }, 400);
    }

    if (!env.ANTHROPIC_API_KEY) {
      return json({ error: "Server misconfigured: ANTHROPIC_API_KEY secret is not set on this worker." }, 500);
    }

    try {
      const upstream = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: model || "claude-sonnet-4-6",
          max_tokens: max_tokens || 1200,
          system: system || undefined,
          messages,
        }),
      });

      const data = await upstream.text();

      return new Response(data, {
        status: upstream.status,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders(),
        },
      });
    } catch (err) {
      return json({ error: "Upstream request to Anthropic failed: " + err.message }, 502);
    }
  },
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: { "Content-Type": "application/json", ...corsHeaders() },
  });
}
