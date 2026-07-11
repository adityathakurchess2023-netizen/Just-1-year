const ALLOWED_ORIGIN = "*";

export default {
  async fetch(request, env) {
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

    const { system, messages, max_tokens } = body;

    if (!messages || !Array.isArray(messages)) {
      return json({ error: "Missing 'messages' array." }, 400);
    }

    if (!env.GEMINI_API_KEY) {
      return json({ error: "Server misconfigured: GEMINI_API_KEY secret is not set." }, 500);
    }

    const contents = messages.map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    const geminiPayload = {
      contents: contents,
      generationConfig: {
        maxOutputTokens: max_tokens || 1200,
      }
    };

    if (system) {
      geminiPayload.systemInstruction = {
        parts: [{ text: system }]
      };
    }
    
    // Automatically clean the key of any hidden terminal spaces or newlines
    const cleanKey = env.GEMINI_API_KEY.trim();
    
    try {
      const upstream = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${cleanKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(geminiPayload),
        }
      );

      const data = await upstream.json();

      if (!upstream.ok) {
        return json({ error: "Gemini API error: " + (data.error?.message || "Unknown error") }, 502);
      }

      const candidate = data.candidates?.[0];
      if (!candidate || !candidate.content) {
        return json({ error: "Gemini API returned no content." }, 500);
      }

      const outputText = candidate.content.parts?.[0]?.text || "";

      const responseBody = {
        content: [
          { type: "text", text: outputText }
        ]
      };

      return new Response(JSON.stringify(responseBody), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders(),
        },
      });
    } catch (err) {
      return json({ error: "Upstream request to Gemini failed: " + err.message }, 502);
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