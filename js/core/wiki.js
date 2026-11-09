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
function wikiData(){const A=[];
 const modes=[['paint5','Obrazy – znajdź oryginał',SET.paint5,DEF,PROFILES],['frag','Zniszczony fragment',SET.frag,DEF,null]];
 Object.values(SCULPT_VARIANTS).forEach(v=>modes.push([v.id,v.label,v.sets,v.defs,v.profiles]));
 Object.values(KINDS).forEach(k=>modes.push([k.id,k.label,k.sets,k.defs,k.profiles]));
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
   body:wSecs(WT[nm],WSEC)+`<h3>W grze</h3>`+L.map(e=>`<p class="wmode"><b>${e.label}.</b> ${e.hint}</p>`).join('')})}
 for(const[nm,L]of Object.entries(forg)){const e=L[0];
  const tl=e.core.find(t=>{const d=e.defs[t];return d&&d.view&&d.view!=='normal'})||e.core.find(t=>{const d=e.defs[t];return d&&d.gate&&d.gate.area&&!WHOLE.includes(d.gate.area)});
  const img=W2D.includes(e.id)&&e.id!=='frag'?{type:'forge',mode:e.id,key:e.key,tool:tl||null}:SCULPT_VARIANTS[e.id]?{type:'bust',marble:e.id==='marble'}:{type:'icon',icon:'doc'};
  A.push({cat:'Metody fałszerskie',title:nm,tags:L.map(x=>x.label).join(' · '),img,
   body:wSecs(WT[nm],WSEC_F)+L.map(x=>`<h3>W grze – ${x.label}</h3><p><b>Zawsze zdradzają:</b> ${x.coreN.map(wgo).join(', ')}</p>${x.optN.length?`<p><b>Mogą zdradzać:</b> ${x.optN.map(wgo).join(', ')}</p>`:''}`).join('')})}
 const SCN={pejzaz:'pejzaż',portret:'portret',martwa:'martwa natura',marina:'marina'};
 ARTISTS.forEach(a=>A.push({cat:'Obiekty i artyści',title:`${a.name} (${a.life})`,tags:'obrazy',img:{type:'artist',id:a.id},
  body:`<p class="wlead">„${a.title}”, ${a.year} – olej na płótnie, ${fmt(a.wcm)} × ${fmt(a.hcm)} cm.</p><h3>Dzieło</h3><p>${a.ref?`Dzieło referencyjne: ${a.ref}. `:''}${a.scene&&SCN[a.scene]?`Gatunek: ${SCN[a.scene]}. `:''}Sygnatura: „${a.sig.text}”.</p><h3>W grze</h3><p>Obraz tego artysty może pojawić się w trybach ${wgo('Obrazy – znajdź oryginał')}, ${wgo('Zniszczony fragment')} i ${wgo('Pamięć eksperta')}. Do porównania sygnatury i stylu gra pokazuje detale z jego „dzieł pewnych”.</p><p><small class="nb">Artysta i dzieło są fikcyjne.</small></p>`}));
 const objs=[['paint5','Obrazy – znajdź oryginał','Obraz olejny to warstwowa konstrukcja: płótno na blejtramie, grunt, rysunek, kolejne warstwy farby i werniks. Każda warstwa ma swoją chemię i swój wiek – dlatego obraz bada się od odwrocia po mikroskopijną strukturę powierzchni. Na stole leży oryginał i kopie wykonane różnymi metodami.'],
  ['frag','Zniszczony fragment','Oryginał zaginął – zostały po nim opis w katalogu i wyniki dawnych badań. Zadanie polega na sprawdzeniu, czy ocalały fragment zgadza się ze wszystkimi punktami tej dokumentacji.'],
  ['memory','Pamięć eksperta','Trening spostrzegawczości: najpierw ogląda się oryginał przez lupę, potem wskazuje go wśród prawie identycznych falsyfikatów różniących się drobnymi szczegółami.']];
 objs.forEach(([id,t,txt])=>A.push({cat:'Obiekty i artyści',title:t,tags:'obrazy',img:{type:'preview',id},
  body:`<p class="wlead">${txt}</p>`+(byMode[id]?`<h3>Badania w tym trybie</h3><p>${[...new Set(byMode[id].tech)].map(wgo).join(', ')}</p>`+(byMode[id].forg.length?`<h3>Metody fałszerskie</h3><p>${byMode[id].forg.map(wgo).join(', ')}</p>`:''):'')}));
 [...Object.values(SCULPT_VARIANTS),...Object.values(KINDS)].forEach(k=>{const t=k.label.replace('Znajdź oryginał – ','').replace('Weryfikacja ','');
  A.push({cat:'Obiekty i artyści',title:t,tags:SCULPT_VARIANTS[k.id]?'rzeźby':'obiekty',img:SCULPT_VARIANTS[k.id]?{type:'bust',marble:k.id==='marble'}:{type:'preview',id:k.id},
   body:(WOBJ[t]?`<p class="wlead">${WOBJ[t]}</p>`:'')+`<h3>Zlecenie</h3><p>${k.caseText()}</p>${k.intro?`<p>${k.intro}</p>`:''}<h3>Badania</h3><p>${[...new Set(byMode[k.id].tech)].map(wgo).join(', ')}</p><h3>Metody fałszerskie</h3><p>${byMode[k.id].forg.map(wgo).join(', ')}</p>`})});
 const GIMG={'Krakelura':['paint5','crack'],'Werniks':['paint5','uv'],'Pentimenti':['paint5','ir'],'Reflektografia IR':['paint5','ir'],'RTG':['paint5','xray'],'Impast':['paint5','texture'],'Blejtram':['paint5','back'],
  'Znak wodny':['notes','watermark'],'Druk wklęsły (intaglio)':['notes','intaglio'],'Farba zmienna optycznie (OVI)':['notes','ovi'],'Obraz utajony':['notes','latent'],'Recto-verso':['notes','register'],
  'Ząbkowanie':['stamp','perf'],'Przedruk':['stamp','overprint'],'Ductus':['manuscript','ductus'],'Atrament żelazowo-galasowy':['manuscript','verso'],'Papier czerpany':['manuscript','paper'],'Galwanoplastyka':['coin','edge']};
 const BUST={'Patyna':false,'Cyzelowanie':false,'Surmoulage':false,'CNC (frezowanie)':true},GICON={'XRF':'spectrum','Katalog raisonné':'doc','Proweniencja':'doc','Giclée':'micro'};
 GLOSS.forEach(([t,b])=>{let img=null;const g=GIMG[t];
  if(g){const d=(KINDS[g[0]]||{defs:DEF}).defs[g[1]];if(d)img={type:'view',mode:g[0],tool:g[1],view:d.view||'normal',area:(d.gate||{}).area||''}}
  else if(t in BUST)img={type:'bust',marble:BUST[t]};else if(GICON[t])img={type:'icon',icon:GICON[t]};else if(t==='Grunt')img={type:'preview',id:'frag'};
  const rel=Object.keys(tech).filter(n=>n!==t&&n.toLowerCase().includes(t.toLowerCase().split(' ')[0]));
  A.push({cat:'Słowniczek',title:t,img,body:`<p class="wlead">${b}</p>${WGLOSS[t]?`<p>${WGLOSS[t]}</p>`:''}${rel.length?`<h3>Zobacz też</h3><p>${rel.map(wgo).join(', ')}</p>`:''}`})});
 return A}

