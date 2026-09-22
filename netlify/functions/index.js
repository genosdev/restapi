const { ok, preflight } = require("./_shared/response");

const ENDPOINTS = [
  { path:"/ai/groq",                   id:"ai-groq",            category:"AI",       method:"POST", desc:"Groq Chat (GPT-OSS 120B)" },
  { path:"/ai/poll-chat",              id:"ai-poll-chat",       category:"AI",       method:"POST", desc:"Pollinations Chat" },
  { path:"/ai/poll-img",               id:"ai-poll-img",        category:"AI",       method:"POST", desc:"Pollinations Image URL" },
  { path:"/tools/rfweb2apk-url",       id:"rfweb2apk-url",      category:"TOOLS",    method:"POST", desc:"URL → APK" },
  { path:"/tools/rfweb2apk-zip",       id:"rfweb2apk-zip",      category:"TOOLS",    method:"POST", desc:"ZIP → APK" },
  { path:"/tools/rfweb2apk-html",      id:"rfweb2apk-html",     category:"TOOLS",    method:"POST", desc:"HTML → APK" },
  { path:"/premium/am-send",           id:"am-send",            category:"PREMIUM",  method:"POST", desc:"AM Send Magic Link" },
  { path:"/premium/am-verify",         id:"am-verify",          category:"PREMIUM",  method:"POST", desc:"AM Verify Premium" },
  { path:"/premium/am-refresh",        id:"am-refresh",         category:"PREMIUM",  method:"POST", desc:"AM Refresh Token" },
  { path:"/premium/am-status",         id:"am-status",          category:"PREMIUM",  method:"POST", desc:"AM Session Status" },
  { path:"/uploader/catbox-file",      id:"catbox-file",        category:"UPLOADER", method:"POST", desc:"Catbox Permanent Upload" },
  { path:"/uploader/catbox-temp",      id:"catbox-temp",        category:"UPLOADER", method:"POST", desc:"Litterbox Temp Upload" },
  { path:"/uploader/catbox-url",       id:"catbox-url",         category:"UPLOADER", method:"POST", desc:"Catbox URL Upload" },
  { path:"/utility/tempmail-domains",  id:"tempmail-domains",   category:"UTILITY",  method:"POST", desc:"List domains mail.tm" },
  { path:"/utility/tempmail-create",   id:"tempmail-create",    category:"UTILITY",  method:"POST", desc:"Buat inbox baru" },
  { path:"/utility/tempmail-inbox",    id:"tempmail-inbox",     category:"UTILITY",  method:"POST", desc:"List pesan" },
  { path:"/utility/tempmail-read",     id:"tempmail-read",      category:"UTILITY",  method:"POST", desc:"Baca pesan" },
  { path:"/utility/kbbj",              id:"kbbj",               category:"UTILITY",  method:"POST", desc:"Kamus Bahasa Jomok" },
];

exports.handler = async (event) => {
  const pf = preflight(event);
  if (pf) return pf;
  return ok("index", "SYSTEM", { total: ENDPOINTS.length, endpoints: ENDPOINTS });
};
