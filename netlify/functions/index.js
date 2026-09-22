const { ok, preflight } = require("./_shared/response");

const ENDPOINTS = [
  { path: "/tools/rfweb2apk-url",  id: "rfweb2apk-url",  category: "TOOLS",   method: "POST", desc: "Convert website URL → APK", params: ["url","app_name","package","version","code"] },
  { path: "/tools/rfweb2apk-zip",  id: "rfweb2apk-zip",  category: "TOOLS",   method: "POST", desc: "Convert ZIP → APK",         params: ["url","app_name","package","version","code"] },
  { path: "/tools/rfweb2apk-html", id: "rfweb2apk-html", category: "TOOLS",   method: "POST", desc: "Convert HTML → APK",        params: ["url","app_name","package","version","code"] },
  { path: "/premium/am-send",      id: "am-send",        category: "PREMIUM", method: "POST", desc: "Kirim magic link Alight Motion", params: ["email"] },
  { path: "/premium/am-verify",    id: "am-verify",      category: "PREMIUM", method: "POST", desc: "Verifikasi oobCode & aktifkan premium", params: ["email","code"] },
  { path: "/premium/am-refresh",   id: "am-refresh",     category: "PREMIUM", method: "POST", desc: "Refresh id_token", params: ["refresh_token"] },
  { path: "/premium/am-status",    id: "am-status",      category: "PREMIUM", method: "POST", desc: "Cek status sesi", params: ["refresh_token"] },
];

exports.handler = async (event) => {
  const pf = preflight(event);
  if (pf) return pf;
  return ok("index", "SYSTEM", { total: ENDPOINTS.length, endpoints: ENDPOINTS });
};
