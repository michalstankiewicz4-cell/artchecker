// Panel: zakładki, edytor scenariusza, podpowiedzi; wysyła ustawienia do serwera i pokazuje postęp na żywo (SSE).
const $ = id => document.getElementById(id);
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const h = html => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; };
let total = 0, running = false;
// panel działa naprawdę tylko z serwera na tym komputerze; plik albo GitHub Pages = podgląd wyglądu
const LIVE = ["127.0.0.1", "localhost"].includes(location.hostname);
const PREVIEW_MSG = location.protocol === "file:" ? "podgląd bez serwera – Start nieaktywny" : "podgląd panelu – bota uruchamiasz na swoim komputerze (start.bat)";
// numer wersji stoi w index.html (pilnuje go npm test); działający program podaje swój – gdyby panel był z innej wersji
document.title += " " + $("ver").textContent;
if (LIVE) fetch("/api/info").then(r => r.json()).then(i => { $("ver").textContent = "v" + i.version; document.title = "Human Bot – panel v" + i.version; }).catch(() => {});

// motyw dzień / noc: domyślnie jak w systemie, wybór zapamiętany w tej przeglądarce
const THEME_KEY = "humanbot-theme";
const sysDark = () => matchMedia("(prefers-color-scheme: dark)").matches;
function applyTheme(t){ const dark = t ? t === "dark" : sysDark(); if (t) document.documentElement.dataset.theme = t; else delete document.documentElement.dataset.theme;
  $("theme").textContent = dark ? "☀ Dzień" : "☾ Noc"; $("theme").title = dark ? "Przełącz na jasny motyw (dzień)" : "Przełącz na ciemny motyw (noc)"; }
let theme = null; try { theme = localStorage.getItem(THEME_KEY); } catch (_) {}
applyTheme(theme);
$("theme").addEventListener("click", () => { const dark = document.documentElement.dataset.theme ? document.documentElement.dataset.theme === "dark" : sysDark();
  theme = dark ? "light" : "dark"; try { localStorage.setItem(THEME_KEY, theme); } catch (_) {} applyTheme(theme); });
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => { if (!theme) applyTheme(null); });

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
// miejsce dla myszy: element (selektor CSS), punkt (% szerokości i wysokości okna) albo losowe miejsce
const pt = at => ({ at, selector: "", x: 50, y: 50, images: [], thr: 90, wait: 10, miss: "skip", cmp: "gray", scales: true });
let IMAGES = [];   // pliki z folderu obrazy/ (tylko gdy panel działa z programu)
const loadImages = () => LIVE ? fetch("/api/images").then(r => r.json()).then(l => { IMAGES = l; renderScenario(); }).catch(() => {}) : Promise.resolve();
const MOUSE = ["hover", "click", "drag", "select", "scroll"];
const TYPES = {
  type:   { name: "Pisz tekst", def: () => ({ text: "", target: "page" }) },
  keys:   { name: "Naciśnij klawisze", def: () => ({ combo: "Enter", times: 1, target: "page" }) },
  hover:  { name: "Najedź myszą", def: () => ({ ...pt("rand"), stay: 1, target: "page" }) },
  click:  { name: "Kliknij", def: () => ({ ...pt("el"), button: "left", count: 1, times: 1, target: "page" }) },
  drag:   { name: "Przeciągnij", def: () => ({ from: pt("el"), to: pt("pt"), target: "page" }) },
  select: { name: "Zaznacz tekst", def: () => ({ how: "word", ...pt("el"), from: pt("el"), to: pt("el"), target: "page" }) },
  scroll: { name: "Przewiń", def: () => ({ dir: "down", px: 600, over: "page", selector: "", target: "page" }) },
  wait:   { name: "Czekaj", def: () => ({ min: 1, max: 3 }) },
  noise:  { name: "Szum", def: () => ({}) },
};
let scenario = [{ type: "noise" }], dragFrom = null;

