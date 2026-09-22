const { ok, fail, parseInput, preflight } = require("./_shared/response");
const { uploadCatbox } = require("./_shared/catbox");

exports.handler = async (event) => {
  const pf = preflight(event); if (pf) return pf;
  const input = parseInput(event);
  if (!input.file_b64) return fail("catbox-file", "UPLOADER", "wajib kirim file_b64 (base64)");
  try {
    const r = await uploadCatbox(input.file_b64, input.filename || `upload-${Date.now()}`);
    return ok("catbox-file", "UPLOADER", r);
  } catch (e) { return fail("catbox-file", "UPLOADER", e.message); }
};
