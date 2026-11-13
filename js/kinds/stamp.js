"use strict";
/* =====================================================================
   ZNACZKI – prawdziwe znaczki z domeny publicznej (zdjęcia: Wikimedia Commons)
   • Penny Black, Wielka Brytania 1840 – druk wklęsły (stalorytniczy), bez ząbkowania, znak wodny „mała korona”,
     litery kontrolne w dolnych narożnikach (rząd A–T, kolumna A–L), kasownik „krzyż maltański”.
   • Polska nr 1, Królestwo Polskie 1860 – druk typograficzny w dwóch kolorach, ząbkowanie 11½–12½, bez znaku wodnego.
   • Polska 1918–19: 10 fen. na 6 gr Poczty Miejskiej w Warszawie z przedrukiem „Poczta Polska”, 10 fen. na 40 Pf Germania
     (wydanie poznańskie) i 50 halerzy z orłem (bez ząbkowania, bez gumy).
   Zdjęcie oryginału jest warstwą bazową; podróbki i wyniki badań symuluje gra.
   ===================================================================== */
const SPX=12;                                           // piksele świata na milimetr (miarka 2 cm = 240 px)
const STAMPS=[
 {id:'pb',img:'stamp-pb',name:'Penny Black',country:'Wielka Brytania',year:'1840',W:261,H:291,perf:null,wm:'crown',print:'intaglio',used:true,
  letters:{boxes:[[33,377,32,38],[336,377,34,38]],ok:['R','A']},
  cat:'druk wklęsły (stalorytniczy), czarny; bez ząbkowania (cięty nożyczkami); znak wodny „mała korona”; litery kontrolne w dolnych narożnikach; kasownik „krzyż maltański”',
  src:'Pennyblack-pd.jpg'},
 {id:'pl1',img:'stamp-pl1',name:'Polska nr 1',country:'Królestwo Polskie',year:'1860',W:240,H:320,perf:[11.5,12,12.5],wm:null,print:'typo',used:false,
  cat:'10 kopiejek, druk typograficzny w dwóch kolorach (niebieski i różowy); ząbkowanie 11½–12½; bez znaku wodnego; guma żółtawa',
  src:'Znaczek Fi 1.jpg',perfTxt:'11½–12½',colOk:'Niebieski i różowy w odcieniach zgodnych z katalogiem.',colBad:'Róż przesunięty w stronę czerwieni, niebieski zbyt nasycony – inne farby niż w oryginale.'},
 {id:'w10',img:'stamp-w10',name:'10 fen. na 6 gr – Poczta Polska',country:'Polska (Warszawa)',year:'1918',W:240,H:296,perf:[11.5],wm:null,print:'litho',used:false,
  over:{boxes:[[0,0.02,0.8,0.15],[0,0.74,0.75,0.16]],ok:'Przedruk czarny, przesunięty w lewo względem rysunku – znana odmiana przesunięcia. Farba wciśnięta w papier, litery pełne, z ciemniejszą obwódką: druk typograficzny.'},
  cat:'10 fenigów na 6 groszach Poczty Miejskiej w Warszawie (1916, Syrena, proj. Edward Trojanowski); przedruk „10 FEN. 10” i „Poczta Polska” z 17 listopada 1918; rysunek zielony, litografia; ząbkowanie 11½',
  src:'Stamp Poland Mi3.jpg',perfTxt:'11½',colOk:'Zieleń rysunku i czerń przedruku zgodne z katalogiem.',colBad:'Zieleń przesunięta w stronę błękitu, zbyt nasycona – inna farba niż w oryginale.'},
 {id:'pz10',img:'stamp-pz10',name:'10 fen. na 40 Pf Germania – Poczta Polska',country:'Polska (Poznań)',year:'1919',W:264,H:310,perf:[14,14.5],wm:'lozenge',print:'typo',used:false,
  over:{boxes:[[0.04,0.05,0.28,0.17],[0.68,0.05,0.28,0.17],[0.16,0.33,0.66,0.38],[0.02,0.82,0.95,0.09]],ok:'Przedruk czarny, matowy: „10” w górnych narożnikach, „Poczta Polska” i kreska na napisie „DEUTSCHES REICH”. Farba wciśnięta w papier, litery pełne, z ciemniejszą obwódką: druk typograficzny.'},
  cat:'10 fenigów na 40 Pf Germania (proj. Paul Waldraff); wydanie poznańskie, sierpień 1919 (Fischer 70); Germania czerwona i czarna, druk typograficzny; ząbkowanie 14 × 14½; znak wodny „romby”; przedruk typograficzny',
  src:'PL Fi70 over DE Mi90.jpg',perfTxt:'14 × 14½',wmName:'romby',colOk:'Czerwień ramki i czerń Germanii zgodne z katalogiem.',colBad:'Czerwień przesunięta w stronę pomarańczu – inna farba niż w oryginale.'},
 {id:'or50',img:'stamp-or50',name:'50 halerzy – Orzeł',country:'Polska (dawny zabór austriacki)',year:'1919',W:264,H:312,perf:null,wm:null,print:'litho',used:false,gum:'none',
  cat:'50 halerzy, orzeł na tarczy; litografia, niebieska; bez ząbkowania; papier biały z niebieskawym odcieniem; wydany bez gumy',
  src:'Poland 50h1919 1st.jpg',colOk:'Niebieski zgodny z katalogiem.',colBad:'Niebieski przesunięty w stronę fioletu – inna farba niż w oryginale.'}];
