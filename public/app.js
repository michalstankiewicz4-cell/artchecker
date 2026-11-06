// Panel: wysyła ustawienia do serwera i pokazuje postęp na żywo (Server-Sent Events).
const $ = id => document.getElementById(id);
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
let total = 0, hashes = [];
fetch("/api/info").then(r => r.json()).then(i => { $("ver").textContent = "v" + i.version; document.title += " v" + i.version; }).catch(() => {});

function setRunning(on){
  $("start").disabled = on; $("stop").disabled = !on;
  document.querySelectorAll("#cfg input, #cfg textarea").forEach(e => e.disabled = on);
  $("status").textContent = on ? "pracuje…" : "gotowy";
}

$("cfg").addEventListener("submit", async e => {
  e.preventDefault();
  const spoof = {}; document.querySelectorAll("[data-spoof]").forEach(c => spoof[c.dataset.spoof] = c.checked);
  const body = { url: $("url").value.trim(), visits: +$("visits").value, delayMin: +$("delayMin").value, delayMax: +$("delayMax").value,
    spoof, browse: $("browse").checked, botTest: $("botTest").checked, useChrome: $("useChrome").checked, headless: $("headless").checked, proxies: $("proxies").value };
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
    + `<td>${v.error ? `<span class="bad">${esc(v.error)}</span>` : `<code>${esc(v.hash)}</code> ${v.newHash ? '<span class="good">nowy</span>' : '<span class="bad">powtórzony</span>'}`}</td>`
    + `<td>${v.botVerdict ? `${v.botSigns}/5 → <span class="${v.botVerdict === "bot" ? "bad" : "good"}">${esc(v.botVerdict)}</span>` : "—"}</td><td>${(v.ms / 1000).toFixed(0)} s</td>`;
  $("visits-t").tBodies[0].appendChild(tr);
  const u = new Set(hashes).size; $("uniq").textContent = `Różnych odcisków: ${u} z ${hashes.length} udanych wejść.`;
  $("status").textContent = `pracuje… ${v.n}${total ? ` z ${total}` : ""}`; });
es.onerror = () => { $("status").textContent = "brak połączenia z serwerem – czy okno z botem jest otwarte?"; };
