const { ok, fail, parseInput, preflight } = require("./_shared/response");
const { runBuild } = require("./_shared/rfweb2apk-core");

exports.handler = async (event) => {
  const pf = preflight(event);
  if (pf) return pf;
  const input = parseInput(event);
  const logs = [];
  const log = (m) => logs.push(m);
  try {
    const result = await runBuild("html", input, log);
    const data = result.response || {};
    const dl = data.downloadUrl || data.apkUrl || data.url || null;
    return ok("rfweb2apk-html", "TOOLS", data, { download_url: dl, field_used: result.field_used, token: result.token, mode: "html", logs });
  } catch (err) {
    return fail("rfweb2apk-html", "TOOLS", err.message, { mode: "html", logs });
  }
};
