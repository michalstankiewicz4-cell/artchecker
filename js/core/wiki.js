"use strict";
/* =====================================================================
   WIKI – encyklopedia w grze. Techniki, obiekty i metody fałszerskie są
   generowane z danych trybów; słowniczek jest pisany ręcznie (GLOSS).
   ===================================================================== */
const GLOSS=[
 ['Atrament żelazowo-galasowy','Atrament z siarczanu żelaza i garbników (galasówek), używany od średniowiecza do XIX w. Z czasem brązowieje i koroduje papier – na odwrociu powstają obwódki, a nawet dziury.'],
 ['Blejtram','Drewniana rama, na którą naciąga się płótno obrazu. Kliny w narożnikach pozwalają je napinać.'],
 ['Cyzelowanie','Ręczne wykańczanie powierzchni odlewu (np. z brązu) rylcami i puncami – usuwa szwy formy i wydobywa detal.'],
 ['CNC (frezowanie)','Obróbka sterowana komputerowo. Frez zostawia regularne, równoległe ścieżki w stałym odstępie – inaczej niż dłuto czy tarnik.'],
 ['Ductus','Sposób prowadzenia narzędzia piszącego: kolejność i kierunek kresek, nacisk, rytm. Kopista zwykle pisze wolniej, linia drży.'],
 ['Druk wklęsły (intaglio)','Technika, w której farba z rowków płyty tworzy wypukły, wyczuwalny palcem nadruk. Stosowany na banknotach.'],
 ['Farba zmienna optycznie (OVI)','Farba zmieniająca kolor zależnie od kąta patrzenia, np. ze złotego na zielony.'],
 ['Galwanoplastyka','Wykonywanie kopii przez osadzanie metalu elektrolitycznie w formie. Kopie monet składa się często z dwóch połówek.'],
 ['Giclée','Wysokiej jakości wydruk atramentowy, także na płótnie. Pod mikroskopem widać raster kolorowych kropek.'],
 ['Grunt','Warstwa przygotowawcza pod farbą (np. kredowo-klejowa, olejna). Widać ją w ubytkach farby.'],
 ['Impast','Grubo nałożona farba tworząca relief, widoczna w świetle bocznym.'],
 ['Katalog raisonné','Pełny, naukowy spis dzieł artysty z opisami, wymiarami, historią i fotografiami.'],
 ['Krakelura','Siatka spękań warstwy malarskiej powstająca z wiekiem. Naturalna jest nieregularna; sztuczna bywa zbyt równa.'],
 ['Obraz utajony','Element widoczny tylko pod ostrym kątem patrzenia (np. ukryty nominał na banknocie).'],
 ['Papier czerpany','Papier wyrabiany ręcznie na sicie: widać w nim linie żeberkowe, linie sita i znak wodny.'],
 ['Patyna','Warstwa powstała na powierzchni z upływem czasu (korozja metalu, brud w zagłębieniach kamienia). Sztuczna bywa zbyt jednolita.'],
 ['Pentimenti','Ślady zmian wprowadzonych przez artystę w trakcie malowania, widoczne np. w podczerwieni.'],
 ['Proweniencja','Udokumentowana historia własności dzieła: kolejni właściciele, wystawy, aukcje.'],
 ['Przedruk','Dodatkowy nadruk na gotowym znaczku (np. nowa wartość). Często fałszowany, bo podnosi cenę.'],
 ['Recto-verso','Element drukowany częściowo na awersie, a częściowo na rewersie – pod światło musi się idealnie złożyć.'],
 ['Reflektografia IR','Obrazowanie w podczerwieni, która przenika przez farbę i odsłania rysunek przygotowawczy.'],
 ['RTG','Prześwietlenie promieniami rentgenowskimi – pokazuje warstwy z ciężkimi pierwiastkami, konstrukcję i to, co ukryte pod obrazem lub w rzeźbie.'],
 ['Surmoulage','Odlew wykonany z formy zdjętej z gotowej rzeźby. Przez skurcz metalu jest nieco mniejszy, a detal zmiękczony.'],
 ['Werniks','Przezroczysta warstwa ochronna na obrazie. Stary werniks świeci w UV zielonkawo-mlecznie.'],
 ['XRF','Fluorescencyjna analiza rentgenowska – nieinwazyjnie pokazuje skład pierwiastkowy powierzchni.'],
 ['Ząbkowanie','Perforacja znaczka; jej gęstość podaje się jako liczbę ząbków na 2 cm i mierzy specjalną miarką.'],
 ['Znak wodny','Wzór uformowany w papierze podczas produkcji, widoczny pod światło (albo w kąpieli w specjalnym płynie).'],
];
const WSEC=[['how','Na czym polega'],['reveals','Co ujawnia'],['pit','Na co uważać'],['fact','Ciekawostka']];
const WSEC_F=[['how','Jak powstaje'],['reveals','Po czym poznać'],['fact','Ciekawostka']];
const W2D=['paint5','frag','notes','coin','stamp','manuscript'];
const WHOLE=['all','note','coin','sheet'];
const WICON={pigment:'spectrum',xrf:'spectrum',ink:'spectrum',magnet:'magnet',mag:'magnet',weight:'scale',dims:'caliper',diam:'caliper',paper:'caliper',prov:'doc',cert:'doc',docs:'doc',micro:'micro'};
function wSecs(t,secs){if(!t)return'';return(t.lead?`<p class="wlead">${t.lead}</p>`:'')+secs.filter(([k])=>t[k]).map(([k,n])=>`<h3>${n}</h3><p>${t[k]}</p>`).join('')}
const wgo=t=>`<a class="wgo" data-t="${t.replace(/"/g,'&quot;')}">${t}</a>`;
const WEN=()=>LANG==='en'&&typeof WT_EN!=='undefined';
function wikiData(){const A=wikiData0();if(!WEN())return A;
 /* EN: polski tytuł zostaje kluczem (obrazy, linki), reszta po angielsku */
 return A.map(a=>Object.assign(a,{key:a.title,title:tr(a.title),cat:tr(a.cat),tags:a.tags?tr(a.tags):a.tags,body:trHTML(a.body)}))}
