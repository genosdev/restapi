const { ok, fail, parseInput, preflight } = require("./_shared/response");
const { uploadLitter } = require("./_shared/catbox");

exports.handler = async (event) => {
  const pf = preflight(event); if (pf) return pf;
  const input = parseInput(event);
  if (!input.file_b64) return fail("catbox-temp", "UPLOADER", "wajib kirim file_b64 (base64)");
  try {
    const r = await uploadLitter(input.file_b64, input.filename || `upload-${Date.now()}`, input.time || "24h");
    return ok("catbox-temp", "UPLOADER", r);
  } catch (e) { return fail("catbox-temp", "UPLOADER", e.message); }
};
