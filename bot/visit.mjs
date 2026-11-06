// Jedno wejście na stronę: świeża przeglądarka z nowym profilem przeglądarki, potem scenariusz akcji
// (pisanie, klawisze, kliknięcia, przewijanie, czekanie, szum).
import { chromium } from "playwright";
import { makeProfile, contextOptions, describe } from "./profiles.mjs";
import { spoof } from "./spoof.mjs";
import { sleep, rand, moveTo, clickEl, scroll, idle, typeText } from "./human.mjs";

class Stopped extends Error {}
const check = signal => { if (signal?.aborted) throw new Stopped("zatrzymano"); };

// proxy w formacie http://user:hasło@host:port lub socks5://host:port
export function parseProxy(line){
  const u = new URL(line.includes("://") ? line : "http://" + line);
  const o = { server: `${u.protocol}//${u.host}` };
  if (u.username) o.username = decodeURIComponent(u.username);
  if (u.password) o.password = decodeURIComponent(u.password);
  return o;
}
export const maskProxy = line => line ? line.replace(/\/\/([^:@/]+):([^@/]+)@/, "//$1:***@") : "";

async function launch({ headless, proxy, channel }){
  const o = { headless, proxy: proxy ? parseProxy(proxy) : undefined, args: ["--disable-blink-features=AutomationControlled"] };
  if (channel) { try { return await chromium.launch({ ...o, channel }); } catch (_) { /* brak Chrome – wbudowany Chromium */ } }
  return chromium.launch(o);
}

const EDITABLE = 'textarea, input:not([type]), input[type=text], input[type=search], input[type=email], input[type=url], input[type=tel], input[type=password], [contenteditable=""], [contenteditable=true]';

// ---------------------------------------------------------------------
// Akcje scenariusza. Każda zwraca opis do dziennika; błąd akcji nie przerywa wejścia.
// Tryb „Przeglądarka” (klawisze na poziomie Windowsa) jest w panelu, ale jeszcze nie jest podłączony.
// ---------------------------------------------------------------------
const PW_KEY = { Plus: "Equal" };   // nazwy z panelu → nazwy Playwrighta
const toPw = combo => combo.split("+").map(k => PW_KEY[k] || k).join("+");
const SHOW = { Control: "Ctrl", Escape: "Esc", ArrowUp: "↑", ArrowDown: "↓", ArrowLeft: "←", ArrowRight: "→", Space: "Spacja", Meta: "Win" };
const showCombo = c => c.split("+").map(k => SHOW[k] || k).join("+");
const plural = (n, one, few, many) => n === 1 ? one : (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14)) ? few : many;

async function focusEditable(page){
  const focused = await page.evaluate(() => { const a = document.activeElement;
    return !!a && (a.isContentEditable || a.tagName === "TEXTAREA" || (a.tagName === "INPUT" && !["button","submit","checkbox","radio","range","color","file","hidden","image","reset"].includes(a.type))); });
  if (focused) return "aktywne pole";
  const loc = page.locator(EDITABLE).filter({ visible: true }).first();
  if (!(await loc.count())) throw new Error("na stronie nie ma pola tekstowego do pisania");
  await clickEl(page, loc); await sleep(rand(300, 700)); return "pierwsze pole tekstowe";
}