/* dopiski o prawdziwych obiektach (tylko tekst, bez wizerunków) */
const NBP_SEC='https://nbp.pl/banknoty-i-monety/zabezpieczenia/',ECB_SEC='https://www.ecb.europa.eu/euro/banknotes/current/html/index.pl.html',ECB_SEC_EN='https://www.ecb.europa.eu/euro/banknotes/current/html/index.en.html';
const WEURO_PL=()=>`<h3>Prawdziwe banknoty: euro</h3><p>W obiegu są dwie serie banknotów euro: pierwsza (od 2002 r., nominały od 5 do 500 euro) i seria „Europa” (5, 10, 20, 50, 100 i 200 euro, wprowadzana w latach 2013–2019; 500 euro nie jest już emitowane). Obie serie są ważne. Nazwa drugiej serii pochodzi od postaci z mitologii greckiej, której portret pojawia się w dwóch zabezpieczeniach.</p><p>Europejski Bank Centralny zaleca sprawdzanie banknotów w trzech krokach – <b>dotykiem, pod światło i pod kątem</b>. Dotykiem: sztywny, szeleszczący papier i wypukły nadruk, w tym rząd krótkich wypukłych kresek przy lewym i prawym brzegu. Pod światło: znak wodny z portretem Europy, nominałem i głównym motywem; w banknotach 20, 50, 100 i 200 euro okienko w hologramie staje się przezroczyste i po obu stronach widać w nim twarz Europy. Pod kątem: „szmaragdowa liczba” – połyskliwy nominał, po którym pionowo przesuwa się światło, a kolor przechodzi ze szmaragdowej zieleni w ciemnoniebieski – oraz hologram z nominałem, głównym motywem i symbolem €.</p><p>Opisy i zdjęcia (z napisem SPECIMEN): <a href="${ECB_SEC}" target="_blank" rel="noopener">EBC – banknoty euro</a>.</p>`;
const WEURO_EN=()=>`<h3>Real banknotes: the euro</h3><p>Two series of euro banknotes are in circulation: the first (since 2002, denominations from 5 to 500 euro) and the “Europa” series (5, 10, 20, 50, 100 and 200 euro, introduced between 2013 and 2019; the 500 euro is no longer issued). Both series are valid. The second series is named after the figure from Greek mythology whose portrait appears in two of its security features.</p><p>The European Central Bank recommends checking banknotes in three steps – <b>feel, look and tilt</b>. Feel: stiff, crisp paper and raised print, including a row of short raised lines along the left and right edges. Look against the light: a portrait watermark showing Europa, the value and the main motif; on the 20, 50, 100 and 200 euro the window in the hologram becomes transparent and shows Europa's face on both sides. Tilt: the “emerald number” – a shiny value numeral with a light that moves up and down while its colour changes from emerald green to deep blue – and a hologram with the value, the main motif and the € symbol.</p><p>Descriptions and images (marked SPECIMEN): <a href="${ECB_SEC_EN}" target="_blank" rel="noopener">ECB – euro banknotes</a>.</p>`;
const WREAL={notes:()=>(WEN()?WEURO_EN():WEURO_PL())+(WEN()?`<h3>Real banknotes: the Polish złoty</h3><p>The currency in this mode is fictional, but its security features are modelled on real ones. The National Bank of Poland (NBP) lists the following on the “Polish Rulers” series of złoty banknotes: a watermark with the ruler's portrait (on the modernised notes also the numeral of the denomination, in an unprinted field), a security thread with the denomination and “ZŁ” visible against the light, a see-through register that forms a crown in an oval on every denomination, optically variable ink that changes colour when tilted, an angle effect, microprinting, gold and iridescent ink, and features visible only in UV and infrared. The modernised 200 zł and 500 zł notes also have a window thread.</p><p>The game deliberately shows no images of real banknotes. Full descriptions with photographs: <a href="${NBP_SEC}" target="_blank" rel="noopener">NBP – banknote security features</a>.</p>`
 :`<h3>Prawdziwe banknoty: złoty</h3><p>Waluta w tym trybie jest fikcyjna, ale jej zabezpieczenia wzorowano na prawdziwych. Narodowy Bank Polski wymienia na banknotach serii „Władcy polscy” m.in.: znak wodny z portretem władcy (na banknotach zmodernizowanych także cyfrowe oznaczenie nominału, w niezadrukowanym polu), nitkę zabezpieczającą z nominałem i skrótem „ZŁ” widoczną pod światło, znak recto-verso tworzący pod światło koronę w owalu (na wszystkich nominałach), farbę zmienną optycznie zmieniającą kolor przy przechylaniu, efekt kątowy, mikrodruk, złotą i opalizującą farbę oraz zabezpieczenia widoczne tylko w UV i podczerwieni. Zmodernizowane 200 zł i 500 zł mają też nitkę okienkową.</p><p>Gra celowo nie pokazuje wizerunków prawdziwych banknotów. Pełne opisy ze zdjęciami: <a href="${NBP_SEC}" target="_blank" rel="noopener">NBP – zabezpieczenia banknotów</a>.</p>`)};
