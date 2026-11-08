"use strict";
/* =====================================================================
   PANEL
   ===================================================================== */
function gateStatus(p){const T=tool&&TB[tool];if(!T)return null;
 if(MODE==='sculpt')return gate3Status(p,T);
 const g=T.gate;if(!g)return null;let txt=`Warunek: zoom ≥ ×${fmt(g.z)}`+(g.area?` i ${AREA[g.area]}`:T.probe?' (kliknij obiekt)':'')+(g.tilt==='both'?', przechyl od < 20° do > 60°':g.tilt==='hi'?', nachylenie > 65°':'');
 if(!p)return{txt,ok:false};const v=viewportWorld(),ok=vw.z>=g.z&&tiltOK(g)&&(!g.area||areaOK(p,g.area,v));return{txt:txt+` · teraz ×${vw.z.toFixed(1).replace('.',',')}`,ok}}
function updatePanel(){const pn=document.getElementById('panel');
 const intro=KIND?KIND.intro:({paint5:'Na stole leży 5 obrazów: jeden oryginał i cztery kopie, każda wykonana inną metodą i każda zdradza się w innych badaniach. Badania działają dopiero przy odpowiednim zoomie – przybliżaj szczegóły. Oznaczaj obrazy jako podejrzane lub wykluczone i wskaż oryginał.',
  notes:'Na stole leży 5 banknotów 100 florenów (waluta fikcyjna). Część jest prawdziwa, część fałszywa – każdy fałszywy powstał inną metodą. Sprawdź zabezpieczenia: pod światło, przechylając suwakiem „Nachylenie”, pod lupą, w UV, IR i detektorem. Oznacz każdy banknot jako prawdziwy lub falsyfikat i zakończ ekspertyzę.',
  frag:'Na stole leży uszkodzony fragment obrazu. Oryginał zaginął w 1944 r. – znamy go tylko z opisu w katalogu i badań z 1965 r. Sprawdź każdy punkt opisu narzędziami (wiele wymaga dużego zoomu) i zdecyduj, czy fragment pochodzi z oryginału.',
  memory:'Najedź kursorem na obraz – lupa powiększa ×4. W fazie 2 zaznacz obraz i oznacz go przyciskiem „✕ Falsyfikat”, a na końcu wskaż oryginał.',
  sculpt:'Na postumentach stoi 5 brązowych popiersi: jeden oryginał i cztery kopie. Obracaj kamerę i podchodź blisko – wiele badań działa tylko z bliska albo z określonej strony. Oznaczaj odlewy i wskaż oryginał.'})[MODE];
 if(!tool){pn.innerHTML=`<h2>Jak grać</h2><p class="hint">${intro}</p>${sel?'':'<div class="obs">Kliknij obiekt, aby go wybrać.</div>'}`;updateNotes();return}
 const T=TB[tool],p=sel;let h=`<h2>${T.name}${p?' – '+(MODE==='frag'?'fragment':'obiekt '+p.letter):''}</h2><p class="hint">${T.hint}</p>`;
 const gs=gateStatus(p);if(gs)h+=`<div class="gate ${gs.ok?'ok':'no'}">${gs.ok?'✓':'✗'} ${gs.txt}</div>`;
 if(tool==='docs'){pn.innerHTML=h+descHTML();updateNotes();return}
 if(!p){pn.innerHTML=h+'<div class="obs">Kliknij obiekt, aby go zbadać.</div>';updateNotes();return}
 if(MODE==='sculpt'){h+=panel3(p);pn.innerHTML=h;after3(p);updateNotes();return}
 if(tool==='pigment'){const s=p.last&&p.last.kind==='pigment'?p.last:null;
  h+=s?`<div class="obs">Próbka #${s.n} – obszar: <b>${s.reg}</b><table class="pig"><tr><th>Pigment</th><th>Pierwiastki</th><th>W użyciu od</th></tr>${s.list.map(a=>`<tr><td>${a[0]}</td><td>${a[2]}</td><td>${a[1]||'starożytności'}</td></tr>`).join('')}</table></div>`:''}
 else if(tool==='micro'){const s=p.last&&p.last.kind==='micro'?p.last:null;if(s)h+=`<div class="cap">Próbka #${s.n} – obszar: ${s.reg}, mapa powierzchni z mikroskopu konfokalnego</div><canvas id="mc" width="320" height="320"></canvas>`}
 else if(tool==='sig')h+=`<div class="cap">Podpisy referencyjne z dzieł pewnych:</div><canvas id="sg1" width="340" height="64"></canvas><canvas id="sg2" width="340" height="64"></canvas>`;
 else if(tool==='style'&&MODE==='paint5'){const[x,y,w,hh]=SC.styleRect(C);h+=`<div class="cap">Referencja: ${ART.name}, ${ART.ref} – detal:</div><canvas id="st1" width="${Math.round(w*2)}" height="${Math.round(hh*2)}"></canvas>`}
 else if(tool==='style'&&MODE==='frag')h+=`<div class="obs"><b>Opis kompozycji oryginału:</b> ${SC.compDesc}</div>`;
 else if(KIND&&KIND.panel)h+=KIND.panel(p,tool)||'';
 else if(tool==='prov')h+=provHTML(p);else if(tool==='cert')h+=certHTML(p);
 if(!T.probe&&p.notes[tool])h+=`<div class="obs"><b>Obserwacja:</b> ${p.notes[tool]}</div>`;
 else if(!T.probe&&T.gate)h+=`<div class="obs" style="color:var(--mut)">Spełnij warunek powyżej – obserwacja zapisze się automatycznie.</div>`;
 else if(!T.probe&&!T.gate){const o=obs(p,tool);if(o){note(p,tool,o);h+=`<div class="obs"><b>Obserwacja:</b> ${o}</div>`}}
 pn.innerHTML=h;
 if(tool==='micro'&&p.last&&p.last.kind==='micro')drawMicro(document.getElementById('mc'),p,p.last);
 if(tool==='sig')[1,2].forEach(k=>{const x=document.getElementById('sg'+k).getContext('2d');x.fillStyle=k===1?'#b9a983':'#8e8064';x.fillRect(0,0,340,64);x.scale(2,2);drawSig(x,10,20,false,k*777,ART.sig.color==='#e6dcc4'?'#f2ead6':ART.sig.color)});
 if(tool==='style'&&MODE==='paint5'){const[x0,y0,w,hh]=SC.styleRect(C),rc=refCanvas(),el=document.getElementById('st1');el.getContext('2d').drawImage(rc,x0*S,y0*S,w*S,hh*S,0,0,el.width,el.height)}
 updateNotes()}
