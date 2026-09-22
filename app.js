/* =========================================================
 * GEN REST API — Main App
 * Author : GENOS
 * ========================================================= */

(function () {
  "use strict";

  const state = { view: "home", category: "ALL", search: "", current: null, fileData: {} };
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);
  const show = (el) => el && el.classList.add("active");
  const hide = (el) => el && el.classList.remove("active");

  /* LOADER */
  function initLoaderLogo() {
    const img = $("#loaderLogo"), fb = $("#loaderLogoFallback");
    if (!img) return;
    img.onerror = () => { img.style.display = "none"; fb.style.display = "block"; };
    img.onload = () => { img.style.display = "block"; fb.style.display = "none"; };
  }
  function runLoader() {
    const fill = $("#loaderFill"), pct = $("#loaderPct");
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 16;
      if (p >= 100) { p = 100; clearInterval(iv); }
      fill.style.width = p + "%"; pct.textContent = Math.floor(p) + "%";
    }, 180);
    setTimeout(() => {
      clearInterval(iv); fill.style.width = "100%"; pct.textContent = "100%";
      setTimeout(() => { hide($("#loader")); show($("#app")); }, 400);
    }, 2000);
  }

  /* SPLASH */
  function playSplash(onEnd) {
    const splash = $("#splash"), video = $("#splashVideo"), skip = $("#btnSkip");
    show(splash); splash.classList.remove("video-ok");
    let done = false;
    const finish = () => {
      if (done) return; done = true;
      try { video.pause(); video.removeAttribute("src"); video.load(); } catch {}
      hide(splash); onEnd && onEnd();
    };
    const timeout = setTimeout(finish, 12000);
    video.onerror = () => { clearTimeout(timeout); splash.classList.remove("video-ok"); setTimeout(finish, 2200); };
    video.onloadeddata = () => { splash.classList.add("video-ok"); video.play().catch(() => {}); };
    video.onended = () => { clearTimeout(timeout); finish(); };
    skip.onclick = () => { clearTimeout(timeout); finish(); };
    try { video.load(); const p = video.play(); if (p && p.catch) p.catch(() => {}); }
    catch { setTimeout(finish, 2200); }
  }

  /* NAV */
  function setView(name) {
    state.view = name;
    $$(".view").forEach((v) => v.classList.remove("active"));
    const v = $("#view-" + name);
    if (v) v.classList.add("active");
    $$(".nav-item").forEach((n) => n.classList.toggle("active", n.dataset.view === name));
    if (name === "explorer") renderExplorer();
    if (name === "home") refreshStatus();
    closeSidebar();
  }
  function bindNav() {
    $$("[data-view]").forEach((el) => {
      el.addEventListener("click", (e) => { e.preventDefault(); setView(el.dataset.view); });
    });
  }
  function refreshStatus() {
    const n = (window.ENDPOINTS || []).length;
    $("#statusScrapers").textContent = n + " ENDPOINTS";
  }

  /* SIDEBAR MOBILE */
  function openSidebar() {
    $(".sidebar").classList.add("open");
    $(".sidebar-backdrop").classList.add("active");
  }
  function closeSidebar() {
    const s = $(".sidebar"); const b = $(".sidebar-backdrop");
    if (s) s.classList.remove("open");
    if (b) b.classList.remove("active");
  }
  function bindMobile() {
    const h = $("#hamburger"); if (h) h.onclick = openSidebar;
    const b = $(".sidebar-backdrop"); if (b) b.onclick = closeSidebar;
  }

  /* SEARCH TOGGLE */
  function bindSearchToggle() {
    const btn = $("#btnSearchToggle");
    const wrap = $("#searchInputWrap");
    const input = $("#searchApi");
    if (!btn || !wrap || !input) return;

    btn.onclick = () => {
      const open = wrap.classList.toggle("open");
      if (open) setTimeout(() => input.focus(), 100);
      else { input.value = ""; state.search = ""; renderApiGrid(); }
    };
    input.addEventListener("input", (e) => {
      state.search = e.target.value.trim();
      renderApiGrid();
    });
  }

  /* EXPLORER */
  function renderCategories() {
    const wrap = $("#catTabs");
    const cats = window.getCategories ? window.getCategories() : ["ALL"];
    const icons = window.CATEGORY_ICONS || {};
    wrap.innerHTML = "";
    cats.forEach((c) => {
      const btn = document.createElement("button");
      btn.className = "cat-tab" + (state.category === c ? " active" : "");
      btn.innerHTML = (icons[c] || "") + "<span>" + c + "</span>";
      btn.onclick = () => { state.category = c; renderCategories(); renderApiGrid(); };
      wrap.appendChild(btn);
    });
  }
  function renderApiGrid() {
    const grid = $("#apiGrid");
    let list = window.getEndpointsByCategory
      ? window.getEndpointsByCategory(state.category)
      : window.ENDPOINTS || [];
    if (state.search) {
      const q = state.search.toLowerCase();
      list = list.filter((s) =>
        s.name.toLowerCase().includes(q) ||
        s.desc.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q)
      );
    }
    grid.innerHTML = "";
    if (!list.length) {
      grid.innerHTML = '<div style="padding:20px;font-family:Space Mono,monospace;font-size:13px;color:#64748b">// tidak ada endpoint ditemukan</div>';
      return;
    }
    list.forEach((s) => {
      const card = document.createElement("div");
      card.className = "api-card";
      card.innerHTML = `
        <div class="api-card-head">
          <span class="api-cat">${s.category}</span>
          <span class="api-method ${s.method}">${s.method}</span>
        </div>
        <div class="api-name">${s.name}</div>
        <div class="api-desc">${s.desc}</div>
        <div class="api-id">${s.path}</div>
      `;
      card.onclick = () => openPlayground(s);
      grid.appendChild(card);
    });
  }
  function renderExplorer() { renderCategories(); renderApiGrid(); }

  /* PLAYGROUND */
  function openPlayground(scraper) {
    state.current = scraper;
    state.fileData = {};
    $("#pgTitle").textContent = scraper.name;
    const m = $("#pgMethod");
    m.textContent = scraper.method;
    m.className = "pg-method " + scraper.method;
    renderInputs(scraper);
    clearTerminal();
    setTermStatus("IDLE");
    setView("playground");
  }

  function renderInputs(scraper) {
    const wrap = $("#pgInputs");
    wrap.innerHTML = "";
    if (!scraper.inputs || !scraper.inputs.length) {
      wrap.innerHTML = '<div style="font-size:12px;color:#64748b;font-family:Space Mono,monospace">// tidak ada input</div>';
      return;
    }
    scraper.inputs.forEach((inp) => {
      const item = document.createElement("div");
      item.className = "input-item";

      if (inp.type === "file") {
        // Dropzone only
        const dz = document.createElement("div");
        dz.className = "dropzone";
        dz.dataset.key = inp.key;
        dz.innerHTML = `
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v12M6 10l6-6 6 6M4 20h16"/></svg>
          <span>Drop file di sini atau klik untuk pilih</span>
        `;
        setupDropzone(dz, inp.key, inp.required);
        item.appendChild(dz);
      } else {
        const lab = document.createElement("label");
        lab.innerHTML = inp.label + (inp.required ? ' <span class="req">*</span>' : "");
        item.appendChild(lab);

        let el;
        if (inp.type === "textarea") el = document.createElement("textarea");
        else { el = document.createElement("input"); el.type = "text"; }
        el.placeholder = inp.placeholder || "";
        el.value = inp.default || "";
        el.dataset.key = inp.key;
        item.appendChild(el);

        // Optional dropzone for RF ZIP/HTML
        if (inp.accept === "file") {
          const dz = document.createElement("div");
          dz.className = "dropzone";
          dz.dataset.key = inp.key;
          dz.dataset.target = "url";
          dz.innerHTML = `
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v12M6 10l6-6 6 6M4 20h16"/></svg>
            <span>Atau drop file di sini</span>
          `;
          setupDropzone(dz, inp.key, false, "url");
          item.appendChild(dz);
        }
      }
      wrap.appendChild(item);
    });
  }

  /* DROPZONE LOGIC */
  function setupDropzone(dz, key, required, mode) {
    let fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.style.display = "none";
    dz.parentElement.appendChild(fileInput);

    const handleFile = async (file) => {
      if (!file) return;

      dz.classList.add("has-file");
      dz.innerHTML = `
        <div class="dropzone-file">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 13l4 4L19 7"/></svg>
          <span class="filename">${file.name}</span>
          <span class="file-badge">${formatSize(file.size)}</span>
        </div>
      `;

      if (mode === "url") {
        // RF ZIP/HTML: upload to litterbox, fill URL field
        dz.innerHTML = `<div class="uploading"><span class="spinner"></span> Uploading to Litterbox...</div>`;
        try {
          const b64 = await fileToBase64(file);
          const res = await fetch("/uploader/catbox-temp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ file_b64: b64, filename: file.name, time: "1h" }),
          });
          const data = await res.json();
          if (!data.ok || !data.data?.url) throw new Error(data.data?.error || "gagal upload");
          const urlInput = document.querySelector(`#pgInputs input[data-key="${key}"]`);
          if (urlInput) urlInput.value = data.data.url;
          dz.innerHTML = `
            <div class="dropzone-file">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 13l4 4L19 7"/></svg>
              <span class="filename">${file.name}</span>
              <span class="file-badge">URL SIAP</span>
            </div>
          `;
        } catch (e) {
          dz.innerHTML = `<span style="color:#ef4444">✗ ${e.message}</span>`;
          dz.classList.remove("has-file");
        }
      } else {
        // Catbox file: store base64
        try {
          const b64 = await fileToBase64(file);
          state.fileData[key] = b64;
          const fn = document.querySelector(`#pgInputs input[data-key="filename"]`);
          if (fn && !fn.value) fn.value = file.name;
        } catch (e) {
          dz.innerHTML = `<span style="color:#ef4444">✗ ${e.message}</span>`;
        }
      }
    };

    dz.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", (e) => handleFile(e.target.files[0]));

    ["dragenter", "dragover"].forEach((ev) => {
      dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.add("dragover"); });
    });
    ["dragleave", "drop"].forEach((ev) => {
      dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.remove("dragover"); });
    });
    dz.addEventListener("drop", (e) => {
      const file = e.dataTransfer.files && e.dataTransfer.files[0];
      handleFile(file);
    });
  }

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const s = String(reader.result);
        resolve(s.split(",")[1] || s);
      };
      reader.onerror = () => reject(new Error("Gagal baca file"));
      reader.readAsDataURL(file);
    });
  }
  function formatSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1024 / 1024).toFixed(2) + " MB";
  }

  function readInputs() {
    const out = {};
    $$("#pgInputs input[data-key], #pgInputs textarea[data-key]").forEach((el) => {
      if (el.type === "file") return;
      out[el.dataset.key] = el.value;
    });
    // Merge file data
    Object.keys(state.fileData).forEach((k) => { out[k] = state.fileData[k]; });
    return out;
  }

  /* TERMINAL */
  function clearTerminal() {
    const body = $("#termBody");
    body.innerHTML = "";
    appendLine("// GEN REST API — terminal ready", "term-muted");
    appendLine("// Author: GENOS", "term-muted");
  }
  function appendLine(text, cls = "") {
    const body = $("#termBody");
    const line = document.createElement("div");
    line.className = "term-line " + cls;
    line.textContent = text;
    body.appendChild(line);
    body.scrollTop = body.scrollHeight;
  }
  function appendJson(obj) {
    const body = $("#termBody");
    const wrap = document.createElement("div");
    wrap.className = "term-json-wrap";
    const el = document.createElement("div");
    el.className = "term-json";
    el.innerHTML = syntaxHighlight(obj);
    const btn = document.createElement("button");
    btn.className = "btn-copy";
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.4"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 012-2h10"/></svg>
      COPY
    `;
    btn.onclick = async () => {
      const text = JSON.stringify(obj, null, 2);
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) await navigator.clipboard.writeText(text);
        else {
          const ta = document.createElement("textarea");
          ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
          document.body.appendChild(ta); ta.select();
          document.execCommand("copy"); document.body.removeChild(ta);
        }
        btn.classList.add("copied");
        btn.innerHTML = `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.6"><path d="M5 13l4 4L19 7"/></svg> COPIED!`;
        setTimeout(() => {
          btn.classList.remove("copied");
          btn.innerHTML = `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.4"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 012-2h10"/></svg> COPY`;
        }, 1500);
      } catch { btn.textContent = "FAILED"; }
    };
    wrap.appendChild(el); wrap.appendChild(btn);
    body.appendChild(wrap);
    body.scrollTop = body.scrollHeight;
  }
  function escapeHtml(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function syntaxHighlight(obj) {
    let json = JSON.stringify(obj, null, 2);
    if (json === undefined) return "undefined";
    json = escapeHtml(json);
    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match) => {
        let cls = "jn";
        if (/^"/.test(match)) cls = /:$/.test(match) ? "jk" : "js";
        else if (/true|false/.test(match)) cls = "jb";
        else if (/null/.test(match)) cls = "jnull";
        return `<span class="${cls}">${match}</span>`;
      }
    );
  }
  function setTermStatus(s) {
    const el = $("#termStatus");
    el.textContent = s; el.className = "term-status " + s;
  }

  /* EXECUTE */
  async function executeCurrent() {
    const scraper = state.current;
    if (!scraper) return;
    const btn = $("#btnExecute");
    btn.disabled = true;
    const oldText = btn.innerHTML;
    btn.innerHTML = "RUNNING...";

    clearTerminal();
    setTermStatus("RUNNING");
    appendLine("> EXECUTE " + scraper.id, "term-info");
    appendLine("> URL: " + location.origin + scraper.path, "term-info");
    appendLine("", "");

    const input = readInputs();
    const t0 = performance.now();

    try {
      const res = await fetch(scraper.path, {
        method: scraper.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      const dt = ((performance.now() - t0) / 1000).toFixed(2);

      if (data.logs && Array.isArray(data.logs)) {
        data.logs.forEach((l) => appendLine(l, "term-muted"));
        appendLine("", "");
      }

      const isOk = data.ok !== false;
      const badge = document.createElement("div");
      badge.className = "term-badge " + (isOk ? "ok" : "err");
      badge.textContent = isOk ? "SUCCESS" : "FAILED";
      $("#termBody").appendChild(badge);

      appendLine("> Status: " + res.status, "term-info");
      appendLine("> Elapsed: " + dt + "s", "term-ok");
      appendLine("> Response:", "term-info");
      appendJson(data);
      setTermStatus(isOk ? "DONE" : "ERROR");
    } catch (err) {
      appendLine("");
      appendLine("[FATAL] " + err.message, "term-err");
      setTermStatus("ERROR");
      appendJson({
        author: "GENOS", powered_by: "GEN REST API",
        endpoint: scraper.id, category: scraper.category,
        timestamp: new Date().toISOString(), ok: false,
        data: { error: err.message },
      });
    } finally {
      btn.disabled = false;
      btn.innerHTML = oldText;
    }
  }

  /* BINDINGS */
  function bindPlayground() {
    $("#btnExecute").addEventListener("click", executeCurrent);
    $("#btnClear").addEventListener("click", () => { clearTerminal(); setTermStatus("IDLE"); });
    $("#btnBack").addEventListener("click", () => setView("explorer"));
  }
  function bindStart() {
    $("#btnStart").addEventListener("click", () => {
      playSplash(() => setView("explorer"));
    });
  }

  function boot() {
    initLoaderLogo();
    bindNav();
    bindMobile();
    bindSearchToggle();
    bindPlayground();
    bindStart();
    runLoader();
    setTimeout(refreshStatus, 2400);
    setTimeout(refreshStatus, 3000);
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
