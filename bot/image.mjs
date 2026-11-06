// Szukanie wzorca (wycinka PNG z folderu obrazy/) na zrzucie widocznej części strony.
// Porównanie: znormalizowana korelacja (ZNCC) w odcieniach szarości, w kolorach (R, G, B) albo na krawędziach (Sobel).
// Najpierw zgrubnie na pomniejszonych obrazach, potem dokładnie wokół najlepszych miejsc. Bez zewnętrznych bibliotek.
import { inflateSync } from "node:zlib";
import { readFile, stat } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

export const IMG_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "obrazy");

// --- dekoder PNG: 8 bitów na kanał, bez przeplotu (tak zapisują Chrome i panel), typy: szary, RGB, szary+alfa, RGBA, paleta
export function decodePng(buf){
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error("to nie jest plik PNG");
  let p = 8, w = 0, h = 0, depth = 0, type = 0, inter = 0, pal = null, trns = null; const idat = [];
  while (p < buf.length) {
    const len = buf.readUInt32BE(p), t = buf.toString("ascii", p + 4, p + 8), d = buf.subarray(p + 8, p + 8 + len); p += 12 + len;
    if (t === "IHDR") { w = d.readUInt32BE(0); h = d.readUInt32BE(4); depth = d[8]; type = d[9]; inter = d[12]; }
    else if (t === "PLTE") pal = d; else if (t === "tRNS") trns = d; else if (t === "IDAT") idat.push(d); else if (t === "IEND") break;
  }
  if (depth !== 8 || inter) throw new Error("nieobsługiwany format PNG (potrzebny 8-bitowy, bez przeplotu)");
  const ch = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[type]; if (!ch) throw new Error("nieobsługiwany typ PNG");
  const raw = inflateSync(Buffer.concat(idat)), stride = w * ch, out = new Uint8Array(w * h * 4), line = new Uint8Array(stride), prev = new Uint8Array(stride);
  for (let y = 0, q = 0; y < h; y++) {
    const f = raw[q++];
    for (let i = 0; i < stride; i++) {
      const x = raw[q++], a = i >= ch ? line[i - ch] : 0, b = prev[i], c = i >= ch ? prev[i - ch] : 0;
      let v = x;
      if (f === 1) v = x + a; else if (f === 2) v = x + b; else if (f === 3) v = x + ((a + b) >> 1);
      else if (f === 4) { const pp = a + b - c, pa = Math.abs(pp - a), pb = Math.abs(pp - b), pc = Math.abs(pp - c); v = x + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c); }
      line[i] = v & 255;
    }
    for (let x = 0; x < w; x++) {
      const o = (y * w + x) * 4, s = x * ch;
      if (type === 6) { out[o] = line[s]; out[o + 1] = line[s + 1]; out[o + 2] = line[s + 2]; out[o + 3] = line[s + 3]; }
      else if (type === 2) { out[o] = line[s]; out[o + 1] = line[s + 1]; out[o + 2] = line[s + 2]; out[o + 3] = 255; }
      else if (type === 0) { out[o] = out[o + 1] = out[o + 2] = line[s]; out[o + 3] = 255; }
      else if (type === 4) { out[o] = out[o + 1] = out[o + 2] = line[s]; out[o + 3] = line[s + 1]; }
      else { const k = line[s] * 3; out[o] = pal[k]; out[o + 1] = pal[k + 1]; out[o + 2] = pal[k + 2]; out[o + 3] = trns && line[s] < trns.length ? trns[line[s]] : 255; }
    }
    prev.set(line);
  }
  return { width: w, height: h, data: out };
}

// --- kanały do porównania (Float32Array na kanał); przezroczystość – na białym tle
function channels(img, mode){
  const { width: w, height: h, data } = img, n = w * h;
  const R = new Float32Array(n), G = new Float32Array(n), B = new Float32Array(n);
  for (let i = 0; i < n; i++) { const a = data[i * 4 + 3] / 255, bg = 255 * (1 - a);
    R[i] = data[i * 4] * a + bg; G[i] = data[i * 4 + 1] * a + bg; B[i] = data[i * 4 + 2] * a + bg; }
  if (mode === "color") return [R, G, B];
  const Y = new Float32Array(n); for (let i = 0; i < n; i++) Y[i] = 0.299 * R[i] + 0.587 * G[i] + 0.114 * B[i];
  if (mode !== "edges") return [Y];
  const E = new Float32Array(n);   // Sobel: siła krawędzi – ta sama w jasnym i ciemnym motywie
  for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
    const i = y * w + x, gx = Y[i - w + 1] + 2 * Y[i + 1] + Y[i + w + 1] - Y[i - w - 1] - 2 * Y[i - 1] - Y[i + w - 1];
    const gy = Y[i + w - 1] + 2 * Y[i + w] + Y[i + w + 1] - Y[i - w - 1] - 2 * Y[i - w] - Y[i - w + 1];
    E[i] = Math.hypot(gx, gy);
  }
  return [E];
}

