"use strict";
/* =====================================================================
   OZNACZENIA, WERDYKT, START
   ===================================================================== */
/* Obiekt uznany za fałszywy = ma zaznaczony co najmniej jeden sygnał na checkliście. */
const flagged=p=>!!(p.check&&Object.values(p.check).some(Boolean));
function setVerdicts(){const v=document.getElementById('verdicts');
 v.innerHTML=KIND||MODE==='sculpt'?'<button class="btn primary" data-v="end">Zakończ ekspertyzę</button>':MODE==='frag'?'<button class="btn primary" data-v="yes" disabled>Pochodzi z oryginału</button> <button class="btn primary" data-v="no" disabled>To nie oryginał</button>':'<button class="btn primary" data-v="pick" disabled>To jest oryginał</button>';
 v.querySelectorAll('button').forEach(b=>b.onclick=()=>verdict(b.dataset.v));if(MODE==='memory'&&MEM.phase===1)v.innerHTML=''}
function verdict(v){if(!sel&&!KIND&&MODE!=='sculpt')return;const m=document.getElementById('modal');let h='';
 if(KIND){const good=P.filter(p=>p.orig!==flagged(p)).length;
  h=`<h2 style="color:${good===5?'var(--ok)':'var(--bad)'}">Poprawnie sklasyfikowano ${good} z 5 banknotów.</h2>`;
  h+=`<table class="mx"><tr><th>Zabezpieczenie</th>${P.map(p=>`<th>${p.letter}<br><small>${p.orig?'prawdziwy':'fałszywy'} · ${flagged(p)?'checklista: fałszywy':'checklista: prawdziwy'}</small></th>`).join('')}</tr>`+
   TLIST.map(t=>`<tr><td>${t.name}</td>${P.map(p=>`<td>${p.t[t.id]?'<span class="x">✖</span>':'<span class="v">✓</span>'}${p.notes[t.id]?'':' <small class="nb">(nie badano)</small>'}</td>`).join('')}</tr>`).join('')+'</table>';
  h+=P.filter(p=>!p.orig).map(p=>`<div class="cp"><b>${KIND.noun} ${p.letter} – ${KIND.profiles[p.profile].name}</b><ul>${TLIST.filter(t=>p.t[t.id]).map(t=>`<li>${t.name}: ${KIND.why(p,t.id)}</li>`).join('')}</ul></div>`).join('')}
 else 
 if(MODE==='memory'){const orig=P.find(p=>p.orig),ok=sel===orig,good=P.filter(p=>!p.orig&&flagged(p)).length,bad=flagged(orig);
  h=`<h2 style="color:${ok?'var(--ok)':'var(--bad)'}">${ok?`Trafnie! Oryginałem jest obraz ${orig.letter}.`:`Pudło – wskazano obraz ${sel.letter}, a oryginałem jest obraz ${orig.letter}.`}</h2><div class="cp">Falsyfikaty z sygnałami na checkliście: <b>${good}/4</b>${bad?' · na checkliście oryginału zaznaczono sygnały fałszerstwa':''}.</div>`+
   P.map(p=>`<div class="cp"><b>Obraz ${p.letter} – ${p.orig?'oryginał':'falsyfikat'}</b>${flagged(p)?' <small class="nb">(sygnały na checkliście)</small>':''}${p.orig?'':`<ul>${p.muts.map(q=>`<li>${q.desc}</li>`).join('')}</ul>`}</div>`).join('')+'<div class="cp">Po zamknięciu różnice zostaną zaznaczone na planszy czerwonymi okręgami.</div>';MEM.reveal=true;render()}
 else if(MODE==='frag'){const p=P[0],ok=(v==='yes')===p.orig,d=descItems();h=`<h2 style="color:${ok?'var(--ok)':'var(--bad)'}">${ok?'Trafnie!':'Pudło.'} Fragment ${p.orig?'POCHODZI':'NIE pochodzi'} z oryginału.</h2>`;
  h+=`<table class="mx"><tr><th>Badanie</th><th>Opis oryginału</th><th>Fragment</th><th></th></tr>`+TLIST.filter(t=>d[t.id]).map(t=>{const bad=p.t[t.id];return`<tr><td>${t.name}${p.notes[t.id]?'':' <small class="nb">(nie badano)</small>'}</td><td style="text-align:left">${d[t.id]}</td><td style="text-align:left">${bad?whyBad(p,t.id):t.id==='back'?`zgodne (${p.thread} nitek/cm)`:'zgodne z opisem'}</td><td>${bad?'<span class="x">✖</span>':'<span class="v">✓</span>'}</td></tr>`}).join('')+'</table>'}
 else{const orig=P.find(p=>p.orig),noun=MODE==='sculpt'?'rzeźba':'obraz';
  if(MODE==='sculpt'){/* rzeźby: ocena z checklisty – oryginał bez sygnałów, kopie z co najmniej jednym */const good=P.filter(p=>p.orig!==flagged(p)).length,ok=good===P.length;
   h=`<h2 style="color:${ok?'var(--ok)':'var(--bad)'}">${ok?'Trafnie! ':''}Checklista poprawnie oceniła ${good} z ${P.length} rzeźb. Oryginałem jest rzeźba ${orig.letter}.</h2>`+(flagged(orig)?'<div class="cp">Na checkliście oryginału zaznaczono sygnały fałszerstwa.</div>':'')+(P.some(p=>!p.orig&&!flagged(p))?`<div class="cp">Kopie bez zaznaczeń na checkliście: ${P.filter(p=>!p.orig&&!flagged(p)).map(p=>p.letter).join(', ')}.</div>`:'')}
  else{const ok=sel===orig;h=`<h2 style="color:${ok?'var(--ok)':'var(--bad)'}">${ok?`Trafnie! Oryginałem jest ${noun} ${orig.letter}.`:`Pudło – wskazano ${noun} ${sel.letter}, a oryginałem jest ${noun} ${orig.letter}.`}</h2>`}
  const rows=TLIST.map(t=>t.id);if(MODE==='paint5'&&P.some(p=>p.t.mark))rows.push('mark');const nm=Object.assign({},EXTRA,...TLIST.map(t=>({[t.id]:t.name})));
  h+=`<table class="mx"><tr><th>Badanie</th>${P.map(p=>`<th>${p.letter}<br><small>${p.orig?'oryginał':'kopia'}${flagged(p)?' · checklista ✕':''}</small></th>`).join('')}</tr>`+
   rows.map(id=>`<tr><td>${nm[id]}</td>${P.map(p=>`<td>${p.t[id]?'<span class="x">✖</span>':'<span class="v">✓</span>'}${p.notes[id]?'':' <small class="nb">(nie badano)</small>'}</td>`).join('')}</tr>`).join('')+'</table>';
  const PR=MODE==='sculpt'?SV.profiles:PROFILES;h+=P.filter(p=>!p.orig).map(p=>`<div class="cp"><b>${MODE==='sculpt'?'Rzeźba':'Obraz'} ${p.letter} – ${MODE==='sculpt'?PR[p.profile].name:profName(p.profile)}</b><ul>${rows.filter(id=>p.t[id]).map(id=>`<li>${nm[id]}: ${whyBad(p,id)}</li>`).join('')}</ul></div>`).join('');
  if(MODE==='paint5'){const herr=[];if(orig.retouch)herr.push('ciemne plamy w UV to udokumentowane retusze z konserwacji w 1961 r.');if(orig.warGap)herr.push('luka w proweniencji 1939–1951 dotyczy wojny i sama nie przesądza o fałszerstwie');if(herr.length)h+=`<div class="cp"><b>Obraz ${orig.letter} – oryginał.</b> Pułapki: ${herr.join('; ')}.</div>`;
   h+=`<div class="cp">Gęstość płótna: katalog ${C.thread} nitek/cm; ${P.map(p=>`${p.letter}: ${p.thread}`).join(', ')}.</div>`}}
 h+=checkReport();h+=`<div style="display:flex;gap:8px;margin-top:12px"><button class="btn primary" id="mnew">Nowa partia</button><button class="btn" id="mclose">Wróć do stołu</button></div>`;
 document.getElementById('mbox').innerHTML=h;m.classList.add('show');recordDone(/Trafnie|5 z 5/.test(h.slice(0,300)));document.getElementById('mnew').onclick=()=>{m.classList.remove('show');runNewGame()};document.getElementById('mclose').onclick=()=>m.classList.remove('show')}
