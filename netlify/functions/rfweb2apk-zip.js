const { ok, fail, parseInput, preflight } = require("./_shared/response");
const { runBuild } = require("./_shared/rfweb2apk-core");

exports.handler = async (event) => {
  const pf = preflight(event); if (pf) return pf;
  const input = parseInput(event);
  const logs = []; const log = (m) => logs.push(m);
  try {
    const r = await runBuild("zip", input, log);
    const data = r.response || {};
    const dl = data.downloadUrl || data.apkUrl || data.url || null;
    return ok("rfweb2apk-zip", "TOOLS", data, { download_url: dl, field_used: r.field_used, token: r.token, source_url: r.source_url, mode: "zip", logs });
  } catch (err) { return fail("rfweb2apk-zip", "TOOLS", err.message, { mode: "zip", logs }); }
};
