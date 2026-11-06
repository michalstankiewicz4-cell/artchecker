// Panel: wysyła ustawienia do serwera i pokazuje postęp na żywo (Server-Sent Events).
const $ = id => document.getElementById(id);
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
let total = 0, hashes = [];
fetch("/api/info").then(r => r.json()).then(i => { $("ver").textContent = "v" + i.version; document.title += " v" + i.version; }).catch(() => {});

const mode = () => document.querySelector('input[name="typeMode"]:checked').value;
document.querySelectorAll('input[name="typeMode"]').forEach(r => r.addEventListener("change", () => { $("selector").disabled = mode() !== "selector"; if (mode() === "selector") $("selector").focus(); }));

function setRunning(on){
  $("start").disabled = on; $("stop").disabled = !on;
  document.querySelectorAll("#cfg input, #cfg textarea").forEach(e => e.disabled = on);
  if (!on) $("selector").disabled = mode() !== "selector";
  $("status").textContent = on ? "pracuje…" : "gotowy";
}

$("cfg").addEventListener("submit", async e => {
  e.preventDefault();
  const spoof = {}; document.querySelectorAll("[data-spoof]").forEach(c => spoof[c.dataset.spoof] = c.checked);
  const body = { url: $("url").value.trim(), visits: +$("visits").value, delayMin: +$("delayMin").value, delayMax: +$("delayMax").value,
    spoof, text: $("text").value, typeMode: mode(), selector: $("selector").value.trim(), enter: $("enter").checked, browse: $("browse").checked, botTest: $("botTest").checked, useChrome: $("useChrome").checked, headless: $("headless").checked, proxies: $("proxies").value };
  $("visits-t").tBodies[0].innerHTML = ""; $("log").textContent = ""; $("uniq").textContent = ""; $("report").textContent = ""; hashes = [];
  const r = await fetch("/api/start", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  if (!r.ok) { const j = await r.json().catch(() => ({})); $("status").textContent = j.error || "błąd"; }
});
$("stop").addEventListener("click", () => fetch("/api/stop", { method: "POST" }));

const es = new EventSource("/api/events");
es.addEventListener("state", e => { const s = JSON.parse(e.data); setRunning(s.running);
  if (s.running) total = s.total || 0;
  if (s.file) $("report").innerHTML = `Raport: <a href="/reports/${esc(s.file)}.csv">${esc(s.file)}.csv</a> · <a href="/reports/${esc(s.file)}.json">.json</a> (folder <code>reports</code>)`; });
es.addEventListener("log", e => { const l = $("log"); l.textContent += JSON.parse(e.data) + "\n"; l.scrollTop = l.scrollHeight; });
es.addEventListener("visit", e => { const v = JSON.parse(e.data);
  if (v.hash) hashes.push(v.hash);
  const tr = document.createElement("tr"); if (v.error) tr.className = "err";
  tr.innerHTML = `<td>${v.n}${total ? `/${total}` : ""}</td><td>${esc(v.summary)}${v.proxy ? `<br><small>proxy ${esc(v.proxy)}</small>` : ""}</td>`
    + `<td>${v.typedChars ? `${v.typedChars} zn.<br><small>${v.cpm} zn./min</small>` : v.typingError ? `<span class="bad">${esc(v.typingError)}</span>` : "—"}</td>`
    + `<td>${v.error ? `<span class="bad">${esc(v.error)}</span>` : v.hash ? `<code>${esc(v.hash)}</code> ${v.newHash ? '<span class="good">nowy</span>' : '<span class="bad">powtórzony</span>'}` : "—"}</td>`
    + `<td>${v.botVerdict ? `${v.botSigns}/5 → <span class="${v.botVerdict === "bot" ? "bad" : "good"}">${esc(v.botVerdict)}</span>` : "—"}</td><td>${(v.ms / 1000).toFixed(0)} s</td>`;
  $("visits-t").tBodies[0].appendChild(tr);
  const u = new Set(hashes).size; $("uniq").textContent = `Różnych odcisków: ${u} z ${hashes.length} udanych wejść.`;
  $("status").textContent = `pracuje… ${v.n}${total ? ` z ${total}` : ""}`; });
es.onerror = () => { $("status").textContent = "brak połączenia z serwerem – czy okno z botem jest otwarte?"; };

// podpowiedzi [?]: po najechaniu, po fokusie z klawiatury albo po kliknięciu (kliknięcie przypina, Esc / klik obok zamyka)
const tip = $("tip"); let pinned = null;
function showTip(el){ tip.textContent = el.dataset.tip; tip.hidden = false;
  const r = el.getBoundingClientRect(), w = Math.min(360, innerWidth - 20); tip.style.maxWidth = w + "px";
  const tw = tip.offsetWidth, th = tip.offsetHeight;
  let x = Math.min(Math.max(10, r.left + r.width / 2 - tw / 2), innerWidth - tw - 10), y = r.bottom + 8;
  if (y + th > innerHeight - 10) y = r.top - th - 8;
  tip.style.left = x + scrollX + "px"; tip.style.top = y + scrollY + "px"; }
const hideTip = () => { if (!pinned) tip.hidden = true; };
document.querySelectorAll(".help[data-tip]").forEach(h => {
  h.setAttribute("role", "button"); h.setAttribute("aria-label", "Opis: " + h.dataset.tip);
  h.addEventListener("mouseenter", () => showTip(h)); h.addEventListener("mouseleave", hideTip);
  h.addEventListener("focus", () => showTip(h)); h.addEventListener("blur", hideTip);
  h.addEventListener("click", e => { e.preventDefault(); e.stopPropagation(); pinned = pinned === h ? null : h; if (pinned) showTip(h); else tip.hidden = true; });
});
document.addEventListener("click", () => { if (pinned) { pinned = null; tip.hidden = true; } });
document.addEventListener("keydown", e => { if (e.key === "Escape") { pinned = null; tip.hidden = true; } });

// zakładki Plan / Ustawienia (myszą, strzałkami ←/→); przy błędnym polu przełącza na jego zakładkę
const TABS = [["tab-plan", "pane-plan"], ["tab-set", "pane-set"]];
function openTab(id){ for (const [t, p] of TABS) { const on = t === id;
  $(t).setAttribute("aria-selected", on); $(t).tabIndex = on ? 0 : -1; $(p).hidden = !on; } }
TABS.forEach(([t], i) => { $(t).addEventListener("click", () => openTab(t));
  $(t).addEventListener("keydown", e => { if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const nx = TABS[(i + (e.key === "ArrowRight" ? 1 : TABS.length - 1)) % TABS.length][0]; openTab(nx); $(nx).focus(); }); });
$("cfg").addEventListener("invalid", e => { const p = e.target.closest(".pane"); if (p && p.hidden) openTab(TABS.find(x => x[1] === p.id)[0]); }, true);