const STAMP_BY=Object.fromEntries(STAMPS.map(s=>[s.id,s]));
let STAMP=STAMPS[0];
const STAMP_PROF_ALL={
 facsimile:{name:'Współczesne faksymile (druk cyfrowy)',for:['pb','pl1','w10','pz10','or50'],core:['print','uv'],opt:['wm','gum','perf','cancel'],modes:{print:'inkjet',uv:'glow',wm:'none',gum:'modern',perf:'p13',cancel:'printed'}},
 litho:{name:'Fałszerstwo z epoki (litografia)',for:['pb','pl1','pz10'],core:['print','letters','colors','perf'],opt:['wm'],modes:{print:'litho',letters:'bad',colors:'shade',perf:'p10',wm:'none'}},
 repaired:{name:'Oryginał z dorobionym marginesem',for:['pb','or50'],core:['perf','uv'],opt:['wm'],modes:{perf:'added',uv:'patch',wm:'seam'}},
 fakeCancel:{name:'Prawdziwy znaczek z podrobionym kasownikiem',for:['pb'],core:['cancel'],opt:['uv'],modes:{cancel:'fake',uv:'cancel'}},
 regum:{name:'Oryginał z dorobioną gumą i poprawionym ząbkowaniem',for:['pl1','w10','pz10','or50'],core:['gum','perf'],opt:[],modes:{gum:'regum',perf:'reperf'}},
 fakeOver:{name:'Prawdziwy znaczek z podrobionym przedrukiem',for:['w10','pz10'],core:['over'],opt:['uv'],modes:{over:'fake',uv:'over'}},
};
const STAMP_DEF_ALL={
 perf:{name:'Ząbkowanie (miarka)',view:'normal',gate:{z:2.5,area:'perf'},hint:'Ząbkowanie to liczba ząbków na 2 cm: Polska nr 1 – 11½–12½, Warszawa 1918 – 11½, Poznań 1919 (Germania) – 14 × 14½. Przybliż brzeg (≥ ×2,5): nad górnym brzegiem pojawi się miarka 2 cm. Policz ząbki i sprawdź, czy otwory są równe.'},
 margins:{name:'Marginesy (brzegi)',view:'normal',gate:{z:2.5,area:'perf'},hint:'Penny Black i orzeł z 1919 r. nie mają ząbkowania – arkusze cięto nożyczkami. Przybliż brzegi (≥ ×2,5): oryginalne marginesy są z jednego kawałka papieru, bez spoin i doklejonych pasków.'},
 wm:{name:'Znak wodny (kąpiel)',view:'wmbath',gate:{z:1.5,area:'design'},hint:'W kąpieli w płynie do znaków wodnych papier ciemnieje, a znak wodny staje się widoczny. Penny Black: jedna mała korona na każdym znaczku; Germania: siatka rombów. Spoina doklejonego papieru też staje się widoczna.'},
 uv:{name:'Lampa UV (papier)',view:'uv',gate:{z:1},hint:'Papier z XIX w. w UV jest matowy i ciemny. Współczesny papier z wybielaczami świeci jasnoniebiesko; świecą też nowsze farby i kleje.'},
 print:{name:'Metoda druku (mikroskop)',view:'normal',gate:{z:6,area:'design'},hint:'Przy zoomie ≥ ×6. Druk wklęsły (Penny Black): farba tworzy wypukłe, ostre linie. Druk typograficzny (Polska nr 1, Germania): farba wyciśnięta na brzegi kresek – ciemniejsze obwódki. Litografia (Warszawa 1918, orzeł 1919) jest płaska. Druk cyfrowy to raster kolorowych kropek.'},
 letters:{name:'Litery kontrolne (narożniki)',view:'normal',gate:{z:3,area:'letters'},hint:'Penny Black: arkusz miał 20 rzędów po 12 znaczków. Lewa litera to rząd (A–T), prawa – kolumna (A–L). Przybliż dolne narożniki (≥ ×3) i sprawdź, czy taka para mogła istnieć.'},
 cancel:{name:'Kasownik (mikroskop)',view:'normal',gate:{z:4,area:'design'},hint:'Penny Black kasowano ręcznie „krzyżem maltańskim”. Przybliż (≥ ×4): odbicie ręcznego stempla jest nierówne, tusz wsiąka w papier. Kasownik dorobiony leży na powierzchni, ma ostre, równe krawędzie albo raster druku.'},
 gum:{name:'Guma (odwrocie)',view:'back',gate:{z:3,area:'perf'},hint:'Polska nr 1: guma żółtawa, matowa, z drobnymi spękaniami. Orzeł z 1919 r. wydano bez gumy. Przybliż ząbki na odwrociu (≥ ×3): dorobiona guma jest błyszcząca i wchodzi na czubki ząbków.'},
 over:{name:'Przedruk (mikroskop)',view:'normal',gate:{z:6,area:'design'},hint:'Znaczki z lat 1918–19 to znaczki zaborców z polskim przedrukiem („Poczta Polska”, nowa wartość). Przybliż przedruk (≥ ×6): prawdziwy, odbity czcionką, ma pełne litery z ciemniejszą obwódką i jest wciśnięty w papier. Podrobiony przedruk dorobiony na prawdziwym znaczku bywa rastrowy (fotomechaniczny), płaski i w innym odcieniu czerni.'},
 colors:{name:'Barwy i ich odcień',view:'normal',gate:{z:2,area:'design'},hint:'Porównaj barwy ze wzorem z katalogu: Polska nr 1 – niebieski i różowy, Penny Black – czerń, Germania – czerwień i czerń, Warszawa 1918 – zieleń, orzeł 1919 – niebieski. Fałszerstwa z epoki często mają inny odcień, bo fałszerz nie miał tych samych farb.'},
};
const STAMP_SETS={pb:[['1. Papier',['margins','wm','uv']],['2. Druk',['print','letters','colors']],['3. Obieg',['cancel']]],
 pl1:[['1. Papier',['perf','uv','gum']],['2. Druk',['print','colors']]],
 w10:[['1. Papier',['perf','uv','gum']],['2. Druk',['print','over','colors']]],
 pz10:[['1. Papier',['perf','wm','uv','gum']],['2. Druk',['print','over','colors']]],
 or50:[['1. Papier',['margins','uv','gum']],['2. Druk',['print','colors']]]};
