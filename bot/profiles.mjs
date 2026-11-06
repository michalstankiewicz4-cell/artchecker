// Losowe, wewnętrznie spójne profile przeglądarki – jeden na każde wejście.
const pick = a => a[Math.floor(Math.random() * a.length)];
const chance = p => Math.random() < p;

const OS = [
  { name: "Windows", platform: "Win32", uaPlat: "Windows NT 10.0; Win64; x64", chPlat: "Windows", weight: 6,
    gpu: [
      ["Google Inc. (NVIDIA)", "ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 (0x00002504) Direct3D11 vs_5_0 ps_5_0, D3D11)"],
      ["Google Inc. (NVIDIA)", "ANGLE (NVIDIA, NVIDIA GeForce GTX 1650 (0x00001F82) Direct3D11 vs_5_0 ps_5_0, D3D11)"],
      ["Google Inc. (Intel)", "ANGLE (Intel, Intel(R) UHD Graphics 620 (0x00005917) Direct3D11 vs_5_0 ps_5_0, D3D11)"],
      ["Google Inc. (Intel)", "ANGLE (Intel, Intel(R) Iris(R) Xe Graphics (0x00009A49) Direct3D11 vs_5_0 ps_5_0, D3D11)"],
      ["Google Inc. (AMD)", "ANGLE (AMD, AMD Radeon RX 580 2048SP (0x00006FDF) Direct3D11 vs_5_0 ps_5_0, D3D11)"],
      ["Google Inc. (AMD)", "ANGLE (AMD, AMD Radeon(TM) Graphics (0x00001638) Direct3D11 vs_5_0 ps_5_0, D3D11)"] ] },
  { name: "macOS", platform: "MacIntel", uaPlat: "Macintosh; Intel Mac OS X 10_15_7", chPlat: "macOS", weight: 2,
    gpu: [
      ["Google Inc. (Apple)", "ANGLE (Apple, ANGLE Metal Renderer: Apple M1, Unspecified Version)"],
      ["Google Inc. (Apple)", "ANGLE (Apple, ANGLE Metal Renderer: Apple M2, Unspecified Version)"],
      ["Google Inc. (Intel Inc.)", "ANGLE (Intel Inc., Intel(R) Iris(TM) Plus Graphics 655, OpenGL 4.1)"] ] },
  { name: "Linux", platform: "Linux x86_64", uaPlat: "X11; Linux x86_64", chPlat: "Linux", weight: 1,
    gpu: [
      ["Google Inc. (Intel)", "ANGLE (Intel, Mesa Intel(R) UHD Graphics 630 (CFL GT2), OpenGL 4.6)"],
      ["Google Inc. (AMD)", "ANGLE (AMD, AMD Radeon RX 6600 (radeonsi, navi23, LLVM 15.0.7), OpenGL 4.6)"] ] },
];
// język ↔ strefa czasowa (pary, które występują w realnym świecie)
const LOCALES = [
  ["pl-PL", ["pl-PL", "pl", "en-US", "en"], "Europe/Warsaw"], ["de-DE", ["de-DE", "de", "en-US", "en"], "Europe/Berlin"],
  ["en-GB", ["en-GB", "en"], "Europe/London"], ["en-US", ["en-US", "en"], "America/New_York"],
  ["en-US", ["en-US", "en"], "America/Chicago"], ["en-US", ["en-US", "en"], "America/Los_Angeles"],
  ["fr-FR", ["fr-FR", "fr", "en-US", "en"], "Europe/Paris"], ["es-ES", ["es-ES", "es"], "Europe/Madrid"],
  ["it-IT", ["it-IT", "it", "en-US", "en"], "Europe/Rome"], ["nl-NL", ["nl-NL", "nl", "en-US", "en"], "Europe/Amsterdam"],
  ["cs-CZ", ["cs-CZ", "cs", "en"], "Europe/Prague"], ["sv-SE", ["sv-SE", "sv", "en-US", "en"], "Europe/Stockholm"],
  ["uk-UA", ["uk-UA", "uk", "en-US", "en"], "Europe/Kyiv"], ["ja-JP", ["ja-JP", "ja", "en-US", "en"], "Asia/Tokyo"],
];
const SCREENS = [[1920,1080],[1920,1080],[2560,1440],[1366,768],[1536,864],[1440,900],[1680,1050],[1600,900],[1280,800],[3840,2160]];
const DPR = [1, 1, 1.25, 1.5, 2];
// popularne czcionki, które skrypty odcisku zwykle sprawdzają – część z nich można „ukryć”
export const FONT_POOL = ["Arial Black","Calibri","Cambria","Candara","Comic Sans MS","Consolas","Constantia","Corbel","Georgia","Impact",
  "Lucida Console","Lucida Sans Unicode","Palatino Linotype","Segoe UI","Tahoma","Trebuchet MS","Verdana"];

