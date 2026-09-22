const CATBOX_API = "https://catbox.moe/user/api.php";
const LITTER_API = "https://litterbox.catbox.moe/resources/internals/api.php";
const USER_HASH = process.env.CATBOX_USERHASH || "";
const UA = "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/124.0.0.0 Mobile Safari/537.36";

function toBlob(b64, filename) {
  const buf = Buffer.from(b64, "base64");
  return { blob: new Blob([buf]), size: buf.length, filename };
}

async function uploadCatbox(file_b64, filename) {
  const { blob, size } = toBlob(file_b64, filename);
  const form = new FormData();
  form.append("reqtype", "fileupload");
  form.append("fileToUpload", blob, filename);
  if (USER_HASH) form.append("userhash", USER_HASH);
  const r = await fetch(CATBOX_API, { method: "POST", headers: { "User-Agent": UA }, body: form });
  const url = (await r.text()).trim();
  if (!url.startsWith("http")) throw new Error(url);
  return { url, size, filename, type: "permanent" };
}

async function uploadLitter(file_b64, filename, time) {
  const valid = ["1h","12h","24h","72h"];
  if (!valid.includes(time)) throw new Error("time invalid");
  const { blob, size } = toBlob(file_b64, filename);
  const form = new FormData();
  form.append("reqtype", "fileupload");
  form.append("time", time);
  form.append("fileToUpload", blob, filename);
  const r = await fetch(LITTER_API, { method: "POST", headers: { "User-Agent": UA }, body: form });
  const url = (await r.text()).trim();
  if (!url.startsWith("http")) throw new Error(url);
  return { url, size, filename, expires: time, type: "temp" };
}

async function uploadUrl(sourceUrl) {
  const form = new FormData();
  form.append("reqtype", "urlupload");
  form.append("url", sourceUrl);
  if (USER_HASH) form.append("userhash", USER_HASH);
  const r = await fetch(CATBOX_API, { method: "POST", headers: { "User-Agent": UA }, body: form });
  const url = (await r.text()).trim();
  if (!url.startsWith("http")) throw new Error(url);
  return { url, source: sourceUrl, type: "url" };
}

module.exports = { uploadCatbox, uploadLitter, uploadUrl };
