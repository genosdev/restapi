/* =========================================================
 * GEN REST API — Alight Motion: Send Magic Link
 * Category : PREMIUM
 * Author   : GENOS
 * URL      : /premium/am-send
 * ========================================================= */

const { ok, fail, parseInput, preflight } = require("./_shared/response");

const API_KEY = "AIzaSyDtG1AU22ErnQD60AzBAcaknySiz9_CEq0";
const IDT = "https://www.googleapis.com/identitytoolkit/v3/relyingparty";

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
  const email = (input.email || "").trim();

  if (!email) return fail("am-send", "PREMIUM", "parameter 'email' wajib");

  const url = `${IDT}/getOobConfirmationCode?key=${API_KEY}`;
  const payload = {
    requestType: 6,
    email,
    androidInstallApp: true,
    canHandleCodeInApp: true,
    continueUrl: "https://alightcreative.com?ui_sid=0366624874&ui_sd=0",
    iosBundleId: "com.alightcreative.motion",
    androidPackageName: "com.alightcreative.motion",
    androidMinimumVersion: "585",
    clientType: "CLIENT_TYPE_ANDROID",
  };

  try {
    const r = await fetch(url, {
      method: "POST",
      headers: spoof({
        "content-type": "application/json",
        "x-android-package": "com.alightcreative.motion",
        "x-android-cert": "ECA6BF91B8715A6F810ED0BBFC65B6CD578F52A8",
        "user-agent": "dalvik/2.1.0 (linux; u; android 15; 23127pn0oc build/bp1a.250505.005)",
      }),
      body: JSON.stringify(payload),
    });
    const text = await r.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }
    if (r.ok) return ok("am-send", "PREMIUM", data, { email });
    return fail("am-send", "PREMIUM", text.slice(0, 300), { email });
  } catch (e) {
    return fail("am-send", "PREMIUM", e.message, { email });
  }
};