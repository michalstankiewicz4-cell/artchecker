// Panel: zakładki, edytor scenariusza, podpowiedzi; wysyła ustawienia do serwera i pokazuje postęp na żywo (SSE).
const $ = id => document.getElementById(id);
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const h = html => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; };
let total = 0, running = false;
fetch("/api/info").then(r => r.json()).then(i => { $("ver").textContent = "v" + i.version; document.title += " v" + i.version; }).catch(() => {});

// =====================================================================
// Scenariusz: lista akcji wykonywanych po kolei po wczytaniu strony
// =====================================================================
// klawisze w formacie Playwrighta (Control+F); wyświetlane po polsku (Ctrl+F)
const SHOW_KEY = { Control: "Ctrl", Escape: "Esc", ArrowUp: "↑", ArrowDown: "↓", ArrowLeft: "←", ArrowRight: "→", " ": "Spacja", Space: "Spacja", Meta: "Win" };
const showCombo = c => c ? c.split("+").map(k => SHOW_KEY[k] || k).join("+") : "";
const PRESETS = [
  ["Podstawowe", ["Enter", "Tab", "Shift+Tab", "Escape", "Space", "Backspace", "Delete"]],
  ["Nawigacja", ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "PageDown", "PageUp", "Home", "End"]],
  ["Edycja", ["Control+A", "Control+C", "Control+V", "Control+X", "Control+Z"]],
  ["Przeglądarka", ["Control+F", "F3", "Control+L", "Control+T", "Control+W", "Control+Tab", "Control+R", "F5", "Alt+ArrowLeft", "Alt+ArrowRight", "Control+Plus", "Control+Minus"]],
];
const TYPES = {
  type:   { name: "Pisz tekst", def: () => ({ text: "", target: "page" }) },
  keys:   { name: "Naciśnij klawisze", def: () => ({ combo: "Enter", times: 1, target: "page" }) },
  click:  { name: "Kliknij w element", def: () => ({ selector: "" }) },
  scroll: { name: "Przewiń", def: () => ({ dir: "down", px: 600 }) },
  wait:   { name: "Czekaj", def: () => ({ min: 1, max: 3 }) },
  human:  { name: "Ludzkie zachowanie", def: () => ({}) },
};
let scenario = [{ type: "human" }], dragFrom = null;

// ikonki przełącznika: kartka z tekstem = treść strony, okno z paskiem kart = przeglądarka
const ICON_PAGE = `<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M4 1.5h5.5L12.5 4.5v10h-8.5z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M9.5 1.5v3h3M6 7.5h4.5M6 9.75h4.5M6 12h3" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`;
const ICON_BROWSER = `<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><rect x="1.5" y="2.5" width="13" height="11" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M1.5 5.75h13" stroke="currentColor" stroke-width="1.2"/><circle cx="3.6" cy="4.15" r=".7" fill="currentColor"/><circle cx="5.6" cy="4.15" r=".7" fill="currentColor"/><path d="M7.5 3.4h5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`;
const TIP_PAGE = "Strona – klawisze trafiają tylko do treści strony. Działa też bez okna i w tle, ale skróty przeglądarki (Ctrl+F, Ctrl+T, Alt+←, F5…) nic nie otworzą.";
const TIP_BROWSER = "Przeglądarka – klawisze idą do okna przeglądarki jak z prawdziwej klawiatury: działają skróty przeglądarki (np. Ctrl+F otwiera okienko szukania). Wymaga widocznego okna; w tym czasie nie używaj klawiatury ani myszy.";
const targetHTML = (a, i) => `<span class="target seg2" role="radiogroup" aria-label="Dokąd idą klawisze">
  <label title="${TIP_PAGE}"><input type="radio" name="tg${i}" value="page"${a.target === "page" ? " checked" : ""} data-f="target" aria-label="Strona"><span>${ICON_PAGE}</span></label><label title="${TIP_BROWSER}"><input type="radio" name="tg${i}" value="browser"${a.target === "browser" ? " checked" : ""} data-f="target" aria-label="Przeglądarka"><span>${ICON_BROWSER}</span></label></span>`;

