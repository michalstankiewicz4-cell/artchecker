// „Ludzki” ruch myszy, kliknięcia i przewijanie przez prawdziwe zdarzenia wejścia (page.mouse).
export const sleep = ms => new Promise(r => setTimeout(r, ms));
export const rand = (a, b) => a + Math.random() * (b - a);
const gauss = () => { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };

// pozycja kursora pamiętana per strona
const POS = new WeakMap();
export const cursor = page => POS.get(page) || { x: rand(100, 400), y: rand(100, 300) };
export const setCursor = (page, p) => POS.set(page, { x: p.x, y: p.y });

// krzywa Béziera z losowymi punktami kontrolnymi, przyspieszanie i hamowanie, drobne drżenie,
// czasem lekkie przestrzelenie celu z korektą
export async function moveTo(page, x, y, { speed = 1 } = {}){
  const vp = page.viewportSize() || { width: 1280, height: 720 };
  x = Math.max(2, Math.min(vp.width - 2, x)); y = Math.max(2, Math.min(vp.height - 2, y));
  const from = cursor(page), dx = x - from.x, dy = y - from.y, dist = Math.hypot(dx, dy);
  if (dist < 2) { POS.set(page, { x, y }); return; }
  const overshoot = dist > 250 && Math.random() < 0.3;
  const tx = overshoot ? x + dx / dist * rand(6, 18) + gauss() * 4 : x, ty = overshoot ? y + dy / dist * rand(6, 18) + gauss() * 4 : y;
  const nx = -dy / dist, ny = dx / dist, bend = () => gauss() * dist * 0.12;
  const c1 = { x: from.x + dx * rand(0.2, 0.4) + nx * bend(), y: from.y + dy * rand(0.2, 0.4) + ny * bend() };
  const c2 = { x: from.x + dx * rand(0.6, 0.8) + nx * bend(), y: from.y + dy * rand(0.6, 0.8) + ny * bend() };
  const duration = (180 + 110 * Math.log2(1 + dist / 12)) * rand(0.8, 1.25) / speed;   // w stylu prawa Fittsa
  const steps = Math.max(8, Math.round(duration / rand(9, 14)));
  for (let i = 1; i <= steps; i++) {
    const s = i / steps, t = s < 0.5 ? 4 * s ** 3 : 1 - (-2 * s + 2) ** 3 / 2, u = 1 - t;   // ease-in-out
    const bx = u ** 3 * from.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t ** 3 * tx;
    const by = u ** 3 * from.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t ** 3 * ty;
    const j = i < steps ? 0.6 : 0;
    await page.mouse.move(bx + gauss() * j, by + gauss() * j);
    await sleep(duration / steps * rand(0.6, 1.4));
  }
  POS.set(page, { x: tx, y: ty });
  if (overshoot) { await sleep(rand(40, 120)); await moveTo(page, x, y, { speed: speed * 1.5 }); }
  POS.set(page, { x, y });
}

// kliknięcie: dojazd, krótka pauza, przytrzymanie 50–140 ms, nie dokładnie w środek
export async function click(page, x, y, spread = 3){
  const px = x + gauss() * spread, py = y + gauss() * spread;
  await moveTo(page, px, py); await sleep(rand(60, 220));
  await page.mouse.down(); await sleep(rand(50, 140)); await page.mouse.up();
}

// kliknięcie w element: losowy punkt w jego środkowej części; najpierw przewija, jeśli trzeba
export async function clickEl(page, locator){
  await locator.scrollIntoViewIfNeeded(); await sleep(rand(150, 400));
  const b = await locator.boundingBox(); if (!b) return false;
  await click(page, b.x + b.width * rand(0.3, 0.7), b.y + b.height * rand(0.35, 0.65), 0);
  return true;
}

// przewijanie kółkiem: kilka „szarpnięć” z przerwami, czasem trochę z powrotem
export async function scroll(page, total){
  let done = 0;
  while (Math.abs(done) < Math.abs(total)) {
    const step = Math.sign(total) * rand(60, 140); await page.mouse.wheel(0, step); done += step;
    await sleep(rand(30, 90)); if (Math.random() < 0.15) await sleep(rand(300, 900));
  }
  if (Math.random() < 0.25) { await sleep(rand(200, 600)); await page.mouse.wheel(0, -Math.sign(total) * rand(80, 200)); }
}