function wikiData0(){const A=[];
 const modes=[['paint5','Obrazy – przeprowadź ekspertyzę',SET.paint5,DEF,PROFILES],['frag','Zniszczony fragment',SET.frag,DEF,null]];
 Object.values(SCULPT_VARIANTS).forEach(v=>modes.push([v.id,v.label,v.sets,v.defs,v.profiles]));
 Object.values(KINDS).forEach(k=>modes.push([k.id,k.label,k.wikiSets||k.sets,k.defs,k.wikiProfiles||k.profiles]));
 const tech={},forg={},byMode={};
 for(const[id,label,sets,defs,profs]of modes){byMode[id]={label,tech:[],forg:[]};
  for(const[g,ids]of sets)for(const t of ids){const d=defs[t],F=id==='frag';const nm=F&&d.nameF||d.name;
   (tech[nm]=tech[nm]||[]).push({id,label,tool:t,hint:F&&d.hintF||d.hint,view:(F&&d.viewF)||d.view||'',area:((F&&d.gateF)||d.gate||{}).area||''});byMode[id].tech.push(nm)}
  if(profs)for(const[key,p]of Object.entries(profs)){const nm=t=>defs[t]?defs[t].name:t;
   (forg[p.name]=forg[p.name]||[]).push({id,label,key,core:p.core,coreN:p.core.map(nm),optN:p.opt.map(nm),defs});byMode[id].forg.push(p.name)}}
 for(const[nm,L]of Object.entries(tech)){
  const pick=L.find(e=>W2D.includes(e.id)&&e.id!=='frag'&&e.view&&e.view!=='normal')||L.find(e=>W2D.includes(e.id)&&e.id!=='frag'&&e.area&&!WHOLE.includes(e.area))||L.find(e=>W2D.includes(e.id)&&e.view&&e.view!=='normal');
  let img=pick?{type:'view',mode:pick.id,tool:pick.tool,view:pick.view||'normal',area:pick.area}:WICON[L[0].tool]?{type:'icon',icon:WICON[L[0].tool]}:L.find(e=>SCULPT_VARIANTS[e.id])?{type:'bust',marble:L.every(e=>e.id==='marble')}:{type:'icon',icon:'doc'};
  A.push({cat:'Techniki badawcze',title:nm,tags:L.map(e=>e.label).join(' · '),img,
   body:wSecs((WEN()&&WT_EN[nm])||WT[nm],WSEC)+`<h3>W grze</h3>`+L.map(e=>`<p class="wmode"><b>${e.label}.</b> ${e.hint}</p>`).join('')})}
 for(const[nm,L]of Object.entries(forg)){const e=L[0];
  const tl=e.core.find(t=>{const d=e.defs[t];return d&&d.view&&d.view!=='normal'})||e.core.find(t=>{const d=e.defs[t];return d&&d.gate&&d.gate.area&&!WHOLE.includes(d.gate.area)});
  const img=W2D.includes(e.id)&&e.id!=='frag'?{type:'forge',mode:e.id,key:e.key,tool:tl||null}:SCULPT_VARIANTS[e.id]?{type:'bust',marble:e.id==='marble'}:{type:'icon',icon:'doc'};
  A.push({cat:'Metody fałszerskie',title:nm,tags:L.map(x=>x.label).join(' · '),img,
   body:wSecs((WEN()&&WT_EN[nm])||WT[nm],WSEC_F)+L.map(x=>`<h3>W grze – ${x.label}</h3><p><b>Zawsze zdradzają:</b> ${x.coreN.map(wgo).join(', ')}</p>${x.optN.length?`<p><b>Mogą zdradzać:</b> ${x.optN.map(wgo).join(', ')}</p>`:''}`).join('')})}
 const SCN={pejzaz:'pejzaż',portret:'portret',martwa:'martwa natura',marina:'marina'};

 const objs=[['paint5','Obrazy – przeprowadź ekspertyzę','Obraz olejny to warstwowa konstrukcja: płótno na blejtramie, grunt, rysunek, kolejne warstwy farby i werniks. Każda warstwa ma swoją chemię i swój wiek – dlatego obraz bada się od odwrocia po mikroskopijną strukturę powierzchni. Na stole leży oryginał i kopie wykonane różnymi metodami.'],
  ['frag','Zniszczony fragment','Oryginał zaginął – zostały po nim opis w katalogu i wyniki dawnych badań. Zadanie polega na sprawdzeniu, czy ocalały fragment zgadza się ze wszystkimi punktami tej dokumentacji.'],
  ['memory','Pamięć eksperta','Trening spostrzegawczości: najpierw ogląda się oryginał przez lupę, potem wskazuje go wśród prawie identycznych falsyfikatów różniących się drobnymi szczegółami.']];
 objs.forEach(([id,t,txt])=>A.push({cat:'Obiekty i artyści',title:t,tags:'obrazy',img:{type:'preview',id},
  body:`<p class="wlead">${txt}</p>`+(byMode[id]?`<h3>Badania w tym trybie</h3><p>${[...new Set(byMode[id].tech)].map(wgo).join(', ')}</p>`+(byMode[id].forg.length?`<h3>Metody fałszerskie</h3><p>${byMode[id].forg.map(wgo).join(', ')}</p>`:''):'')}));
 [...Object.values(SCULPT_VARIANTS),...Object.values(KINDS)].forEach(k=>{const t=k.label.replace('Przeprowadź ekspertyzę – ','').replace('Weryfikacja ','');
  A.push({cat:'Obiekty i artyści',title:t,tags:SCULPT_VARIANTS[k.id]?'rzeźby':'obiekty',img:SCULPT_VARIANTS[k.id]?{type:'bust',marble:k.id==='marble'}:{type:'preview',id:k.id},
   body:(((WEN()&&WOBJ_EN[t])||WOBJ[t])?`<p class="wlead">${(WEN()&&WOBJ_EN[t])||WOBJ[t]}</p>`:'')+`<h3>Zlecenie</h3><p>${k.caseText()}</p>${k.intro?`<p>${k.intro}</p>`:''}<h3>Badania</h3><p>${[...new Set(byMode[k.id].tech)].map(wgo).join(', ')}</p><h3>Metody fałszerskie</h3><p>${byMode[k.id].forg.map(wgo).join(', ')}</p>`+(WREAL[k.id]?WREAL[k.id]():'')})});
 const GIMG={'Krakelura':['paint5','crack'],'Werniks':['paint5','uv'],'Pentimenti':['paint5','ir'],'Reflektografia IR':['paint5','ir'],'RTG':['paint5','xray'],'Impast':['paint5','texture'],'Blejtram':['paint5','back'],
  'Znak wodny':['notes','watermark'],'Druk wklęsły (intaglio)':['notes','intaglio'],'Farba zmienna optycznie (OVI)':['notes','ovi'],'Obraz utajony':['notes','latent'],'Recto-verso':['notes','register'],
  'Ząbkowanie':['stamp','perf'],'Ductus':['manuscript','ductus'],'Atrament żelazowo-galasowy':['manuscript','verso'],'Papier czerpany':['manuscript','paper'],'Galwanoplastyka':['coin','edge']};
 const BUST={'Patyna':false,'Cyzelowanie':false,'Surmoulage':false,'CNC (frezowanie)':true},GICON={'XRF':'spectrum','Katalog raisonné':'doc','Proweniencja':'doc','Giclée':'micro'};
 GLOSS.forEach(([t,b])=>{let img=null;const g=GIMG[t];
  if(g){const d=(KINDS[g[0]]||{defs:DEF}).defs[g[1]];if(d)img={type:'view',mode:g[0],tool:g[1],view:d.view||'normal',area:(d.gate||{}).area||''}}
  else if(t in BUST)img={type:'bust',marble:BUST[t]};else if(GICON[t])img={type:'icon',icon:GICON[t]};else if(t==='Grunt')img={type:'preview',id:'frag'};
  const rel=Object.keys(tech).filter(n=>n!==t&&n.toLowerCase().includes(t.toLowerCase().split(' ')[0]));
  A.push({cat:'Słowniczek',title:t,img,body:`<p class="wlead">${(WEN()&&GLOSS_EN[t])||b}</p>${WGLOSS[t]?`<p>${(WEN()&&WGLOSS_EN[t])||WGLOSS[t]}</p>`:''}${rel.length?`<h3>Zobacz też</h3><p>${rel.map(wgo).join(', ')}</p>`:''}`})});
 if(typeof WART!=='undefined')WART.forEach(([k,t,spec,txt])=>{if(WEN()&&WART_EN[t]){EN[t]=WART_EN[t][0];txt=WART_EN[t][1]}A.push({cat:'Techniki malarskie i podłoża',title:t,tags:k==='tech'?'technika':k==='sur'?'podłoże':'oprawa',img:{type:'artkit',spec},body:wSecs(txt,WSEC)+'<p><small class="nb">Ilustracja: ArtKit z laboratorium sztuki GameLaboratory.</small></p>'})});
 if(typeof REAL!=='undefined')REAL.filter(e=>REAL_READY.includes(e.slug)).forEach(e=>{const M={paint5:'Obrazy – przeprowadź ekspertyzę',drawing:'Rysunki i grafiki',water:'Akwarele i pastele',frag:'Zniszczony fragment'}[e.mode]||'Obrazy – przeprowadź ekspertyzę';
  A.push({cat:'Dzieła prawdziwe',title:`${e.artist} – „${e.title}”`,tags:e.year,img:{type:'real',slug:e.slug,cap:`${e.artist}, „${e.title}”, ${e.year}. Źródło: Wikimedia Commons (${e.license}).`},
   body:`<p class="wlead">${e.desc}</p><h3>Dzieło</h3><p>${e.artist} (${e.life}), „${e.title}”, ${e.year} – ${e.tech}${e.wcm?`, ok. ${fmt(e.hcm)} × ${fmt(e.wcm)} cm`:''}. ${e.museum}.</p><h3>Licencja i źródło</h3><p>${e.license[0].toUpperCase()+e.license.slice(1)}. Reprodukcja: <a href="${realSrc(e)}" target="_blank" rel="noopener">Wikimedia Commons – ${e.file}</a>.</p><h3>W grze</h3><p>Dzieło można wybrać na liście „Artysta” w trybie ${wgo(M)}. ${e.mode==='frag'?'Obraz nie istnieje, więc gra symuluje fragment, który mógłby z niego pochodzić, i podróbki takiego fragmentu.':'Reprodukcja jest oryginałem, a kopie na stole robi gra.'}</p><p><small class="nb">${REAL_NOTE}</small></p>`})});
 return A}