/* ---------- ilustracje (generowane z silnika gry, w piaskownicy) ---------- */
const WIMG={},WBATCH={};
function wBatch(mode,seed,artist){const k=mode+'|'+seed+'|'+(artist||'');if(WBATCH[k])return WBATCH[k];
 const sel0=document.getElementById('artist'),a0=sel0.value;if(artist!=null)sel0.value=artist;
 try{return WBATCH[k]=withSandbox(()=>{const r=rng(seed);MODE=mode;KIND=KINDS[mode]||null;SV=null;sel=null;tool=null;
  if(KIND)KIND.newGame(r);else if(mode==='frag')newFrag(r);else newPaint5(r);
  return{MODE,KIND,ART,SC,C,W,H,IW,IH,P,BW,BH}})}finally{sel0.value=a0}}
function wWith(b,fn){return withSandbox(()=>{({MODE,KIND,ART,SC,C,W,H,IW,IH,P,BW,BH}=b);SV=null;sel=null;tool=null;return fn(P)})}
function wAreaRect(p,area){if(!area||WHOLE.includes(area))return null;let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;const N=56;
 for(let j=0;j<=N;j++)for(let i=0;i<=N;i++){const lx=W*i/N,ly=H*j/N;let ok=false;try{ok=areaOK(p,area,{cx:p.x+lx,cy:p.y+ly,x0:p.x,y0:p.y,x1:p.x+W,y1:p.y+H})}catch(e){}
  if(ok){x0=Math.min(x0,lx);y0=Math.min(y0,ly);x1=Math.max(x1,lx);y1=Math.max(y1,ly)}}
 if(x1<x0||(x1-x0)*(y1-y0)>W*H*0.6)return null;const m=Math.max(W,H)*0.06,cw=Math.max(x1-x0+2*m,W*0.22),ch=Math.max(y1-y0+2*m,H*0.22),cx=(x0+x1)/2,cy=(y0+y1)/2;
 const w=Math.min(W,cw),h=Math.min(H,ch);return[Math.max(0,Math.min(W-w,cx-w/2)),Math.max(0,Math.min(H-h,cy-h/2)),w,h]}
