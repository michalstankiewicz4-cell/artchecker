"use strict";
/* =====================================================================
   RĘKOPIS – Manuskrypt Wojnicza (Beinecke Rare Book & Manuscript Library, Yale, MS 408), domena publiczna.
   Cztery karty (zdjęcia z Wikimedia Commons, przycięte przez tools/build-manuscript.py → js/real/ms-<n>.js):
   sam tekst, dwie karty zielnikowe i karta z postaciami. Oryginałem jest zdjęcie karty; kopie i wyniki badań symuluje gra.
   Prawdziwe dane: pergamin cielęcy datowany radiowęglowo na 1404–1438 (Uniwersytet Arizony, 2009); atrament
   żelazowo-galasowy (C, Fe, S, K, Ca, ślady Cu i Zn – EDS 2009); farby: azuryt, czerwona ochra (hematyt),
   zieleń miedziowa, biel z węglanu wapnia; karta ok. 23,5 × 16,2 cm.
   ===================================================================== */
const MSPAGES=[
 {id:'200',img:'ms-200',name:'Karta z tekstem',desc:'gęsty tekst i rząd gwiazdek na marginesie',src:'Voynich Manuscript (200).jpg'},
 {id:'32',img:'ms-32',name:'Karta zielnikowa – kwiaty',desc:'roślina z niebieskim i czerwonymi kwiatami, tekst obok',src:'Voynich Manuscript (32).jpg'},
 {id:'100',img:'ms-100',name:'Karta zielnikowa – roślina',desc:'roślina z zielonymi liśćmi i korzeniem, tekst nad nią',src:'Voynich Manuscript (100).jpg'},
 {id:'140',img:'ms-140',name:'Karta z postaciami',desc:'postacie w kąpieli, rurki i tekst',src:'Voynich Manuscript (140).jpg'},
 /* dokumenty papierowe z pieczęcią lakową (domena publiczna); dane o papierze i atramencie – symulowane */
 {id:'agad',img:'ms-agad',paper:true,laid:true,hcm:20,name:'Dokument Rządu Narodowego (1863)',desc:'koperta z pieczęcią lakową i kartą „Dowody do rachunków Józefa Ordęgi”',
  src:'AGAD (3) Koperta z pieczęcią lakową, Pudło 660-12 s. 8.png',where:'Archiwum Główne Akt Dawnych w Warszawie',
  seal:[0.045,0.42,0.125,0.15],add:{u:0.56,v:0.86,t:'i 2000 fr.',rot:-0.03},
  cat:'koperta z czerwoną pieczęcią lakową i karta z nadrukiem „RZĄD NARODOWY. Izba Obrachunkowa”; tekst odręczny „Dowody do rachunków Komisarza w Paryżu i Agenta Politycznego we Włoszech i Szwajcarii. J. Ordęga”; 1863'},
 {id:'nowo',img:'ms-nowo',paper:true,laid:false,hcm:35,name:'Akt sprzedaży domu (Nowogródek)',desc:'odwrocie ostatniej karty z adnotacją notariusza, pieczątką i pieczęcią lakową na nici',
  src:'Актовая бумага на продажу недвижимости в г. Новогрудке 5.png',where:'muzeum w Nowogródku (nr inw. КП 783)',
  seal:[0.685,0.70,0.18,0.13],add:{u:0.14,v:0.88,t:'и 50 руб.',rot:-0.02},
  cat:'akt sprzedaży drewnianego domu przy ul. Troickiej w Nowogródku za 100 rubli, lata 1902–1911; na odwrociu ostatniej karty adnotacja notariusza A. A. Afanasjewa o trzech zszytych kartach, podpis, różowa pieczątka i pieczęć z czerwonobrązowego laku na nici'}];