/* ---------- ilustracje (generowane z silnika gry, w piaskownicy) ---------- */
const WIMG={},WBATCH={};
const WREAL_MODE={paint5:'stanczyk',frag:'kamieniarze',memory:'stanczyk',drawing:'melencolia',water:'zajac'};
function wBatch(mode,seed,artist){const k=mode+'|'+seed+'|'+(artist||'');if(WBATCH[k])return WBATCH[k];
 const sel0=document.getElementById('artist'),a0=sel0.value;if(artist!=null)sel0.value=artist;
 const rc0=REAL_CUR,rs=artist&&String(artist).startsWith('real:')?String(artist).slice(5):WREAL_MODE[mode];if(rs&&REALIM[rs])REAL_CUR=REAL_BY[rs];
 try{return WBATCH[k]=withSandbox(()=>{const r=rng(seed);MODE=mode;KIND=KINDS[mode]||null;SV=null;sel=null;tool=null;if(KIND&&KIND.wikiSetup)KIND.wikiSetup(artist);
  if(KIND)KIND.newGame(r);else if(mode==='frag')newFrag(r);else newPaint5(r);
  return{MODE,KIND,ART,SC,C,W,H,IW,IH,P,BW,BH}})}finally{sel0.value=a0;REAL_CUR=rc0}}