/* odpowiedniki: tell „perf” obsługuje u Penny Black narzędzie „margins” */
const stampTell=id=>!STAMP.perf&&id==='margins'?'perf':id;
const stampMode=(p,id,def)=>{const k=stampTell(id);return p.t[k]?p.m[k]:def};
const STAMP_G={p13:13,p10:10,reperf:13};
const stampGauge=p=>{const m=stampMode(p,'perf','ok');return m==='ok'?STAMP.perf[p.seed%STAMP.perf.length]:STAMP_G[m]};
/* ---------- obraz bazowy i jego pochodne (liczone raz na znaczek) ---------- */
const STC={};
function stampImg(){return REALIM[STAMP.img]}
function stampAux(kind){const k=STAMP.id+':'+kind;if(STC[k])return STC[k];const im=stampImg(),w=im.width,h=im.height,c=mk(w,h),x=c.getContext('2d');x.drawImage(im,0,0);
 const id=x.getImageData(0,0,w,h),d=id.data,o=x.createImageData(w,h),q=o.data,L=i=>0.3*d[i]+0.59*d[i+1]+0.11*d[i+2];
 for(let y=1;y<h-1;y++)for(let X=1;X<w-1;X++){const i=(y*w+X)*4;if(d[i+3]<128)continue;
  if(kind==='over'||kind==='overg'||kind==='overd'){if(!stampOverAt(X/w,y/h))continue;const dk=j=>L(j)<60;if(!(dk(i)&&dk(i+4)&&dk(i-4)&&dk(i+w*4)&&dk(i-w*4)))continue;
   if(kind==='over'){q[i]=104;q[i+1]=88;q[i+2]=74;q[i+3]=200}else if(kind==='overg'){q[i]=255;q[i+1]=226;q[i+2]=130;q[i+3]=235}else if((X+y)%3===0){q[i]=236;q[i+1]=228;q[i+2]=212;q[i+3]=200}}
  else if(kind==='red'){const r=d[i]-Math.max(d[i+1],d[i+2]);if(r>45&&d[i]>110){q[i]=d[i];q[i+1]=d[i+1];q[i+2]=d[i+2];q[i+3]=255}}
  else{const gx=L(i+4)-L(i-4),gy=L(i+w*4)-L(i-w*4),g=Math.hypot(gx,gy);
   if(kind==='rim'){if(g>40&&L(i)<150){q[i]=40;q[i+1]=20;q[i+2]=30;q[i+3]=Math.min(200,g*1.6)}}
   else if(kind==='relief'){const v=-(gx+gy)*0.9;if(v>12){q[i]=255;q[i+1]=255;q[i+2]=245;q[i+3]=Math.min(170,v*2)}}}}
 x.clearRect(0,0,w,h);x.putImageData(o,0,0);return STC[k]=c}
