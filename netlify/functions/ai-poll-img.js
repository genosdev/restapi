const { ok, fail, parseInput, preflight } = require("./_shared/response");
const BASE = "https://image.pollinations.ai/prompt/";

exports.handler = async (event) => {
  const pf = preflight(event); if (pf) return pf;
  const input = parseInput(event);
  const prompt = (input.prompt || "").trim();
  const width = parseInt(input.width) || 1024;
  const height = parseInt(input.height) || 1024;
  if (!prompt) return fail("ai-poll-img", "AI", "parameter 'prompt' wajib");

  const seed = Math.floor(Math.random() * 1000000);
  const params = new URLSearchParams({
    width: String(width), height: String(height),
    seed: String(seed), model: "flux", nologo: "true", enhance: "true",
  });
  const url = `${BASE}${encodeURIComponent(prompt)}?${params}`;
  return ok("ai-poll-img", "AI", { prompt, width, height, seed, url });
};