function wWith(b,fn){return withSandbox(()=>{({MODE,KIND,ART,SC,C,W,H,IW,IH,P,BW,BH}=b);SV=null;sel=null;tool=null;return fn(P)})}
function wAreaRect(p,area){if(!area||WHOLE.includes(area))return null;let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;const N=56;
 for(let j=0;j<=N;j++)for(let i=0;i<=N;i++){const lx=W*i/N,ly=H*j/N;let ok=false;try{ok=areaOK(p,area,{cx:p.x+lx,cy:p.y+ly,x0:p.x,y0:p.y,x1:p.x+W,y1:p.y+H})}catch(e){}
  if(ok){x0=Math.min(x0,lx);y0=Math.min(y0,ly);x1=Math.max(x1,lx);y1=Math.max(y1,ly)}}
 if(x1<x0||(x1-x0)*(y1-y0)>W*H*0.6)return null;const m=Math.max(W,H)*0.06,cw=Math.max(x1-x0+2*m,W*0.22),ch=Math.max(y1-y0+2*m,H*0.22),cx=(x0+x1)/2,cy=(y0+y1)/2;
 const w=Math.min(W,cw),h=Math.min(H,ch);return[Math.max(0,Math.min(W-w,cx-w/2)),Math.max(0,Math.min(H-h,cy-h/2)),w,h]}
