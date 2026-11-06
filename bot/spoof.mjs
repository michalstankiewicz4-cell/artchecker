// Kod wstrzykiwany do strony przed jej skryptami (page.addInitScript). Zmienia to, czego
// Playwright nie ustawia sam: navigator.*, WebGL, szum na płótnie, ukrywanie czcionek.
// Uwaga: podmienione funkcje da się wykryć (np. po Function.prototype.toString) – to demo, nie niewidzialność.
export function spoof(p){
  const def = (obj, key, val) => { try { Object.defineProperty(obj, key, { get: () => val, configurable: true }); } catch (_) {} };
  const N = Navigator.prototype;
  if (p.platform) def(N, "platform", p.platform);
  if (p.languages) { def(N, "languages", Object.freeze([...p.languages])); def(N, "language", p.languages[0]); }
  if (p.hardwareConcurrency) def(N, "hardwareConcurrency", p.hardwareConcurrency);
  if (p.deviceMemory) def(N, "deviceMemory", p.deviceMemory);
  if (p.doNotTrack !== undefined) def(N, "doNotTrack", p.doNotTrack);
  def(N, "webdriver", false);
  if (p.chPlatform && navigator.userAgentData) {
    const brands = [{ brand: "Chromium", version: String(p.major) }, { brand: "Google Chrome", version: String(p.major) }, { brand: "Not_A Brand", version: "24" }];
    const uad = { brands, mobile: false, platform: p.chPlatform,
      getHighEntropyValues: async () => ({ brands, mobile: false, platform: p.chPlatform, platformVersion: "", architecture: "x86", model: "", uaFullVersion: `${p.major}.0.0.0` }),
      toJSON(){ return { brands, mobile: false, platform: p.chPlatform }; } };
    def(N, "userAgentData", uad);
  }
  // WebGL: producent i model karty
  if (p.webglVendor) for (const C of [self.WebGLRenderingContext, self.WebGL2RenderingContext]) {
    if (!C) continue; const orig = C.prototype.getParameter;
    C.prototype.getParameter = function (k) { if (k === 37445) return p.webglVendor; if (k === 37446) return p.webglRenderer; return orig.call(this, k); };
  }
  // płótno: lekki, stały w obrębie wizyty szum w eksportowanym obrazku → inny skrót canvas
  if (p.canvasNoise) {
    let s = p.seed >>> 0; const rnd = () => (s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32;
    const noise = [...Array(24)].map(() => [rnd(), rnd(), Math.floor(rnd() * 3)]);
    const orig = HTMLCanvasElement.prototype.toDataURL;
    HTMLCanvasElement.prototype.toDataURL = function (...a) {
      try { if (this.width && this.height) {
        const c = document.createElement("canvas"); c.width = this.width; c.height = this.height; const g = c.getContext("2d");
        g.drawImage(this, 0, 0); const d = g.getImageData(0, 0, c.width, c.height);
        for (const [x, y, ch] of noise) { const i = (Math.floor(y * c.height) * c.width + Math.floor(x * c.width)) * 4 + ch; d.data[i] ^= 1; if (d.data[i + 3 - ch] === 0) d.data[i + 3 - ch] = 1; }
        g.putImageData(d, 0, 0); return orig.apply(c, a); } } catch (_) {}
      return orig.apply(this, a); };
  }
  // czcionki: pomiar tekstu „udaje”, że część czcionek nie jest zainstalowana
  if (p.hiddenFonts && p.hiddenFonts.length) {
    const hidden = p.hiddenFonts.map(f => f.toLowerCase()), orig = CanvasRenderingContext2D.prototype.measureText;
    CanvasRenderingContext2D.prototype.measureText = function (t) {
      const f = this.font, m = /^(.*?[\d.]+px\s+)(.+)$/.exec(f);
      if (m) { const fam = m[2].split(","), first = fam[0].trim().replace(/^["']|["']$/g, "").toLowerCase();
        if (fam.length > 1 && hidden.includes(first)) { this.font = m[1] + fam.slice(1).join(",").trim(); const r = orig.call(this, t); this.font = f; return r; } }
      return orig.call(this, t); };
  }
}