function fieldsHTML(a, i){
  switch (a.type) {
    case "type": return `<textarea data-f="text" rows="2" placeholder="tekst do wpisania; nowa linia = Enter" title="Tekst, który bot wpisze znak po znaku z ludzkim rytmem. Nowa linia = Enter.">${esc(a.text)}</textarea>
      <span class="help" tabindex="0" data-tip="Bot wpisuje tekst znak po znaku jak człowiek: nierówne odstępy między klawiszami (średnio ok. 150–200 ms), szybciej w częstych parach liter, dłużej po spacji i interpunkcji, czasem chwila namysłu, każdy klawisz chwilę przytrzymany. Polskie znaki są „naciskane” jak na polskiej klawiaturze. Pisze tam, gdzie jest kursor – żeby wskazać pole, dodaj wcześniej akcję „Kliknij w element”. Jeśli kursora nie ma nigdzie, bot kliknie w pierwsze widoczne pole tekstowe.">?</span>`;
    case "keys": return `<input data-f="combo" class="combo" readonly value="${esc(showCombo(a.combo))}" data-combo="${esc(a.combo)}" title="Kliknij tutaj i naciśnij klawisz albo kombinację (np. Ctrl+F). Skrótów, które przeglądarka przechwytuje sama (np. Ctrl+W), nie da się tu nacisnąć – wybierz je z listy obok.">
      <select data-f="preset" title="Gotowe klawisze i kombinacje – także te, których nie da się nacisnąć w polu obok."><option value="">lista…</option>${PRESETS.map(([g, ks]) => `<optgroup label="${g}">${ks.map(k => `<option value="${k}">${esc(showCombo(k))}</option>`).join("")}</optgroup>`).join("")}</select>
      <label class="times" title="Ile razy nacisnąć – z ludzkimi odstępami między naciśnięciami.">× <input data-f="times" type="number" min="1" max="100" value="${a.times}"></label>
      <span class="help" tabindex="0" data-tip="Kliknij w pole z klawiszem i naciśnij kombinację na klawiaturze – zapisze się sama (np. Ctrl+F, Shift+Tab, Alt+←). Niektórych skrótów (np. Ctrl+W, Ctrl+T, Ctrl+N) przeglądarka nie oddaje stronie – takie wybierz z listy. „×” = ile razy nacisnąć. Skróty przeglądarki (Ctrl+F, Ctrl+T, Alt+←, F5…) zadziałają tylko w trybie „Przeglądarka”.">?</span>`;
    case "click": return `<input data-f="selector" class="grow" placeholder="selektor CSS, np. #search albo textarea[name=q]" value="${esc(a.selector)}" title="Selektor CSS elementu, w który bot kliknie (np. pole do pisania).">
      <span class="help" tabindex="0" data-tip="Bot dojeżdża myszą do elementu ludzkim ruchem i klika w niego – np. w pole, w które potem będzie pisał. Selektor znajdziesz w Chrome: prawy przycisk na elemencie → Zbadaj → na podświetlonym kodzie prawy przycisk → Copy → Copy selector. Przykłady: #search, input[name=q], textarea, button[type=submit]. Bot czeka na element do 10 s.">?</span>`;
    case "scroll": return `<select data-f="dir" title="Kierunek przewijania."><option value="down"${a.dir === "down" ? " selected" : ""}>w dół</option><option value="up"${a.dir === "up" ? " selected" : ""}>w górę</option></select>
      <label class="num" title="O ile pikseli przewinąć (ok. 100 px = jedno „kliknięcie” kółka).">o <input data-f="px" type="number" min="50" max="20000" step="50" value="${a.px}"> px</label>
      <span class="help" tabindex="0" data-tip="Bot przewija kółkiem myszy porcjami z krótkimi przerwami, jak przy czytaniu. Jedno „kliknięcie” kółka to ok. 100 px, cały ekran – ok. 700–900 px.">?</span>`;
    case "wait": return `<label class="num" title="Najkrótszy czas czekania, w sekundach.">od <input data-f="min" type="number" min="0" step="0.5" value="${a.min}"></label>
      <label class="num" title="Najdłuższy czas czekania, w sekundach.">do <input data-f="max" type="number" min="0" step="0.5" value="${a.max}"> s</label>
      <span class="help" tabindex="0" data-tip="Bot czeka losowy czas z tego przedziału, w tym czasie lekko poruszając myszą – jak człowiek, który czyta albo się zastanawia.">?</span>`;
    case "human": return `<span class="sub">czytanie, przewijanie, ruchy myszy – kilkanaście sekund</span>
      <span class="help" tabindex="0" data-tip="Bot przez kilkanaście sekund zachowuje się jak czytający człowiek: 3–6 razy chwilę „czyta” (drobne ruchy myszy), przewija kółkiem w dół – czasem wraca trochę wyżej – i co jakiś czas najeżdża myszą na link, nagłówek albo przycisk, niczego nie klikając. Działa na każdej stronie.">?</span>`;
  }
}