function wShot(p,v,rect){const src=getView(p,v),[x,y,w,h]=rect||[0,0,W,H],sc=Math.min(1,560/(w*S),340/(h*S)),c=mk(Math.round(w*S*sc),Math.round(h*S*sc));
 c.getContext('2d').drawImage(src,x*S,y*S,w*S,h*S,0,0,c.width,c.height);return c}
function wPanels(list){const H0=300,pad=14,lab=26,ws=list.map(o=>Math.round(o.c.width*H0/o.c.height)),tw=ws.reduce((a,b)=>a+b,0)+pad*(list.length+1);
 const out=mk(tw,H0+lab+pad*2),x=out.getContext('2d');x.fillStyle='#17191D';x.fillRect(0,0,out.width,out.height);let X=pad;
 list.forEach((o,i)=>{x.drawImage(o.c,X,pad,ws[i],H0);x.strokeStyle=o.col||'rgba(130,155,180,.6)';x.lineWidth=2;x.strokeRect(X+1,pad+1,ws[i]-2,H0-2);
  x.fillStyle=o.col||'#E8E3D9';x.font='600 15px Inter,"Segoe UI",system-ui';x.textAlign='center';x.fillText(o.label,X+ws[i]/2,pad+H0+20,ws[i]);X+=ws[i]+pad});return out}
function wFind(mode,test){const V=(KINDS[mode]&&KINDS[mode].wikiVariants)||[null];for(const v of V)for(let k=0;k<14;k++){const b=wBatch(mode,9100+k*37,v);const p=b.P.find(test);if(p)return{b,p}}return null}
function wIcon(kind){const c=mk(600,320),x=c.getContext('2d');x.fillStyle='#17191D';x.fillRect(0,0,600,320);x.strokeStyle='#C99539';x.fillStyle='#C99539';x.lineWidth=5;x.lineCap='round';x.lineJoin='round';x.shadowColor='rgba(245,198,107,.6)';x.shadowBlur=14;
 if(kind==='spectrum'){x.lineWidth=2;x.globalAlpha=.35;for(let i=0;i<=10;i++){x.beginPath();x.moveTo(60+i*48,40);x.lineTo(60+i*48,270);x.stroke()}x.globalAlpha=1;x.lineWidth=4;x.beginPath();x.moveTo(60,270);x.lineTo(540,270);x.moveTo(60,270);x.lineTo(60,40);x.stroke();
  const pk=[[140,170,'Fe'],[230,90,'Pb'],[300,200,'Cu'],[400,130,'Zn'],[470,220,'Sn']];x.lineWidth=3;x.beginPath();x.moveTo(60,262);for(let X=60;X<=540;X+=3){let y=262-Math.random()*6;for(const[px,ph]of pk)y-=ph*Math.exp(-((X-px)**2)/60);x.lineTo(X,y)}x.stroke();
  x.shadowBlur=0;x.font='600 18px "Segoe UI"';x.textAlign='center';pk.forEach(([px,ph,n])=>x.fillText(n,px,262-ph-12))}
 else if(kind==='magnet'){x.lineWidth=34;x.strokeStyle='#e0566a';x.beginPath();x.arc(300,150,80,Math.PI,0);x.stroke();x.beginPath();x.moveTo(220,150);x.lineTo(220,220);x.moveTo(380,150);x.lineTo(380,220);x.stroke();x.strokeStyle='#cfe3f8';x.beginPath();x.moveTo(220,220);x.lineTo(220,250);x.moveTo(380,220);x.lineTo(380,250);x.stroke();
  x.lineWidth=3;x.strokeStyle='#C99539';for(let i=1;i<=3;i++){x.beginPath();x.arc(300,262,30+i*22,Math.PI*1.1,Math.PI*1.9,true);x.stroke()}}
 else if(kind==='scale'){x.beginPath();x.moveTo(300,60);x.lineTo(300,250);x.moveTo(220,250);x.lineTo(380,250);x.moveTo(140,100);x.lineTo(460,100);x.stroke();[[140,100],[460,100]].forEach(([X,Y])=>{x.beginPath();x.moveTo(X,Y);x.lineTo(X-50,Y+90);x.moveTo(X,Y);x.lineTo(X+50,Y+90);x.stroke();x.beginPath();x.ellipse(X,Y+95,60,14,0,0,Math.PI);x.stroke()});x.beginPath();x.arc(300,55,10,0,7);x.fill()}
 else if(kind==='caliper'){x.strokeRect(70,120,460,40);for(let i=0;i<=40;i++){x.lineWidth=i%5?2:3;x.beginPath();x.moveTo(80+i*11,120);x.lineTo(80+i*11,i%5?132:140);x.stroke()}x.lineWidth=5;x.beginPath();x.moveTo(90,120);x.lineTo(90,40);x.lineTo(120,40);x.lineTo(120,120);x.moveTo(300,160);x.lineTo(300,250);x.lineTo(330,250);x.lineTo(330,160);x.stroke();x.strokeRect(270,110,110,60)}
 else if(kind==='doc'){x.strokeRect(190,40,220,250);x.lineWidth=3;for(let i=0;i<7;i++){x.beginPath();x.moveTo(215,85+i*24);x.lineTo(i===6?320:385,85+i*24);x.stroke()}x.beginPath();x.arc(360,250,26,0,7);x.stroke();x.beginPath();x.moveTo(345,272);x.lineTo(338,300);x.moveTo(375,272);x.lineTo(382,300);x.stroke()}
 else if(kind==='micro'){x.beginPath();x.moveTo(200,280);x.lineTo(420,280);x.moveTo(330,280);x.lineTo(330,240);x.moveTo(330,240);x.quadraticCurveTo(400,200,360,120);x.stroke();x.lineWidth=26;x.beginPath();x.moveTo(300,60);x.lineTo(270,190);x.stroke();x.lineWidth=5;x.beginPath();x.moveTo(230,215);x.lineTo(330,215);x.stroke();
  x.shadowBlur=0;for(let i=0;i<60;i++){x.fillStyle=['#00b7ff','#ff2fa0','#ffe500'][i%3];x.beginPath();x.arc(450+(i%8)*14,70+(i/8|0)*14,4+Math.random()*2,0,7);x.fill()}}
 return c}
