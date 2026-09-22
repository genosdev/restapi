/* =========================================================
 * GEN REST API — Manifest + Category Icons
 * Author : GENOS
 * ========================================================= */

window.CATEGORY_ICONS = {
  ALL: '<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',
  AI: '<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M12 2l1.8 4.6L18 8.4l-4.2 1.8L12 15l-1.8-4.8L6 8.4l4.2-1.8L12 2z"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="19" r="2"/></svg>',
  TOOLS: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 01-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 015.4-5.4l-3 3-3-3 3-3z"/></svg>',
  PREMIUM: '<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M3 18h18l-2-11-5 4-4-7-4 7-5-4-2 11z"/></svg>',
  UPLOADER: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v12M6 10l6-6 6 6M4 20h16"/></svg>',
  UTILITY: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1"/></svg>',
};

window.ENDPOINTS = [
  /* ============ AI ============ */
  {
    id: "ai-groq",
    category: "AI",
    name: "Groq Chat",
    desc: "Chat AI via Groq (GPT-OSS 120B). Support system prompt.",
    method: "POST",
    path: "/ai/groq",
    inputs: [
      { key: "prompt", label: "Prompt", type: "textarea", placeholder: "Tulis pertanyaan...", required: true },
      { key: "system", label: "System (opsional)", type: "text", placeholder: "You are a helpful assistant" },
    ],
  },
  {
    id: "ai-poll-chat",
    category: "AI",
    name: "Pollinations Chat",
    desc: "Chat AI tanpa API key via Pollinations.",
    method: "POST",
    path: "/ai/poll-chat",
    inputs: [
      { key: "prompt", label: "Prompt", type: "textarea", placeholder: "Tulis pertanyaan...", required: true },
      { key: "system", label: "System (opsional)", type: "text", placeholder: "You are a helpful assistant" },
      { key: "json", label: "JSON Mode (true/false)", type: "text", placeholder: "false", default: "false" },
    ],
  },
  {
    id: "ai-poll-img",
    category: "AI",
    name: "Pollinations Image",
    desc: "Generate gambar AI tanpa API key. Returns URL.",
    method: "POST",
    path: "/ai/poll-img",
    inputs: [
      { key: "prompt", label: "Prompt", type: "textarea", placeholder: "A cyberpunk city at night", required: true },
      { key: "width", label: "Width", type: "text", default: "1024" },
      { key: "height", label: "Height", type: "text", default: "1024" },
    ],
  },

  /* ============ TOOLS ============ */
  {
    id: "rfweb2apk-url",
    category: "TOOLS",
    name: "RF — URL to APK",
    desc: "Convert website URL jadi APK Android.",
    method: "POST",
    path: "/tools/rfweb2apk-url",
    inputs: [
      { key: "url", label: "Website URL", type: "text", placeholder: "https://tokosaya.com", required: true },
      { key: "app_name", label: "Nama App", type: "text", default: "My App" },
      { key: "package", label: "Package", type: "text", placeholder: "com.toko.saya" },
      { key: "version", label: "Versi", type: "text", default: "1.0" },
      { key: "code", label: "Build Code", type: "text", default: "1" },
    ],
  },
  {
    id: "rfweb2apk-zip",
    category: "TOOLS",
    name: "RF — ZIP to APK",
    desc: "Convert file ZIP jadi APK. Drag & drop file ZIP di sini.",
    method: "POST",
    path: "/tools/rfweb2apk-zip",
    inputs: [
      { key: "url", label: "ZIP URL (atau drop file di bawah)", type: "text", placeholder: "https://.../website.zip", accept: "file" },
      { key: "app_name", label: "Nama App", type: "text", default: "My App" },
      { key: "package", label: "Package", type: "text", placeholder: "com.toko.saya" },
      { key: "version", label: "Versi", type: "text", default: "1.0" },
      { key: "code", label: "Build Code", type: "text", default: "1" },
    ],
  },
  {
    id: "rfweb2apk-html",
    category: "TOOLS",
    name: "RF — HTML to APK",
    desc: "Convert file HTML jadi APK. Drag & drop file HTML di sini.",
    method: "POST",
    path: "/tools/rfweb2apk-html",
    inputs: [
      { key: "url", label: "HTML URL (atau drop file di bawah)", type: "text", placeholder: "https://.../index.html", accept: "file" },
      { key: "app_name", label: "Nama App", type: "text", default: "My App" },
      { key: "package", label: "Package", type: "text", placeholder: "com.toko.saya" },
      { key: "version", label: "Versi", type: "text", default: "1.0" },
      { key: "code", label: "Build Code", type: "text", default: "1" },
    ],
  },

  /* ============ PREMIUM ============ */
  {
    id: "am-send",
    category: "PREMIUM",
    name: "AM — Send Magic Link",
    desc: "Kirim magic link login Alight Motion.",
    method: "POST",
    path: "/premium/am-send",
    inputs: [
      { key: "email", label: "Email", type: "text", placeholder: "user@gmail.com", required: true },
    ],
  },
  {
    id: "am-verify",
    category: "PREMIUM",
    name: "AM — Verify & Activate",
    desc: "Verifikasi oobCode & aktifkan premium.",
    method: "POST",
    path: "/premium/am-verify",
    inputs: [
      { key: "email", label: "Email", type: "text", required: true },
      { key: "code", label: "Magic Link / oobCode", type: "textarea", required: true },
    ],
  },
  {
    id: "am-refresh",
    category: "PREMIUM",
    name: "AM — Refresh Session",
    desc: "Refresh id_token dari refresh_token.",
    method: "POST",
    path: "/premium/am-refresh",
    inputs: [{ key: "refresh_token", label: "Refresh Token", type: "text", required: true }],
  },
  {
    id: "am-status",
    category: "PREMIUM",
    name: "AM — Session Status",
    desc: "Cek status sesi & user info.",
    method: "POST",
    path: "/premium/am-status",
    inputs: [{ key: "refresh_token", label: "Refresh Token", type: "text", required: true }],
  },

  /* ============ UPLOADER ============ */
  {
    id: "catbox-file",
    category: "UPLOADER",
    name: "Catbox — Upload Permanent",
    desc: "Upload file permanen ke Catbox.moe. Drag & drop file di sini.",
    method: "POST",
    path: "/uploader/catbox-file",
    inputs: [
      { key: "file_b64", label: "File (drag & drop)", type: "file", accept: "file", required: true },
      { key: "filename", label: "Nama File", type: "text", placeholder: "otomatis" },
    ],
  },
  {
    id: "catbox-temp",
    category: "UPLOADER",
    name: "Catbox — Upload Temporary",
    desc: "Upload file sementara (Litterbox). Drag & drop file di sini.",
    method: "POST",
    path: "/uploader/catbox-temp",
    inputs: [
      { key: "file_b64", label: "File (drag & drop)", type: "file", accept: "file", required: true },
      { key: "filename", label: "Nama File", type: "text", placeholder: "otomatis" },
      { key: "time", label: "Durasi (1h / 12h / 24h / 72h)", type: "text", default: "24h" },
    ],
  },
  {
    id: "catbox-url",
    category: "UPLOADER",
    name: "Catbox — Upload dari URL",
    desc: "Upload file dari URL sumber ke Catbox.",
    method: "POST",
    path: "/uploader/catbox-url",
    inputs: [
      { key: "url", label: "Source URL", type: "text", placeholder: "https://.../file.jpg", required: true },
    ],
  },

  /* ============ UTILITY ============ */
  {
    id: "tempmail-domains",
    category: "UTILITY",
    name: "TempMail — Domains",
    desc: "List domain aktif dari mail.tm",
    method: "POST",
    path: "/utility/tempmail-domains",
    inputs: [],
  },
  {
    id: "tempmail-create",
    category: "UTILITY",
    name: "TempMail — Create",
    desc: "Buat inbox email sementara baru.",
    method: "POST",
    path: "/utility/tempmail-create",
    inputs: [
      { key: "username", label: "Username (opsional)", type: "text", placeholder: "otomatis" },
      { key: "password", label: "Password (opsional)", type: "text", placeholder: "otomatis" },
    ],
  },
  {
    id: "tempmail-inbox",
    category: "UTILITY",
    name: "TempMail — Inbox",
    desc: "List pesan di inbox.",
    method: "POST",
    path: "/utility/tempmail-inbox",
    inputs: [
      { key: "email", label: "Email", type: "text", required: true },
      { key: "password", label: "Password", type: "text", required: true },
    ],
  },
  {
    id: "tempmail-read",
    category: "UTILITY",
    name: "TempMail — Read Message",
    desc: "Baca pesan spesifik dari inbox.",
    method: "POST",
    path: "/utility/tempmail-read",
    inputs: [
      { key: "email", label: "Email", type: "text", required: true },
      { key: "password", label: "Password", type: "text", required: true },
      { key: "id", label: "Message ID", type: "text", required: true },
    ],
  },
  {
    id: "kbbj",
    category: "UTILITY",
    name: "KBBJ — Kamus Jomok",
    desc: "Cari kata di Kamus Besar Bahasa Jomok.",
    method: "POST",
    path: "/utility/kbbj",
    inputs: [
      { key: "kata", label: "Kata", type: "text", placeholder: "contoh: keseleo", required: true },
    ],
  },
];

window.getEndpoints = () => window.ENDPOINTS;
window.getEndpointsByCategory = (cat) =>
  !cat || cat === "ALL" ? window.ENDPOINTS : window.ENDPOINTS.filter((e) => e.category === cat);
window.getEndpointById = (id) => window.ENDPOINTS.find((e) => e.id === id);
window.getCategories = () => {
  const s = new Set(window.ENDPOINTS.map((e) => e.category));
  return ["ALL", ...Array.from(s)];
};
