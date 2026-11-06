// Akcje myszy scenariusza: najechanie, kliknięcie, przeciąganie, zaznaczanie tekstu, przewijanie nad elementem.
// Miejsce: element (selektor CSS), punkt (% okna), losowo albo obraz (wzorzec z folderu obrazy/ szukany na zrzucie).
// ctx.io – powierzchnia (bot/surface.mjs): „Strona” (okno strony) albo „Przeglądarka” (kursor Windowsa, całe okno przeglądarki).
import { sleep, rand, moveTo, cursor, scroll } from "./human.mjs";
import { findOnShot } from "./image.mjs";
import { pageSurface } from "./surface.mjs";

export class Skip extends Error {}   // „gdy brak: pomiń” – akcja pominięta, to nie błąd

const vpOf = page => page.viewportSize() || { width: 1280, height: 720 };
const ioOf = (page, ctx) => ctx.io || pageSurface(page);
const inBox = (b, sx = [0.3, 0.7], sy = [0.35, 0.65]) => ({ x: b.x + b.width * rand(...sx), y: b.y + b.height * rand(...sy) });

// opis miejsca do dziennika
export const placeText = (w, hit) => w.at === "el" ? w.selector : w.at === "pt" ? `punkt ${w.x}%, ${w.y}%` : w.at === "rand" ? "losowe miejsce"
  : hit ? `obraz ${hit.name.replace(/\.png$/, "")} (${Math.round(hit.score * 100)}%${hit.scale !== 1 ? `, skala ${hit.scale}` : ""})` : "obraz";

// szukanie obrazu: do `wait` s (strona może się doczytywać); gdy brak – pomiń, przewijaj i szukaj albo błąd
async function findImage(page, w, signal, io){
  if (!w.images.length) throw new Error("brak wzorca obrazu");
  let scrolls = 0, last = null;
  for (;;) {
    const end = Date.now() + w.wait * 1000;
    do {
      if (signal?.aborted) throw new Error("zatrzymano");
      const s = await io.shot(), hit = await findOnShot(s.png, w);
      if (hit && hit.score * 100 >= w.thr) return { ...hit, x: hit.x + s.ox, y: hit.y + s.oy };
      last = hit; if (Date.now() < end) await sleep(500);
    } while (Date.now() < end);
    if (w.miss === "scroll" && scrolls < 25) {
      const y0 = await page.evaluate(() => scrollY);
      await scroll(io.surf, vpOf(page).height * rand(0.55, 0.75)); await sleep(rand(400, 800)); scrolls++;
      if (await page.evaluate(() => scrollY) > y0 + 5) continue;   // koniec strony – dalej nie ma czego szukać
    }
    const why = `nie znaleziono obrazu (najlepsze dopasowanie ${last ? Math.round(last.score * 100) : 0}% < próg ${w.thr}%${scrolls ? `, po ${scrolls} przewinięciach` : ""})`;
    if (w.miss === "error") throw new Error(why);
    throw new Skip(why);
  }
}

// miejsce → punkt na powierzchni (okno strony albo ekran); scrollTo = przewiń do elementu, gdy jest poza oknem
export async function locate(page, w, ctx = {}){
  const io = ioOf(page, ctx), { signal, scrollTo = true } = ctx, A = io.area();
  if (w.at === "pt") return { x: A.l + A.w * w.x / 100, y: A.t + A.h * w.y / 100, text: placeText(w) };
  if (w.at === "rand") return { x: A.l + rand(0.1, 0.9) * A.w, y: A.t + rand(0.1, 0.9) * A.h, text: placeText(w) };
  if (w.at === "img") { const hit = await findImage(page, w, signal, io); return { ...inBox(hit), box: hit, text: placeText(w, hit) }; }
  const loc = page.locator(w.selector).first();
  try { await loc.waitFor({ state: "visible", timeout: 10000 }); } catch (_) { throw new Error(`nie znaleziono elementu „${w.selector}”`); }
  if (scrollTo) { await loc.scrollIntoViewIfNeeded(); await sleep(rand(150, 400)); }
  const b = await loc.boundingBox(); if (!b) throw new Error(`element „${w.selector}” nie ma rozmiaru`);
  return { ...io.toSurf(inBox(b)), box: b, loc, text: placeText(w) };
}

// postój kursora: drobne drżenie ręki
async function hold(surf, ms){
  const end = Date.now() + ms, c = { ...cursor(surf) };
  while (Date.now() < end) { await sleep(rand(150, 450)); if (Math.random() < 0.5) await surf.mouse.move(c.x + rand(-1.5, 1.5), c.y + rand(-1.5, 1.5)); }
  await surf.mouse.move(c.x, c.y);
}

// pojedyncze lub wielokrotne kliknięcie w miejscu kursora (detail = 1, 2, 3 jak u człowieka)
async function press(surf, button, count){
  for (let k = 1; k <= count; k++) {
    await surf.mouse.down({ button, clickCount: k }); await sleep(rand(50, 120)); await surf.mouse.up({ button, clickCount: k });
    if (k < count) await sleep(rand(70, 150));
  }
}
const BTN = { left: "lewym", right: "prawym", middle: "środkowym" };