function wikiIllus(img){const key=JSON.stringify(img);if(WIMG[key])return WIMG[key];let out=null,cap='';
 if(img.type==='view'){const T=(KINDS[img.mode]||{defs:DEF}).defs[img.tool];
  const f=wFind(img.mode,p=>!p.orig&&p.t&&p.t[img.tool]),o=f?f.b.P.find(p=>p.orig):wBatch(img.mode,9100).P.find(p=>p.orig)||wBatch(img.mode,9100).P[0];
  const b=f?f.b:wBatch(img.mode,9100);
  out=wWith(b,()=>{const rect=wAreaRect(o,img.area),L=[{c:wShot(o,img.view,rect),label:tr(img.mode==='frag'?'Fragment':'Oryginał'),col:'#65DB87'}];
   if(f)L.push({c:wShot(f.p,img.view,rect),label:tr('Falsyfikat:')+' '+tr(((b.KIND?b.KIND.profiles:PROFILES)[f.p.profile]||{name:''}).name),col:'#e0636e'});return wPanels(L)});
  cap=`Widok z gry: ${T?T.name:''}${img.view!=='normal'?' – '+(VIEWNAME[img.view]||img.view):''}.`}
 else if(img.type==='forge'){const f=wFind(img.mode,p=>p.profile===img.key);
  if(f){const defs=f.b.KIND?f.b.KIND.defs:DEF,d=img.tool&&defs[img.tool],v=d?d.view||'normal':'normal';
   out=wWith(f.b,()=>{const o=f.b.P.find(p=>p.orig),rect=d?wAreaRect(o,(d.gate||{}).area):null;return wPanels([{c:wShot(o,v,rect),label:tr('Oryginał'),col:'#65DB87'},{c:wShot(f.p,v,rect),label:tr('Ta metoda'),col:'#e0636e'}])});
   cap=d?`Porównanie w grze: ${d.name}${v!=='normal'?' – '+(VIEWNAME[v]||v):''}.`:'Oryginał i falsyfikat w świetle dziennym.'}}
 else if(img.type==='preview'){out=preview(img.id);cap='Podgląd z gry.'}
 else if(img.type==='bust'){out=(typeof bustIllus3D==='function'&&bustIllus3D(!!img.marble))||bustIllus(!!img.marble);cap=img.marble?'Rzeźba z marmuru – w grze badana w 3D.':'Rzeźba z brązu – w grze badana w 3D.'}
 else if(img.type==='artkit'&&window.ArtKit){const sp=Object.assign({size:720,aspect:1.25,seed:11,relief:0.7,varnish:0.15},img.spec),full=ArtKit.render(sp).canvas;
  const det=ArtKit.render(Object.assign({},sp,{format:'none'})).canvas,d=mk(320,256);d.getContext('2d').drawImage(det,det.width*0.42,det.height*0.38,det.width*0.22,det.height*0.22,0,0,320,256);
  const rk=ArtKit.render(Object.assign({},sp,{format:'none',view:'raking'})).canvas,rc=mk(320,256);rc.getContext('2d').drawImage(rk,rk.width*0.42,rk.height*0.38,rk.width*0.22,rk.height*0.22,0,0,320,256);
  out=wPanels([{c:full,label:tr('Cały obraz')},{c:d,label:tr('Szczegół ×4')},{c:rc,label:tr('Światło boczne ×4')}]);cap='Wygenerowane przez ArtKit (laboratorium sztuki GameLaboratory).'}
 else if(img.type==='icon'){out=wIcon(img.icon);cap='Schemat.'}
 return WIMG[key]={c:out,cap}}