const stampOverAt=(u,v)=>!!(STAMP.over&&STAMP.over.boxes.some(([a,b,c,d])=>u>=a&&u<=a+c&&v>=b&&v<=b+d));
/* rysuje zdjęcie znaczka na obszarze druku; filtr dla podróbek */
function stampArt(x,p,opt={}){const im=stampImg();if(!im)return[0,0,W,H];const bx=STAMP.perf?12:0,by=STAMP.perf?12:0,bw=W-2*bx,bh=H-2*by;
 x.save();const f=[];if(stampMode(p,'colors','ok')==='shade')f.push(STAMP.id==='pb'?'sepia(.35) brightness(1.12)':'hue-rotate(-14deg) saturate(1.35) brightness(.97)');
 const pm=opt.flat?'typo':stampMode(p,'print',STAMP.print);if(pm==='inkjet')f.push('blur(1.4px)');if(pm==='litho')f.push('blur(.5px) contrast(.92)');
 if(opt.filter)f.push(opt.filter);if(f.length)x.filter=f.join(' ');x.drawImage(im,bx,by,bw,bh);x.filter='none';
 if(STAMP.over&&!opt.filter&&stampMode(p,'over','ok')==='fake'){x.drawImage(stampAux('over'),bx+1.2,by+0.6,bw,bh)}
 if(STAMP.id==='pb'){const cm=stampMode(p,'cancel','ok');
  if(cm==='fake'){const red=stampAux('red');x.globalCompositeOperation='source-atop';x.save();x.globalAlpha=.92;x.filter='saturate(0) sepia(.55) brightness(1.08)';x.drawImage(red,bx,by,bw,bh);x.restore();x.globalCompositeOperation='source-over';
   stampCross(x,bx,bh,bw,'rgba(205,62,44,.85)')}
  if(stampMode(p,'letters','ok')==='bad'){const L=stampBadLetters(p),sx=bw/im.width,sy=bh/im.height;STAMP.letters.boxes.forEach(([lx,ly,lw,lh],k)=>{
   x.fillStyle='#ece3cf';x.fillRect(bx+(lx+3)*sx,by+(ly+3)*sy,(lw-6)*sx,(lh-6)*sy);x.fillStyle='#1b1714';x.font=`bold ${Math.round(lh*sy*0.62)}px Georgia,serif`;x.textAlign='center';
   x.fillText(L[k],bx+(lx+lw/2)*sx,by+(ly+lh*0.74)*sy);x.textAlign='left'})}}
 x.restore();return[bx,by,bw,bh]}
/* dorobiony kasownik: krzyż maltański (rysowany) */
function stampCross(x,bx,bh,bw,col){x.save();x.translate(bx+bw*0.47,bx+bh*0.43);x.rotate(-0.12);x.scale(.82,.82);x.strokeStyle=col;x.lineWidth=3;
 x.beginPath();for(let a=0;a<4;a++){const t=a*Math.PI/2;x.moveTo(0,0);x.lineTo(Math.cos(t-.28)*86,Math.sin(t-.28)*86);x.lineTo(Math.cos(t)*68,Math.sin(t)*68);x.lineTo(Math.cos(t+.28)*86,Math.sin(t+.28)*86);x.closePath()}x.stroke();
 x.beginPath();x.arc(0,0,94,0,7);x.stroke();x.restore()}
function stampBadLetters(p){const r=rng(p.seed+41);return r()<0.5?['R','NOPQ'[Math.floor(r()*4)]]:['UVWX'[Math.floor(r()*4)],'A']}
/* ---------- perforacja (Polska nr 1) i marginesy (Penny Black) ---------- */
function stampHoles(p,cb){const g=stampGauge(p),sp=240/g,r=rng(p.seed+29),rag=stampMode(p,'perf','ok')==='reperf';
 for(const[len,fn]of[[W,i=>[i,0]],[W,i=>[i,H]],[H,i=>[0,i]],[H,i=>[W,i]]]){const n=Math.floor(len/sp),off=(len-n*sp)/2;for(let k=0;k<=n;k++){const[x,y]=fn(off+k*sp+(rag?(r()-.5)*sp*0.25:0));cb(x,y,rag?3.6+r()*2:4.4)}}}