export const MOUSE_ACTIONS = {
  async hover(page, a, ctx){
    const S = ioOf(page, ctx).surf;
    const p = await locate(page, a, ctx); await moveTo(S, p.x, p.y);
    await hold(S, a.stay * 1000 * rand(0.85, 1.15));
    return `najechano na ${p.text}, postój ${a.stay} s`;
  },
  async click(page, a, ctx){
    const S = ioOf(page, ctx).surf;
    const p = await locate(page, a, ctx);
    for (let k = 0; k < a.times; k++) {
      if (ctx.signal?.aborted) break;
      await moveTo(S, p.x + rand(-2, 2), p.y + rand(-2, 2)); await sleep(rand(60, 220));
      await press(S, a.button, a.count); if (k < a.times - 1) await sleep(rand(250, 700));
    }
    await page.waitForLoadState("load", { timeout: 10000 }).catch(() => {});
    return `kliknięto ${a.count === 2 ? "podwójnie " : ""}${BTN[a.button]} przyciskiem: ${p.text}${a.times > 1 ? ` ×${a.times}` : ""}`;
  },
  async drag(page, a, ctx){
    const S = ioOf(page, ctx).surf;
    const s = await locate(page, a.from, ctx);
    await moveTo(S, s.x, s.y); await sleep(rand(80, 200));
    const t = await locate(page, a.to, { ...ctx, scrollTo: false });   // cel liczony po dojeździe do początku (strona mogła się przewinąć)
    await S.mouse.down(); await sleep(rand(120, 260));
    await moveTo(S, s.x + (t.x - s.x) * 0.1, s.y + (t.y - s.y) * 0.1, { speed: 0.5 });   // ruszenie z miejsca – wolno
    await moveTo(S, t.x, t.y, { speed: 0.6 }); await sleep(rand(100, 250));
    await S.mouse.up(); await sleep(rand(200, 500));
    return `przeciągnięto z ${s.text} do ${t.text}`;
  },
  async select(page, a, ctx){
    const io = ioOf(page, ctx), S = io.surf;
    if (a.how === "range") {
      const s = await locate(page, a.from, ctx); await moveTo(S, s.x, s.y); await sleep(rand(80, 200));
      const t = await locate(page, a.to, { ...ctx, scrollTo: false });
      await S.mouse.down(); await sleep(rand(80, 160)); await moveTo(S, t.x, t.y, { speed: 0.5 }); await sleep(rand(60, 150)); await S.mouse.up();
    } else {
      let p = await locate(page, a, ctx);
      // element: celujemy w losowe słowo jego tekstu, żeby dwuklik trafił w słowo, a nie w pustą przestrzeń
      if (p.loc) { const r = await p.loc.evaluate(el => { const ws = [], tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
          for (let n; (n = tw.nextNode()) && ws.length < 400;) for (const m of n.data.matchAll(/[\p{L}\p{N}]{3,}/gu)) {
            const rg = document.createRange(); rg.setStart(n, m.index); rg.setEnd(n, m.index + m[0].length); const b = rg.getBoundingClientRect();
            if (b.width && b.top >= 0 && b.bottom <= innerHeight) ws.push({ x: b.x, y: b.y, width: b.width, height: b.height }); }
          return ws.length ? ws[Math.floor(Math.random() * ws.length)] : null; }).catch(() => null);
        if (r) p = { ...p, ...io.toSurf(inBox(r, [0.3, 0.7], [0.4, 0.6])) }; }
      await moveTo(S, p.x, p.y); await sleep(rand(100, 260)); await press(S, "left", a.how === "para" ? 3 : 2);
    }
    await sleep(rand(200, 500));
    const txt = (await page.evaluate(() => String(getSelection())).catch(() => "")).trim().replace(/\s+/g, " ");
    return `zaznaczono ${a.how === "word" ? "słowo" : a.how === "para" ? "akapit" : "fragment"}: ${txt ? `„${txt.length > 40 ? txt.slice(0, 40) + "…" : txt}” (${txt.length} zn.)` : "nic (brak tekstu w tym miejscu)"}`;
  },
  async scroll(page, a, ctx){
    const S = ioOf(page, ctx).surf;
    const px = a.dir === "up" ? -a.px : a.px;
    if (a.over !== "el") { await scroll(S, px); return `przewinięto ${a.dir === "up" ? "w górę" : "w dół"} o ${a.px} px`; }
    const p = await locate(page, { at: "el", selector: a.selector }, ctx); await moveTo(S, p.x, p.y); await sleep(rand(150, 400));
    await scroll(S, px);
    return `przewinięto ${a.dir === "up" ? "w górę" : "w dół"} o ${a.px} px nad ${a.selector}`;
  },
};
