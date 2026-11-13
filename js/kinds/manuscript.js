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
 {id:'140',img:'ms-140',name:'Karta z postaciami',desc:'postacie w kąpieli, rurki i tekst',src:'Voynich Manuscript (140).jpg'}];
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
const msMode=(p,id,def)=>p.t[id]?p.m[id]:def;
/* ---------- obraz karty i jego pochodne ---------- */
const MSC={};
const msImg=()=>REALIM[MSP.img];
function msAux(kind){const k=MSP.id+':'+kind;if(MSC[k])return MSC[k];const im=msImg(),w=im.width,h=im.height,c=mk(w,h),x=c.getContext('2d');x.drawImage(im,0,0);
 if(kind==='px')return MSC[k]=x.getImageData(0,0,w,h);
 const id=x.getImageData(0,0,w,h),d=id.data,o=x.createImageData(w,h),q=o.data;
 for(let i=0;i<d.length;i+=4){const r=d[i],g=d[i+1],b=d[i+2],mx=Math.max(r,g,b),mn=Math.min(r,g,b),L=0.3*r+0.59*g+0.11*b;
  if(kind==='ink'&&L<95&&mx-mn<60){q[i]=60;q[i+1]=38;q[i+2]=18;q[i+3]=255}
  if(kind==='paint'&&mx-mn>45&&L>50){const px=(i/4)%w,py=(i/4)/w|0;if(px<w*0.05||px>w*0.95||py<h*0.04||py>h*0.96)continue;q[i]=r;q[i+1]=g;q[i+2]=b;q[i+3]=255}}
 x.clearRect(0,0,w,h);x.putImageData(o,0,0);return MSC[k]=c}
/* klasyfikacja barwy w punkcie karty: ink | blue | green | red | none */
function msSample(lx,ly){const im=msImg();if(!im)return'none';const px=msAux('px'),X=Math.max(0,Math.min(px.width-1,Math.round(lx/W*px.width))),Y=Math.max(0,Math.min(px.height-1,Math.round(ly/H*px.height)));
 let best='none';for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){const xx=Math.max(0,Math.min(px.width-1,X+dx)),yy=Math.max(0,Math.min(px.height-1,Y+dy)),i=(yy*px.width+xx)*4,r=px.data[i],g=px.data[i+1],b=px.data[i+2],mx=Math.max(r,g,b),mn=Math.min(r,g,b),L=0.3*r+0.59*g+0.11*b;
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
function msArea(p,a,v){const lx=v.cx-p.x,ly=v.cy-p.y;if(lx<0||lx>W||ly<0||ly>H)return false;return a==='sheet'}
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
function msSetup(id){MSP=MSP_BY[id]||MSP;const im=msImg(),k=KINDS.manuscript;if(!im)return;k.H=640;k.W=Math.round(640*im.width/im.height);k.hcm=23.5;k.wcm=Math.round(23.5*k.W/k.H*10)/10}
async function msPick(r){const el=document.getElementById('artist'),v=el.value;const id=el.dataset.mode!=='manuscript'?'32':MSP_BY[v]?v:MSPAGES[Math.floor(r()*MSPAGES.length)].id;await loadReal(MSP_BY[id].img);msSetup(id)}
registerKind({id:'manuscript',label:'Weryfikacja rękopisów',noun:'Rękopis',W:440,H:640,wcm:16.2,hcm:23.5,tilt:false,focusLabel:'Tekst',
 defs:MS_DEF,sets:MS_SET,profiles:MS_PROF,pick:msPick,wikiSetup(){if(!msImg()){const s=MSPAGES.find(s=>REALIM[s.img]);if(s)MSP=s}msSetup(MSP.id)},
 newGame(r){if(msImg())msSetup(MSP.id);kindBatch(this,r)},view:msView,live:msLive,area:msArea,obs:(p,id)=>msObs(p,id),why:msWhy,
 focus:p=>[p.x+W*0.2,p.y+H*0.12,W*0.3,H*0.12],
 probe(p,lx,ly,id){if(vw.z<3)return toast('Przybliż do ×3, aby przyłożyć głowicę XRF.');const c=msSample(lx,ly);
  if(id==='ink'){if(c==='none')return toast('Kliknij dokładnie w tekst albo kontur rysunku.');const t=MS_INK[msMode(p,'ink','iron')];note(p,'ink',t);toast(`Rękopis ${p.letter}: ${t}`)}
  if(id==='pigment'){if(c==='none'||c==='ink')return toast('Kliknij pomalowany fragment ilustracji (niebieski, zielony albo czerwonobrązowy).');const t=msObs(p,'pigment',c);note(p,'pigment',t);toast(`Rękopis ${p.letter}: ${t}`)}},
 panel(p,id){if((id==='ink'||id==='pigment')&&p.notes[id])return`<div class="obs"><b>Odczyty:</b><br>${[...new Set([].concat(p.notes[id]))].join('<br>')}</div>`},
 get intro(){return`Na stole leży 5 egzemplarzy karty z Manuskryptu Wojnicza – ${tr(MSP.name).toLowerCase()} (${tr(MSP.desc)}). Jeden to oryginał, reszta to kopie, faksymile albo przeróbki. Zbadaj pergamin pod światło i w UV, atrament i farby, pismo pod mikroskopem i zleć datowanie radiowęglowe. Na checkliście każdej karty zaznacz sygnały fałszerstwa i zakończ ekspertyzę.`},
 caseText:()=>`Weryfikacja rękopisów: Manuskrypt Wojnicza (Beinecke Rare Book & Manuscript Library, Yale, MS 408) – ${MSP.name.toLowerCase()}. Katalog: pergamin cielęcy datowany na 1404–1438, atrament żelazowo-galasowy, farby: azuryt, czerwona ochra, zieleń miedziowa; karta ok. 23,5 × 16,2 cm. Zdjęcie karty: Wikimedia Commons (domena publiczna); kopie i wyniki badań symuluje gra.`});
Object.assign(AREA,{sheet:'środek widoku na karcie'});
/* karta potrzebna miniaturze na ekranie startowym i ilustracjom wiki */
setTimeout(()=>loadReal(MSP_BY['32'].img).then(()=>{if(MODE!=='manuscript')msSetup('32');if(typeof PREV!=='undefined'){delete PREV.manuscript;
 const h=document.getElementById('home');if(h&&!h.hidden&&h.offsetParent!==null&&typeof renderHome==='function')renderHome()}}).catch(()=>{}),800);