function stampCut(x,p){if(!STAMP.perf)return;x.save();x.globalCompositeOperation='destination-out';stampHoles(p,(cx,cy,rr)=>{x.beginPath();x.arc(cx,cy,rr,0,7);x.fill()});x.restore()}
function stampPaper(x,p,col){if(!STAMP.perf)return;x.fillStyle=col;x.fillRect(0,0,W,H)}
const STAMP_SEAM=()=>Math.round(W*0.034);      // szerokość doklejonego paska (lewy margines)
function stampAdded(x,p,col,a){if(STAMP.perf||stampMode(p,'perf','ok')!=='added')return;const s=STAMP_SEAM();x.save();x.globalCompositeOperation='source-atop';x.fillStyle=col;x.globalAlpha=a;x.fillRect(0,0,s,H);x.restore()}
/* ---------- widoki ---------- */
function stampView(p,v){
 if(v==='normal')return kView(p,v,(x,c)=>{stampPaper(x,p,'#efe6d2');stampArt(x,p);
  if(stampMode(p,'perf','ok')==='added'){const s=STAMP_SEAM();x.save();x.globalCompositeOperation='source-atop';x.fillStyle='rgba(246,240,228,.55)';x.fillRect(0,0,s,H);x.strokeStyle='rgba(120,100,70,.45)';x.lineWidth=0.6;x.beginPath();x.moveTo(s,0);x.lineTo(s+1.5,H);x.stroke();x.restore()}
  stampCut(x,p)});
 if(v==='back')return kView(p,v,x=>{const gm=stampMode(p,'gum','ok'),r=rng(p.seed+31);x.fillStyle='#efe7d4';x.fillRect(0,0,W,H);
  x.save();x.globalAlpha=.07;x.translate(W,0);x.scale(-1,1);x.filter='grayscale(1)';x.drawImage(stampImg(),STAMP.perf?12:0,STAMP.perf?12:0,STAMP.perf?W-24:W,STAMP.perf?H-24:H);x.restore();
  if(STAMP.gum==='none'&&gm==='ok'){x.fillStyle='rgba(205,215,235,.18)';x.fillRect(0,0,W,H)}
  else if(STAMP.used){x.fillStyle='rgba(120,100,70,.12)';for(let i=0;i<40;i++)x.fillRect(r()*W,r()*H,2+r()*8,1+r()*3)}
  else if(gm==='ok'){x.fillStyle='rgba(215,180,95,.38)';x.fillRect(14,14,W-28,H-28);x.strokeStyle='rgba(120,90,40,.35)';x.lineWidth=0.5;
   for(let i=0;i<140;i++){let X=20+r()*(W-40),Y=20+r()*(H-40);x.beginPath();x.moveTo(X,Y);for(let k=0;k<4;k++){X+=(r()-.5)*24;Y+=(r()-.5)*24;x.lineTo(X,Y)}x.stroke()}}
  else{x.fillStyle=gm==='modern'?'rgba(255,255,255,.55)':'rgba(240,228,190,.5)';x.fillRect(0,0,W,H);x.fillStyle=lin(0,0,W,H,[[0,'rgba(255,255,255,0)'],[.45,'rgba(255,255,255,.45)'],[.55,'rgba(255,255,255,0)']])(x);x.fillRect(0,0,W,H);
   x.fillStyle=gm==='modern'?'rgba(255,255,255,.4)':'rgba(235,215,160,.55)';if(STAMP.perf)stampHoles(p,(cx,cy,rr)=>{x.beginPath();x.arc(cx,cy,rr+3.5,0,7);x.fill()})}
  if(!STAMP.perf){x.globalCompositeOperation='destination-in';x.drawImage(stampView(p,'normal'),0,0,W,H)}
  stampCut(x,p)});
 if(v==='wmbath')return kView(p,v,x=>{stampPaper(x,p,'#2b1d22');x.save();x.globalAlpha=STAMP.perf?.2:1;stampArt(x,p);x.restore();
  x.globalCompositeOperation='source-atop';x.fillStyle=STAMP.perf?'rgba(43,29,34,.0)':'rgba(43,29,34,.82)';x.fillRect(0,0,W,H);x.globalCompositeOperation='source-over';
  const wm=stampMode(p,'wm',STAMP.wm?'ok':'none');
  if(wm==='ok'&&STAMP.wm==='lozenge'){x.save();x.strokeStyle='rgba(0,0,0,.55)';x.lineWidth=2.2;const s=34;for(let k=-H;k<W+H;k+=s){x.beginPath();x.moveTo(k,0);x.lineTo(k+H*0.6,H);x.stroke();x.beginPath();x.moveTo(k,H);x.lineTo(k+H*0.6,0);x.stroke()}x.restore()}
  else if(wm==='ok'||wm==='seam'){const cx=W/2,cy=H*0.47;x.strokeStyle='rgba(0,0,0,.75)';x.lineWidth=3.5;x.beginPath();x.moveTo(cx-26,cy+16);x.lineTo(cx-30,cy-12);x.lineTo(cx-13,cy+2);x.lineTo(cx,cy-20);x.lineTo(cx+13,cy+2);x.lineTo(cx+30,cy-12);x.lineTo(cx+26,cy+16);x.closePath();x.stroke();
   x.beginPath();x.moveTo(cx-26,cy+22);x.lineTo(cx+26,cy+22);x.stroke()}
  if(stampMode(p,'perf','ok')==='added'){const s=STAMP_SEAM();x.save();x.globalCompositeOperation='source-atop';x.fillStyle='rgba(120,100,95,.55)';x.fillRect(0,0,s,H);x.fillStyle='rgba(0,0,0,.8)';x.fillRect(s-1,0,2.5,H);x.restore()}
  stampCut(x,p)});
 if(v==='uv')return kView(p,v,x=>{const u=stampMode(p,'uv','ok');stampPaper(x,p,'#3a2f55');x.save();stampArt(x,p,{filter:'grayscale(1) brightness(.45)'});x.restore();
  x.globalCompositeOperation='source-atop';x.fillStyle=u==='glow'?'rgba(170,200,255,.55)':'rgba(70,40,130,.55)';x.fillRect(0,0,W,H);
  if(u==='glow'){x.fillStyle='rgba(225,240,255,.35)';x.fillRect(0,0,W,H)}
  if(u==='patch'||stampMode(p,'perf','ok')==='added'&&u!=='ok'){x.fillStyle='rgba(205,225,255,.85)';x.fillRect(0,0,STAMP_SEAM(),H)}
  if(u==='over'){x.save();x.shadowColor='rgba(255,210,110,.9)';x.shadowBlur=5;const bx=STAMP.perf?12:0;x.drawImage(stampAux('overg'),bx,bx,W-2*bx,H-2*bx);x.restore()}
  if(u==='cancel'){x.save();x.shadowColor='rgba(255,170,60,.9)';x.shadowBlur=6;stampCross(x,0,H,W,'rgba(255,200,90,.95)');x.restore()}
  x.globalCompositeOperation='source-over';stampCut(x,p)});
 return stampView(p,'normal')}