const MSP_BY=Object.fromEntries(MSPAGES.map(s=>[s.id,s]));
let MSP=MSPAGES[0];
const MS_PROF={
 facsimile:{name:'Faksymile drukowane na papierze',core:['ink','parch','uv','ductus'],opt:['c14'],modes:{ink:'toner',parch:'paper',uv:'glow',ductus:'print',c14:'modern'}},
 newVellum:{name:'Kopia na współczesnym pergaminie',core:['c14','uv','ductus'],opt:['pigment','ink'],modes:{c14:'bomb',uv:'fresh',ductus:'tremor',pigment:'modern',ink:'modern'}},
 oldVellum:{name:'Współczesne fałszerstwo na starym, czystym pergaminie',core:['ink','ductus','pigment'],opt:['uv'],modes:{ink:'modern',ductus:'tremor',pigment:'modern',uv:'ink'}},
 repaint:{name:'Oryginalna karta z dorobionymi kolorami',core:['pigment','uv'],opt:[],modes:{pigment:'modern',uv:'paint'}},
};
const MS_DEF={
 ink:{name:'Atrament (XRF)',view:'normal',probe:'ink',gate:{z:3},hint:'Przy zoomie ≥ ×3 kliknij tekst albo kontur rysunku. Katalog (EDS, 2009): atrament żelazowo-galasowy – węgiel, żelazo, siarka, potas i wapń, ślady miedzi i cynku. Przy zoomie ≥ ×5 stary atrament ma brązową obwódkę.'},
 pigment:{name:'Farby ilustracji (XRF)',view:'normal',probe:'pigment',gate:{z:3},hint:'Przy zoomie ≥ ×3 kliknij pomalowany fragment ilustracji. Katalog: niebieski – azuryt, czerwonobrązowy – czerwona ochra (hematyt), zielony – zieleń miedziowa. Pigmenty syntetyczne (kadmowe, chromowe, ftalocyjaninowe) to anachronizm.'},
 parch:{name:'Pergamin (mikroskop, pod światło)',view:'trans',gate:{z:3,area:'sheet'},hint:'Pod światło przybliż kartę (≥ ×3). Pergamin cielęcy ma pory po włosach, nierówną grubość i przeświecające żyłki. Papier ma włókna i jednolitą strukturę.'},
 uv:{name:'Lampa UV',view:'uv',gate:{z:1},hint:'Stary pergamin w UV świeci matowo, żółtawo i nierówno. Współczesny papier z wybielaczami świeci jasnoniebiesko; świeży pergamin – jaśniej i równomiernie. Nowsze farby i atramenty odcinają się od tła.'},
 ductus:{name:'Pismo i ductus',view:'normal',gate:{z:5,area:'sheet'},hint:'Przybliż tekst (≥ ×5). Piszący gęsim piórem prowadzi kreskę płynnie, atrament słabnie i wraca po zanurzeniu pióra. Kopista pisze wolno: kreska drży i bywa poprawiana. Druk nie ma śladów pióra.'},
 c14:{name:'Datowanie radiowęglowe (C-14)',hint:'Próbkę pergaminu bada się w laboratorium AMS. Katalog: 1404–1438 (Uniwersytet Arizony, 2009). Uwaga: C-14 datuje skórę, z której zrobiono pergamin – nie moment zapisania tekstu.'},
};
const MS_SET=[['1. Pergamin',['parch','uv','c14']],['2. Atrament i farby',['ink','pigment']],['3. Pismo',['ductus']]];
/* ---------- dokumenty papierowe z pieczęcią lakową ---------- */
const MS_PROF_P={
 pfacs:{name:'Faksymile wydrukowane na nowym papierze',core:['pink','paper','puv','nib'],opt:['seal','verso'],modes:{pink:'toner',paper:'modern',puv:'glow',nib:'print',seal:'modern',verso:'clean'}},
 teaAged:{name:'Kopia na nowym papierze postarzonym herbatą',core:['age','paper','verso'],opt:['puv','pink','nib'],modes:{age:'tea',paper:'modern',verso:'clean',puv:'glow',pink:'modern',nib:'tremor'}},
 addedText:{name:'Oryginał z dopiskiem innym atramentem',core:['added'],opt:['pink','puv'],modes:{added:'yes',pink:'mixed',puv:'added'}},
 fakeSeal:{name:'Oryginał z podrobioną pieczęcią lakową',core:['seal'],opt:['puv'],modes:{seal:'modern',puv:'seal'}},
};
Object.assign(MS_DEF,{
 paper:{name:'Papier (pod światło)',view:'trans',gate:{z:2,area:'sheet'},hint:'Pod światło przybliż kartę (≥ ×2). Papier czerpany lub żeberkowy z epoki ma gęste linie żeberek i rzadsze prążki, czasem znak wodny. Papier z masy drzewnej z przełomu XIX i XX w. jest gładki, pożółkły, z krótkimi włóknami. Współczesny papier jest jednolity, jasny i bez żeberkowania.'},
 puv:{name:'Lampa UV (papier)',view:'uv',gate:{z:1},hint:'Stary papier w UV jest matowy, żółtawobrązowy i plamisty. Współczesny papier z wybielaczami świeci jasnoniebiesko. Dopisek innym atramentem i nowy lak odcinają się od reszty.'},
 age:{name:'Patyna i przebarwienia',view:'normal',gate:{z:2,area:'sheet'},hint:'Przybliż kartę (≥ ×2). Naturalna patyna jest nierówna: ciemniejsze brzegi i zgięcia, rdzawe plamki (foxing), zabrudzenia tam, gdzie kartę trzymano. Postarzanie herbatą lub kawą daje jednolity odcień, zacieki z ciemną obwódką i barwnik także w zgięciach.'},
 pink:{name:'Atrament na papierze (XRF)',view:'normal',probe:'ink',gate:{z:3},hint:'Przy zoomie ≥ ×3 kliknij pismo. Atrament żelazowo-galasowy (do początku XX w.) zawiera żelazo i siarkę. Atramenty anilinowe i współczesne nie zawierają żelaza; toner to węgiel i polimer.'},
 nib:{name:'Pismo (mikroskop)',view:'normal',gate:{z:5,area:'sheet'},hint:'Przybliż pismo (≥ ×5). W XIX w. pisano stalówką: kreska grubieje przy nacisku, a przy mocnym nacisku widać dwa ślady rozchylonych połówek stalówki. Kopista pisze wolno – kreska drży. Druk nie ma śladów pióra.'},
 verso:{name:'Odwrocie (korozja atramentu)',view:'back',gate:{z:2},hint:'Obejrzyj odwrocie (≥ ×2). Atrament żelazowo-galasowy z czasem utlenia się i „przegryza” papier – pismo przebija brązowo na drugą stronę. Świeży atrament i druk nie przebijają.'},
 added:{name:'Jednolitość tekstu (UV)',view:'uv',gate:{z:2,area:'sheet'},hint:'W UV przybliż tekst (≥ ×2) i porównaj linijki. Tekst pisany jednym atramentem reaguje tak samo. Dopisek innym atramentem, choćby w tym samym kolorze, jest w UV ciemniejszy albo jaśniejszy od reszty.'},
 seal:{name:'Pieczęć lakowa (mikroskop)',view:'normal',gate:{z:4,area:'seal'},hint:'Przybliż pieczęć (≥ ×4). Dawny lak (szelak, kalafonia, czerwień cynobrowa) jest matowy, kruchy, spękany, z pyłem w zagłębieniach odcisku, a papier wokół ma tłustą obwódkę. Współczesny lak lub wosk z pistoletu jest błyszczący, plastyczny, bez spękań, a odcisk jest płytki.'},
});
const MS_SET_P=[['1. Papier',['paper','puv','age']],['2. Atrament i pismo',['pink','nib','verso','added']],['3. Pieczęć',['seal']]];
const MS_INK_P={iron:'Fe, S, K – atrament żelazowo-galasowy, zgodny z epoką.',modern:'Brak Fe; C, N – barwnik organiczny: współczesny atrament.',toner:'C, Si i polimer, brak Fe i S – toner drukarki.'};
const msSealAt=(u,v)=>{const b=MSP.seal;return!!b&&u>=b[0]&&u<=b[0]+b[2]&&v>=b[1]&&v<=b[1]+b[3]};
const msAddAt=(u,v)=>{const a=MSP.add;return!!a&&u>=a.u-0.02&&u<=a.u+0.32&&v>=a.v-0.05&&v<=a.v+0.02};
function msAdded(x,p,col,alpha){const a=MSP.add;if(!a||msMode(p,'added','none')!=='yes')return;x.save();x.translate(W*a.u,H*a.v);x.rotate(a.rot);x.globalAlpha=alpha;x.fillStyle=col;
 x.font=`italic ${Math.round(H*0.034)}px "Segoe Script","Brush Script MT","Apple Chancery",cursive`;x.fillText(a.t,0,0);x.restore()}