function wShot(p,v,rect){const src=getView(p,v),[x,y,w,h]=rect||[0,0,W,H],sc=Math.min(1,560/(w*S),340/(h*S)),c=mk(Math.round(w*S*sc),Math.round(h*S*sc));
 c.getContext('2d').drawImage(src,x*S,y*S,w*S,h*S,0,0,c.width,c.height);return c}
function wPanels(list){const H0=300,pad=14,lab=26,ws=list.map(o=>Math.round(o.c.width*H0/o.c.height)),tw=ws.reduce((a,b)=>a+b,0)+pad*(list.length+1);
 const out=mk(tw,H0+lab+pad*2),x=out.getContext('2d');x.fillStyle='#061430';x.fillRect(0,0,out.width,out.height);let X=pad;
 list.forEach((o,i)=>{x.drawImage(o.c,X,pad,ws[i],H0);x.strokeStyle=o.col||'rgba(95,184,255,.6)';x.lineWidth=2;x.strokeRect(X+1,pad+1,ws[i]-2,H0-2);
  x.fillStyle=o.col||'#bfe0ff';x.font='600 15px "Segoe UI",system-ui';x.textAlign='center';x.fillText(o.label,X+ws[i]/2,pad+H0+20,ws[i]);X+=ws[i]+pad});return out}
function wFind(mode,test){for(let k=0;k<14;k++){const b=wBatch(mode,9100+k*37);const p=b.P.find(test);if(p)return{b,p}}return null}
function wIcon(kind){const c=mk(600,320),x=c.getContext('2d');x.fillStyle='#061430';x.fillRect(0,0,600,320);x.strokeStyle='#6fd0ff';x.fillStyle='#6fd0ff';x.lineWidth=5;x.lineCap='round';x.lineJoin='round';x.shadowColor='#3fb0ff';x.shadowBlur=14;
 if(kind==='spectrum'){x.lineWidth=2;x.globalAlpha=.35;for(let i=0;i<=10;i++){x.beginPath();x.moveTo(60+i*48,40);x.lineTo(60+i*48,270);x.stroke()}x.globalAlpha=1;x.lineWidth=4;x.beginPath();x.moveTo(60,270);x.lineTo(540,270);x.moveTo(60,270);x.lineTo(60,40);x.stroke();
  const pk=[[140,170,'Fe'],[230,90,'Pb'],[300,200,'Cu'],[400,130,'Zn'],[470,220,'Sn']];x.lineWidth=3;x.beginPath();x.moveTo(60,262);for(let X=60;X<=540;X+=3){let y=262-Math.random()*6;for(const[px,ph]of pk)y-=ph*Math.exp(-((X-px)**2)/60);x.lineTo(X,y)}x.stroke();
  x.shadowBlur=0;x.font='600 18px "Segoe UI"';x.textAlign='center';pk.forEach(([px,ph,n])=>x.fillText(n,px,262-ph-12))}
 else if(kind==='magnet'){x.lineWidth=34;x.strokeStyle='#e0566a';x.beginPath();x.arc(300,150,80,Math.PI,0);x.stroke();x.beginPath();x.moveTo(220,150);x.lineTo(220,220);x.moveTo(380,150);x.lineTo(380,220);x.stroke();x.strokeStyle='#cfe3f8';x.beginPath();x.moveTo(220,220);x.lineTo(220,250);x.moveTo(380,220);x.lineTo(380,250);x.stroke();
  x.lineWidth=3;x.strokeStyle='#6fd0ff';for(let i=1;i<=3;i++){x.beginPath();x.arc(300,262,30+i*22,Math.PI*1.1,Math.PI*1.9,true);x.stroke()}}
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
  out=wWith(b,()=>{const rect=wAreaRect(o,img.area),L=[{c:wShot(o,img.view,rect),label:img.mode==='frag'?'Fragment':'Oryginał',col:'#7ff0b0'}];
   if(f)L.push({c:wShot(f.p,img.view,rect),label:'Falsyfikat: '+((b.KIND?b.KIND.profiles:PROFILES)[f.p.profile]||{name:''}).name,col:'#ff8a98'});return wPanels(L)});
  cap=`Widok z gry: ${T?T.name:''}${img.view!=='normal'?' – '+(VIEWNAME[img.view]||img.view):''}.`}
 else if(img.type==='forge'){const f=wFind(img.mode,p=>p.profile===img.key);
  if(f){const defs=f.b.KIND?f.b.KIND.defs:DEF,d=img.tool&&defs[img.tool],v=d?d.view||'normal':'normal';
   out=wWith(f.b,()=>{const o=f.b.P.find(p=>p.orig),rect=d?wAreaRect(o,(d.gate||{}).area):null;return wPanels([{c:wShot(o,v,rect),label:'Oryginał',col:'#7ff0b0'},{c:wShot(f.p,v,rect),label:'Ta metoda',col:'#ff8a98'}])});
   cap=d?`Porównanie w grze: ${d.name}${v!=='normal'?' – '+(VIEWNAME[v]||v):''}.`:'Oryginał i falsyfikat w świetle dziennym.'}}
 else if(img.type==='artist'){const b=wBatch('paint5',5150,img.id);out=wWith(b,()=>{const o=b.P.find(p=>p.orig);return frameIt(getView(o,'normal'),W,H,true)});cap='Oryginał w świetle dziennym (wygenerowany przez grę).'}
 else if(img.type==='preview'){out=preview(img.id);cap='Podgląd z gry.'}
 else if(img.type==='bust'){out=bustIllus(!!img.marble);cap=img.marble?'Rzeźba z marmuru – w grze badana w 3D.':'Rzeźba z brązu – w grze badana w 3D.'}
 else if(img.type==='icon'){out=wIcon(img.icon);cap='Schemat.'}
 return WIMG[key]={c:out,cap}}

