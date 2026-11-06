// „Powierzchnia” dla myszy: tryb „Strona” – zdarzenia Playwrighta w oknie strony (współrzędne CSS),
// tryb „Przeglądarka” – prawdziwy kursor Windowsa (współrzędne ekranu), z przeliczeniem punktów strony na ekran.
import { sleep, rand, moveTo, setCursor } from "./human.mjs";

// tryb „Strona”: wszystko w oknie strony
export function pageSurface(page){
  return {
    mode: "page", surf: page,
    toSurf: p => p,
    area: () => { const v = page.viewportSize() || { width: 1280, height: 720 }; return { l: 0, t: 0, w: v.width, h: v.height }; },
    shot: async () => ({ png: await page.screenshot({ scale: "css", type: "png" }), ox: 0, oy: 0 }),
    ready: async () => {},
  };
}

// czeka, aż kursor się zatrzyma nad stroną, i zwraca jego położenie w stronie (bez zostawiania śladów w stronie)
const lastMove = page => page.evaluate(() => new Promise(res => { let last = null, t;
  const f = e => { last = [e.clientX, e.clientY]; clearTimeout(t); t = setTimeout(done, 180); };
  const done = () => { removeEventListener("mousemove", f, true); res(last); };
  addEventListener("mousemove", f, true); setTimeout(() => { if (!last) done(); }, 5000); }));

// tryb „Przeglądarka”: okno bota na wierzchu, kursor zgrany ze stroną
export async function browserSurface(page, os){
  await page.bringToFront(); await sleep(400);
  const fg = await os.foreground();
  if (!/^Chrome_WidgetWin/.test(fg.cls)) throw new Error("okno przeglądarki bota nie jest na wierzchu – nie zasłaniaj go w czasie pracy");
  const hwnd = fg.hwnd; let rect = fg.rect, map = null;
  const surf = {
    mouse: { move: (x, y) => os.move(x, y), down: (o = {}) => os.down(o.button), up: (o = {}) => os.up(o.button), wheel: (_dx, dy) => os.wheel(dy) },
    viewportSize: () => ({ width: 100000, height: 100000 }),
  };
  setCursor(surf, await os.pos());

  // zgranie: kursor ludzkim ruchem w dwa miejsca strony; z położeń na ekranie i w stronie – przeliczenie strona → ekran
  async function calibrate(){
    const w = rect.r - rect.l, h = rect.b - rect.t, pts = [];
    for (const [fx, fy] of [[0.4, 0.55], [0.62, 0.72]]) {
      const sx = rect.l + w * fx + rand(-10, 10), sy = rect.t + h * fy + rand(-10, 10);
      const seen = lastMove(page); await sleep(50); await moveTo(surf, sx, sy, { speed: 1.2 });
      const c = await seen; if (!c) throw new Error("nie udało się zgrać kursora ze stroną – okno przeglądarki musi być widoczne i na wierzchu");
      pts.push({ sx, sy, cx: c[0], cy: c[1] });
    }
    const [a, b] = pts, kx = (b.sx - a.sx) / ((b.cx - a.cx) || 1), ky = (b.sy - a.sy) / ((b.cy - a.cy) || 1);
    map = { kx, ky, bx: a.sx - kx * a.cx, by: a.sy - ky * a.cy, rect: { ...rect } };
  }
  return {
    mode: "browser", surf, os,
    toSurf: p => ({ x: map.kx * p.x + map.bx, y: map.ky * p.y + map.by }),
    area: () => ({ l: rect.l, t: rect.t, w: rect.r - rect.l, h: rect.b - rect.t }),   // całe okno – razem z paskiem kart i przyciskami
    shot: async () => ({ png: await os.shot(rect.l, rect.t, rect.r - rect.l, rect.b - rect.t), ox: rect.l, oy: rect.t }),
    // przed każdą akcją: okno na wierzch; zgranie od nowa, gdy okno się przesunęło
    ready: async () => {
      const r = await os.activate(hwnd); if (!r.ok) { await page.bringToFront(); await sleep(300); if (!(await os.activate(hwnd)).ok) throw new Error("nie da się wyciągnąć okna przeglądarki bota na wierzch"); }
      rect = r.rect;
      if (!map || ["l", "t", "r", "b"].some(k => map.rect[k] !== rect[k])) await calibrate();
    },
  };
}