// ikonki przełącznika: kartka z tekstem = treść strony, okno z paskiem kart = przeglądarka
const ICON_PAGE = `<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M4 1.5h5.5L12.5 4.5v10h-8.5z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M9.5 1.5v3h3M6 7.5h4.5M6 9.75h4.5M6 12h3" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`;
const ICON_BROWSER = `<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><rect x="1.5" y="2.5" width="13" height="11" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M1.5 5.75h13" stroke="currentColor" stroke-width="1.2"/><circle cx="3.6" cy="4.15" r=".7" fill="currentColor"/><circle cx="5.6" cy="4.15" r=".7" fill="currentColor"/><path d="M7.5 3.4h5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`;
const TIP_PAGE = "Strona – klawisze trafiają tylko do treści strony. Działa też bez okna i w tle, ale skróty przeglądarki (Ctrl+F, Ctrl+T, Alt+←, F5…) nic nie otworzą.";
const TIP_BROWSER = "Przeglądarka – klawisze idą do okna przeglądarki jak z prawdziwej klawiatury: działają skróty przeglądarki (np. Ctrl+F otwiera okienko szukania). Tekst idzie tam, gdzie jest kursor w oknie (np. okienko Ctrl+F, pasek adresu). Tylko Windows; wymaga widocznego okna; w tym czasie nie używaj klawiatury ani myszy.";
const TIP_PAGE_M = "Strona – mysz działa tylko w treści strony. Działa też bez okna i w tle.";
const TIP_BROWSER_M = "Przeglądarka – prawdziwy kursor nad oknem przeglądarki, więc można trafić też w jej przyciski (np. „Wstecz”, karty). Punkt liczony w % całego okna. Tylko Windows; wymaga widocznego okna; w tym czasie nie ruszaj myszą ani klawiaturą.";
const targetHTML = (a, i) => { const m = MOUSE.includes(a.type), tp = m ? TIP_PAGE_M : TIP_PAGE, tb = m ? TIP_BROWSER_M : TIP_BROWSER;
  return `<span class="target seg2" role="radiogroup" aria-label="${m ? "Gdzie działa mysz" : "Dokąd idą klawisze"}">
  <label title="${tp}"><input type="radio" name="tg${i}" value="page"${a.target === "page" ? " checked" : ""} data-f="target" aria-label="Strona"><span>${ICON_PAGE}</span></label><label title="${tb}"><input type="radio" name="tg${i}" value="browser"${a.target === "browser" ? " checked" : ""} data-f="target" aria-label="Przeglądarka"><span>${ICON_BROWSER}</span></label></span>`; };

