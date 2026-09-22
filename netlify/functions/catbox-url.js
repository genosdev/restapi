const { ok, fail, parseInput, preflight } = require("./_shared/response");
const { uploadUrl } = require("./_shared/catbox");

exports.handler = async (event) => {
  const pf = preflight(event); if (pf) return pf;
  const input = parseInput(event);
  const url = (input.url || "").trim();
  if (!url) return fail("catbox-url", "UPLOADER", "parameter 'url' wajib");
  try {
    const r = await uploadUrl(url);
    return ok("catbox-url", "UPLOADER", r);
  } catch (e) { return fail("catbox-url", "UPLOADER", e.message); }
};
