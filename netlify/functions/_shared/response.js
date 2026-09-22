/* =========================================================
 * GEN REST API — Shared Response Helper
 * Author : GENOS
 * ========================================================= */

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json", ...CORS },
    body: JSON.stringify(body, null, 2),
  };
}

function wrap(endpoint, category, data, meta) {
  return {
    author: "GENOS",
    powered_by: "GEN REST API",
    endpoint,
    category,
    timestamp: new Date().toISOString(),
    ...(meta || {}),
    data,
  };
}

function ok(endpoint, category, data, meta) {
  return json(200, wrap(endpoint, category, data, { ok: true, ...(meta || {}) }));
}

function fail(endpoint, category, message, meta) {
  return json(200, wrap(endpoint, category, { error: message }, { ok: false, ...(meta || {}) }));
}

function parseInput(event) {
  const out = {};
  if (event.queryStringParameters) {
    Object.assign(out, event.queryStringParameters);
  }
  if (event.body) {
    try {
      Object.assign(out, JSON.parse(event.body));
    } catch {
      try {
        const params = new URLSearchParams(event.body);
        for (const [k, v] of params) out[k] = v;
      } catch {}
    }
  }
  return out;
}

function preflight(event) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: CORS, body: "" };
  }
  return null;
}

module.exports = { json, wrap, ok, fail, parseInput, preflight, CORS };