const wslug=t=>t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ł/g,'l').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,70);
let WCUR=null,WIKI=null,WCAT=tr('Słowniczek'),WSEL=0,WTOK=0;
function showWiki(cat){WIKI=WIKI||wikiData();if(cat)WCAT=cat;document.getElementById('wiki').classList.remove('hidden');renderWiki()}
function wikiOpen(title){const a=WIKI.find(x=>x.title===title||x.key===title);if(!a)return;WCAT=a.cat;document.getElementById('wq').value='';WSEL=WIKI.filter(x=>x.cat===WCAT).indexOf(a);renderWiki()}
function renderWiki(){const q=(document.getElementById('wq').value||'').toLowerCase(),cats=[...new Set(WIKI.map(a=>a.cat))];
 const list=WIKI.filter(a=>(q?(a.title+a.body+(a.tags||'')).toLowerCase().includes(q):a.cat===WCAT));
 document.getElementById('wcats').innerHTML=cats.map(c=>`<button class="hbtn ghost${c===WCAT&&!q?' on':''}" data-c="${c}">${c} <small>(${WIKI.filter(a=>a.cat===c).length})</small></button>`).join('');
 document.querySelectorAll('#wcats button').forEach(b=>b.onclick=()=>{WCAT=b.dataset.c;WSEL=0;document.getElementById('wq').value='';renderWiki()});
 if(WSEL>=list.length)WSEL=0;
 document.getElementById('wlist').innerHTML=list.map((a,i)=>`<div class="wli${i===WSEL?' on':''}" data-i="${i}">${a.title}${a.tags?`<small>${a.tags}</small>`:''}</div>`).join('')||`<div class="sub">${tr('Brak wyników.')}</div>`;
 document.querySelectorAll('.wli').forEach(el=>el.onclick=()=>{WSEL=+el.dataset.i;renderWiki()});
 const on=document.querySelector('.wli.on');if(on)on.scrollIntoView({block:'nearest'});
 const a=list[WSEL],wa=document.getElementById('wart');WCUR=a;wa.scrollTop=0;
 wa.innerHTML=a?`<div class="sub">${a.cat}${a.tags?' · '+a.tags:''}</div><h2>${a.title}</h2>${a.img&&a.img.type==='real'?`<figure class="wfig"><img src="img/real/${a.img.slug}.jpg" alt="${a.title}" loading="lazy"><figcaption>${a.img.cap}</figcaption></figure>`:a.img?(typeof WIMGS!=='undefined'&&WIMGS[wslug(a.key||a.title)]?(m=>`<figure class="wfig"><img src="img/wiki/${LANG==='en'?'en/':''}${wslug(a.key||a.title)}.jpg" width="${m.w}" height="${m.h}" alt="${a.title}" loading="lazy"><figcaption>${m.cap}</figcaption></figure>`)(WIMGS[wslug(a.key||a.title)]):'<figure class="wfig" id="wfig"><div class="wload"><i></i>Generowanie ilustracji…</div></figure>'):''}${a.body}`:'';
 wa.querySelectorAll('.wgo').forEach(l=>l.onclick=()=>wikiOpen(l.dataset.t));
 if(a&&a.img&&document.getElementById('wfig')){const tok=++WTOK;setTimeout(()=>{if(tok!==WTOK)return;let r=null;try{r=wikiIllus(a.img)}catch(e){console.warn(e)}const fg=document.getElementById('wfig');if(!fg||tok!==WTOK)return;
  if(!r||!r.c){fg.remove();return}const im=document.createElement('img');im.src=r.c.toDataURL('image/jpeg',.9);im.alt=a.title;fg.innerHTML='';fg.appendChild(im);const fc=document.createElement('figcaption');fc.textContent=r.cap;fg.appendChild(fc)},30)}}
