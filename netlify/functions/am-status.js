/* =========================================================
 * GEN REST API — Alight Motion: Session Status
 * Category : PREMIUM
 * Author   : GENOS
 * URL      : /premium/am-status
 * ========================================================= */

const { ok, fail, parseInput, preflight } = require("./_shared/response");

const API_KEY = "AIzaSyDtG1AU22ErnQD60AzBAcaknySiz9_CEq0";
const IDT = "https://www.googleapis.com/identitytoolkit/v3/relyingparty";
const TOKEN_URL = "https://securetoken.googleapis.com/v1/token";

function randomIp() {
  const r = () => Math.floor(Math.random() * 255) + 1;
  return `${r()}.${r()}.${r()}.${r()}`;
}
function spoof(h) {
  const o = { ...h };
  o["x-forwarded-for"] = randomIp();
  o["x-real-ip"] = randomIp();
  o["client-ip"] = randomIp();
  o["x-client-ip"] = randomIp();
  o["x-originating-ip"] = randomIp();
  o["x-cluster-client-ip"] = randomIp();
  return o;
}

exports.handler = async (event) => {
  const pf = preflight(event);
  if (pf) return pf;

  const input = parseInput(event);
  const refToken = (input.refresh_token || "").trim();

  if (!refToken) return fail("am-status", "PREMIUM", "parameter 'refresh_token' wajib");

  // Refresh untuk dapetin id_token fresh
  let idToken;
  try {
    const r = await fetch(`${TOKEN_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "refresh_token",
        refresh_token: refToken,
      }),
    });
    const d = await r.json();
    if (!r.ok || !d.id_token) {
      return fail("am-status", "PREMIUM", "refresh_token tidak valid", { raw: d });
    }
    idToken = d.id_token;
  } catch (e) {
    return fail("am-status", "PREMIUM", e.message);
  }

  // Ambil info akun
  try {
    const r = await fetch(`${IDT}/getAccountInfo?key=${API_KEY}`, {
      method: "POST",
      headers: spoof({
        "content-type": "application/json",
        "x-android-package": "com.alightcreative.motion",
        "x-android-cert": "ECA6BF91B8715A6F810ED0BBFC65B6CD578F52A8",
        "user-agent": "dalvik/2.1.0 (linux; u; android 15; 23127pn0oc build/bp1a.250505.005)",
      }),
      body: JSON.stringify({ idToken }),
    });
    const d = await r.json();
    const user = (d.users && d.users[0]) || null;
    return ok("am-status", "PREMIUM", {
      active: true,
      user,
      id_token: idToken,
    });
  } catch (e) {
    return fail("am-status", "PREMIUM", e.message);
  }
};