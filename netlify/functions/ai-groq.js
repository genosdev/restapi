const { ok, fail, parseInput, preflight } = require("./_shared/response");
const KEY = "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";
const URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "openai/gpt-oss-120b";

exports.handler = async (event) => {
  const pf = preflight(event); if (pf) return pf;
  const input = parseInput(event);
  const prompt = (input.prompt || "").trim();
  const system = (input.system || "").trim();
  if (!prompt) return fail("ai-groq", "AI", "parameter 'prompt' wajib");

  const messages = [];
  if (system) messages.push({ role: "system", content: system });
  messages.push({ role: "user", content: prompt });

  try {
    const r = await fetch(URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: MODEL, messages, temperature: 0.7, max_tokens: 1024 }),
    });
    const data = await r.json();
    if (!r.ok) return fail("ai-groq", "AI", JSON.stringify(data).slice(0, 300));
    return ok("ai-groq", "AI", {
      model: data.model,
      reply: data.choices?.[0]?.message?.content ?? null,
      finish_reason: data.choices?.[0]?.finish_reason ?? null,
      usage: data.usage ?? null,
    });
  } catch (e) { return fail("ai-groq", "AI", e.message); }
};