function stampLive(p){const V=viewportWorld();if(p.x>V.x1||p.x+W<V.x0||p.y>V.y1||p.y+H<V.y0)return;
 if(tool==='perf'&&vw.z>=2.5&&STAMP.perf){ctx.save();ctx.translate(p.x+(W-240)/2,p.y-26);ctx.fillStyle='rgba(250,240,200,.92)';ctx.fillRect(0,0,240,18);ctx.fillStyle='#222';for(let i=0;i<=20;i++)ctx.fillRect(i*12,0,0.6,i%10?6:12);ctx.font='7px system-ui';ctx.fillText('0',1,17);ctx.fillText('1 cm',112,17);ctx.fillText('2 cm',222,17);ctx.restore()}
 if(vw.z<6||curView()!=='normal')return;const pm=stampMode(p,'print',STAMP.print),bx=STAMP.perf?12:0,bw=W-2*bx,bh=H-2*bx;
 ctx.save();ctx.beginPath();ctx.rect(p.x,p.y,W,H);ctx.clip();
 if(pm==='inkjet')noteDots(p,Math.max(V.x0,p.x),Math.max(V.y0,p.y),Math.min(V.x1,p.x+W),Math.min(V.y1,p.y+H));
 else if(pm==='typo'){ctx.globalAlpha=.85;ctx.drawImage(stampAux('rim'),p.x+bx,p.y+bx,bw,bh)}
 else if(pm==='intaglio'){ctx.drawImage(stampAux('relief'),p.x+bx+0.25,p.y+bx+0.25,bw,bh)}
 else if(pm==='litho'){const r=rng(p.seed+5);ctx.fillStyle='rgba(90,60,60,.16)';for(let i=0;i<5000;i++){const X=p.x+r()*W,Y=p.y+r()*H;if(X>V.x0&&X<V.x1&&Y>V.y0&&Y<V.y1)ctx.fillRect(X,Y,0.22,0.22)}}
 if(STAMP.over&&stampMode(p,'over','ok')==='fake'){ctx.globalAlpha=1;ctx.drawImage(stampAux('overd'),p.x+bx,p.y+bx,bw,bh)}
 if(STAMP.id==='pb'&&vw.z>=4){const cm=stampMode(p,'cancel','ok');if(cm==='printed')noteDots(p,Math.max(V.x0,p.x),Math.max(V.y0,p.y),Math.min(V.x1,p.x+W),Math.min(V.y1,p.y+H));
  else if(cm==='ok'){ctx.globalAlpha=.5;ctx.filter='blur(0.4px)';ctx.drawImage(stampAux('red'),p.x+bx,p.y+bx,bw,bh);ctx.filter='none'}}
 ctx.restore()}
function stampArea(p,a,v){const lx=v.cx-p.x,ly=v.cy-p.y;if(lx<0||lx>W||ly<0||ly>H)return false;
 if(a==='perf')return lx<26||lx>W-26||ly<26||ly>H-26;if(a==='design')return lx>20&&lx<W-20&&ly>20&&ly<H-20;
 if(a==='letters')return ly>H*0.8&&(lx<W*0.3||lx>W*0.7);return false}
