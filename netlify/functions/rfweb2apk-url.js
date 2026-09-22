const { ok, fail, parseInput, preflight } = require("./_shared/response");
const { runBuild } = require("./_shared/rfweb2apk-core");

exports.handler = async (event) => {
  const pf = preflight(event);
  if (pf) return pf;
  const input = parseInput(event);
  const logs = [];
  const log = (m) => logs.push(m);
  try {
    const result = await runBuild("url", input, log);
    const data = result.response || {};
    const dl = data.downloadUrl || data.apkUrl || data.url || null;
    return ok("rfweb2apk-url", "TOOLS", data, { download_url: dl, field_used: result.field_used, token: result.token, mode: "url", logs });
  } catch (err) {
    return fail("rfweb2apk-url", "TOOLS", err.message, { mode: "url", logs });
  }
};