let REFC=null;function refCanvas(){if(REFC)return REFC;const r=rng(C.sd+999),c2=SC.make(r);Object.assign(c2,{sig:C.sig});const save=C;C=c2;const L=SC.build(c2,null);C=save;
 REFC=mk(IW,IH);const x=REFC.getContext('2d');x.scale(S,S);drawShapes(x,L,rng(5));return REFC}
const MEMCHK=[['shift','Przesunięty element'],['scale','Zmieniony rozmiar elementu'],['tint','Zmieniony odcień'],['remove','Brakujący element'],['extra','Dodatkowy element'],['sig','Zmieniona sygnatura']];
function checkItems(){if(MODE==='memory')return MEMCHK;const a=TLIST.map(t=>[t.id,t.name]);if(MODE==='paint5')a.push(['mark',EXTRA.mark]);return a}
function checkTruth(p,id){return MODE==='memory'?!!(p.muts&&p.muts.some(m=>m.type===id)):!!p.t[id]}
function updateCheck(){const el=document.getElementById('check');
 if(!sel||(MODE==='memory'&&MEM.phase===1)){el.innerHTML='';return}const p=sel;p.check=p.check||{};const items=checkItems(),n=items.filter(([id])=>p.check[id]).length;
 el.innerHTML=`<h3>Checklista fałszerstwa – ${MODE==='frag'?'fragment':(p.kind?p.kind.noun.toLowerCase()+' ':MODE==='sculpt'?'rzeźba ':'obraz ')+p.letter}</h3><div class="cap">Zaznacz wszystko, co wskazuje, że ${MODE==='frag'?'fragment nie pochodzi z oryginału':'obiekt jest fałszywy'}.</div>`+
  items.map(([id,name])=>`<label class="${p.check[id]?'on':''}"><input type="checkbox" data-c="${id}" ${p.check[id]?'checked':''}>${name}</label>`).join('')+`<div class="cnt">Zaznaczone sygnały fałszerstwa: ${n}</div>`;
 el.querySelectorAll('input').forEach(i=>i.onchange=()=>{p.check[i.dataset.c]=i.checked;updateCheck();if(MODE!=='sculpt')render()})}