function renderScenario(){
  const ol = $("scenario"); ol.innerHTML = "";
  scenario.forEach((a, i) => {
    const li = h(`<li class="action" data-i="${i}">
      <span class="no">${i + 1}</span>
      <span class="grip" draggable="true" title="Przeciągnij, żeby zmienić kolejność.">⠿</span>
      <select class="kind" data-f="type" title="Rodzaj akcji.">${Object.entries(TYPES).map(([k, t]) => `<option value="${k}"${k === a.type ? " selected" : ""}>${t.name}</option>`).join("")}</select>
      <span class="fields">${fieldsHTML(a, i)}</span>
      <span class="tcell">${"target" in a ? targetHTML(a, i) : ""}</span>
      <span class="row-btns">
        <button type="button" data-do="up" title="Przesuń wyżej"${i === 0 ? " disabled" : ""}>↑</button>
        <button type="button" data-do="down" title="Przesuń niżej"${i === scenario.length - 1 ? " disabled" : ""}>↓</button>
        <button type="button" data-do="dup" title="Powiel akcję">⧉</button>
        <button type="button" data-do="del" title="Usuń akcję" class="del">✕</button>
      </span></li>`);
    ol.appendChild(li);
  });
  $("scenario-empty").hidden = scenario.length > 0;
  if (running) setRunning(true);
}

function addAction(type, at = scenario.length){ scenario.splice(at, 0, { type, ...TYPES[type].def() }); renderScenario();
  const li = $("scenario").children[at]; li.classList.add("new"); li.querySelector(".fields input, .fields textarea, .fields select")?.focus(); }

// zmiany pól
$("scenario").addEventListener("input", e => { const li = e.target.closest(".action"), f = e.target.dataset.f; if (!li || !f || f === "type" || f === "preset") return;
  const a = scenario[+li.dataset.i]; a[f] = e.target.type === "number" ? +e.target.value : e.target.value; });
$("scenario").addEventListener("change", e => { const li = e.target.closest(".action"); if (!li) return; const i = +li.dataset.i, f = e.target.dataset.f;
  if (f === "type") { scenario[i] = { type: e.target.value, ...TYPES[e.target.value].def() }; renderScenario(); }
  else if (f === "preset" && e.target.value) { scenario[i].combo = e.target.value; const c = li.querySelector(".combo"); c.value = showCombo(e.target.value); c.dataset.combo = e.target.value; e.target.value = ""; }
  else if (f === "target") scenario[i].target = e.target.value; });