// chwila „czytania” z drobnymi ruchami kursora
export async function idle(page, ms){
  const end = Date.now() + ms;
  while (Date.now() < end) {
    if (Math.random() < 0.4) { const c = cursor(page); await moveTo(page, c.x + gauss() * 60, c.y + gauss() * 40, { speed: 0.7 }); }
    await sleep(rand(300, 900));
  }
}

// ---------------------------------------------------------------------
// Pisanie jak człowiek: nierówne odstępy między znakami (rozkład log-normalny, średnio ok. 170 ms),
// szybciej w częstych parach liter, dłużej po spacji i interpunkcji, czasem pauza „na myślenie”,
// klawisz przytrzymany 50–130 ms. Nowa linia w tekście = Enter.
const COMMON = new Set(["th","he","in","er","an","re","on","at","en","nd","ie","ni","ow","po","na","za","ra","ro","st","pr","ch","cz","sz","rz","wa","ta","ko","ka","to","no","ze","je","em","ał","ię","ią"]);
const lognormal = (median, sigma) => median * Math.exp(sigma * gauss());
const typable = ch => /^[\x20-\x7e]$/.test(ch);
// polskie znaki (układ „polski programisty”: prawy Alt + litera) – kod fizycznego klawisza
const PL = { ą: "KeyA", ć: "KeyC", ę: "KeyE", ł: "KeyL", ń: "KeyN", ó: "KeyO", ś: "KeyS", ź: "KeyX", ż: "KeyZ" };
const CDP = new WeakMap();
async function pressExotic(page, ch, dwell){
  let s = CDP.get(page); if (!s) { s = await page.context().newCDPSession(page); CDP.set(page, s); }
  const code = PL[ch.toLowerCase()] || "", mods = ch !== ch.toLowerCase() ? 8 : 0;   // 8 = Shift (bez Ctrl/Alt – inaczej Chrome traktuje to jak skrót)
  await s.send("Input.dispatchKeyEvent", { type: "keyDown", key: ch, code, text: ch, unmodifiedText: ch, modifiers: mods });
  await sleep(dwell);
  await s.send("Input.dispatchKeyEvent", { type: "keyUp", key: ch, code, modifiers: mods });
}

// os – tryb „Przeglądarka”: znaki przez prawdziwą klawiaturę Windowsa (Unicode), Enter i Tab jako klawisze
export async function typeText(page, text, { signal, os } = {}){
  const t0 = Date.now(); let prev = "", count = 0;
  for (const ch of text) {
    if (signal?.aborted) break;
    let gap = lognormal(150, 0.45);
    if (COMMON.has((prev + ch).toLowerCase())) gap *= 0.7;
    if (prev === " ") gap *= 1.25;
    if (/[.,;:!?]/.test(prev)) gap += rand(150, 450);
    if (prev === "\n") gap += rand(300, 900);
    if (/[A-ZĄĆĘŁŃÓŚŹŻ]/.test(ch)) gap += rand(40, 120);        // sięgnięcie po Shift
    if (Math.random() < 0.03) gap += rand(500, 1500);          // chwila namysłu
    await sleep(Math.min(gap, 2500));
    if (os) { const k = ch === "\n" ? "Enter" : ch === "\t" ? "Tab" : null, d = rand(50, 130);
      if (k) { await os.key(k); await sleep(d); await os.key(k, true); } else { await os.char(ch); await sleep(d); await os.char(ch, true); } }
    else if (ch === "\n") { await page.keyboard.press("Enter", { delay: rand(50, 130) }); }
    else if (ch === "\t") { await page.keyboard.press("Tab", { delay: rand(50, 130) }); }
    else if (typable(ch)) { await page.keyboard.press(ch, { delay: rand(50, 130) }); }
    else { try { await pressExotic(page, ch, rand(50, 130)); } catch (_) { await page.keyboard.insertText(ch); } }   // polskie znaki: keydown/keyup przez CDP; awaryjnie samo wstawienie
    prev = ch; count++;
  }
  return { chars: count, ms: Date.now() - t0 };
}