function setCase(){const e=document.getElementById('case');
 if(KIND)e.textContent=KIND.caseText();else
 if(MODE==='memory')e.textContent=`Pamięć eksperta: „${ART.title}” – ${ART.name} (${ART.life}). Zapamiętaj oryginał, a potem wskaż go wśród prawie identycznych falsyfikatów. (Artyści i dzieła są fikcyjne.)`;else
 if(MODE==='sculpt')e.textContent=SV.caseText();
 else if(MODE==='frag')e.textContent=`Sprawa: fragment obrazu, który może pochodzić z zaginionego dzieła „${ART.title}” – ${ART.name} (${ART.life}), ${ART.year}. Oryginał znany tylko z opisu. (Artyści i dzieła są fikcyjne.)`;
 else if(ART.real)e.textContent=`Dzieło prawdziwe: „${ART.title}” – ${ART.name} (${ART.life}), ${ART.yearTxt}, ${ART.real.tech}, ok. ${fmt(ART.hcm)} × ${fmt(ART.wcm)} cm, ${ART.museum}. Na stole ${P.length===4?'4 obrazy':'5 obrazów'}: reprodukcja oryginału i kopie zrobione przez grę. Wyniki badań są symulowane.`;
 else e.textContent=`Sprawa: „${ART.title}”, przypisywany: ${ART.name} (${ART.life}), ${ART.year}, ${SUP[supOf()].tech}, ${fmt(ART.wcm)} × ${fmt(ART.hcm)} cm. Na stole ${P.length===4?'4 obrazy':'5 obrazów'} – jeden jest oryginałem. (Artyści i dzieła są fikcyjne.)`}