function msSealBox(){const b=MSP.seal;return[W*b[0],H*b[1],W*b[2],H*b[3]]}
function msDrawP(x,p,opt={}){const im=msImg();if(!im)return;const f=[];
 if(msMode(p,'paper','ok')==='modern')f.push('brightness(1.06) contrast(1.05)');if(msMode(p,'nib','steel')==='print')f.push('blur(.6px)');if(opt.filter)f.push(opt.filter);
 x.save();if(f.length)x.filter=f.join(' ');x.drawImage(im,0,0,W,H);x.restore();if(opt.bare)return;
 if(msMode(p,'age','ok')==='tea'){const r=rng(p.seed+13);x.save();x.globalCompositeOperation='source-atop';x.fillStyle='rgba(150,95,35,.22)';x.fillRect(0,0,W,H);
  for(let i=0;i<7;i++){const X=r()*W,Y=r()*H,R=25+r()*70;x.strokeStyle='rgba(110,60,20,.4)';x.lineWidth=1.6+r()*1.5;x.beginPath();x.ellipse(X,Y,R,R*(0.6+r()*0.5),r()*3,0,7);x.stroke();x.fillStyle='rgba(140,85,30,.12)';x.fill()}x.restore()}
 if(msMode(p,'seal','ok')==='modern'){const[sx,sy,sw,sh]=msSealBox();x.save();x.beginPath();x.ellipse(sx+sw/2,sy+sh/2,sw*0.42,sh*0.4,0,0,7);x.clip();
  x.filter='blur(1.2px) saturate(1.4) brightness(1.05)';x.drawImage(im,sx/W*im.width,sy/H*im.height,sw/W*im.width,sh/H*im.height,sx,sy,sw,sh);x.filter='none';
  x.fillStyle=rad(sx+sw*0.38,sy+sh*0.35,1,sw*0.3,[[0,'rgba(255,255,255,.55)'],[1,'rgba(255,255,255,0)']])(x);x.fillRect(sx,sy,sw,sh);x.restore()}
 msAdded(x,p,'rgba(45,30,40,.88)',1)}
