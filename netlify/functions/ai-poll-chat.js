const { ok, fail, parseInput, preflight } = require("./_shared/response");
const URL = "https://text.pollinations.ai/openai";

exports.handler = async (event) => {
  const pf = preflight(event); if (pf) return pf;
  const input = parseInput(event);
  const prompt = (input.prompt || "").trim();
  const system = (input.system || "").trim();
  const jsonMode = String(input.json || "").toLowerCase() === "true";
  if (!prompt) return fail("ai-poll-chat", "AI", "parameter 'prompt' wajib");

  const messages = [];
  if (system) messages.push({ role: "system", content: system });
  messages.push({ role: "user", content: prompt });
  const payload = { model: "openai", messages, temperature: 0.7 };
  if (jsonMode) payload.response_format = { type: "json_object" };

  try {
    const r = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "User-Agent": "Mozilla/5.0" },
      body: JSON.stringify(payload),
    });
    const data = await r.json();
    if (!r.ok) return fail("ai-poll-chat", "AI", JSON.stringify(data).slice(0, 300));
    return ok("ai-poll-chat", "AI", {
      model: data.model || "openai",
      reply: data.choices?.[0]?.message?.content ?? null,
      finish_reason: data.choices?.[0]?.finish_reason ?? null,
      usage: data.usage ?? null,
    });
  } catch (e) { return fail("ai-poll-chat", "AI", e.message); }
};
