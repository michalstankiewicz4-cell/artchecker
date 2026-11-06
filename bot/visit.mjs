// Jedno wejście na stronę: świeża przeglądarka z nowym profilem, przewijanie, zakładki,
// test „Człowiek czy bot”, odcisk przeglądarki i odczyt wyników.
import { chromium } from "playwright";
import { makeProfile, contextOptions, describe } from "./profiles.mjs";
import { spoof } from "./spoof.mjs";
import { sleep, rand, moveTo, click, clickEl, scroll, idle, typeText } from "./human.mjs";

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

// szuka na płótnie testu koła w danym kolorze (zmienna CSS strony) i zwraca jego środek w pikselach strony
async function findDot(page, cssVar){
  return page.evaluate(v => {
    const c = document.getElementById("cv-bot"); if (!c || !c.width) return null;
    const hex = getComputedStyle(document.documentElement).getPropertyValue(v).trim().replace("#", "");
    const full = hex.length === 3 ? hex.split("").map(h => h + h).join("") : hex;
    const [R, G, B] = [0, 2, 4].map(i => parseInt(full.slice(i, i + 2), 16));
    const d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
    let sx = 0, sy = 0, n = 0;
    for (let y = 0; y < c.height; y += 2) for (let x = 0; x < c.width; x += 2) {
      const i = (y * c.width + x) * 4;
      if (d[i + 3] > 180 && Math.abs(d[i] - R) < 28 && Math.abs(d[i + 1] - G) < 28 && Math.abs(d[i + 2] - B) < 28) { sx += x; sy += y; n++; }
    }
    if (n < 15) return null;
    const r = c.getBoundingClientRect(), k = c.width / r.width;
    return { x: r.left + sx / n / k, y: r.top + sy / n / k };
  }, cssVar);
}
async function waitDot(page, cssVar, signal){
  for (let i = 0; i < 40; i++) { check(signal); const p = await findDot(page, cssVar);
    if (p) { const vh = (page.viewportSize() || { height: 720 }).height;
      if (p.y > 40 && p.y < vh - 40) return p;
      await page.mouse.wheel(0, p.y - vh / 2); await sleep(rand(250, 450)); continue; }   // kółko poza oknem – przewiń do niego
    await sleep(100); }
  throw new Error("nie znaleziono kółka w teście „Człowiek czy bot”");
}

// czy na stronie jest dany element (krótka próba, bez czekania 30 s)
const has = (page, sel) => page.locator(sel).first().isVisible().catch(() => false);
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
  async browse(page, a, ctx){
    await scroll(page, rand(400, 1200)); await idle(page, rand(600, 1500)); await scroll(page, -rand(200, 800));
    if (!ctx.ours) return "przewijanie (to nie jest „Cyfrowy odcisk” – bez zakładek)";
    const tabs = await page.$$eval("#tabs a[data-tab]", as => as.map(x => x.dataset.tab).filter(t => t !== "bot" && t !== "odcisk"));
    const pick = tabs.sort(() => Math.random() - 0.5).slice(0, Math.floor(rand(2, 5)));
    for (const t of pick) { check(ctx.signal); await tab(page, t); await scroll(page, rand(200, 700)); await idle(page, rand(500, 1500)); }
    return `przewijanie i zakładki: ${pick.join(", ")}`;
  },
  async botTest(page, a, ctx){
    if (!ctx.ours) return "pominięty – to nie jest „Cyfrowy odcisk”";
    await tab(page, "bot");
    await clickEl(page, page.locator("#bot-go")); await sleep(rand(300, 600));
    await page.locator("#cv-bot").evaluate(c => c.scrollIntoView({ block: "center" })); await sleep(rand(300, 500));
    for (let i = 0; i < 5; i++) {
      const g = await waitDot(page, "--muted", ctx.signal); await click(page, g.x, g.y, 3); await sleep(rand(150, 400));
      const b = await waitDot(page, "--accent", ctx.signal); await click(page, b.x, b.y, 4); await sleep(rand(250, 600));
    }
    await sleep(500);
    const done = await page.evaluate(() => /Gotowe|Done/.test(document.getElementById("st-bot").textContent));
    if (!done) throw new Error("test „Człowiek czy bot” nie został ukończony (chybione kliknięcie?)");
    return "test „Człowiek czy bot” wykonany";
  },
};
const ANAME = { type: "Pisz tekst", keys: "Naciśnij klawisze", click: "Kliknij w element", scroll: "Przewiń", wait: "Czekaj", browse: "Przeglądaj losowo", botTest: "Test „Człowiek czy bot”" };

async function tab(page, name){
  const link = page.locator(`#tabs a[data-tab="${name}"]`);
  await clickEl(page, link); await sleep(rand(400, 900));
}

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

    // czy to strona „Cyfrowy odcisk człowieka” (zakładki, test bota i odcisk działają tylko na niej)
    const ours = await has(page, "#tabs a[data-tab]");
    rec.actions = scenario.length; rec.actionsDone = 0;
    for (const [k, a] of scenario.entries()) {
      check(signal);
      const label = `#${n} akcja ${k + 1}/${scenario.length} (${ANAME[a.type]})`;
      if (a.target === "browser") { log(`${label}: tryb „Przeglądarka” nie jest jeszcze podłączony – pomijam`); continue; }
      try { const msg = await ACTIONS[a.type](page, a, { rec, ours, signal }); rec.actionsDone++; log(`${label}: ${msg}`); }
      catch (e) { check(signal); const m = String(e.message || e).split("\n")[0]; rec.actionError ||= `akcja ${k + 1}: ${m}`; log(`${label}: błąd – ${m}; dalej`); }
      await sleep(rand(200, 600));
    }
    if (rec.typingMs) rec.cpm = Math.round(rec.typedChars / rec.typingMs * 60000);

    if (!ours || !(await has(page, "#tabs a[data-tab]"))) return rec;
    check(signal); await tab(page, "odcisk");
    await clickEl(page, page.locator("#fp-go")); await sleep(rand(600, 1200));
    await scroll(page, rand(300, 700)); await idle(page, rand(500, 1200));

    const res = await page.evaluate(async base => {
      const fp = (await import(base + "js/tests/browser-fingerprint.js")).FP, bot = (await import(base + "js/tests/human-or-bot.js")).Bot;
      return { fp: fp.R, bot: bot.R && bot.R.human ? bot.R.human : null };
    }, new URL(".", page.url()).href);
    if (!res.fp) throw new Error("strona nie policzyła odcisku");
    rec.hash = res.fp.hash; rec.features = res.fp.features;
    if (res.bot) { rec.botSigns = res.bot.signs; rec.botVerdict = res.bot.signs >= 3 ? "bot" : "człowiek"; rec.botMetrics = res.bot; }
    log(`#${n} odcisk: ${rec.hash}${res.bot ? ` · „Człowiek czy bot”: ${rec.botSigns}/5 oznak → ${rec.botVerdict}` : ""}`);
  } catch (e) {
    rec.error = e instanceof Stopped ? "zatrzymano" : String(e.message || e).split("\n")[0];
    log(`#${n} błąd: ${rec.error}`);
  } finally {
    if (browser) await browser.close().catch(() => {});
    rec.ms = Date.now() - t0;
  }
  return rec;
}