// pola „gdzie”: lista element / punkt / losowo i pola zależne; p = ścieżka w obiekcie akcji ("" albo "from.", "to.")
const sel = (name, val, opts, title) => `<select data-f="${name}" title="${title}">${opts.map(([v, t]) => `<option value="${v}"${String(v) === String(val) ? " selected" : ""}>${t}</option>`).join("")}</select>`;
function whereHTML(w, p, label, rand){
  const opts = [["el", "element"], ["pt", "punkt"], ["img", "obraz"]]; if (rand) opts.push(["rand", "losowo"]);
  let h = `${label ? `<span class="lbl">${label}</span>` : ""}${sel(p + "at", w.at, opts, "Jak wskazać miejsce: element strony (selektor CSS), punkt w oknie (w % szerokości i wysokości), obraz (bot szuka wyciętego fragmentu na zrzucie strony) albo losowe miejsce.")}`;
  if (w.at === "img") return `<span class="where">${h}${imgHTML(w, p)}</span>`;
  if (w.at === "el") h += `<input data-f="${p}selector" class="grow sel" placeholder="selektor CSS, np. #menu" value="${esc(w.selector)}" title="Selektor CSS elementu – bot wybierze w nim losowy punkt.">`;
  if (w.at === "pt") h += `<label class="num pct" title="Odległość od lewej krawędzi okna, w % jego szerokości.">x <input data-f="${p}x" type="number" min="0" max="100" value="${w.x}"> %</label><label class="num pct" title="Odległość od górnej krawędzi okna, w % jego wysokości.">y <input data-f="${p}y" type="number" min="0" max="100" value="${w.y}"> %</label>`;
  return `<span class="where">${h}</span>`;
}
// obraz: wzorce (kilka = alternatywy, np. wersja jasna i ciemna) i ustawienia szukania
function imgHTML(w, p){
  const chips = w.images.map((n, k) => `<span class="chip" title="${esc(n)}">${LIVE ? `<img src="/obrazy/${encodeURIComponent(n)}" alt="">` : ""}<span>${esc(n.replace(/\.png$/, ""))}</span><button type="button" data-do="imgdel" data-p="${p}" data-k="${k}" title="Usuń ten wzorzec z akcji (plik zostaje w folderze obrazy)">✕</button></span>`).join("");
  const free = IMAGES.filter(n => !w.images.includes(n));
  return `<span class="imgbox">
    <span class="chips">${chips || `<span class="sub">brak wzorca</span>`}
      <select data-f="${p}imgadd" title="Dodaj wzorzec z folderu obrazy. Kilka wzorców = alternatywy: wystarczy, że znajdzie się jeden (np. przycisk w jasnym i ciemnym motywie)."><option value="">+ z folderu…</option>${free.map(n => `<option value="${esc(n)}">${esc(n)}</option>`).join("")}</select>
      <button type="button" class="newimg" data-do="newimg" data-p="${p}" title="Zrób zrzut strony albo wklej / wczytaj obrazek i wytnij z niego fragment do szukania.">✂ Nowy…</button></span>
    <span class="imgopts">
      <label class="num" title="Jak bardzo znaleziony fragment musi przypominać wzorzec (100% = identyczny).">próg <input data-f="${p}thr" type="number" min="50" max="100" value="${w.thr}"> %</label>
      <label class="num" title="Jak długo szukać – strona może się jeszcze doczytywać.">szukaj do <input data-f="${p}wait" type="number" min="0" max="120" step="0.5" value="${w.wait}"> s</label>
      <label class="num">gdy brak ${sel(p + "miss", w.miss, [["skip", "pomiń"], ["scroll", "przewijaj i szukaj"], ["error", "błąd akcji"]], "Co zrobić, gdy obrazka nie ma na stronie.")}</label>
      <label class="num">porównuj ${sel(p + "cmp", w.cmp, [["gray", "szarość"], ["color", "kolory"], ["edges", "krawędzie"]], "Jak porównywać: kolory – najdokładniej, ale motyw jasny/ciemny psuje dopasowanie; szarość – odporne na drobne zmiany kolorów; krawędzie – odporne też na zmianę motywu.")}</label>
      <label class="check sm" title="Szukaj też w innych rozmiarach – wzorzec jest dopasowywany do wylosowanego skalowania i rozmiaru okna."><input type="checkbox" data-f="${p}scales"${w.scales ? " checked" : ""}> różne skale</label>
    </span></span>`;
}
const SEL_TIP = "Selektor znajdziesz w Chrome: prawy przycisk na elemencie → Zbadaj → na podświetlonym kodzie prawy przycisk → Copy → Copy selector. Punkt: x i y w % okna (0,0 = lewy górny róg, 50,50 = środek). Obraz: bot robi zrzut strony i szuka na nim wyciętego fragmentu (wzorca), a potem trafia w losowe miejsce w nim.";