function msViewP(p,v){
 if(v==='normal')return kView(p,v,x=>msDrawP(x,p));
 if(v==='uv')return kView(p,v,x=>{const u=msMode(p,'puv','ok');msDrawP(x,p,{filter:'grayscale(1) brightness(.5)',bare:true});
  x.globalCompositeOperation='source-atop';x.fillStyle=u==='glow'?'rgba(180,205,255,.7)':'rgba(150,120,60,.35)';x.fillRect(0,0,W,H);
  if(u!=='glow'){const r=rng(p.seed+5);for(let i=0;i<16;i++){const a=r()<.5?80:170;x.fillStyle=`rgba(${a},${a*0.8|0},40,.13)`;x.beginPath();x.ellipse(r()*W,r()*H,30+r()*100,25+r()*80,r()*3,0,7);x.fill()}}
  if(msMode(p,'seal','ok')==='modern'){const[sx,sy,sw,sh]=msSealBox();x.fillStyle='rgba(255,150,120,.85)';x.shadowColor='rgba(255,170,140,.9)';x.shadowBlur=10;x.beginPath();x.ellipse(sx+sw/2,sy+sh/2,sw*0.42,sh*0.4,0,0,7);x.fill();x.shadowBlur=0}
  x.globalCompositeOperation='source-over';msAdded(x,p,'rgba(8,4,12,.95)',1)});
 if(v==='trans')return kView(p,v,x=>{const r=rng(p.seed+9),mod=msMode(p,'paper','ok')==='modern';x.save();x.drawImage(msImg(),0,0,W,H);x.globalCompositeOperation='source-atop';
  x.fillStyle=mod?'#f3eedf':'#e9d9ad';x.fillRect(0,0,W,H);
  for(let i=0;i<(mod?900:1700);i++){x.strokeStyle=`rgba(120,100,60,${.04+r()*.08})`;x.lineWidth=.5;x.beginPath();const X=r()*W,Y=r()*H,a=r()*6.28,l=mod?2+r()*4:4+r()*10;x.moveTo(X,Y);x.lineTo(X+Math.cos(a)*l,Y+Math.sin(a)*l);x.stroke()}
  if(!mod&&MSP.laid){x.strokeStyle='rgba(255,250,230,.35)';x.lineWidth=.6;for(let y=0;y<H;y+=3.2){x.beginPath();x.moveTo(0,y);x.lineTo(W,y);x.stroke()}
   x.strokeStyle='rgba(120,95,50,.32)';x.lineWidth=1.4;for(let X0=W*0.43+18;X0<W;X0+=W*0.09){x.beginPath();x.moveTo(X0,0);x.lineTo(X0,H);x.stroke()}
   x.strokeStyle='rgba(255,252,235,.6)';x.lineWidth=2.2;const cx=W*0.72,cy=H*0.62;x.beginPath();x.ellipse(cx,cy,W*0.07,H*0.09,0,0,7);x.stroke();x.beginPath();x.moveTo(cx-W*0.04,cy);x.lineTo(cx+W*0.04,cy);x.moveTo(cx,cy-H*0.06);x.lineTo(cx,cy+H*0.06);x.stroke()}
  if(!mod){x.fillStyle='rgba(120,80,30,.05)';for(let i=0;i<30;i++){x.beginPath();x.ellipse(r()*W,r()*H,20+r()*60,15+r()*40,r()*3,0,7);x.fill()}}
  x.globalAlpha=.45;x.drawImage(msImg(),0,0,W,H);x.restore()});
 if(v==='back')return kView(p,v,x=>{const cor=msMode(p,'verso','corr')==='corr';x.save();x.translate(W,0);x.scale(-1,1);x.drawImage(msImg(),0,0,W,H);x.globalCompositeOperation='source-atop';
  x.fillStyle=msMode(p,'paper','ok')==='modern'?'#efe8d6':'#ddc79a';x.fillRect(0,0,W,H);x.globalCompositeOperation='source-over';
  x.globalAlpha=cor?.42:.07;x.filter=cor?'blur(.9px)':'none';x.drawImage(msAux('ink'),0,0,W,H);x.filter='none';x.globalAlpha=1;
  if(MSP.seal){const[sx,sy,sw,sh]=msSealBox();x.fillStyle=cor?'rgba(150,100,40,.22)':'rgba(150,100,40,.06)';x.beginPath();x.ellipse(sx+sw/2,sy+sh/2,sw*0.55,sh*0.52,0,0,7);x.fill()}x.restore()});
 return msViewP(p,'normal')}
function msLiveP(p){if(vw.z<4||curView()!=='normal')return;const V=viewportWorld();if(p.x>V.x1||p.x+W<V.x0||p.y>V.y1||p.y+H<V.y0)return;
 ctx.save();ctx.beginPath();ctx.rect(p.x,p.y,W,H);ctx.clip();
 if(MSP.seal){const[sx,sy,sw,sh]=msSealBox(),r=rng(p.seed+77),cx=p.x+sx+sw/2,cy=p.y+sy+sh/2;if(msMode(p,'seal','ok')==='ok'){ctx.strokeStyle='rgba(40,10,8,.55)';ctx.lineWidth=0.25;
   for(let i=0;i<26;i++){let X=cx+(r()-.5)*sw*0.7,Y=cy+(r()-.5)*sh*0.7;ctx.beginPath();ctx.moveTo(X,Y);for(let k=0;k<4;k++){X+=(r()-.5)*sw*0.12;Y+=(r()-.5)*sh*0.12;ctx.lineTo(X,Y)}ctx.stroke()}
   ctx.fillStyle='rgba(120,90,50,.18)';ctx.beginPath();ctx.ellipse(cx,cy,sw*0.58,sh*0.55,0,0,7);ctx.ellipse(cx,cy,sw*0.45,sh*0.43,0,0,7,true);ctx.fill('evenodd')}
  else{ctx.fillStyle=rad(cx-sw*0.1,cy-sh*0.12,1,sw*0.2,[[0,'rgba(255,255,255,.5)'],[1,'rgba(255,255,255,0)']])(ctx);ctx.fillRect(p.x+sx,p.y+sy,sw,sh)}}
 if(vw.z>=5){const ink=msMode(p,'pink','iron'),nb=msMode(p,'nib','steel');
  if(ink==='toner'||nb==='print')noteDots(p,Math.max(V.x0,p.x),Math.max(V.y0,p.y),Math.min(V.x1,p.x+W),Math.min(V.y1,p.y+H));
  else if(nb==='tremor'){ctx.globalAlpha=.5;ctx.drawImage(msAux('ink'),p.x+0.35,p.y-0.25,W,H)}
  else{ctx.globalAlpha=.3;ctx.filter='blur(0.6px)';ctx.drawImage(msAux('ink'),p.x+0.3,p.y+0.3,W,H);ctx.filter='none'}}
 ctx.restore()}