/* ---------- odczyty ---------- */
function stampObs(p,id){const m=k=>stampMode(p,k,'ok'),pb=STAMP.id==='pb',ng=STAMP.gum==='none';switch(id){
 case'perf':return`Na 2 cm przypada ${fmt(stampGauge(p))} ząbków.`+(m('perf')==='reperf'?' Otwory nierównej wielkości, poszarpane, rozmieszczone nieregularnie.':' Otwory równe i regularne.');
 case'margins':return m('perf')==='added'?'Lewy margines doklejony: cieńszy pasek papieru o innym odcieniu, wzdłuż brzegu rysunku widoczna spoina.':'Brak ząbkowania – brzegi cięte nożyczkami. Marginesy z jednego kawałka papieru, bez spoin.';
 case'wm':{const w=m('wm');if(!STAMP.wm)return'W kąpieli brak znaku wodnego – zgodnie z katalogiem.';
  if(STAMP.wm==='lozenge')return w==='none'?'W kąpieli brak jakiegokolwiek znaku wodnego.':'W kąpieli widoczny znak wodny – siatka rombów na całym znaczku.';
  return w==='none'?'W kąpieli brak jakiegokolwiek znaku wodnego.':w==='seam'?'Widoczna mała korona, ale także pionowa spoina i jaśniejszy pasek doklejonego papieru przy lewym brzegu.':'W kąpieli widoczna jedna mała korona.'}
 case'uv':return{ok:'Papier w UV matowy, ciemnofioletowy – bez wybielaczy optycznych.',glow:'Cały papier świeci jasnoniebiesko – wybielacze optyczne współczesnego papieru.',patch:'Pasek przy lewym brzegu świeci jasno, reszta papieru matowa – doklejony współczesny papier.',cancel:'Kasownik świeci w UV, papier matowy – farba kasownika współczesna.',over:'Papier matowy, ale przedruk świeci żółtawo – farba przedruku jest współczesna.'}[m('uv')];
 case'over':return m('over')==='fake'?'Przedruk płaski, w szarobrązowym odcieniu czerni; litery złożone z rastra drobnych kropek, bez wgniecenia w papier – przedruk dorobiony metodą fotomechaniczną.':STAMP.over.ok;
 case'print':return{intaglio:'Linie farby wypukłe, ostre, z wyraźnym reliefem – druk wklęsły (stalorytniczy).',typo:'Farba wyciśnięta na brzegi kresek – ciemniejsze obwódki: druk typograficzny.',litho:'Farba płaska, bez obwódek i reliefu, drobne ziarno: litografia.',inkjet:'Obraz złożony z kolorowych kropek – druk cyfrowy.'}[stampMode(p,'print',STAMP.print)];
 case'letters':{if(m('letters')==='bad'){const L=stampBadLetters(p);return L[0]>'T'?`Litery w narożnikach: ${L[0]} i ${L[1]} – rząd ${L[0]} nie istnieje (rzędy A–T). Litery mają inny krój niż oryginał.`:`Litery w narożnikach: ${L[0]} i ${L[1]} – kolumna ${L[1]} nie istnieje (kolumny A–L). Litery mają inny krój niż oryginał.`}
  return'Litery w narożnikach: R i A – rząd R, kolumna A. Para możliwa na arkuszu 20 × 12.'}
 case'cancel':return{ok:'Czerwony krzyż maltański odbity ręcznie: nierówny nacisk, tusz wsiąkł w papier.',fake:'Krzyż maltański z ostrymi, równymi krawędziami, tusz leży na powierzchni – kasownik dorobiony.',printed:'Kasownik złożony z kropek rastra, tak jak cały druk – wydrukowany razem ze znaczkiem.'}[m('cancel')];
 case'gum':if(ng)return{ok:'Odwrocie bez gumy, papier matowy – znaczek wydano bez gumy, zgodnie z katalogiem.',regum:'Na odwrociu błyszcząca, jednolita guma – a znaczek wydano bez gumy: guma dorobiona.',modern:'Na odwrociu biała, błyszcząca, nowoczesna guma – a znaczek wydano bez gumy.'}[m('gum')];
  return{ok:'Guma żółtawa, matowa, z drobnymi spękaniami; czubki ząbków bez gumy.',regum:'Guma błyszcząca, jednolita, bez spękań, wchodzi na czubki ząbków.',modern:'Guma biała, błyszcząca, nowoczesna, aż do brzegów ząbków.'}[m('gum')];
 case'colors':return m('colors')==='shade'?(pb?'Czerń z brązowym nalotem, rozjaśniona – inny odcień niż w katalogu.':STAMP.colBad):(pb?'Głęboka czerń – zgodnie z katalogiem.':STAMP.colOk)}}