async function newGame(){showTab('panel');CUR=document.getElementById('mode').value;MODE=CUR;KIND=KINDS[MODE]||null;SV=SCULPT_VARIANTS[MODE]||null;if(SV)MODE='sculpt';fillArtist(CUR);await resolveReal(CUR);const r=rng((Math.random()*1e9)|0);sel=null;tool=null;REFC=null;
 document.getElementById('tiltw').style.display=KIND&&KIND.tilt?'':'none';const is3=MODE==='sculpt';cv.style.display=is3?'none':'block';document.getElementById('three').style.display=is3?'block':'none';
 document.getElementById('help').textContent=is3?'Przeciągnij – obracaj · prawy przycisk / Shift – przesuń · kółko / szczypanie – przybliż · kliknij rzeźbę – wybierz':'Kółko myszy / szczypanie – zoom (do ×24) · przeciągnij – przesuń · kliknij obiekt – wybierz · lampa świeci za kursorem (Shift + kółko – wielkość)';
 document.getElementById('zsig').textContent=is3?'Tył cokołu':KIND?KIND.focusLabel:'Sygnatura';
 document.querySelector('.zoom').style.display=MODE==='memory'?'none':'';if(MODE!=='memory'){clearInterval(MEM.iv);MEM.phase=0}else MEM.phase=1;
 if(MODE==='memory')document.getElementById('help').textContent='Najedź kursorem – lupa ×4 · kliknij obraz – wybierz';
 buildToolDefs();setVerdicts();
 if(is3){document.getElementById('panel').innerHTML='<div class="obs">Ładowanie sceny 3D…</div>';try{await loadThree()}catch(e){document.getElementById('panel').innerHTML='<div class="obs">Nie udało się wczytać biblioteki 3D (three.js). Sprawdź połączenie z internetem.</div>';return}
  init3D();newSculpt(r);build3Scene()}
 else{if(MODE==='frag')newFrag(r);else if(MODE==='memory')newMemory(r);else if(KIND)KIND.newGame(r);else newPaint5(r);fit()}
 setCase();buildTools();onChange()}
document.getElementById('zin').onclick=()=>{if(MODE==='sculpt')return zoom3(1/1.4);const r=cv.getBoundingClientRect();zoomAt(r.width/2,r.height/2,1.6)};
document.getElementById('zout').onclick=()=>{if(MODE==='sculpt')return zoom3(1.4);const r=cv.getBoundingClientRect();zoomAt(r.width/2,r.height/2,1/1.6)};
document.getElementById('zfit').onclick=()=>{if(MODE==='sculpt'){anim3(new THREE.Vector3(0,1.15,0),5.6,0,0.16);return}fit()};
document.getElementById('zsel').onclick=()=>{if(!sel)return;if(MODE==='sculpt'){const b=T3.busts.find(b=>b.q===sel);anim3(b.center.clone(),0.9,0,0.1);return}focusRect(sel.x-40,sel.y-40,W+80,H+80)};
document.getElementById('zsig').onclick=()=>{if(!sel)return;if(MODE==='sculpt'){const b=T3.busts.find(b=>b.q===sel);anim3(new THREE.Vector3(b.center.x,1.05,0),0.4,Math.PI,0.15);return}if(sel.kind)return focusRect(...sel.kind.focus(sel));focusRect(sel.x+C.sig.x-14,sel.y+C.sig.y-26,C.sig.w+28,40)};
document.getElementById('tilt').oninput=e=>{TILT.v=+e.target.value;if(TILT.v<20)TILT.lo=true;if(TILT.v>60)TILT.hi=true;document.getElementById('tiltv').textContent=TILT.v+'°';render();scheduleGates()};
fillArtist(document.getElementById('mode').value);
document.getElementById('newgame').onclick=()=>runNewGame();document.getElementById('mode').onchange=()=>runNewGame();document.getElementById('artist').onchange=()=>runNewGame();
new ResizeObserver(resize).observe(cv);
