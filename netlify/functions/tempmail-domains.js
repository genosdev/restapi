const { ok, fail, preflight } = require("./_shared/response");
const API = "https://api.mail.tm";
exports.handler = async (event) => {
  const pf = preflight(event); if (pf) return pf;
  try {
    const r = await fetch(`${API}/domains`);
    const d = await r.json();
    const domains = d["hydra:member"] || [];
    return ok("tempmail-domains", "UTILITY", { total: domains.length, domains: domains.map(x => ({ id: x.id, domain: x.domain, active: x.isActive })) });
  } catch (e) { return fail("tempmail-domains", "UTILITY", e.message); }
};