function weighted(list){ const sum = list.reduce((s, x) => s + x.weight, 0); let r = Math.random() * sum;
  for (const x of list){ r -= x.weight; if (r <= 0) return x; } return list[0]; }

// opts: które grupy cech zmieniać; chromeMajor: wersja prawdziwej przeglądarki (UA spójny z silnikiem)
export function makeProfile(opts, chromeMajor){
  const os = weighted(OS), [locale, languages, tz] = pick(LOCALES), [sw, sh] = pick(SCREENS);
  const dpr = sw >= 2560 ? pick([1, 1.5, 2]) : pick(DPR);
  const vw = Math.min(sw, Math.round(sw * (0.75 + Math.random() * 0.25))), vh = Math.min(sh - 80, Math.round((sh - 80) * (0.8 + Math.random() * 0.2)));
  const major = chromeMajor - (chance(0.5) ? 0 : 1);
  const p = { seed: Math.floor(Math.random() * 2 ** 31) };
  if (opts.ua) Object.assign(p, { os: os.name, platform: os.platform, chPlatform: os.chPlat,
    userAgent: `Mozilla/5.0 (${os.uaPlat}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${major}.0.0.0 Safari/537.36`, major });
  if (opts.lang) Object.assign(p, { locale, languages });
  if (opts.tz) p.timezoneId = opts.lang ? tz : pick(LOCALES)[2];
  if (opts.screen) Object.assign(p, { screen: { width: sw, height: sh }, viewport: { width: vw, height: vh }, deviceScaleFactor: dpr });
  if (opts.hw) Object.assign(p, { hardwareConcurrency: pick([2, 4, 4, 6, 8, 8, 12, 16]), deviceMemory: pick([2, 4, 8, 8]) });
  if (opts.webgl) { const [v, r] = pick(opts.ua ? os.gpu : OS[0].gpu); Object.assign(p, { webglVendor: v, webglRenderer: r }); }
  if (opts.canvas) p.canvasNoise = true;
  if (opts.fonts) p.hiddenFonts = FONT_POOL.filter(() => chance(0.3));
  if (opts.prefs) Object.assign(p, { colorScheme: pick(["light", "dark"]), reducedMotion: chance(0.15) ? "reduce" : "no-preference", doNotTrack: chance(0.3) ? "1" : null });
  return p;
}

// opcje dla browser.newContext() z profilu
export function contextOptions(p){
  const o = {};
  if (p.userAgent) o.userAgent = p.userAgent;
  if (p.locale) o.locale = p.locale;
  if (p.timezoneId) o.timezoneId = p.timezoneId;
  if (p.viewport) Object.assign(o, { viewport: p.viewport, screen: p.screen, deviceScaleFactor: p.deviceScaleFactor });
  if (p.colorScheme) Object.assign(o, { colorScheme: p.colorScheme, reducedMotion: p.reducedMotion });
  if (p.languages) o.extraHTTPHeaders = { "Accept-Language": p.languages.map((l, i) => i ? `${l};q=${(1 - i * 0.1).toFixed(1)}` : l).join(",") };
  return o;
}

// krótki opis profilu do panelu i raportu
export function describe(p){
  return [p.os, p.locale, p.timezoneId, p.screen && `${p.screen.width}×${p.screen.height} ×${p.deviceScaleFactor}`,
    p.hardwareConcurrency && `${p.hardwareConcurrency} rdz./${p.deviceMemory} GB`, p.webglRenderer && p.webglRenderer.replace(/^ANGLE \(([^,]+), /, "").replace(/ \(0x.*| Direct3D.*|, OpenGL.*|, Unspecified.*/, ""),
    p.colorScheme, p.hiddenFonts && `ukryte czcionki: ${p.hiddenFonts.length}`].filter(Boolean).join(" · ");
}
