/* =========================================================
 * GEN REST API — Alight Motion: Verify & Activate
 * Category : PREMIUM
 * Author   : GENOS
 * URL      : /premium/am-verify
 * ========================================================= */

const { ok, fail, parseInput, preflight } = require("./_shared/response");

const API_KEY = "AIzaSyDtG1AU22ErnQD60AzBAcaknySiz9_CEq0";
const IDT = "https://www.googleapis.com/identitytoolkit/v3/relyingparty";
const VFY = "https://us-central1-alight-creative.cloudfunctions.net/verifyPurchase";

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

function extractCode(raw) {
  if (!raw) return null;
  let s = String(raw).replace(/&amp;/g, "&");
  try { s = decodeURIComponent(s); } catch {}
  try {
    const u = new URL(s);
    const p = u.searchParams;
    let c = p.get("oobCode");
    if (!c) {
      const link = p.get("link") || p.get("q") || p.get("url");
      if (link) {
        try { c = new URL(link).searchParams.get("oobCode"); } catch {}
      }
    }
    if (c) return c;
  } catch {}
  const m = s.match(/oobCode=([a-zA-Z0-9_-]+)/i);
  if (m) return m[1];
  const t = raw.trim();
  if (/^[a-zA-Z0-9_-]{10,}$/.test(t) && !t.includes("://")) return t;
  return null;
}

function randomOrderId() {
  const c = "0123456789abcdef";
  let s = "neo-";
  for (let i = 0; i < 12; i++) s += c[Math.floor(Math.random() * 16)];
  return s;
}

async function postJson(url, body, headers) {
  const r = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });
  const text = await r.text();
  let data;
  try { data = JSON.parse(text); } catch { data = null; }
  return { ok: r.ok, status: r.status, data, raw: text };
}

exports.handler = async (event) => {
  const pf = preflight(event);
  if (pf) return pf;

  const input = parseInput(event);
  const email = (input.email || "").trim();
  const rawCode = (input.code || "").trim();

  if (!email) return fail("am-verify", "PREMIUM", "parameter 'email' wajib");
  if (!rawCode) return fail("am-verify", "PREMIUM", "parameter 'code' wajib");

  const code = extractCode(rawCode);
  if (!code) return fail("am-verify", "PREMIUM", "oobCode tidak ditemukan di input", { email });

  // Step 1: emailLinkSignin
  let idToken, refreshToken, localId, isNewUser;
  try {
    const r1 = await postJson(
      `${IDT}/emailLinkSignin?key=${API_KEY}`,
      { email, oobCode: code, clientType: "CLIENT_TYPE_ANDROID" },
      spoof({
        "content-type": "application/json",
        "x-android-package": "com.alightcreative.motion",
        "x-android-cert": "ECA6BF91B8715A6F810ED0BBFC65B6CD578F52A8",
        "user-agent": "dalvik/2.1.0 (linux; u; android 15; 23127pn0oc build/bp1a.250505.005)",
      })
    );
    if (!r1.ok) return fail("am-verify", "PREMIUM", r1.raw.slice(0, 300), { email });
    const d1 = r1.data || {};
    idToken = d1.idToken;
    refreshToken = d1.refreshToken;
    localId = d1.localId;
    isNewUser = !!d1.isNewUser;
    if (!idToken) return fail("am-verify", "PREMIUM", "idToken tidak ditemukan", { email });
  } catch (e) {
    return fail("am-verify", "PREMIUM", e.message, { email });
  }

  // Step 2: getAccountInfo
  let userInfo = null;
  try {
    const r2 = await postJson(
      `${IDT}/getAccountInfo?key=${API_KEY}`,
      { idToken },
      spoof({
        "content-type": "application/json",
        "x-android-package": "com.alightcreative.motion",
        "x-android-cert": "ECA6BF91B8715A6F810ED0BBFC65B6CD578F52A8",
        "user-agent": "dalvik/2.1.0 (linux; u; android 15; 23127pn0oc build/bp1a.250505.005)",
      })
    );
    if (r2.ok && r2.data && r2.data.users && r2.data.users[0]) userInfo = r2.data.users[0];
  } catch {}

  // Step 3: verifyPurchase
  const orderId = randomOrderId();
  const proPayload = {
    data: {
      productId: "am.full.sub.annual.19q4",
      token: "mmgaobamlahbbeccfplmbkbb.AO-J1OzqG0or_GJJIx-ms8GrTm-jaglCRfhQSRPUZKpl2YspYS-oN7_94uv8RC5vQbvd_Ios2pPDStZ2n7F0hLE3FiOU7HS3R6Fquulv5xLXFECSv4ctElW",
      skuType: "subs",
      orderId,
    },
  };
  let premium;
  try {
    const r3 = await postJson(
      VFY,
      proPayload,
      spoof({
        "content-type": "application/json; charset=utf-8",
        "user-agent": "okhttp/3.12.1",
        "accept-encoding": "gzip",
        authorization: `Bearer ${idToken}`,
        "firebase-instance-id-token": "cSDnCyp3T-uwp07z3tL86T:APA91bFkmvvsHw5nnqa1SBFci-99DRsKClLiETdRrVcJjS5yBx1v_FbCb1d8WhBuea_zmwnYBktyTIzcRhN4b6uNOUur9wPc0gKXmJDoZic0LhNq5V2s0xI",
      })
    );
    premium = r3.ok ? r3.data : { ok: false, why: r3.raw.slice(0, 200) };
  } catch (e) {
    premium = { ok: false, why: e.message };
  }

  return ok(
    "am-verify",
    "PREMIUM",
    {
      email,
      uid: localId,
      new_user: isNewUser,
      id_token: idToken,
      refresh_token: refreshToken,
      user: userInfo,
      premium,
    },
    { email, uid: localId }
  );
};