// przyciski wiersza
$("scenario").addEventListener("click", e => { const b = e.target.closest("button[data-do]"); if (!b) return; const i = +b.closest(".action").dataset.i;
  if (b.dataset.do === "del") scenario.splice(i, 1);
  if (b.dataset.do === "dup") scenario.splice(i + 1, 0, structuredClone(scenario[i]));
  if (b.dataset.do === "up" && i > 0) [scenario[i - 1], scenario[i]] = [scenario[i], scenario[i - 1]];
  if (b.dataset.do === "down" && i < scenario.length - 1) [scenario[i + 1], scenario[i]] = [scenario[i], scenario[i + 1]];
  renderScenario(); });
// nagrywanie kombinacji klawiszy w polu „combo”
const MODS = ["Control", "Alt", "Shift", "Meta"];
$("scenario").addEventListener("keydown", e => { if (!e.target.classList.contains("combo")) return;
  if (e.key === "Tab" && !e.ctrlKey && !e.altKey && !e.shiftKey) return;   // Tab = zwykłe przejście dalej
  e.preventDefault();
  let key = e.key;
  if (/^Key[A-Z]$/.test(e.code)) key = e.code.slice(3); else if (/^Digit\d$/.test(e.code)) key = e.code.slice(5);
  else if (key === " ") key = "Space"; else if (key === "+") key = "Plus"; else if (key === "-") key = "Minus"; else if (key.length === 1) key = key.toUpperCase();
  const mods = MODS.filter(m => e.getModifierState(m) && m !== key);
  const combo = MODS.includes(key) ? mods.concat(key).join("+") : mods.concat(key).join("+");
  e.target.value = showCombo(combo) + (MODS.includes(key) ? "+…" : ""); if (MODS.includes(key)) return;
  e.target.dataset.combo = combo; scenario[+e.target.closest(".action").dataset.i].combo = combo; });
