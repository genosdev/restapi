const { ok, fail, parseInput, preflight } = require("./_shared/response");
const API = "https://api.mail.tm";
const rnd = (n) => Math.random().toString(36).slice(2, 2 + n);

exports.handler = async (event) => {
  const pf = preflight(event); if (pf) return pf;
  const input = parseInput(event);
  try {
    const dr = await fetch(`${API}/domains`);
    const dd = await dr.json();
    const domains = (dd["hydra:member"] || []).filter(d => d.isActive);
    if (!domains.length) return fail("tempmail-create", "UTILITY", "tidak ada domain aktif");
    const username = input.username || rnd(10);
    const password = input.password || rnd(12);
    const address = `${username}@${domains[0].domain}`;

    const cr = await fetch(`${API}/accounts`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address, password }),
    });
    const acc = await cr.json();
    if (!cr.ok) return fail("tempmail-create", "UTILITY", JSON.stringify(acc).slice(0, 200));

    const lr = await fetch(`${API}/token`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address, password }),
    });
    const tok = await lr.json();
    return ok("tempmail-create", "UTILITY", {
      email: address, password, id: acc.id, token: tok.token, createdAt: acc.createdAt,
    });
  } catch (e) { return fail("tempmail-create", "UTILITY", e.message); }
};