function msObsP(p,id){const m=(k,d)=>msMode(p,k,d);switch(id){
 case'paper':return m('paper','ok')==='modern'?'Pod światło papier jasny i jednolity, bez żeberkowania i znaku wodnego, z krótkimi, bielonymi włóknami – papier współczesny.':MSP.laid?'Pod światło widoczne żeberkowanie – gęste linie i rzadsze prążki – oraz fragment znaku wodnego; papier pożółkły, nierównej grubości.':'Pod światło papier gładki, pożółkły, z krótkimi włóknami masy drzewnej i drukowanymi liniami; prześwitują ślady zgięć.';
 case'puv':return{ok:'Papier w UV matowy, żółtawobrązowy, z ciemniejszymi plamami – stary papier bez wybielaczy.',glow:'Cała karta świeci jasnoniebiesko – papier z wybielaczami optycznymi.',seal:'Papier matowy, ale lak pieczęci świeci jasno – lak współczesny.',added:'Papier matowy; jedna linijka tekstu jest w UV wyraźnie ciemniejsza od reszty – inny atrament.'}[m('puv','ok')];
 case'age':return m('age','ok')==='tea'?'Jednolity brązowawy odcień na całej karcie, zacieki z ciemną obwódką, barwnik także w zgięciach – postarzanie herbatą lub kawą.':'Patyna nierówna: ciemniejsze brzegi i zgięcia, rdzawe plamki (foxing), przetarcia w miejscach chwytu.';
 case'pink':return m('pink','iron')==='mixed'?'Tekst główny: Fe, S, K – atrament żelazowo-galasowy. Dopisek w dolnej części karty: brak Fe – współczesny atrament.':MS_INK_P[m('pink','iron')];
 case'nib':return{steel:'Kreska grubieje przy nacisku, przy mocnym nacisku widać dwa ślady rozchylonej stalówki; atrament wsiąkł w papier – pismo stalówką.',tremor:'Kreska drży, jest prowadzona wolno i miejscami poprawiana – pismo kopiowane.',print:'Kreska równej grubości, brak śladów stalówki, pod mikroskopem raster kropek – druk.'}[m('nib','steel')];
 case'verso':return m('verso','corr')==='clean'?'Na odwrociu pismo nie przebija – brak korozji atramentu.':'Pismo przebija brązowo na odwrocie, papier pod literami jest kruchy – korozja atramentu żelazowo-galasowego. Pod pieczęcią tłusta plama po laku.';
 case'added':return m('added','none')==='yes'?'W UV dopisek w dolnej części karty jest wyraźnie ciemniejszy niż reszta tekstu – napisany innym atramentem.':'Cały tekst reaguje w UV tak samo – jeden atrament, brak dopisków.';
 case'seal':return m('seal','ok')==='modern'?'Lak błyszczący, gładki i plastyczny, bez spękań; odcisk płytki i rozmyty, papier wokół bez tłustej obwódki. XRF: brak rtęci – lak współczesny.':'Lak matowy, kruchy, drobno spękany, z pyłem w zagłębieniach odcisku; papier wokół z tłustą obwódką. XRF: Hg i S – czerwień cynobrowa, lak dawny.'}}
function msWhyP(p,id){const m=p.m;return({paper:()=>'Papier współczesny.',puv:()=>({glow:'Papier z wybielaczami optycznymi.',seal:'Lak świeci w UV – współczesny.',added:'Dopisek innym atramentem.'})[m.puv],
 age:()=>'Postarzanie herbatą lub kawą.',pink:()=>m.pink==='toner'?'Toner – tekst wydrukowany.':m.pink==='mixed'?'Dopisek atramentem bez żelaza.':'Współczesny atrament.',nib:()=>m.nib==='print'?'Druk zamiast pisma.':'Drżące, wolne pismo – kopiowanie.',
 verso:()=>'Brak korozji atramentu na odwrociu.',added:()=>'Dopisek innym atramentem.',seal:()=>'Współczesny lak – podrobiona pieczęć.'}[id]||(()=>''))()}
const msMode=(p,id,def)=>p.t[id]?p.m[id]:def;
/* ---------- obraz karty i jego pochodne ---------- */
const MSC={};
const msImg=()=>REALIM[MSP.img];
function msAux(kind){const k=MSP.id+':'+kind;if(MSC[k])return MSC[k];const im=msImg(),w=im.width,h=im.height,c=mk(w,h),x=c.getContext('2d');x.drawImage(im,0,0);
 if(kind==='px')return MSC[k]=x.getImageData(0,0,w,h);
 const id=x.getImageData(0,0,w,h),d=id.data,o=x.createImageData(w,h),q=o.data;
 for(let i=0;i<d.length;i+=4){const r=d[i],g=d[i+1],b=d[i+2],mx=Math.max(r,g,b),mn=Math.min(r,g,b),L=0.3*r+0.59*g+0.11*b;
  if(d[i+3]<128)continue;
  if(kind==='ink'&&L<95&&mx-mn<60&&!(MSP.seal&&msSealAt((i/4)%w/w,((i/4)/w|0)/h))){q[i]=60;q[i+1]=38;q[i+2]=18;q[i+3]=255}
  if(kind==='paint'&&mx-mn>45&&L>50){const px=(i/4)%w,py=(i/4)/w|0;if(px<w*0.05||px>w*0.95||py<h*0.04||py>h*0.96)continue;q[i]=r;q[i+1]=g;q[i+2]=b;q[i+3]=255}}
 x.clearRect(0,0,w,h);x.putImageData(o,0,0);return MSC[k]=c}