function stampWhy(p,id){const m=p.m,pb=STAMP.id==='pb';return({perf:()=>m.perf==='reperf'?'Dorobione ząbkowanie – nierówne, poszarpane otwory.':`Ząbkowanie ${fmt(STAMP_G[m.perf])} zamiast ${STAMP.perfTxt}.`,
 margins:()=>'Doklejony margines – spoina i inny papier.',wm:()=>m.wm==='seam'?'Spoina doklejonego papieru widoczna w kąpieli.':`Brak znaku wodnego (${STAMP.wmName||'mała korona'}).`,
 uv:()=>({glow:'Papier świeci w UV – współczesny.',patch:'Doklejony pasek współczesnego papieru świeci w UV.',cancel:'Farba kasownika świeci w UV – współczesna.',over:'Farba przedruku świeci w UV – współczesna.'})[m.uv],
 over:()=>'Podrobiony przedruk – raster kropek, płaska farba w innym odcieniu.',
 print:()=>m.print==='litho'?`Litografia zamiast druku ${pb?'wklęsłego':'typograficznego'}.`:'Druk cyfrowy – faksymile.',
 letters:()=>'Para liter kontrolnych niemożliwa na arkuszu Penny Black.',cancel:()=>m.cancel==='printed'?'Kasownik wydrukowany razem ze znaczkiem.':'Dorobiony kasownik – tusz na powierzchni, ostre krawędzie.',
 gum:()=>STAMP.gum==='none'?'Guma na znaczku wydanym bez gumy.':m.gum==='modern'?'Nowoczesna guma.':'Dorobiona guma – błyszcząca, na czubkach ząbków.',colors:()=>'Odcień farby niezgodny z katalogiem.'}[id]||(()=>''))()}
/* ---------- wybór znaczka ---------- */
function stampSetup(id){STAMP=STAMP_BY[id]||STAMP;const k=KINDS.stamp;k.W=STAMP.W;k.H=STAMP.H;k.wcm=STAMP.W/SPX/10;k.hcm=STAMP.H/SPX/10;
 k.sets=STAMP_SETS[STAMP.id];k.defs=STAMP_DEF_ALL;
 k.profiles=Object.fromEntries(Object.entries(STAMP_PROF_ALL).filter(([,v])=>v.for.includes(STAMP.id)).map(([n,v])=>{const keep=new Set(STAMP_SETS[STAMP.id].flatMap(g=>g[1]).map(t=>t==='margins'?'perf':t)),
  f=a=>a.filter(t=>keep.has(t)&&!(t==='perf'&&!STAMP.perf&&v.modes.perf!=='added'));return[n,Object.assign({},v,{core:f(v.core),opt:f(v.opt)})]}))}
async function stampPick(r){const el=document.getElementById('artist'),v=el.value;const id=el.dataset.mode!=='stamp'?'pb':STAMP_BY[v]?v:STAMPS[Math.floor(r()*STAMPS.length)].id;
 await loadReal(STAMP_BY[id].img);stampSetup(id)}
const stampCat=()=>`${STAMP.name} (${STAMP.country}, ${STAMP.year}). Katalog: ${STAMP.cat}.`;
registerKind({id:'stamp',label:'Weryfikacja znaczków',noun:'Znaczek',W:261,H:291,wcm:2.175,hcm:2.425,tilt:false,focusLabel:'Narożnik',
 defs:STAMP_DEF_ALL,sets:STAMP_SETS.pb,profiles:STAMP_PROF_ALL,originals:r=>Object.keys(KINDS.stamp.profiles).length>=4?1+Math.floor(r()*3):2+Math.floor(r()*2),
 pick:stampPick,wikiVariants:['pb','pl1','w10','pz10','or50'],wikiSetup(id){const s=STAMP_BY[id]||STAMPS[0];if(REALIM[s.img])stampSetup(s.id)},
 wikiSets:[['1. Papier',['perf','margins','wm','uv','gum']],['2. Druk',['print','letters','over','colors']],['3. Obieg',['cancel']]],wikiProfiles:STAMP_PROF_ALL,newGame(r){if(!stampImg())stampSetup(STAMP.id);kindBatch(this,r)},view:stampView,live:stampLive,area:stampArea,obs:stampObs,why:stampWhy,
 focus:p=>[p.x,p.y+H*0.75,W,H*0.25],
 get intro(){return`Na stole leży 5 znaczków ${STAMP.name}. Część jest prawdziwa, część fałszywa albo przerobiona. Zbadaj papier, znak wodny, druk pod mikroskopem i pozostałe cechy z katalogu. Na checkliście każdego znaczka zaznacz sygnały fałszerstwa i zakończ ekspertyzę.`},
 caseText:()=>`Weryfikacja znaczków: ${stampCat()} Zdjęcie oryginału: Wikimedia Commons (domena publiczna); podróbki i wyniki badań symuluje gra.`});
Object.assign(AREA,{perf:'środek widoku na brzegu znaczka',design:'środek widoku na rysunku znaczka',letters:'środek widoku na dolnym narożniku z literą'});
Object.assign(VIEWNAME,{wmbath:'kąpiel w płynie do znaków wodnych',uv:VIEWNAME.uv||'lampa UV',back:VIEWNAME.back});
/* zdjęcia znaczków potrzebne też ilustracjom wiki */
setTimeout(()=>STAMPS.forEach(s=>loadReal(s.img).catch(()=>{})),1500);
