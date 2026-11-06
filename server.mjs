// Panel bota: mały serwer tylko na tym komputerze (127.0.0.1). Nic nie jest wysyłane nigdzie poza
// wejściami bota na wskazaną stronę (i przez podane proxy).
import http from "node:http";
import { readFile, writeFile, mkdir, readdir, appendFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { exec } from "node:child_process";
import { visit } from "./bot/visit.mjs";
import { sleep, rand } from "./bot/human.mjs";

const ROOT = dirname(fileURLToPath(import.meta.url)), PUB = join(ROOT, "public"), REP = join(ROOT, "reports");
const PORT = +(process.env.PORT || 3777);
const PKG = JSON.parse(await readFile(join(ROOT, "package.json"), "utf8"));   // jedyne źródło numeru wersji
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8", ".csv": "text/csv; charset=utf-8" };

let run = null;            // { ctrl, records, file, config }
const clients = new Set(); // połączenia SSE panelu
const send = (type, data) => { const msg = `event: ${type}\ndata: ${JSON.stringify(data)}\n\n`; for (const c of clients) c.write(msg); };
const log = text => { const line = `${new Date().toLocaleTimeString("pl-PL")}  ${text}`; console.log(line); send("log", line); };

const plural = (n, one, few, many) => n === 1 ? one : (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14)) ? few : many;
const csvCell = v => { const s = v == null ? "" : String(v); return /[",;\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
// kolumny raportu; cechy przeglądarki – z wylosowanego profilu (puste = grupa niezmieniana)
const CSV_COLS = ["n", "start", "ms", "error", "proxy", "summary", "actions", "actionsDone", "actionError", "typedChars", "typingMs", "cpm",
  "os", "userAgent", "languages", "timezone", "screen", "scale", "viewport", "cores", "memoryGB", "webgl", "canvasSeed", "hiddenFonts", "colorScheme"];
const PROFILE_COLS = {
  os: p => p.os, userAgent: p => p.userAgent, languages: p => p.languages && p.languages.join(", "), timezone: p => p.timezoneId,
  screen: p => p.screen && `${p.screen.width}x${p.screen.height}`, scale: p => p.deviceScaleFactor, viewport: p => p.viewport && `${p.viewport.width}x${p.viewport.height}`,
  cores: p => p.hardwareConcurrency, memoryGB: p => p.deviceMemory, webgl: p => p.webglRenderer, canvasSeed: p => p.canvasNoise ? p.seed : "",
  hiddenFonts: p => p.hiddenFonts && p.hiddenFonts.join(", "), colorScheme: p => p.colorScheme };
const csvRow = r => CSV_COLS.map(k => csvCell(k in PROFILE_COLS ? (r.profile ? PROFILE_COLS[k](r.profile) : "") : r[k])).join(";");

async function startRun(cfg){
  await mkdir(REP, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:T]/g, "-").slice(0, 19);
  const file = join(REP, `wejscia-${stamp}`);
  await writeFile(file + ".csv", "﻿" + CSV_COLS.join(";") + "\n");
  const ctrl = new AbortController(), proxies = cfg.proxies.split(/\r?\n/).map(s => s.trim()).filter(s => s && !s.startsWith("#"));
  run = { ctrl, records: [], file, config: { version: PKG.version, ...cfg, proxies: proxies.length } };
  send("state", { running: true, total: cfg.visits, file: file.split(/[\\/]/).pop() });
  log(`Start: ${cfg.visits} ${plural(cfg.visits, "wejście", "wejścia", "wejść")} na ${cfg.url}, scenariusz: ${cfg.scenario.length} ${plural(cfg.scenario.length, "akcja", "akcje", "akcji")}${proxies.length ? `, ${proxies.length} proxy na zmianę` : ", bez proxy"}`);
  (async () => {
    for (let i = 1; i <= cfg.visits && !ctrl.signal.aborted; i++) {
      const rec = await visit({ n: i, url: cfg.url, spoofOpts: cfg.spoof, proxy: proxies.length ? proxies[(i - 1) % proxies.length] : null,
        headless: cfg.headless, channel: cfg.useChrome ? "chrome" : undefined, scenario: cfg.scenario, log, signal: ctrl.signal });
      run.records.push(rec);
      await appendFile(file + ".csv", csvRow(rec) + "\n");
      await writeFile(file + ".json", JSON.stringify({ config: run.config, records: run.records }, null, 2));
      send("visit", { n: rec.n, ms: rec.ms, error: rec.error, summary: rec.summary, proxy: rec.proxy, actions: rec.actions, actionsDone: rec.actionsDone, actionError: rec.actionError, typedChars: rec.typedChars, cpm: rec.cpm });
      if (i < cfg.visits && !ctrl.signal.aborted) { const w = rand(cfg.delayMin, cfg.delayMax) * 1000; log(`przerwa ${(w / 1000).toFixed(1)} s`);
        const end = Date.now() + w; while (Date.now() < end && !ctrl.signal.aborted) await sleep(200); }
    }
    const ok = run.records.filter(r => !r.error);
    log(`Koniec: udane wejścia: ${ok.length} z ${run.records.length}. Raport: reports/${file.split(/[\\/]/).pop()}.csv i .json`);
    send("state", { running: false }); run.done = true;
  })().catch(e => { log("błąd: " + e.message); send("state", { running: false }); run.done = true; });
}

// scenariusz z panelu: tylko znane akcje, pola przycięte do sensownych zakresów
const num = (v, lo, hi, d) => { v = +v; return Number.isFinite(v) ? Math.min(hi, Math.max(lo, v)) : d; };
const target = t => t === "browser" ? "browser" : "page";
function cleanScenario(list){
  if (!Array.isArray(list)) return [];
  return list.slice(0, 100).map(a => { switch (a && a.type) {
    case "type": return { type: "type", text: String(a.text || "").replace(/\r\n?/g, "\n").slice(0, 20000), target: target(a.target) };
    case "keys": return { type: "keys", combo: String(a.combo || "").slice(0, 60), times: Math.round(num(a.times, 1, 100, 1)), target: target(a.target) };
    case "click": return { type: "click", selector: String(a.selector || "").trim().slice(0, 500) };
    case "scroll": return { type: "scroll", dir: a.dir === "up" ? "up" : "down", px: Math.round(num(a.px, 50, 20000, 600)) };
    case "wait": { const min = num(a.min, 0, 600, 1); return { type: "wait", min, max: num(a.max, min, 600, min) }; }
    case "human": return { type: "human" };
  } }).filter(a => a && !(a.type === "type" && !a.text) && !(a.type === "keys" && !a.combo) && !(a.type === "click" && !a.selector));
}

const body = req => new Promise((res, rej) => { let b = ""; req.on("data", c => b += c); req.on("end", () => { try { res(JSON.parse(b || "{}")); } catch (e) { rej(e); } }); });
const json = (res, code, obj) => { res.writeHead(code, { "content-type": TYPES[".json"] }); res.end(JSON.stringify(obj)); };

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  try {
    if (url.pathname === "/api/events") {
      res.writeHead(200, { "content-type": "text/event-stream", "cache-control": "no-cache", connection: "keep-alive" });
      res.write(`event: state\ndata: ${JSON.stringify({ running: !!run && !run.done })}\n\n`);
      clients.add(res); req.on("close", () => clients.delete(res)); return;
    }
    if (url.pathname === "/api/start" && req.method === "POST") {
      if (run && !run.done) return json(res, 409, { error: "bot już działa" });
      const c = await body(req);
      const cfg = { url: String(c.url || ""), visits: Math.max(1, Math.min(500, +c.visits || 1)), delayMin: Math.max(0, +c.delayMin || 0), delayMax: Math.max(+c.delayMin || 0, +c.delayMax || 0),
        headless: !!c.headless, useChrome: c.useChrome !== false, spoof: c.spoof || {}, proxies: String(c.proxies || ""), scenario: cleanScenario(c.scenario) };
      if (!/^https?:\/\//.test(cfg.url)) return json(res, 400, { error: "adres musi zaczynać się od http:// lub https://" });
      if (cfg.headless && cfg.scenario.some(x => x.target === "browser")) return json(res, 400, { error: "akcje w trybie „Przeglądarka” wymagają okna – odznacz „Bez okna przeglądarki”" });
      await startRun(cfg); return json(res, 200, { ok: true });
    }
    if (url.pathname === "/api/stop" && req.method === "POST") { if (run && !run.done) { run.ctrl.abort(); log("Zatrzymywanie…"); } return json(res, 200, { ok: true }); }
    if (url.pathname === "/api/info") return json(res, 200, { name: PKG.name, version: PKG.version });
    if (url.pathname === "/api/reports") { const f = existsSync(REP) ? (await readdir(REP)).filter(n => n.endsWith(".csv")).sort().reverse() : []; return json(res, 200, f); }
    // pliki: panel z public/, raporty z reports/
    const rel = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname).replace(/\.\.+/g, "");
    const path = rel.startsWith("/reports/") ? join(REP, rel.slice(9)) : join(PUB, rel);
    const data = await readFile(path);
    res.writeHead(200, { "content-type": TYPES[extname(path)] || "application/octet-stream" }); res.end(data);
  } catch (e) { if (!res.headersSent) { res.writeHead(e.code === "ENOENT" ? 404 : 500); res.end(e.code === "ENOENT" ? "nie ma" : String(e.message)); } }
});

server.listen(PORT, "127.0.0.1", () => {
  const addr = `http://127.0.0.1:${PORT}/`;
  console.log(`Bot odcisku v${PKG.version} – panel: ${addr}  (Ctrl+C kończy)`);
  if (!process.env.NO_OPEN) exec(process.platform === "win32" ? `start "" "${addr}"` : process.platform === "darwin" ? `open ${addr}` : `xdg-open ${addr}`);
});
