// Akcja „Znajdź pozycję”: na stronie wyników wyszukiwania czyta wyniki po kolei i szuka domeny;
// gdy jej nie ma – przewija w dół i przechodzi do następnej strony wyników (jak człowiek). W znaleziony wynik NIE wchodzi.
// Selektory wyników i przycisku „następna strona” są w akcji (domyślnie pod Google), więc działa też z inną wyszukiwarką.
import { sleep, rand, idle, scroll, clickEl } from "./human.mjs";

// adres wyniku: bezpośredni albo przekierowanie typu /url?q=…
function realUrl(href){
  try { const u = new URL(href); const q = u.pathname === "/url" && (u.searchParams.get("q") || u.searchParams.get("url")); return new URL(q || href); }
  catch (_) { return null; }
}
const matches = (u, dom) => !!u && (u.hostname === dom || u.hostname.endsWith("." + dom));

// strona z CAPTCHA / blokadą – bot jej nie obchodzi
async function blocked(page){
  if (/\/sorry\//.test(page.url())) return true;
  return (await page.locator('iframe[src*="recaptcha"], form#captcha-form, #recaptcha').count().catch(() => 0)) > 0;
}

export async function findRank(page, a, ctx){
  const dom = a.domain, query = (() => { try { const u = new URL(page.url()); return u.searchParams.get("q") || u.searchParams.get("query") || ""; } catch (_) { return ""; } })();
  let offset = 0, pages = 0;
  const done = (position, hit) => { (ctx.rec.ranks ||= []).push({ query, domain: dom, position, page: hit ? pages : null, url: hit?.href || "", title: hit?.title || "", pagesChecked: pages }); };
  while (pages < a.maxPages) {
    if (ctx.signal?.aborted) break;
    if (await blocked(page)) throw new Error("wyszukiwarka pokazała CAPTCHA / blokadę – sprawdzanie przerwane (bot jej nie rozwiązuje)");
    try { await page.locator(a.results).first().waitFor({ state: "visible", timeout: 15000 }); }
    catch (_) { if (await blocked(page)) throw new Error("wyszukiwarka pokazała CAPTCHA / blokadę – sprawdzanie przerwane (bot jej nie rozwiązuje)");
      throw new Error(pages ? "następna strona wyników się nie wczytała" : `nie widać wyników (selektor „${a.results}”) – czy przed tą akcją jest wyszukanie frazy?`); }
    pages++;
    const links = await page.$$eval(a.results, els => els.map(e => ({ href: e.href, title: ((e.querySelector("h3") || e).innerText || "").trim().split("\n")[0] })));
    const seen = new Set(), list = links.filter(l => l.href && !seen.has(l.href) && seen.add(l.href));
    const i = list.findIndex(l => matches(realUrl(l.href), dom));
    // „czytanie” wyników: chwila i przewijanie w dół – także wtedy, gdy wynik jest na tej stronie
    await idle(page, rand(1200, 3000));
    if (i >= 0) { const p = offset + i + 1; done(p, list[i]);
      return `fraza „${query}”: ${dom} na pozycji ${p} (strona ${pages}, ${i + 1}. wynik) – „${list[i].title}”; bez wchodzenia na stronę`; }
    offset += list.length;
    if (pages >= a.maxPages) break;
    const next = page.locator(a.next).first();
    if (!(await next.count())) break;   // nie ma kolejnej strony wyników
    // do dołu strony porcjami, jak przy czytaniu, potem „następna”
    for (let k = 0; k < 12; k++) {
      const left = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight - scrollY);
      if (left < 40) break;
      await scroll(page, Math.min(left, rand(400, 800))); await sleep(rand(300, 900));
    }
    await sleep(rand(400, 1200)); await clickEl(page, next);
    await page.waitForLoadState("load", { timeout: 20000 }).catch(() => {}); await sleep(rand(800, 1600));
  }
  done(null, null);
  return `fraza „${query}”: ${dom} nie ma w pierwszych ${offset} wynikach (${pages} ${pages === 1 ? "strona" : pages < 5 ? "strony" : "stron"})`;
}