const ACTIONS = {
  async type(page, a, ctx){
    const where = await focusEditable(page);
    const r = await typeText(page, a.text, { signal: ctx.signal });
    ctx.rec.typedChars = (ctx.rec.typedChars || 0) + r.chars; ctx.rec.typingMs = (ctx.rec.typingMs || 0) + r.ms;
    return `wpisano ${r.chars} ${plural(r.chars, "znak", "znaki", "znaków")} (${where}) w ${(r.ms / 1000).toFixed(1)} s, ${Math.round(r.chars / r.ms * 60000)} znaków/min`;
  },
  async keys(page, a, ctx){
    for (let k = 0; k < a.times; k++) { check(ctx.signal); if (k) await sleep(rand(120, 380)); await page.keyboard.press(toPw(a.combo), { delay: rand(50, 130) }); }
    await page.waitForLoadState("load", { timeout: 10000 }).catch(() => {});
    return `naciśnięto ${showCombo(a.combo)}${a.times > 1 ? ` ×${a.times}` : ""}`;
  },
  async click(page, a){
    const loc = page.locator(a.selector).first();
    try { await loc.waitFor({ state: "visible", timeout: 10000 }); } catch (_) { throw new Error(`nie znaleziono elementu „${a.selector}”`); }
    await clickEl(page, loc); await page.waitForLoadState("load", { timeout: 10000 }).catch(() => {});
    return `kliknięto ${a.selector}`;
  },
  async scroll(page, a){ await scroll(page, a.dir === "up" ? -a.px : a.px); return `przewinięto ${a.dir === "up" ? "w górę" : "w dół"} o ${a.px} px`; },
  async wait(page, a){ const ms = rand(a.min, Math.max(a.min, a.max)) * 1000; await idle(page, ms); return `czekanie ${(ms / 1000).toFixed(1)} s`; },
  // szum: kilka rund „przeczytaj – przewiń”, czasem powrót wyżej i najechanie myszą na link lub nagłówek
  async noise(page, a, ctx){
    const rounds = Math.floor(rand(3, 7)); let hovers = 0;
    for (let r = 0; r < rounds; r++) {
      check(ctx.signal); await idle(page, rand(1200, 3500));
      if (Math.random() < 0.35) {
        const els = page.locator("a:visible, h1:visible, h2:visible, h3:visible, button:visible");
        const n = await els.count();
        if (n) { const b = await els.nth(Math.floor(Math.random() * n)).boundingBox().catch(() => null);
          const vp = page.viewportSize() || { width: 1280, height: 720 };
          if (b && b.y > 0 && b.y + b.height < vp.height) { await moveTo(page, b.x + b.width * rand(0.2, 0.8), b.y + b.height * rand(0.3, 0.7)); hovers++; await sleep(rand(300, 900)); } }
      }
      await scroll(page, Math.random() < 0.15 ? -rand(150, 500) : rand(250, 800));
    }
    return `szum: ${rounds} ${plural(rounds, "runda", "rundy", "rund")} czytania i przewijania, najechania myszą: ${hovers}`;
  },
};
const ANAME = { type: "Pisz tekst", keys: "Naciśnij klawisze", hover: "Najedź myszą", click: "Kliknij", drag: "Przeciągnij", select: "Zaznacz tekst", scroll: "Przewiń", wait: "Czekaj", noise: "Szum" };
// które warianty są już podłączone; reszta (nowe akcje myszy) jest na razie tylko w panelu
const wired = a => !!ACTIONS[a.type]
  && !(a.type === "click" && (a.at !== "el" || a.button !== "left" || a.count !== 1 || a.times !== 1))
  && !(a.type === "scroll" && a.over === "el");


// wynik: rekord do raportu
export async function visit({ n, url, spoofOpts, proxy, headless, channel, scenario = [], log, signal }){
  const t0 = Date.now(), rec = { n, start: new Date().toISOString(), proxy: maskProxy(proxy) };
  let browser;
  try {
    browser = await launch({ headless, proxy, channel });
    const major = parseInt(browser.version(), 10) || 130;
    const p = makeProfile(spoofOpts, major);
    rec.browser = browser.version(); rec.profile = p; rec.summary = describe(p) || "bez zmian (prawdziwa przeglądarka)";
    log(`#${n} profil: ${rec.summary}${proxy ? ` · proxy ${rec.proxy}` : ""}`);
    const ctx = await browser.newContext(contextOptions(p));
    await ctx.addInitScript(spoof, p);
    const page = await ctx.newPage();
    check(signal);
    await page.goto(url, { waitUntil: "load", timeout: 45000 });
    await idle(page, rand(800, 2000));

    rec.actions = scenario.length; rec.actionsDone = 0;
    for (const [k, a] of scenario.entries()) {
      check(signal);
      const label = `#${n} akcja ${k + 1}/${scenario.length} (${ANAME[a.type]})`;
      if (a.target === "browser") { log(`${label}: tryb „Przeglądarka” nie jest jeszcze podłączony – pomijam`); continue; }
      if (!wired(a)) { log(`${label}: ta akcja (ten wariant) nie jest jeszcze podłączona – pomijam`); continue; }
      try { const msg = await ACTIONS[a.type](page, a, { rec, signal }); rec.actionsDone++; log(`${label}: ${msg}`); }
      catch (e) { check(signal); const m = String(e.message || e).split("\n")[0]; rec.actionError ||= `akcja ${k + 1}: ${m}`; log(`${label}: błąd – ${m}; dalej`); }
      await sleep(rand(200, 600));
    }
    if (rec.typingMs) rec.cpm = Math.round(rec.typedChars / rec.typingMs * 60000);

  } catch (e) {
    rec.error = e instanceof Stopped ? "zatrzymano" : String(e.message || e).split("\n")[0];
    log(`#${n} błąd: ${rec.error}`);
  } finally {
    if (browser) await browser.close().catch(() => {});
    rec.ms = Date.now() - t0;
  }
  return rec;
}
