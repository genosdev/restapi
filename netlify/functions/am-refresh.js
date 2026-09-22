/* =========================================================
 * GEN REST API — Alight Motion: Refresh Session
 * Category : PREMIUM
 * Author   : GENOS
 * URL      : /premium/am-refresh
 * ========================================================= */

const { ok, fail, parseInput, preflight } = require("./_shared/response");

const API_KEY = "AIzaSyDtG1AU22ErnQD60AzBAcaknySiz9_CEq0";
const TOKEN_URL = "https://securetoken.googleapis.com/v1/token";

exports.handler = async (event) => {
  const pf = preflight(event);
  if (pf) return pf;

  const input = parseInput(event);
  const refToken = (input.refresh_token || "").trim();

  if (!refToken) return fail("am-refresh", "PREMIUM", "parameter 'refresh_token' wajib");

  try {
    const r = await fetch(`${TOKEN_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "refresh_token",
        refresh_token: refToken,
      }),
    });
    const text = await r.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }
    if (r.ok) {
      return ok("am-refresh", "PREMIUM", {
        id_token: data.id_token,
        refresh_token: data.refresh_token,
        user_id: data.user_id,
        expires_in: data.expires_in,
      });
    }
    return fail("am-refresh", "PREMIUM", text.slice(0, 300));
  } catch (e) {
    return fail("am-refresh", "PREMIUM", e.message);
  }
};