let WIKI=null,WCAT='Słowniczek',WSEL=0,WTOK=0;
function showWiki(cat){WIKI=WIKI||wikiData();if(cat)WCAT=cat;document.getElementById('wiki').classList.remove('hidden');renderWiki()}
function wikiOpen(title){const a=WIKI.find(x=>x.title===title);if(!a)return;WCAT=a.cat;document.getElementById('wq').value='';WSEL=WIKI.filter(x=>x.cat===WCAT).indexOf(a);renderWiki()}
function renderWiki(){const q=(document.getElementById('wq').value||'').toLowerCase(),cats=[...new Set(WIKI.map(a=>a.cat))];
 const list=WIKI.filter(a=>(q?(a.title+a.body+(a.tags||'')).toLowerCase().includes(q):a.cat===WCAT));
 document.getElementById('wcats').innerHTML=cats.map(c=>`<button class="hbtn ghost${c===WCAT&&!q?' on':''}" data-c="${c}">${c} <small>(${WIKI.filter(a=>a.cat===c).length})</small></button>`).join('');
 document.querySelectorAll('#wcats button').forEach(b=>b.onclick=()=>{WCAT=b.dataset.c;WSEL=0;document.getElementById('wq').value='';renderWiki()});
 if(WSEL>=list.length)WSEL=0;
 document.getElementById('wlist').innerHTML=list.map((a,i)=>`<div class="wli${i===WSEL?' on':''}" data-i="${i}">${a.title}${a.tags?`<small>${a.tags}</small>`:''}</div>`).join('')||'<div class="sub">Brak wyników.</div>';
 document.querySelectorAll('.wli').forEach(el=>el.onclick=()=>{WSEL=+el.dataset.i;renderWiki()});
 const on=document.querySelector('.wli.on');if(on)on.scrollIntoView({block:'nearest'});
 const a=list[WSEL],wa=document.getElementById('wart');wa.scrollTop=0;
 wa.innerHTML=a?`<div class="sub">${a.cat}${a.tags?' · '+a.tags:''}</div><h2>${a.title}</h2>${a.img?'<figure class="wfig" id="wfig"><div class="wload"><i></i>Generowanie ilustracji…</div></figure>':''}${a.body}`:'';
 wa.querySelectorAll('.wgo').forEach(l=>l.onclick=()=>wikiOpen(l.dataset.t));
 if(a&&a.img){const tok=++WTOK;setTimeout(()=>{if(tok!==WTOK)return;let r=null;try{r=wikiIllus(a.img)}catch(e){console.warn(e)}const fg=document.getElementById('wfig');if(!fg||tok!==WTOK)return;
  if(!r||!r.c){fg.remove();return}const im=document.createElement('img');im.src=r.c.toDataURL('image/jpeg',.9);im.alt=a.title;fg.innerHTML='';fg.appendChild(im);const fc=document.createElement('figcaption');fc.textContent=r.cap;fg.appendChild(fc)},30)}}