function checkReport(){const items=checkItems(),nm=Object.fromEntries(items);let h='<h3 style="font:600 15px Georgia,serif;color:var(--acc);margin:14px 0 4px">Twoja checklista</h3>';
 h+=P.map(p=>{const c=p.check||{},hit=items.filter(([id])=>c[id]&&checkTruth(p,id)),miss=items.filter(([id])=>!c[id]&&checkTruth(p,id)),fa=items.filter(([id])=>c[id]&&!checkTruth(p,id));
  const who=MODE==='frag'?'Fragment':(p.kind?p.kind.noun+' ':MODE==='sculpt'?'Rzeźba ':'Obraz ')+p.letter;
  if(!hit.length&&!miss.length&&!fa.length)return`<div class="cp"><b>${who}</b> – brak sygnałów fałszerstwa i nic nie zaznaczono ✓</div>`;
  return`<div class="cp"><b>${who}</b> – trafne: <span class="v">${hit.length}</span>, pominięte: <span class="x">${miss.length}</span>, fałszywe alarmy: <span class="x">${fa.length}</span>`+
   (hit.length?`<br><small>✓ trafne: ${hit.map(i=>i[1]).join(', ')}</small>`:'')+(miss.length?`<br><small>○ pominięte: ${miss.map(i=>i[1]).join(', ')}</small>`:'')+(fa.length?`<br><small>✕ fałszywe alarmy: ${fa.map(i=>i[1]).join(', ')}</small>`:'')+'</div>'}).join('');
 return h}
function updateNotes(){updateCheck();const n=document.getElementById('notes');
 if(!sel){n.innerHTML='<h3>Notatnik</h3><div class="cap">Wybierz obiekt, aby zobaczyć notatki.</div>';return}
 const p=sel,names=Object.assign({},EXTRA,...TLIST.map(t=>({[t.id]:t.name})));const keys=Object.keys(p.notes);const used=TLIST.filter(t=>p.notes[t.id]).length;
 n.innerHTML=`<h3>Notatnik – ${MODE==='frag'?'fragment':'obiekt '+p.letter} (zbadano ${used}/${TLIST.length})</h3><ul>${keys.map(k=>{const v=p.notes[k];return(Array.isArray(v)?v:[v]).map(s=>`<li><span>${names[k]||k}:</span> ${s}</li>`).join('')}).join('')||'<li>Brak notatek.</li>'}</ul>`}
function buildTools(){const el=document.getElementById('tools');
 if(MODE==='memory'){el.innerHTML=memToolsHTML();document.getElementById('memtime').onchange=e=>{MEM.time=+e.target.value;newGame()};document.getElementById('memready').onclick=()=>memPhase2(rng((Math.random()*1e9)|0));memUI();return}
 el.innerHTML=GROUPS.map(([g,ids])=>`<div class="grp"><h3>${g}</h3>${ids.map(id=>`<button class="tool" data-id="${id}">${TB[id].name}</button>`).join('')}</div>`).join('');
 el.querySelectorAll('.tool').forEach(b=>b.onclick=()=>{tool=tool===b.dataset.id?null:b.dataset.id;onChange()})}
function onChange(){if(tool!==TILT.tool){TILT.tool=tool;TILT.lo=TILT.v<20;TILT.hi=TILT.v>60}document.querySelectorAll('.tool').forEach(b=>{b.classList.toggle('on',b.dataset.id===tool);b.classList.toggle('used',P.some(p=>p.notes[b.dataset.id]))});
 const v=curView();document.getElementById('viewlbl').textContent='Widok: '+(MODE==='sculpt'?{normal:'światło dzienne',uv:'promieniowanie UV',xray:'RTG'}[v]||'światło dzienne':VIEWNAME[v]);
 cv.classList.toggle('probe',!!(tool&&TB[tool].probe));
 document.getElementById('sel').textContent=sel?(MODE==='frag'?'Wybrany: fragment':`Wybrany: obiekt ${sel.letter}`):'Nie wybrano obiektu.';
 document.querySelectorAll('#verdicts button').forEach(b=>b.disabled=!KIND&&!sel);
 if(MODE==='sculpt'){apply3View();mark3Dirty();schedule3Gates()}else{render();scheduleGates()}
 updatePanel()}
const VIEWNAME={trans:'światło przechodzące (pod światło)',normal:'światło dzienne',uv:'promieniowanie UV',back:'odwrocie',crackview:'wzmocniona krakelura',raking:'światło boczne',xray:'RTG',ir:'reflektografia IR'};
