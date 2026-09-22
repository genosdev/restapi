const { ok, fail, parseInput, preflight } = require("./_shared/response");
const BASE = "https://kbbj.web.id";
const UA = "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/124.0.0.0 Mobile Safari/537.36";

function txt(html, re) {
  const m = html.match(re);
  return m ? m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() : "";
}

exports.handler = async (event) => {
  const pf = preflight(event); if (pf) return pf;
  const input = parseInput(event);
  const word = (input.kata || input.word || "").trim();
  if (!word) return fail("kbbj", "UTILITY", "parameter 'kata' wajib");

  const slug = word.toLowerCase().replace(/\s+/g, "-");
  const url = `${BASE}/kata/${slug}`;

  try {
    const r = await fetch(url, { headers: { "User-Agent": UA, Accept: "text/html" } });
    if (!r.ok) return fail("kbbj", "UTILITY", `Kata "${word}" tidak ditemukan (HTTP ${r.status})`);
    const html = await r.text();

    const kata = txt(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i) || word;
    const kategori = txt(html, /class="[^"]*kategori[^"]*"[^>]*>([\s\S]*?)<\//i)
                  || txt(html, /class="[^"]*badge[^"]*"[^>]*>([\s\S]*?)<\//i);
    const definisi = txt(html, /class="[^"]*definisi[^"]*"[^>]*>([\s\S]*?)<\/(?:p|div)>/i)
                  || txt(html, /<article[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i)
                  || txt(html, /class="[^"]*content[^"]*"[^>]*>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i);

    let diusulkan = "";
    const du = html.match(/diusulkan\s+oleh[:\s]*([^<\n]+)/i);
    if (du) diusulkan = du[1].trim().slice(0, 100);

    let tanggal = "";
    const dt = html.match(/\d{1,2}\s+(januari|februari|maret|april|mei|juni|juli|agustus|september|oktober|november|desember)\s+\d{4}/i);
    if (dt) tanggal = dt[0];

    if (!kata && !definisi) return fail("kbbj", "UTILITY", `Kata "${word}" tidak ditemukan`);
    return ok("kbbj", "UTILITY", { kata, kategori, definisi, diusulkan_oleh: diusulkan, tanggal });
  } catch (e) { return fail("kbbj", "UTILITY", e.message); }
};
