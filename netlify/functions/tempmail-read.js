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
  const id = (input.id || "").trim();
  if (!email || !password || !id) return fail("tempmail-read", "UTILITY", "butuh email, password, id");
  try {
    const token = await login(email, password);
    const r = await fetch(`${API}/messages/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    const m = await r.json();
    if (!r.ok) return fail("tempmail-read", "UTILITY", JSON.stringify(m).slice(0, 200));
    return ok("tempmail-read", "UTILITY", {
      id: m.id, from: m.from, to: m.to, subject: m.subject,
      intro: m.intro, seen: m.seen, html: m.html, text: m.text, createdAt: m.createdAt,
    });
  } catch (e) { return fail("tempmail-read", "UTILITY", e.message); }
};
