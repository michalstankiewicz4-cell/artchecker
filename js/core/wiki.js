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
function wikiData(){const A=[],add=(cat,title,body,tags)=>A.push({cat,title,body,tags:tags||''});
 const modes=[['paint5','Obrazy – znajdź oryginał',SET.paint5,DEF,PROFILES],['frag','Zniszczony fragment',SET.frag,DEF,null]];
 Object.values(SCULPT_VARIANTS).forEach(v=>modes.push([v.id,v.label,v.sets,v.defs,v.profiles]));
 Object.values(KINDS).forEach(k=>modes.push([k.id,k.label,k.sets,k.defs,k.profiles]));
 for(const[id,label,sets,defs,profs]of modes){
  for(const[g,ids]of sets)for(const t of ids){const d=defs[t];const nm=id==='frag'&&d.nameF||d.name,hint=id==='frag'&&d.hintF||d.hint;add('Techniki badawcze',nm,`<p>${hint}</p>`,label)}
  if(profs)for(const p of Object.values(profs)){const nm=t=>{const d=defs[t];return d?d.name:t};add('Metody fałszerskie',p.name,`<p><b>Tryb:</b> ${label}</p><p><b>Zawsze zdradzają:</b> ${p.core.map(nm).join(', ')}</p>${p.opt.length?`<p><b>Mogą zdradzać:</b> ${p.opt.map(nm).join(', ')}</p>`:''}`,label)}}
 ARTISTS.forEach(a=>add('Obiekty i artyści',`${a.name} (${a.life})`,`<p>„${a.title}”, ${a.year}, olej na płótnie, ${fmt(a.wcm)} × ${fmt(a.hcm)} cm. Sygnatura: „${a.sig.text}”.</p><p>Postać fikcyjna.</p>`,'obrazy'));
 Object.values(SCULPT_VARIANTS).forEach(v=>add('Obiekty i artyści',v.label.replace('Znajdź oryginał – ',''),`<p>${v.caseText()}</p>`,'rzeźby'));
 Object.values(KINDS).forEach(k=>add('Obiekty i artyści',k.label.replace('Weryfikacja ',''),`<p>${k.caseText()}</p><p>${k.intro}</p>`,'obiekty'));
 GLOSS.forEach(([t,b])=>add('Słowniczek',t,`<p>${b}</p>`));
 const seen=new Set();return A.filter(a=>{const k=a.cat+'|'+a.title+'|'+a.tags;if(seen.has(k))return false;seen.add(k);return true})}
let WIKI=null,WCAT='Słowniczek',WSEL=0;
function showWiki(cat){WIKI=WIKI||wikiData();if(cat)WCAT=cat;document.getElementById('wiki').classList.remove('hidden');renderWiki()}
function renderWiki(){const q=(document.getElementById('wq').value||'').toLowerCase(),cats=[...new Set(WIKI.map(a=>a.cat))];
 const list=WIKI.filter(a=>(q?(a.title+a.body+a.tags).toLowerCase().includes(q):a.cat===WCAT));
 document.getElementById('wcats').innerHTML=cats.map(c=>`<button class="hbtn ghost${c===WCAT&&!q?' on':''}" data-c="${c}">${c} <small>(${WIKI.filter(a=>a.cat===c).length})</small></button>`).join('');
 document.querySelectorAll('#wcats button').forEach(b=>b.onclick=()=>{WCAT=b.dataset.c;WSEL=0;document.getElementById('wq').value='';renderWiki()});
 if(WSEL>=list.length)WSEL=0;
 document.getElementById('wlist').innerHTML=list.map((a,i)=>`<div class="wli${i===WSEL?' on':''}" data-i="${i}">${a.title}${a.tags?`<small>${a.tags}</small>`:''}</div>`).join('')||'<div class="sub">Brak wyników.</div>';
 document.querySelectorAll('.wli').forEach(el=>el.onclick=()=>{WSEL=+el.dataset.i;renderWiki()});
 const a=list[WSEL];document.getElementById('wart').innerHTML=a?`<div class="sub">${a.cat}${a.tags?' · '+a.tags:''}</div><h2>${a.title}</h2>${a.body}`:''}