// zmiana rozmiaru (średnia z obszaru przy pomniejszaniu, dwuliniowo przy powiększaniu)
function resize(ch, w, h, nw, nh){
  const out = new Float32Array(nw * nh), sx = w / nw, sy = h / nh;
  for (let y = 0; y < nh; y++) for (let x = 0; x < nw; x++) {
    if (sx >= 1 && sy >= 1) {
      const x0 = Math.floor(x * sx), x1 = Math.max(x0 + 1, Math.floor((x + 1) * sx)), y0 = Math.floor(y * sy), y1 = Math.max(y0 + 1, Math.floor((y + 1) * sy));
      let s = 0, c = 0; for (let yy = y0; yy < y1 && yy < h; yy++) for (let xx = x0; xx < x1 && xx < w; xx++) { s += ch[yy * w + xx]; c++; }
      out[y * nw + x] = c ? s / c : 0;
    } else {
      const fx = Math.min(w - 1, (x + 0.5) * sx - 0.5), fy = Math.min(h - 1, (y + 0.5) * sy - 0.5), x0 = Math.max(0, Math.floor(fx)), y0 = Math.max(0, Math.floor(fy));
      const x1 = Math.min(w - 1, x0 + 1), y1 = Math.min(h - 1, y0 + 1), ax = Math.max(0, fx - x0), ay = Math.max(0, fy - y0);
      out[y * nw + x] = (ch[y0 * w + x0] * (1 - ax) + ch[y0 * w + x1] * ax) * (1 - ay) + (ch[y1 * w + x0] * (1 - ax) + ch[y1 * w + x1] * ax) * ay;
    }
  }
  return out;
}
const resizeAll = (chs, w, h, nw, nh) => chs.map(c => resize(c, w, h, nw, nh));

// podobieństwo wzorca t (tw×th) do obrazu s (sw) w miejscu (x, y): ZNCC; dla prawie jednolitych wzorców – średnia różnica
function score(S, sw, T, tw, th, x, y, tStat){
  let total = 0;
  for (let c = 0; c < S.length; c++) {
    const s = S[c], t = T[c], { mean: tm, sd: tsd } = tStat[c], n = tw * th;
    let sum = 0, sum2 = 0, cross = 0;
    for (let j = 0; j < th; j++) { const row = (y + j) * sw + x, tr = j * tw;
      for (let i = 0; i < tw; i++) { const v = s[row + i]; sum += v; sum2 += v * v; cross += v * (t[tr + i] - tm); } }
    const sm = sum / n, ssd = Math.sqrt(Math.max(0, sum2 / n - sm * sm));
    if (tsd < 3) { let d = 0; for (let j = 0; j < th; j++) for (let i = 0; i < tw; i++) d += Math.abs(s[(y + j) * sw + x + i] - t[j * tw + i]); total += 1 - d / n / 255; }
    else total += ssd < 1e-3 ? 0 : cross / n / (ssd * tsd);
  }
  return total / S.length;
}
const stats = (T, n) => T.map(t => { let s = 0, s2 = 0; for (let i = 0; i < n; i++) { s += t[i]; s2 += t[i] * t[i]; } const m = s / n; return { mean: m, sd: Math.sqrt(Math.max(0, s2 / n - m * m)) }; });

// najlepsze dopasowanie jednego wzorca w jednej skali: zgrubnie (pomniejszone), potem dokładnie
function matchAt(S, sw, sh, T, tw, th){
  if (tw > sw || th > sh || tw < 3 || th < 3) return null;
  const f = Math.max(1, Math.min(8, Math.floor(Math.min(tw, th) / 10)));   // wzorzec po pomniejszeniu ma min. ok. 10 px
  let cand = [];
  if (f > 1) {
    const csw = Math.floor(sw / f), csh = Math.floor(sh / f), ctw = Math.floor(tw / f), cth = Math.floor(th / f);
    const CS = resizeAll(S, sw, sh, csw, csh), CT = resizeAll(T, tw, th, ctw, cth), cst = stats(CT, ctw * cth);
    for (let y = 0; y <= csh - cth; y++) for (let x = 0; x <= csw - ctw; x++) cand.push([score(CS, csw, CT, ctw, cth, x, y, cst), x * f, y * f]);
    cand.sort((a, b) => b[0] - a[0]); cand = cand.slice(0, 5);
  } else cand = [[0, 0, 0, true]];
  const tst = stats(T, tw * th); let best = null;
  for (const [, cx, cy, all] of cand) {
    const x0 = all ? 0 : Math.max(0, cx - f), x1 = all ? sw - tw : Math.min(sw - tw, cx + f), y0 = all ? 0 : Math.max(0, cy - f), y1 = all ? sh - th : Math.min(sh - th, cy + f);
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { const s = score(S, sw, T, tw, th, x, y, tst); if (!best || s > best.score) best = { score: s, x, y }; }
  }
  return best;
}

// wczytane wzorce (pamięć podręczna według daty pliku)
const CACHE = new Map();
async function template(name){
  const f = join(IMG_DIR, name), m = (await stat(f).catch(() => { throw new Error(`brak pliku obrazy/${name}`); })).mtimeMs, c = CACHE.get(f);
  if (c && c.m === m) return c.img;
  const img = decodePng(await readFile(f)); CACHE.set(f, { m, img }); return img;
}

// szuka wzorców na zrzucie PNG (piksele = piksele CSS okna); zwraca najlepsze { name, score, x, y, width, height } albo null
export async function findOnShot(png, w){
  const shot = decodePng(png), sw = shot.width, sh = shot.height;
  const S = channels(shot, w.cmp); let best = null;
  const scales = w.scales ? [1, 0.9, 1.1, 0.8, 1.25, 0.67, 1.5, 0.5, 2] : [1];
  for (const name of w.images) {
    const img = await template(name), T0 = channels(img, w.cmp);
    for (const s of scales) {
      const tw = Math.round(img.width * s), th = Math.round(img.height * s); if (tw > sw || th > sh || tw < 4 || th < 4) continue;
      const T = s === 1 ? T0 : resizeAll(T0, img.width, img.height, tw, th);
      const m = matchAt(S, sw, sh, T, tw, th);
      if (m && (!best || m.score > best.score)) best = { name, score: m.score, x: m.x, y: m.y, width: tw, height: th, scale: s };
      if (best && best.score >= 0.985) return best;   // praktycznie identyczny – nie ma sensu szukać dalej
    }
  }
  return best;
}
