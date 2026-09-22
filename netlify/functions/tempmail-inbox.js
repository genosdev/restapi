const { ok, fail, parseInput, preflight } = require("./_shared/response");
const API = "https://api.mail.tm";

async function login(email, password) {
  const r = await fetch(`${API}/token`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address: email, password }),
  });
  const d = await r.json();
  if (!r.ok) throw new Error(JSON.stringify(d));
  return d.token;
}

exports.handler = async (event) => {
  const pf = preflight(event); if (pf) return pf;
  const input = parseInput(event);
  const email = (input.email || "").trim();
  const password = (input.password || "").trim();
  if (!email || !password) return fail("tempmail-inbox", "UTILITY", "butuh email + password");
  try {
    const token = await login(email, password);
    const r = await fetch(`${API}/messages`, { headers: { Authorization: `Bearer ${token}` } });
    const d = await r.json();
    const messages = d["hydra:member"] || [];
    return ok("tempmail-inbox", "UTILITY", {
      email, total: messages.length,
      messages: messages.map(m => ({ id: m.id, from: m.from, subject: m.subject, intro: m.intro, seen: m.seen, createdAt: m.createdAt })),
    });
  } catch (e) { return fail("tempmail-inbox", "UTILITY", e.message); }
};