/* klasyfikacja barwy w punkcie karty: ink | blue | green | red | none */
function msSample(lx,ly){const im=msImg();if(!im)return'none';const px=msAux('px'),X=Math.max(0,Math.min(px.width-1,Math.round(lx/W*px.width))),Y=Math.max(0,Math.min(px.height-1,Math.round(ly/H*px.height)));
 let best='none';for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){const xx=Math.max(0,Math.min(px.width-1,X+dx)),yy=Math.max(0,Math.min(px.height-1,Y+dy)),i=(yy*px.width+xx)*4,r=px.data[i],g=px.data[i+1],b=px.data[i+2];if(px.data[i+3]<128)continue;const mx=Math.max(r,g,b),mn=Math.min(r,g,b),L=0.3*r+0.59*g+0.11*b;
  let c='none';if(mx-mn>40&&L>45){c=b>=r&&b>=g?'blue':g>=r?'green':'red'}else if(L<110)c='ink';
  if(c!=='none'&&(best==='none'||(best==='ink'&&c!=='ink')))best=c}return best}
function msDraw(x,p,opt={}){const im=msImg();if(!im)return;const f=[];const pm=msMode(p,'parch','vellum'),c14=msMode(p,'c14','ok'),du=msMode(p,'ductus','dip');
 if(pm==='paper')f.push('saturate(.75) brightness(1.06)');if(c14==='bomb')f.push('brightness(1.07) saturate(.85) contrast(1.04)');if(du==='print')f.push('blur(.6px)');if(opt.filter)f.push(opt.filter);
 x.save();if(f.length)x.filter=f.join(' ');x.drawImage(im,0,0,W,H);x.restore();
 if(msMode(p,'pigment','ok')==='modern'&&!opt.noPaint){x.save();x.filter='saturate(1.9) contrast(1.15)'+(opt.filter?' '+opt.filter:'');x.globalAlpha=.85;x.drawImage(msAux('paint'),0,0,W,H);x.restore()}}
function msView(p,v){
 if(v==='normal')return kView(p,v,x=>msDraw(x,p));
 if(v==='uv')return kView(p,v,x=>{const u=msMode(p,'uv','old');x.fillStyle='#1d1530';x.fillRect(0,0,W,H);msDraw(x,p,{filter:'grayscale(1) brightness(.5)',noPaint:true});
  x.globalCompositeOperation='source-atop';x.fillStyle={old:'rgba(150,120,60,.35)',glow:'rgba(180,205,255,.7)',fresh:'rgba(200,190,235,.55)',ink:'rgba(150,120,60,.35)',paint:'rgba(150,120,60,.35)'}[u];x.fillRect(0,0,W,H);
  if(u==='old'||u==='ink'||u==='paint'){const r=rng(p.seed+5);for(let i=0;i<14;i++){{const a=r()<.5?90:190;x.fillStyle=`rgba(${a},${a*0.8|0},40,.12)`}x.beginPath();x.ellipse(r()*W,r()*H,40+r()*120,30+r()*90,r()*3,0,7);x.fill()}}
  x.globalCompositeOperation='source-over';
  if(u==='ink'){x.save();x.globalAlpha=.9;x.filter='invert(1) brightness(1.3)';x.drawImage(msAux('ink'),0,0,W,H);x.restore()}
  if(u==='paint'){x.save();x.globalAlpha=.9;x.filter='brightness(1.8) saturate(2)';x.drawImage(msAux('paint'),0,0,W,H);x.restore()}});
 if(v==='trans')return kView(p,v,x=>{const r=rng(p.seed+9),pm=msMode(p,'parch','vellum');x.fillStyle=pm==='paper'?'#efe6c8':'#e2c88f';x.fillRect(0,0,W,H);
  if(pm==='paper'){for(let i=0;i<1600;i++){x.strokeStyle=`rgba(120,100,60,${.05+r()*.08})`;x.lineWidth=.5;x.beginPath();const X=r()*W,Y=r()*H,a=r()*6.28;x.moveTo(X,Y);x.lineTo(X+Math.cos(a)*(4+r()*8),Y+Math.sin(a)*(4+r()*8));x.stroke()}}
  else{for(let i=0;i<70;i++){x.fillStyle=`rgba(150,105,50,${.05+r()*.1})`;x.beginPath();x.ellipse(r()*W,r()*H,30+r()*110,20+r()*80,r()*3,0,7);x.fill()}
   for(let i=0;i<2400;i++){x.fillStyle='rgba(95,60,25,.35)';x.beginPath();x.arc(r()*W,r()*H,.5+r()*.7,0,7);x.fill()}
   x.strokeStyle='rgba(120,70,30,.18)';x.lineWidth=1.2;for(let i=0;i<5;i++){let X=r()*W,Y=r()*H;x.beginPath();x.moveTo(X,Y);for(let k=0;k<14;k++){X+=(r()-.5)*40;Y+=(r()-.3)*30;x.lineTo(X,Y)}x.stroke()}}
  x.save();x.globalAlpha=.4;x.translate(W,0);x.scale(-1,1);x.drawImage(msImg(),0,0,W,H);x.restore()});
 return msView(p,'normal')}