function fieldsHTML(a, i){
  switch (a.type) {
    case "type": return `<textarea data-f="text" rows="2" placeholder="tekst do wpisania; nowa linia = Enter" title="Tekst, który bot wpisze znak po znaku z ludzkim rytmem. Nowa linia = Enter.">${esc(a.text)}</textarea>
      <span class="help" tabindex="0" data-tip="Bot wpisuje tekst znak po znaku jak człowiek: nierówne odstępy między klawiszami (średnio ok. 150–200 ms), szybciej w częstych parach liter, dłużej po spacji i interpunkcji, czasem chwila namysłu, każdy klawisz chwilę przytrzymany. Polskie znaki są „naciskane” jak na polskiej klawiaturze. Pisze tam, gdzie jest kursor – żeby wskazać pole, dodaj wcześniej akcję „Kliknij”. Jeśli kursora nie ma nigdzie, bot kliknie w pierwsze widoczne pole tekstowe.">?</span>`;
    case "keys": return `<input data-f="combo" class="combo" readonly value="${esc(showCombo(a.combo))}" data-combo="${esc(a.combo)}" title="Kliknij tutaj i naciśnij klawisz albo kombinację (np. Ctrl+F). Skrótów, które przeglądarka przechwytuje sama (np. Ctrl+W), nie da się tu nacisnąć – wybierz je z listy obok.">
      <select data-f="preset" title="Gotowe klawisze i kombinacje – także te, których nie da się nacisnąć w polu obok."><option value="">lista…</option>${PRESETS.map(([g, ks]) => `<optgroup label="${g}">${ks.map(k => `<option value="${k}">${esc(showCombo(k))}</option>`).join("")}</optgroup>`).join("")}</select>
      <label class="times" title="Ile razy nacisnąć – z ludzkimi odstępami między naciśnięciami.">× <input data-f="times" type="number" min="1" max="100" value="${a.times}"></label>
      <span class="help" tabindex="0" data-tip="Kliknij w pole z klawiszem i naciśnij kombinację na klawiaturze – zapisze się sama (np. Ctrl+F, Shift+Tab, Alt+←). Niektórych skrótów (np. Ctrl+W, Ctrl+T, Ctrl+N) przeglądarka nie oddaje stronie – takie wybierz z listy. „×” = ile razy nacisnąć. Skróty przeglądarki (Ctrl+F, Ctrl+T, Alt+←, F5…) zadziałają tylko w trybie „Przeglądarka”.">?</span>`;
    case "hover": return `${whereHTML(a, "", "", true)}
      <label class="num" title="Ile sekund kursor stoi w miejscu (z drobnym drżeniem ręki).">stój <input data-f="stay" type="number" min="0" max="60" step="0.5" value="${a.stay}"> s</label>
      <span class="help" tabindex="0" data-tip="Bot dojeżdża kursorem ludzkim ruchem i chwilę stoi, niczego nie klikając – np. żeby rozwinąć menu po najechaniu albo pokazać podpowiedź. ${SEL_TIP} „Losowo” – dowolne miejsce w widocznej części okna.">?</span>`;
    case "click": return `${whereHTML(a, "", "", false)}
      ${sel("button", a.button, [["left", "lewy"], ["right", "prawy"], ["middle", "środkowy"]], "Którym przyciskiem myszy kliknąć.")}
      ${sel("count", a.count, [[1, "pojedyncze"], [2, "podwójne"]], "Pojedyncze albo podwójne kliknięcie.")}
      <label class="times" title="Ile razy powtórzyć kliknięcie – z ludzkimi przerwami.">× <input data-f="times" type="number" min="1" max="100" value="${a.times}"></label>
      <span class="help" tabindex="0" data-tip="Bot dojeżdża myszą ludzkim ruchem i klika – np. w pole, w które potem będzie pisał. Prawy przycisk otwiera menu kontekstowe, środkowy zwykle otwiera link w nowej karcie. ${SEL_TIP} Przykłady selektorów: #search, input[name=q], button[type=submit]. Bot czeka na element do 10 s.">?</span>`;
    case "drag": return `${whereHTML(a.from, "from.", "z", false)}${whereHTML(a.to, "to.", "do", false)}
      <span class="help" tabindex="0" data-tip="Bot wciska lewy przycisk, przesuwa kursor ludzkim ruchem i puszcza – np. suwak, przeciąganie elementu albo zaznaczenie. ${SEL_TIP}">?</span>`;
    case "select": return `${sel("how", a.how, [["word", "słowo (2× klik)"], ["para", "akapit (3× klik)"], ["range", "fragment (przeciągnij)"]], "Jak zaznaczyć: podwójne kliknięcie zaznacza słowo, potrójne – akapit, przeciągnięcie – fragment od miejsca do miejsca.")}
      ${a.how === "range" ? `${whereHTML(a.from, "from.", "od", false)}${whereHTML(a.to, "to.", "do", false)}` : whereHTML(a, "", "w", false)}
      <span class="help" tabindex="0" data-tip="Ludzie często zaznaczają tekst podczas czytania. Słowo – podwójne kliknięcie w losowe słowo elementu, akapit – potrójne kliknięcie, fragment – przeciągnięcie od miejsca do miejsca. ${SEL_TIP}">?</span>`;
    case "scroll": return `${sel("dir", a.dir, [["down", "w dół"], ["up", "w górę"]], "Kierunek przewijania.")}
      <label class="num" title="O ile pikseli przewinąć (ok. 100 px = jedno „kliknięcie” kółka).">o <input data-f="px" type="number" min="50" max="20000" step="50" value="${a.px}"> px</label>
      ${sel("over", a.over, [["page", "całą stronę"], ["el", "nad elementem"]], "Co przewijać: całą stronę albo przewijany element wewnątrz niej (lista, okienko) – bot najpierw najedzie na niego kursorem.")}
      ${a.over === "el" ? `<input data-f="selector" class="grow sel" placeholder="selektor CSS, np. .lista albo #czat" value="${esc(a.selector)}" title="Selektor CSS przewijanego elementu.">` : ""}
      <span class="help" tabindex="0" data-tip="Bot przewija kółkiem myszy porcjami z krótkimi przerwami, jak przy czytaniu. Jedno „kliknięcie” kółka to ok. 100 px, cały ekran – ok. 700–900 px. „Nad elementem” – dla list i okienek, które przewijają się osobno od strony.">?</span>`;
    case "wait": return `<label class="num" title="Najkrótszy czas czekania, w sekundach.">od <input data-f="min" type="number" min="0" step="0.5" value="${a.min}"></label>
      <label class="num" title="Najdłuższy czas czekania, w sekundach.">do <input data-f="max" type="number" min="0" step="0.5" value="${a.max}"> s</label>
      <span class="help" tabindex="0" data-tip="Bot czeka losowy czas z tego przedziału, w tym czasie lekko poruszając myszą – jak człowiek, który czyta albo się zastanawia.">?</span>`;
    case "noise": return `<span class="sub">czytanie, przewijanie, ruchy myszy – kilkanaście sekund</span>
      <span class="help" tabindex="0" data-tip="„Szum” to tło ludzkiego zachowania: przez kilkanaście sekund bot zachowuje się jak czytający człowiek – 3–6 razy chwilę „czyta” (drobne ruchy myszy), przewija kółkiem w dół – czasem wraca trochę wyżej – i co jakiś czas najeżdża myszą na link, nagłówek albo przycisk, niczego nie klikając. Działa na każdej stronie.">?</span>`;
  }
}