$("scenario").addEventListener("keyup", e => { if (e.target.classList.contains("combo")) e.target.value = showCombo(e.target.dataset.combo); });
// przeciąganie za uchwyt
$("scenario").addEventListener("dragstart", e => { const li = e.target.closest(".action"); if (!li) return; dragFrom = +li.dataset.i; li.classList.add("dragging"); e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", ""); e.dataTransfer.setDragImage(li, 20, 20); });
$("scenario").addEventListener("dragover", e => { if (dragFrom === null) return; e.preventDefault(); const li = e.target.closest(".action");
  document.querySelectorAll(".action.drop-above,.action.drop-below").forEach(x => x.classList.remove("drop-above", "drop-below"));
  if (li) { const r = li.getBoundingClientRect(); li.classList.add(e.clientY < r.top + r.height / 2 ? "drop-above" : "drop-below"); } });
$("scenario").addEventListener("drop", e => { e.preventDefault(); const li = e.target.closest(".action"); if (dragFrom === null || !li) return;
  let to = +li.dataset.i + (li.classList.contains("drop-below") ? 1 : 0); const [a] = scenario.splice(dragFrom, 1); if (to > dragFrom) to--; scenario.splice(to, 0, a); dragFrom = null; renderScenario(); });
$("scenario").addEventListener("dragend", () => { dragFrom = null; document.querySelectorAll(".action").forEach(x => x.classList.remove("dragging", "drop-above", "drop-below")); });
// menu „+ Dodaj akcję”
const menu = $("add-menu");
const openMenu = on => { menu.hidden = !on; $("add-action").setAttribute("aria-expanded", on); if (on) menu.querySelector("button").focus(); };
$("add-action").addEventListener("click", e => { e.stopPropagation(); openMenu(menu.hidden); });
menu.addEventListener("click", e => { const b = e.target.closest("[data-add]"); if (!b) return; e.stopPropagation(); openMenu(false); addAction(b.dataset.add); });
menu.addEventListener("keydown", e => { const items = [...menu.querySelectorAll("button")], i = items.indexOf(document.activeElement);
  if (e.key === "ArrowDown") { e.preventDefault(); items[(i + 1) % items.length].focus(); }
  if (e.key === "ArrowUp") { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
  if (e.key === "Escape") { openMenu(false); $("add-action").focus(); } });
document.addEventListener("click", () => openMenu(false));
renderScenario();

// =====================================================================
// Start / Stop i podgląd na żywo
// =====================================================================
function setRunning(on){
  running = on; $("start").disabled = on; $("stop").disabled = !on;
  document.querySelectorAll("#cfg input, #cfg textarea, #cfg select, #scenario button, #add-action").forEach(e => { if (e.id !== "stop" && e.id !== "start") e.disabled = on; });
  if (!on) renderScenarioButtons();
  $("status").textContent = on ? "pracuje…" : "gotowy";
}
// po odblokowaniu przywróć wyłączone ↑/↓ na krańcach
function renderScenarioButtons(){ const rows = $("scenario").children;
  [...rows].forEach((li, i) => { li.querySelector('[data-do="up"]').disabled = i === 0; li.querySelector('[data-do="down"]').disabled = i === rows.length - 1; }); }

function validate(){
  if ($("headless").checked && scenario.some(a => a.target === "browser")) return ["Akcje w trybie „Przeglądarka” wymagają widocznego okna – w Ustawieniach odznacz „Bez okna przeglądarki” albo zmień te akcje na „Strona”.", "tab-set"];
  const i = scenario.findIndex(a => (a.type === "click" && !a.selector.trim()) || (a.type === "type" && !a.text) || (a.type === "keys" && !a.combo));
  if (i >= 0) return [`Akcja ${i + 1} (${TYPES[scenario[i].type].name}) jest niewypełniona.`, "tab-plan", i];
  return null;
}

$("cfg").addEventListener("submit", async e => {
  e.preventDefault();
  const bad = validate();
  if (bad) { $("status").textContent = bad[0]; openTab(bad[1]); if (bad[2] !== undefined) { const li = $("scenario").children[bad[2]]; li.classList.add("invalid"); li.scrollIntoView({ block: "center" }); setTimeout(() => li.classList.remove("invalid"), 2500); } return; }
  const spoof = {}; document.querySelectorAll("[data-spoof]").forEach(c => spoof[c.dataset.spoof] = c.checked);
  const body = { url: $("url").value.trim(), visits: +$("visits").value, delayMin: +$("delayMin").value, delayMax: +$("delayMax").value,
    spoof, scenario, useChrome: $("useChrome").checked, headless: $("headless").checked, proxies: $("proxies").value };
  $("visits-t").tBodies[0].innerHTML = ""; $("log").textContent = ""; $("report").textContent = "";
  const r = await fetch("/api/start", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }).catch(() => null);
  if (!r) { $("status").textContent = "brak połączenia z serwerem – uruchom start.bat"; return; }
  if (!r.ok) { const j = await r.json().catch(() => ({})); $("status").textContent = j.error || "błąd"; }
});
$("stop").addEventListener("click", () => fetch("/api/stop", { method: "POST" }));

const es = new EventSource("/api/events");
es.addEventListener("state", e => { const s = JSON.parse(e.data); setRunning(s.running);
  if (s.running) total = s.total || 0;
  if (s.file) $("report").innerHTML = `Raport: <a href="/reports/${esc(s.file)}.csv">${esc(s.file)}.csv</a> · <a href="/reports/${esc(s.file)}.json">.json</a> (folder <code>reports</code>)`; });
es.addEventListener("log", e => { const l = $("log"); l.textContent += JSON.parse(e.data) + "\n"; l.scrollTop = l.scrollHeight; });
es.addEventListener("visit", e => { const v = JSON.parse(e.data);
  const tr = document.createElement("tr"); if (v.error) tr.className = "err";
  tr.innerHTML = `<td>${v.n}${total ? `/${total}` : ""}</td><td>${esc(v.summary)}${v.proxy ? `<br><small>proxy ${esc(v.proxy)}</small>` : ""}</td>`
    + `<td>${v.actions ? `${v.actionsDone}/${v.actions} akcji${v.typedChars ? `<br><small>${v.typedChars} zn., ${v.cpm} zn./min</small>` : ""}` : "—"}${v.actionError ? `<br><span class="bad">${esc(v.actionError)}</span>` : ""}${v.error ? `<br><span class="bad">${esc(v.error)}</span>` : ""}</td>`
    + `<td>${(v.ms / 1000).toFixed(0)} s</td>`;
  $("visits-t").tBodies[0].appendChild(tr);
  $("status").textContent = `pracuje… ${v.n}${total ? ` z ${total}` : ""}`; });
es.onerror = () => { if (!running) $("status").textContent = location.protocol === "file:" ? "podgląd bez serwera – Start nieaktywny" : "brak połączenia z serwerem – czy okno z botem jest otwarte?"; };

// =====================================================================
// Zakładki Plan / Ustawienia (myszą, strzałkami ←/→); przy błędnym polu przełącza na jego zakładkę
// =====================================================================
const TABS = [["tab-plan", "pane-plan"], ["tab-set", "pane-set"]];
function openTab(id){ for (const [t, p] of TABS) { const on = t === id;
  $(t).setAttribute("aria-selected", on); $(t).tabIndex = on ? 0 : -1; $(p).hidden = !on; } }
TABS.forEach(([t], i) => { $(t).addEventListener("click", () => openTab(t));
  $(t).addEventListener("keydown", e => { if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const nx = TABS[(i + (e.key === "ArrowRight" ? 1 : TABS.length - 1)) % TABS.length][0]; openTab(nx); $(nx).focus(); }); });
$("cfg").addEventListener("invalid", e => { const p = e.target.closest(".pane"); if (p && p.hidden) openTab(TABS.find(x => x[1] === p.id)[0]); }, true);

// =====================================================================
// Podpowiedzi [?]: najechanie, fokus z klawiatury albo kliknięcie (przypina; Esc / klik obok zamyka).
// Delegacja zdarzeń – działa też dla wierszy scenariusza dodawanych później.
// =====================================================================
const tip = $("tip"); let pinned = null;
function showTip(el){ tip.textContent = el.dataset.tip; tip.hidden = false;
  const r = el.getBoundingClientRect(), w = Math.min(360, innerWidth - 20); tip.style.maxWidth = w + "px";
  const tw = tip.offsetWidth, th = tip.offsetHeight;
  let x = Math.min(Math.max(10, r.left + r.width / 2 - tw / 2), innerWidth - tw - 10), y = r.bottom + 8;
  if (y + th > innerHeight - 10) y = r.top - th - 8;
  tip.style.left = x + scrollX + "px"; tip.style.top = y + scrollY + "px"; }
const helpOf = t => t instanceof Element ? t.closest(".help[data-tip]") : null;
document.addEventListener("mouseover", e => { const el = helpOf(e.target); if (el && !pinned) showTip(el); });
document.addEventListener("mouseout", e => { const el = helpOf(e.target); if (el && !pinned && !el.contains(e.relatedTarget)) tip.hidden = true; });
document.addEventListener("focusin", e => { const el = helpOf(e.target); if (el) showTip(el); });
document.addEventListener("focusout", e => { if (helpOf(e.target) && !pinned) tip.hidden = true; });
document.addEventListener("click", e => { const el = helpOf(e.target);
  if (el) { e.preventDefault(); e.stopPropagation(); pinned = pinned === el ? null : el; if (pinned) showTip(el); else tip.hidden = true; return; }
  if (pinned) { pinned = null; tip.hidden = true; } }, true);
document.addEventListener("keydown", e => { if (e.key === "Escape") { pinned = null; tip.hidden = true; } });
new MutationObserver(() => document.querySelectorAll(".help[data-tip]:not([role])").forEach(el => { el.setAttribute("role", "button"); el.setAttribute("aria-label", "Opis: " + el.dataset.tip); }))
  .observe(document.body, { childList: true, subtree: true });
document.querySelectorAll(".help[data-tip]").forEach(el => { el.setAttribute("role", "button"); el.setAttribute("aria-label", "Opis: " + el.dataset.tip); });