function msLive(p){if(vw.z<5||curView()!=='normal')return;const V=viewportWorld();if(p.x>V.x1||p.x+W<V.x0||p.y>V.y1||p.y+H<V.y0)return;
 ctx.save();ctx.beginPath();ctx.rect(p.x,p.y,W,H);ctx.clip();const ink=msMode(p,'ink','iron'),du=msMode(p,'ductus','dip');
 if(ink==='iron'){ctx.globalAlpha=.35;ctx.filter='blur(0.6px)';ctx.drawImage(msAux('ink'),p.x+0.3,p.y+0.3,W,H);ctx.filter='none';ctx.globalAlpha=1}
 if(ink==='toner'||du==='print')noteDots(p,Math.max(V.x0,p.x),Math.max(V.y0,p.y),Math.min(V.x1,p.x+W),Math.min(V.y1,p.y+H));
 if(du==='tremor'){ctx.globalAlpha=.5;ctx.drawImage(msAux('ink'),p.x+0.35,p.y-0.25,W,H);ctx.globalAlpha=1}
 ctx.restore()}
function msArea(p,a,v){const lx=v.cx-p.x,ly=v.cy-p.y;if(lx<0||lx>W||ly<0||ly>H)return false;if(a==='seal')return msSealAt(lx/W,ly/H);return a==='sheet'}
const MS_INK={iron:'C, Fe, S, K, Ca; ślady Cu i Zn – atrament żelazowo-galasowy, zgodny z katalogiem.',modern:'Fe i S obecne, ale bez K i Ca, z czystym siarczanem żelaza i barwnikiem anilinowym – współczesny atrament „na wzór dawnego”.',toner:'C, Si i polimer, brak Fe i S – toner drukarki.'};
const MS_PIG={ok:{blue:'Cu – azuryt z domieszką kuprytu (zgodnie z katalogiem).',green:'Cu, Cl – zieleń miedziowa (rezynian miedzi, atakamit), zgodnie z katalogiem.',red:'Fe – czerwona ochra (hematyt), zgodnie z katalogiem.'},
 modern:{blue:'Cu, N i C, brak węglanów – błękit ftalocyjaninowy (pigment syntetyczny z XX w.).',green:'Cr – zieleń chromowa (pigment z XIX w.).',red:'Cd, Se – czerwień kadmowa (pigment z XX w.).'}};
function msObs(p,id,v){switch(id){
 case'parch':return msMode(p,'parch','vellum')==='paper'?'Pod światło jednolita struktura z włóknami, bez porów po włosach – papier, nie pergamin.':'Pory po włosach, nierówna grubość i przeświecające żyłki – pergamin cielęcy.';
 case'uv':return{old:'Pergamin świeci matowo, żółtawo i nierówno – stara powierzchnia.',glow:'Cała karta świeci jasnoniebiesko – papier z wybielaczami optycznymi.',fresh:'Karta świeci jasno i równomiernie – świeżo wyprawiony pergamin.',ink:'Pergamin matowy, ale tekst i kontury odcinają się wyraźnie – atrament nowszy niż pergamin.',paint:'Pergamin matowy, ale farby ilustracji świecą jaskrawo – farby nowsze niż karta.'}[msMode(p,'uv','old')];
 case'ductus':return{dip:'Kreski prowadzone płynnie, nasycenie atramentu słabnie i wraca po zanurzeniu pióra – pismo gęsim piórem.',tremor:'Kreska drży, jest prowadzona wolno i miejscami poprawiana – pismo kopiowane.',print:'Kreska równej grubości, brak śladów pióra, pod mikroskopem raster kropek – druk.'}[msMode(p,'ductus','dip')];
 case'c14':return{ok:'Wynik AMS: 1404–1438 (95% prawdopodobieństwa) – zgodnie z katalogiem.',bomb:'Wynik AMS: po 1955 r. – nadmiar węgla-14 z prób jądrowych („bomba węglowa”): współczesny pergamin.',modern:'Próbka to papier z celulozy drzewnej, wynik AMS: XX w.'}[msMode(p,'c14','ok')];
 case'ink':return MS_INK[msMode(p,'ink','iron')];
 case'pigment':return MS_PIG[msMode(p,'pigment','ok')][v||'red']}}
function msWhy(p,id){const m=p.m;return({ink:()=>m.ink==='toner'?'Toner – tekst wydrukowany.':'Współczesny atrament o innym składzie niż w katalogu.',
 pigment:()=>'Pigment syntetyczny, nieznany w XV w. – anachronizm.',parch:()=>'Papier zamiast pergaminu.',
 uv:()=>({glow:'Papier z wybielaczami optycznymi.',fresh:'Świeży pergamin – brak starej powierzchni.',ink:'Atrament nowszy niż pergamin.',paint:'Farby nowsze niż karta.'})[m.uv],
 ductus:()=>m.ductus==='print'?'Druk zamiast pisma.':'Drżące, wolne pismo – kopiowanie.',c14:()=>m.c14==='bomb'?'Pergamin współczesny (bomba węglowa).':'Papier współczesny.'}[id]||(()=>''))()}
/* ---------- wybór karty ---------- */
function msSetup(id){MSP=MSP_BY[id]||MSP;const im=msImg(),k=KINDS.manuscript;if(!im)return;k.H=640;k.W=Math.round(640*im.width/im.height);k.hcm=MSP.hcm||23.5;k.wcm=Math.round(k.hcm*k.W/k.H*10)/10;
 k.sets=MSP.paper?MS_SET_P:MS_SET;k.profiles=MSP.paper?MS_PROF_P:MS_PROF;k.focusLabel=MSP.seal?'Pieczęć':'Tekst'}