function renderScenario(){
  const ol = $("scenario"); ol.innerHTML = "";
  scenario.forEach((a, i) => {
    const li = h(`<li class="action${MOUSE.includes(a.type) ? " mouse" : ""}" data-i="${i}">
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
  updateConflicts();
}

// „Bez okna” nie współgra z akcjami w trybie „Przeglądarka” – obie strony konfliktu na żółto z ⚠
const WARN = `<span class="warn-ico" aria-hidden="true">⚠</span>`;
function updateConflicts(){
  const head = $("headless").checked; let n = 0;
  [...$("scenario").children].forEach((li, i) => { const bad = head && scenario[i].target === "browser"; if (bad) n++;
    li.classList.toggle("conflict", bad);
    const lab = li.querySelector('.seg2 label:nth-of-type(2)'); if (lab) lab.classList.toggle("conflict", bad);
    li.querySelector(".no").title = bad ? "Ta akcja („Przeglądarka”) nie zadziała z opcją „Bez okna przeglądarki” w Ustawieniach." : ""; });
  const hl = $("headless").closest("label"); hl.classList.toggle("conflict", n > 0);
  hl.querySelector(".warn-note")?.remove();
  if (n) hl.insertAdjacentHTML("beforeend", `<span class="warn-note" title="Akcje w trybie „Przeglądarka” potrzebują widocznego okna.">${WARN} nie pasuje do ${n} ${n === 1 ? "akcji" : "akcji"} w trybie „Przeglądarka” (zakładka Plan)</span>`);
  $("tab-set").classList.toggle("has-conflict", n > 0); $("tab-plan").classList.toggle("has-conflict", n > 0);
}
$("headless").addEventListener("change", updateConflicts);

function addAction(type, at = scenario.length){ scenario.splice(at, 0, { type, ...TYPES[type].def() }); renderScenario();
  const li = $("scenario").children[at]; li.classList.add("new"); li.querySelector(".fields input, .fields textarea, .fields select")?.focus(); }

// zmiany pól
$("scenario").addEventListener("input", e => { const li = e.target.closest(".action"), f = e.target.dataset.f; if (!li || !f || f === "type" || f === "preset") return;
  if (/(^|\.)imgadd$/.test(f)) return;
  setF(scenario[+li.dataset.i], f, e.target.type === "checkbox" ? e.target.checked : e.target.type === "number" ? +e.target.value : e.target.value); });
// pole „from.x” → a.from.x
const getW = (a, f) => f.includes(".") ? a[f.split(".")[0]] : a;   // obiekt miejsca dla pola (a, a.from albo a.to)
function setF(a, f, v){ const k = f.split("."); let o = a; while (k.length > 1) o = o[k.shift()]; o[k[0]] = v; }
const RERENDER = /(^|\.)at$|^how$|^over$/;   // zmiana tych list zmienia pola wiersza
$("scenario").addEventListener("change", e => { const li = e.target.closest(".action"); if (!li) return; const i = +li.dataset.i, f = e.target.dataset.f;
  if (f === "type") { scenario[i] = { type: e.target.value, ...TYPES[e.target.value].def() }; renderScenario(); }
  else if (f === "preset" && e.target.value) { scenario[i].combo = e.target.value; const c = li.querySelector(".combo"); c.value = showCombo(e.target.value); c.dataset.combo = e.target.value; e.target.value = ""; }
  else if (f === "target") { scenario[i].target = e.target.value; updateConflicts(); }
  else if (f && /(^|\.)imgadd$/.test(f)) { if (e.target.value) { getW(scenario[i], f).images.push(e.target.value); renderScenario(); } }
  else if (f && RERENDER.test(f)) { setF(scenario[i], f, e.target.value); renderScenario(); $("scenario").children[i].querySelector(`[data-f="${f}"]`)?.focus(); }
  else if (f === "button" || f === "count") setF(scenario[i], f, f === "count" ? +e.target.value : e.target.value); });
// przyciski wiersza
$("scenario").addEventListener("click", e => { const b = e.target.closest("button[data-do]"); if (!b) return; const i = +b.closest(".action").dataset.i;
  if (b.dataset.do === "newimg") { openCrop(scenario[i], b.dataset.p); return; }
  if (b.dataset.do === "imgdel") { getW(scenario[i], b.dataset.p + "x").images.splice(+b.dataset.k, 1); renderScenario(); return; }
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
renderScenario(); loadImages();

// =====================================================================
// Nowy obraz: zrzut strony z planu albo wklejony / wczytany obrazek → zaznaczenie prostokąta → zapis do obrazy/
// =====================================================================
const crop = { w: null, img: null, r: null, start: null };
const cv = $("crop-cv"), cx = cv.getContext("2d");
function openCrop(a, p){ crop.w = getW(a, p + "x"); crop.img = null; crop.r = null; $("crop-name").value = ""; drawCrop();
  $("crop-shot").disabled = !LIVE; $("crop-save").disabled = true;
  $("crop-msg").textContent = LIVE ? "Zrób zrzut, wczytaj plik albo wklej obrazek (Ctrl+V), potem zaznacz myszą fragment do szukania." : "Podgląd panelu: zapis do folderu obrazy działa tylko w programie na Twoim komputerze."; $("crop").showModal(); }
function setCropImage(src){ const im = new Image(); im.onload = () => { crop.img = im; crop.r = null; drawCrop(); $("crop-msg").textContent = "Zaznacz myszą prostokąt – tylko to bot będzie szukał."; }; im.src = src; }
function drawCrop(){ const im = crop.img; if (!im) { cv.width = 640; cv.height = 200; cx.fillStyle = getComputedStyle(document.body).getPropertyValue("--bg"); cx.fillRect(0, 0, 640, 200); return; }
  const s = Math.min(1, 860 / im.naturalWidth, 520 / im.naturalHeight); cv.width = Math.round(im.naturalWidth * s); cv.height = Math.round(im.naturalHeight * s); crop.s = s;
  cx.drawImage(im, 0, 0, cv.width, cv.height);
  if (crop.r) { const { x, y, w, h } = crop.r; cx.fillStyle = "rgba(0,0,0,.45)"; cx.fillRect(0, 0, cv.width, cv.height); cx.drawImage(im, x / s, y / s, w / s, h / s, x, y, w, h);
    cx.strokeStyle = "#ffcc00"; cx.lineWidth = 2; cx.strokeRect(x + 1, y + 1, w - 2, h - 2); }
  $("crop-save").disabled = !LIVE || !crop.r || crop.r.w < 4 || crop.r.h < 4;
  $("crop-size").textContent = crop.r ? `${Math.round(crop.r.w / s)} × ${Math.round(crop.r.h / s)} px` : ""; }
const cpos = e => { const b = cv.getBoundingClientRect(); return { x: Math.max(0, Math.min(cv.width, (e.clientX - b.left) * cv.width / b.width)), y: Math.max(0, Math.min(cv.height, (e.clientY - b.top) * cv.height / b.height)) }; };
cv.addEventListener("pointerdown", e => { if (!crop.img) return; cv.setPointerCapture(e.pointerId); crop.start = cpos(e); crop.r = null; drawCrop(); });
cv.addEventListener("pointermove", e => { if (!crop.start) return; const q = cpos(e), s = crop.start;
  crop.r = { x: Math.min(s.x, q.x), y: Math.min(s.y, q.y), w: Math.abs(q.x - s.x), h: Math.abs(q.y - s.y) }; drawCrop(); });
cv.addEventListener("pointerup", () => { crop.start = null; });
$("crop-file").addEventListener("change", e => { const f = e.target.files[0]; if (f) { const rd = new FileReader(); rd.onload = () => setCropImage(rd.result); rd.readAsDataURL(f); } e.target.value = ""; });
$("crop").addEventListener("paste", e => { const it = [...e.clipboardData.items].find(x => x.type.startsWith("image/")); if (!it) return;
  e.preventDefault(); const rd = new FileReader(); rd.onload = () => setCropImage(rd.result); rd.readAsDataURL(it.getAsFile()); });
$("crop-shot").addEventListener("click", async () => { $("crop-msg").textContent = "Robię zrzut strony z zakładki Plan…"; $("crop-shot").disabled = true;
  const r = await fetch("/api/shot", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ url: $("url").value.trim(), useChrome: $("useChrome").checked }) }).catch(() => null);
  $("crop-shot").disabled = false; const j = r ? await r.json().catch(() => ({})) : {};
  if (j.data) setCropImage(j.data); else $("crop-msg").textContent = j.error || "nie udało się zrobić zrzutu"; });
$("crop-save").addEventListener("click", async () => { const s = crop.s, { x, y, w, h } = crop.r, c = document.createElement("canvas");
  c.width = Math.round(w / s); c.height = Math.round(h / s); c.getContext("2d").drawImage(crop.img, x / s, y / s, w / s, h / s, 0, 0, c.width, c.height);
  const r = await fetch("/api/images", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: $("crop-name").value || "obraz", data: c.toDataURL("image/png") }) }).catch(() => null);
  const j = r ? await r.json().catch(() => ({})) : {};
  if (!j.name) { $("crop-msg").textContent = j.error || "nie udało się zapisać"; return; }
  crop.w.images.push(j.name); $("crop").close(); await loadImages(); renderScenario(); });
$("crop-cancel").addEventListener("click", () => $("crop").close());

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
  const noEl = w => (w.at === "el" && !w.selector.trim()) || (w.at === "img" && !w.images.length);
  const i = scenario.findIndex(a => (a.type === "type" && !a.text) || (a.type === "keys" && !a.combo)
    || ((a.type === "hover" || a.type === "click") && noEl(a)) || (a.type === "drag" && (noEl(a.from) || noEl(a.to)))
    || (a.type === "select" && (a.how === "range" ? noEl(a.from) || noEl(a.to) : noEl(a)))
    || (a.type === "scroll" && a.over === "el" && !a.selector.trim()));
  if (i >= 0) return [`Akcja ${i + 1} (${TYPES[scenario[i].type].name}) jest niewypełniona.`, "tab-plan", i];
  return null;
}

$("cfg").addEventListener("submit", async e => {
  e.preventDefault();
  if (!LIVE) { $("status").textContent = PREVIEW_MSG; return; }
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

const es = LIVE ? new EventSource("/api/events") : { addEventListener(){} };
if (!LIVE) $("status").textContent = PREVIEW_MSG;
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
es.onerror = () => { if (!running) $("status").textContent = "brak połączenia z serwerem – czy okno z botem jest otwarte?"; };

// =====================================================================
// Zakładki Plan / Ustawienia (myszą, strzałkami ←/→); przy błędnym polu przełącza na jego zakładkę
// =====================================================================
const TABS = [["tab-plan", "pane-plan"], ["tab-set", "pane-set"], ["tab-stat", "pane-stat"]];
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
