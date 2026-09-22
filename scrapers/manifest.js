/* =========================================================
 * GEN REST API — Frontend Manifest
 * Author : GENOS
 * ========================================================= */

window.ENDPOINTS = [
  /* ============ TOOLS ============ */
  {
    id: "rfweb2apk-url",
    category: "TOOLS",
    name: "RFWeb2APK — URL to APK",
    desc: "Convert website URL jadi file APK Android otomatis.",
    method: "POST",
    path: "/tools/rfweb2apk-url",
    inputs: [
      { key: "url", label: "Website URL", type: "text", placeholder: "https://tokosaya.com", required: true },
      { key: "app_name", label: "Nama App", type: "text", placeholder: "Toko Saya", default: "My App" },
      { key: "package", label: "Package", type: "text", placeholder: "com.toko.saya (opsional)" },
      { key: "version", label: "Versi", type: "text", default: "1.0" },
      { key: "code", label: "Build Code", type: "text", default: "1" },
      { key: "token", label: "Token (opsional)", type: "text", placeholder: "skip register" },
    ],
  },
  {
    id: "rfweb2apk-zip",
    category: "TOOLS",
    name: "RFWeb2APK — ZIP to APK",
    desc: "Convert file ZIP (website offline) jadi file APK Android.",
    method: "POST",
    path: "/tools/rfweb2apk-zip",
    inputs: [
      { key: "url", label: "ZIP URL", type: "text", placeholder: "https://.../website.zip", required: true },
      { key: "app_name", label: "Nama App", type: "text", placeholder: "Toko Saya", default: "My App" },
      { key: "package", label: "Package", type: "text", placeholder: "com.toko.saya (opsional)" },
      { key: "version", label: "Versi", type: "text", default: "1.0" },
      { key: "code", label: "Build Code", type: "text", default: "1" },
      { key: "token", label: "Token (opsional)", type: "text", placeholder: "skip register" },
    ],
  },
  {
    id: "rfweb2apk-html",
    category: "TOOLS",
    name: "RFWeb2APK — HTML to APK",
    desc: "Convert file HTML jadi file APK Android langsung.",
    method: "POST",
    path: "/tools/rfweb2apk-html",
    inputs: [
      { key: "url", label: "HTML URL", type: "text", placeholder: "https://.../index.html", required: true },
      { key: "app_name", label: "Nama App", type: "text", placeholder: "Toko Saya", default: "My App" },
      { key: "package", label: "Package", type: "text", placeholder: "com.toko.saya (opsional)" },
      { key: "version", label: "Versi", type: "text", default: "1.0" },
      { key: "code", label: "Build Code", type: "text", default: "1" },
      { key: "token", label: "Token (opsional)", type: "text", placeholder: "skip register" },
    ],
  },

  /* ============ PREMIUM ============ */
  {
    id: "am-send",
    category: "PREMIUM",
    name: "AM — Send Magic Link",
    desc: "Kirim magic link login ke email Alight Motion.",
    method: "POST",
    path: "/premium/am-send",
    inputs: [
      { key: "email", label: "Email", type: "text", placeholder: "user@gmail.com", required: true },
    ],
  },
  {
    id: "am-verify",
    category: "PREMIUM",
    name: "AM — Verify & Activate Premium",
    desc: "Verifikasi oobCode dari magic link & aktifkan premium.",
    method: "POST",
    path: "/premium/am-verify",
    inputs: [
      { key: "email", label: "Email", type: "text", placeholder: "user@gmail.com", required: true },
      { key: "code", label: "Magic Link / oobCode", type: "textarea", placeholder: "Tempel link dari email atau oobCode mentah", required: true },
    ],
  },
  {
    id: "am-refresh",
    category: "PREMIUM",
    name: "AM — Refresh Session",
    desc: "Refresh id_token dari refresh_token.",
    method: "POST",
    path: "/premium/am-refresh",
    inputs: [
      { key: "refresh_token", label: "Refresh Token", type: "text", required: true },
    ],
  },
  {
    id: "am-status",
    category: "PREMIUM",
    name: "AM — Session Status",
    desc: "Cek status sesi & user info via refresh_token.",
    method: "POST",
    path: "/premium/am-status",
    inputs: [
      { key: "refresh_token", label: "Refresh Token", type: "text", required: true },
    ],
  },
];

window.getEndpoints = () => window.ENDPOINTS;
window.getEndpointsByCategory = (cat) =>
  !cat || cat === "ALL"
    ? window.ENDPOINTS
    : window.ENDPOINTS.filter((e) => e.category === cat);
window.getEndpointById = (id) => window.ENDPOINTS.find((e) => e.id === id);
window.getCategories = () => {
  const s = new Set(window.ENDPOINTS.map((e) => e.category));
  return ["ALL", ...Array.from(s)];
};
