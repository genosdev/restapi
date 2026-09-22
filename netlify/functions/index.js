/* =========================================================
 * GEN REST API — Index (list endpoints)
 * Author : GENOS
 * URL    : /api
 * ========================================================= */

const { ok, preflight } = require("./_shared/response");

const ENDPOINTS = [
  {
    path: "/tools/rfweb2apk",
    id: "rfweb2apk",
    category: "TOOLS",
    method: "POST",
    desc: "Auto-build APK dari URL website",
    params: ["url", "app_name", "package", "version", "code"],
  },
  {
    path: "/premium/am-send",
    id: "am-send",
    category: "PREMIUM",
    method: "POST",
    desc: "Kirim magic link Alight Motion",
    params: ["email"],
  },
  {
    path: "/premium/am-verify",
    id: "am-verify",
    category: "PREMIUM",
    method: "POST",
    desc: "Verifikasi oobCode & aktifkan premium",
    params: ["email", "code"],
  },
  {
    path: "/premium/am-refresh",
    id: "am-refresh",
    category: "PREMIUM",
    method: "POST",
    desc: "Refresh id_token",
    params: ["refresh_token"],
  },
  {
    path: "/premium/am-status",
    id: "am-status",
    category: "PREMIUM",
    method: "POST",
    desc: "Cek status sesi via refresh_token",
    params: ["refresh_token"],
  },
];

exports.handler = async (event) => {
  const pf = preflight(event);
  if (pf) return pf;

  return ok("index", "SYSTEM", {
    total: ENDPOINTS.length,
    endpoints: ENDPOINTS,
  });
};