async function msPick(r){const el=document.getElementById('artist'),v=el.value;const id=el.dataset.mode!=='manuscript'?'32':MSP_BY[v]?v:MSPAGES[Math.floor(r()*MSPAGES.length)].id;await loadReal(MSP_BY[id].img);msSetup(id)}
registerKind({id:'manuscript',label:'Weryfikacja rękopisów',noun:'Rękopis',W:440,H:640,wcm:16.2,hcm:23.5,tilt:false,focusLabel:'Tekst',
 defs:MS_DEF,sets:MS_SET,profiles:MS_PROF,pick:msPick,wikiVariants:['32','agad'],wikiSets:[...MS_SET,...MS_SET_P],wikiProfiles:Object.assign({},MS_PROF,MS_PROF_P),
 wikiSetup(id){const s=MSP_BY[id];if(s&&REALIM[s.img]){msSetup(s.id);return}if(!msImg()){const t=MSPAGES.find(s=>REALIM[s.img]);if(t)MSP=t}msSetup(MSP.id)},
 newGame(r){if(msImg())msSetup(MSP.id);kindBatch(this,r)},view:(p,v)=>MSP.paper?msViewP(p,v):msView(p,v),live:p=>MSP.paper?msLiveP(p):msLive(p),area:msArea,shadow(p){if(MSP.id!=='agad'){ctx.fillRect(p.x+6,p.y+8,W,H);return}ctx.save();ctx.globalAlpha=.5;ctx.filter='brightness(0)';ctx.drawImage(msViewP(p,'normal'),p.x+6,p.y+8,W,H);ctx.restore()},
 obs:(p,id)=>MSP.paper?msObsP(p,id):msObs(p,id),why:(p,id)=>MSP.paper?msWhyP(p,id):msWhy(p,id),
 focus:p=>MSP.seal?[p.x+W*MSP.seal[0],p.y+H*MSP.seal[1],W*MSP.seal[2],H*MSP.seal[3]]:[p.x+W*0.2,p.y+H*0.12,W*0.3,H*0.12],
 probe(p,lx,ly,id){if(vw.z<3)return toast('Przybliż do ×3, aby przyłożyć głowicę XRF.');const c=msSample(lx,ly);
  if(id==='pink'){if(c!=='ink')return toast('Kliknij dokładnie w pismo.');const md=msMode(p,'pink','iron'),t=MS_INK_P[md==='mixed'?(msAddAt(lx/W,ly/H)?'modern':'iron'):md];note(p,'pink',t);toast(`Rękopis ${p.letter}: ${t}`)}
  if(id==='ink'){if(c==='none')return toast('Kliknij dokładnie w tekst albo kontur rysunku.');const t=MS_INK[msMode(p,'ink','iron')];note(p,'ink',t);toast(`Rękopis ${p.letter}: ${t}`)}
  if(id==='pigment'){if(c==='none'||c==='ink')return toast('Kliknij pomalowany fragment ilustracji (niebieski, zielony albo czerwonobrązowy).');const t=msObs(p,'pigment',c);note(p,'pigment',t);toast(`Rękopis ${p.letter}: ${t}`)}},
 panel(p,id){if((id==='ink'||id==='pigment'||id==='pink')&&p.notes[id])return`<div class="obs"><b>Odczyty:</b><br>${[...new Set([].concat(p.notes[id]))].join('<br>')}</div>`},
 get intro(){if(MSP.paper)return`Na stole leży 5 egzemplarzy dokumentu: ${tr(MSP.name)} – ${tr(MSP.desc)}. Część to oryginały, reszta to kopie, faksymile albo przeróbki. Zbadaj papier pod światło i w UV, patynę, atrament i pismo, odwrocie i pieczęć lakową. Na checkliście każdego dokumentu zaznacz sygnały fałszerstwa i zakończ ekspertyzę.`;return`Na stole leży 5 egzemplarzy karty z Manuskryptu Wojnicza – ${tr(MSP.name).toLowerCase()} (${tr(MSP.desc)}). Jeden to oryginał, reszta to kopie, faksymile albo przeróbki. Zbadaj pergamin pod światło i w UV, atrament i farby, pismo pod mikroskopem i zleć datowanie radiowęglowe. Na checkliście każdej karty zaznacz sygnały fałszerstwa i zakończ ekspertyzę.`},
 caseText:()=>MSP.paper?`Weryfikacja rękopisów: ${MSP.name} – ${MSP.where}. Katalog: ${MSP.cat}. Zdjęcie: Wikimedia Commons (domena publiczna); dane o papierze i atramencie, kopie i wyniki badań symuluje gra.`:`Weryfikacja rękopisów: Manuskrypt Wojnicza (Beinecke Rare Book & Manuscript Library, Yale, MS 408) – ${MSP.name.toLowerCase()}. Katalog: pergamin cielęcy datowany na 1404–1438, atrament żelazowo-galasowy, farby: azuryt, czerwona ochra, zieleń miedziowa; karta ok. 23,5 × 16,2 cm. Zdjęcie karty: Wikimedia Commons (domena publiczna); kopie i wyniki badań symuluje gra.`});
Object.assign(AREA,{sheet:'środek widoku na karcie',seal:'środek widoku na pieczęci'});
/* karta potrzebna miniaturze na ekranie startowym i ilustracjom wiki */
setTimeout(()=>{loadReal('ms-agad').catch(()=>{});loadReal('ms-nowo').catch(()=>{})},2500);
setTimeout(()=>loadReal(MSP_BY['32'].img).then(()=>{if(MODE!=='manuscript')msSetup('32');if(typeof PREV!=='undefined'){delete PREV.manuscript;
 const h=document.getElementById('home');if(h&&!h.hidden&&h.offsetParent!==null&&typeof renderHome==='function')renderHome()}}).catch(()=>{}),800);
