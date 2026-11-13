"use strict";
/* =====================================================================
   PRACE NA PAPIERZE – dwa rodzaje z technikami z ArtKit (laboratorium sztuki GameLaboratory):
   „Rysunki i grafiki” (ołówek, tusz, węgiel, miedzioryt) oraz „Akwarele i pastele”.
   Obraz pracy rysuje ArtKit (js/lab/artkit.js); papier, widoki i zdrady – ten plik.
   Oryginałem jest zawsze dzieło prawdziwe (REAL_CUR, js/core/real.js); fikcyjnych artystów usunięto w 1.35.
   ===================================================================== */
const PW_TECH={
 pencil:{label:'ołówek',full:'Rysunek ołówkiem',mat:'grafit',matObs:'Węgiel (grafit) z glinką – typowy sztyft grafitowy z epoki.',subj:'landscape',title:'Pejzaż z rzeką i mostem',kind:'drawing'},
 ink:{label:'tusz',full:'Rysunek piórem i tuszem',mat:'atrament',matObs:'Żelazo i siarka – atrament żelazowo-galasowy, zbrązowiały na brzegach linii.',subj:'still',title:'Martwa natura z dzbanem',kind:'drawing'},
 charcoal:{label:'węgiel',full:'Rysunek węglem',mat:'węgiel',matObs:'Czysty węgiel drzewny, ślady fiksatywy z kazeiny (Ca, P).',subj:'landscape',title:'Drzewa nad stawem',kind:'drawing'},
 engraving:{label:'miedzioryt',full:'Miedzioryt (rytownictwo)',mat:'farba drukowa',matObs:'Sadza w oleju lnianym; w odciśniętej farbie śladowa miedź z płyty.',subj:'still',title:'Martwa natura z owocami',kind:'drawing'},
 watercolor:{label:'akwarela',full:'Akwarela',mat:'pigmenty',matObs:'Ultramaryna, ochra, siena, czerń kostna – pigmenty dostępne w epoce.',subj:'landscape',title:'Jezioro pod chmurami',kind:'water'},
 pastel:{label:'pastel suchy',full:'Pastel suchy',mat:'pigmenty',matObs:'Biel ołowiowa, ochra, cynober, ultramaryna w kredzie – pigmenty z epoki.',subj:'still',title:'Wazon z kwiatami',kind:'water'},
};
const PW_DEF={
 paper:{name:'Papier pod światło',view:'trans',gate:{z:1.5,area:'all'},hint:'Pod światło papier czerpany pokazuje gęste linie żeberkowe, rzadsze linie sita i znak wodny. Papier maszynowy (welinowy) jest jednolicie chmurkowaty. Imitacja ma linie nadrukowane – widoczne także w świetle dziennym.'},
 uvp:{name:'Papier w UV',view:'uv',gate:{z:1.2,area:'all'},hint:'Stary papier w UV jest matowy, żółtobrązowy, z jaśniejszymi plamami zażółceń (foxing). Papier z wybielaczami optycznymi (od lat 50. XX w.) świeci jasnoniebiesko.'},
 back:{name:'Odwrocie (znaki kolekcji)',view:'back',gate:{z:2,area:'all'},hint:'Na odwrociu szukaj stempli kolekcji, numerów inwentarzowych i śladów dawnych opraw. Stempel podrobiony ma świeży, fioletowy tusz i ostre krawędzie; brak znaków przy deklarowanej historii to sygnał ostrzegawczy.'},
 micro:{name:'Struktura kreski (mikroskop)',view:'normal',gate:{z:6,area:'pwdesign'},hint:'Przy zoomie ≥ ×6: grafit i węgiel zostawiają ziarna na grzbietach papieru, tusz wsiąka i ma postrzępione brzegi, miedzioryt ma linie zwężające się na końcach. Druk cyfrowy to kolorowe kropki, a reprodukcja fotomechaniczna – regularne ziarno rastra.'},
 relief:{name:'Odcisk i relief (światło boczne)',view:'raking',gate:{z:2,area:'all'},hint:'W świetle bocznym widać wgniecenia narzędzia w papier, a w miedziorycie – odcisk krawędzi płyty i wypukłe linie farby. Druk cyfrowy jest płaski. Przerys przez kalkę zostawia dodatkowe, puste rowki obok linii.'},
 line:{name:'Płynność kreski',view:'normal',gate:{z:3,area:'pwdesign'},hint:'Przybliż kluczowy fragment (≥ ×3). Ręka autora prowadzi linię szybko i pewnie: linia zmienia grubość, zaczyna się i kończy lekko. Kopista rysuje wolno – linia jest równa, drżąca, z poprawkami.'},
 xrf:{name:'Materiał (XRF)',view:'normal',gate:{z:3,area:'pwdesign'},hint:'Przyłóż spektrometr do linii (≥ ×3). Porównaj skład z materiałem z epoki: grafit, atrament żelazowo-galasowy, węgiel, farba drukowa z sadzy, pigmenty z datami wprowadzenia.'},
 fade:{name:'Granica oprawy (blaknięcie)',view:'normal',gate:{z:1.5,area:'edge'},hint:'Praca, która latami wisiała w passe-partout, ma pod nim pas papieru jaśniejszy i barwy mocniejsze niż w oknie oprawy. Kopia jest wyblakła równo albo wcale.'},
};
const PW_SET_DRAW=[['1. Papier',['paper','uvp','back']],['2. Kreska i technika',['micro','relief','line']],['3. Materiał',['xrf']]];
const PW_SET_WATER=[['1. Papier',['paper','uvp','back']],['2. Farba i technika',['micro','relief','fade']],['3. Materiał',['xrf']]];
const PW_PROF_DRAW={
 facs:{name:'Faksymile – druk cyfrowy na współczesnym papierze',core:['micro','paper','relief'],opt:['uvp','back'],modes:{micro:'inkjet',paper:'wove',relief:'flat',uvp:'bright',back:'none'}},
 trace:{name:'Przerys przez kalkę na współczesnym papierze',core:['line','paper','relief'],opt:['uvp','xrf'],modes:{line:'slow',paper:'wove',relief:'traced',uvp:'bright',xrf:'modern'}},
 oldpaper:{name:'Kopia na czystej karcie papieru z epoki',core:['xrf','line'],opt:['back','relief'],modes:{xrf:'modern',line:'slow',back:'forged',relief:'traced'}},
 photo:{name:'Reprodukcja fotomechaniczna na papierze z nadrukiem linii sita',core:['micro','paper','relief'],opt:['xrf','uvp'],modes:{micro:'screen',paper:'imitation',relief:'flat',xrf:'modern',uvp:'bright'}},
};
const PW_PROF_WATER={
 facs:{name:'Giclée – druk cyfrowy na papierze akwarelowym',core:['micro','relief','paper'],opt:['uvp','fade'],modes:{micro:'inkjet',relief:'flat',paper:'wove',uvp:'bright',fade:'none'}},
 modern:{name:'Współczesna kopia nowymi farbami',core:['xrf','paper','uvp'],opt:['fade','back'],modes:{xrf:'modern',paper:'wove',uvp:'bright',fade:'none',back:'none'}},
 oldpaper:{name:'Kopia na papierze z epoki nowymi farbami',core:['xrf','fade'],opt:['back'],modes:{xrf:'modern',fade:'none',back:'forged'}},
 collector:{name:'Kopia z podrobionym znakiem kolekcji',core:['back','fade'],opt:['xrf','micro'],modes:{back:'forged',fade:'none',xrf:'modern',micro:'inkjet'}},
};
const PW_W=600,PW_H=470,PW_ART={};
const pwMode=(p,id,def)=>p.t[id]?p.m[id]:def;
/* papier oryginału: czerpany, a dla dzieła prawdziwego na papierze maszynowym (np. Wyspiański 1902) – welinowy */
const pwPaper=p=>p.kind.cur.real&&p.kind.cur.real.paper==='wove'?'wove':'laid';
/* obraz pracy z ArtKit – jeden na partię (oryginał) i jeden dla kopii ręcznych (inne ziarno pociągnięć) */
function pwArt(k,hand){const key=(k.cur.real?k.cur.real.slug:k.cur.tech)+'|'+k.cur.seed+'|'+(hand?1:0)+'|'+IW;if(PW_ART[key])return PW_ART[key];const T=PW_TECH[k.cur.tech];
 if(k.cur.real){const im=REALIM[k.cur.real.slug];let c;/* oryginał = reprodukcja dzieła; kopia ręczna = ten sam obraz przerysowany techniką ArtKit */
  c=mk(IW,IH);const x=c.getContext('2d');
  if(!hand)x.drawImage(im,0,0,IW,IH);
  else{/* kopia ręczna: najdrobniejsze linie się zlewają (mniejsza rozdzielczość), pasy obrazu lekko przesunięte – kopista prowadzi kreskę wolniej i nierówno */
   const lo=mk(Math.round(IW*0.45),Math.round(IH*0.45));lo.getContext('2d').drawImage(im,0,0,lo.width,lo.height);const r=rng(k.cur.seed+17),B=24;
   x.fillStyle='#ece3cf';x.fillRect(0,0,IW,IH);x.filter='contrast(1.06) sepia(0.12)';for(let y=0;y<IH;y+=B){const dx=(r()-.5)*3;x.drawImage(lo,0,y*lo.height/IH,lo.width,B*lo.height/IH,dx,y,IW,B)}x.filter='none'}
  if(Object.keys(PW_ART).length>8)for(const q in PW_ART)delete PW_ART[q];return PW_ART[key]=c}
 const spec={size:Math.max(IW,IH),aspect:IW/IH,seed:k.cur.seed+(hand?17:0),subject:T.subj,palette:T.kind==='water'?'natural':'cool',technique:k.cur.tech,surface:'paper',relief:0.25,light:135,varnish:0,cracks:0,age:0,stroke:hand?1.08:1,detail:(T.kind==='water'?1:0.7)*(hand?0.85:1)};
 let c=window.ArtKit?ArtKit.render(spec).canvas:null;if(!c){c=mk(IW,IH);const x=c.getContext('2d');x.fillStyle='#ece4d2';x.fillRect(0,0,IW,IH)}
 if(Object.keys(PW_ART).length>8)for(const q in PW_ART)delete PW_ART[q];return PW_ART[key]=c}
function pwPaperTone(x,old,r){x.save();x.globalCompositeOperation='multiply';x.fillStyle=old?'rgb(244,228,196)':'rgb(252,252,250)';x.fillRect(0,0,W,H);x.restore();
 if(old)for(let i=0;i<26;i++){x.fillStyle=`rgba(150,95,40,${.05+r()*.12})`;x.beginPath();x.arc(r()*W,r()*H,1+r()*4,0,7);x.fill()}}
function pwView(p,v){const k=p.kind,hand=p.profile==='trace'||p.profile==='oldpaper'||p.profile==='modern';
 if(v==='normal')return kView(p,v,(x,c)=>{const r=rng(p.seed+3),old=pwMode(p,'uvp','old')==='old';x.save();x.setTransform(1,0,0,1,0,0);x.drawImage(pwArt(k,hand),0,0,IW,IH);
   if(pwMode(p,'micro','hand')==='inkjet'||pwMode(p,'micro','hand')==='screen'){x.filter='blur(0.6px)';x.drawImage(c,0,0);x.filter='none'}x.restore();
  if(!k.cur.real)pwPaperTone(x,old,r);if(pwMode(p,'paper',pwPaper(p))==='imitation'){x.strokeStyle='rgba(120,100,70,.12)';x.lineWidth=0.4;for(let y=0;y<H;y+=1.6){x.beginPath();x.moveTo(0,y);x.lineTo(W,y);x.stroke()}}
  if(k.id==='water'){const f=pwMode(p,'fade','faded');if(f==='faded'){x.fillStyle='rgba(250,244,228,.16)';x.fillRect(42,42,W-84,H-84)}}
  if(k.cur.tech==='engraving'&&!k.cur.real){x.strokeStyle='rgba(60,50,40,.35)';x.lineWidth=0.8;x.strokeRect(22,22,W-44,H-44)}});
 if(v==='trans')return kView(p,v,x=>{const r=rng(p.seed+5),pm=pwMode(p,'paper',pwPaper(p));x.fillStyle=pm==='wove'?'#f0e6c8':'#ecd9a8';x.fillRect(0,0,W,H);
  for(let i=0;i<60;i++){x.fillStyle=`rgba(120,90,40,${r()*.08})`;x.beginPath();x.ellipse(r()*W,r()*H,8+r()*30,6+r()*20,r()*3,0,7);x.fill()}
  if(pm==='laid'){x.strokeStyle='rgba(255,252,235,.55)';x.lineWidth=0.5;for(let y=0;y<H;y+=1.4){x.beginPath();x.moveTo(0,y+(r()-.5)*.3);x.lineTo(W,y);x.stroke()}x.strokeStyle='rgba(110,80,40,.35)';x.lineWidth=1.4;for(let X=18;X<W;X+=24){x.beginPath();x.moveTo(X,0);x.lineTo(X+(r()-.5)*1.5,H);x.stroke()}
   x.save();x.translate(W*0.72,H*0.5);x.strokeStyle='rgba(255,252,235,.7)';x.lineWidth=2.4;x.beginPath();x.moveTo(-18,24);x.lineTo(-22,-4);x.lineTo(-10,8);x.lineTo(0,-16);x.lineTo(10,8);x.lineTo(22,-4);x.lineTo(18,24);x.closePath();x.stroke();x.font='bold 13px Georgia';x.textAlign='center';x.fillStyle='rgba(255,252,235,.7)';x.fillText('J W',0,44);x.restore()}
  else if(pm==='imitation'){x.strokeStyle='rgba(90,70,40,.22)';x.lineWidth=0.4;for(let y=0;y<H;y+=1.6){x.beginPath();x.moveTo(0,y);x.lineTo(W,y);x.stroke()}}
  x.save();x.globalCompositeOperation='multiply';x.globalAlpha=.55;x.setTransform(1,0,0,1,0,0);x.drawImage(pwView(p,'normal'),0,0);x.restore()});
 if(v==='uv')return kView(p,v,x=>{const r=rng(p.seed+7),bright=pwMode(p,'uvp','old')==='bright';x.fillStyle=bright?'#b9c6ff':'#3a2c3a';x.fillRect(0,0,W,H);
  if(!bright)for(let i=0;i<30;i++){x.fillStyle=`rgba(200,190,120,${.08+r()*.15})`;x.beginPath();x.arc(r()*W,r()*H,2+r()*6,0,7);x.fill()}
  x.save();x.globalCompositeOperation='multiply';x.globalAlpha=.75;x.setTransform(1,0,0,1,0,0);x.drawImage(pixMap(pwView(p,'normal'),l=>{const q=40+l*0.8;return[q,q*0.9,q*1.1]}),0,0);x.restore()});
 if(v==='back')return kView(p,v,x=>{const r=rng(p.seed+9),old=pwMode(p,'uvp','old')==='old',bm=pwMode(p,'back','ok');x.fillStyle=old?'#e2d3ad':'#f4f1ea';x.fillRect(0,0,W,H);pwPaperTone(x,old,r);
  x.save();x.globalAlpha=.07;x.translate(W,0);x.scale(-1,1);x.drawImage(pwView(p,'normal'),0,0,W,H);x.restore();
  if(old){x.fillStyle='rgba(120,90,50,.18)';x.fillRect(0,0,W,16);x.fillRect(0,0,16,H)}
  if(bm==='ok'||bm==='forged'){x.save();x.translate(W*0.2,H*0.78);x.rotate(-0.08);x.strokeStyle=bm==='ok'?'rgba(70,40,30,.65)':'rgba(110,40,200,.85)';x.lineWidth=bm==='ok'?1.6:2.2;
   x.beginPath();x.ellipse(0,0,34,22,0,0,7);x.stroke();x.fillStyle=x.strokeStyle;x.font=(bm==='ok'?'italic ':'')+'bold 11px Georgia';x.textAlign='center';x.fillText('Coll. K.Z.',0,4);x.restore();
   if(bm==='ok'){x.fillStyle='rgba(60,40,30,.6)';x.font='10px Georgia';x.fillText('inw. '+(1200+p.kind.cur.seed%700),W*0.62,H*0.86)}}});
 if(v==='raking')return kView(p,v,(x,c)=>{const hm=mk(IW,IH),h=hm.getContext('2d'),rm=pwMode(p,'relief',k.cur.tech==='engraving'?'plate':'indent'),r=rng(p.seed+11);
  h.fillStyle='#808080';h.fillRect(0,0,IW,IH);h.scale(S,S);for(let i=0;i<9000;i++){h.fillStyle=`rgba(${r()<.5?255:0},${r()<.5?255:0},${r()<.5?255:0},.05)`;h.fillRect(r()*W,r()*H,1.2,1.2)}
  if(rm!=='flat'){h.save();h.setTransform(1,0,0,1,0,0);h.globalCompositeOperation='multiply';h.globalAlpha=rm==='plate'?.55:.35;h.drawImage(pixMap(pwView(p,'normal'),l=>{const q=Math.min(255,l*1.15+40);return[q,q,q]}),0,0);h.restore()}
  if(rm==='plate'){h.strokeStyle='rgba(30,30,30,.9)';h.lineWidth=2.4;h.strokeRect(22,22,W-44,H-44);h.strokeStyle='rgba(255,255,255,.6)';h.lineWidth=1.4;h.strokeRect(24,24,W-48,H-48)}
  if(rm==='traced'){h.strokeStyle='rgba(20,20,20,.55)';h.lineWidth=0.9;const sh=p.shapes||(p.shapes=Array.from({length:22},()=>{const a=[r()*W,r()*H];return[a,[a[0]+(r()-.5)*90,a[1]+(r()-.5)*70]]}));
   for(const[a,b]of sh){h.beginPath();h.moveTo(a[0]+3,a[1]+2);h.lineTo(b[0]+3,b[1]+2);h.stroke()}}
  h.setTransform(1,0,0,1,0,0);x.save();x.setTransform(1,0,0,1,0,0);x.drawImage(embossFrom(hm,pwView(p,'normal')),0,0);x.restore()});
 return pwView(p,'normal')}
/* mikroskop – na żywo przy dużym zoomie */
function pwLive(p){if(vw.z<6)return;const V=viewportWorld(),x0=Math.max(V.x0,p.x+40),y0=Math.max(V.y0,p.y+40),x1=Math.min(V.x1,p.x+W-40),y1=Math.min(V.y1,p.y+H-40);if(x0>=x1||y0>=y1)return;
 const mm=pwMode(p,'micro','hand'),tech=p.kind.cur.tech,T=4;ctx.save();ctx.beginPath();ctx.rect(x0,y0,x1-x0,y1-y0);ctx.clip();
 if(mm==='inkjet'){p.m.print='inkjet';noteDots(p,x0,y0,x1,y1)}
 else for(let ty=Math.floor((y0-p.y)/T);ty*T<y1-p.y;ty++)for(let tx=Math.floor((x0-p.x)/T);tx*T<x1-p.x;tx++){const r=rng(p.seed^Math.imul(tx,73856093)^Math.imul(ty,19349663)),bx=tx*T,by=ty*T,[R,Gc,B]=pix(p,bx+T/2,by+T/2),X=p.x+bx,Y=p.y+by,dark=(R+Gc+B)/3<185;
  if(mm==='screen'){ctx.fillStyle='rgba(240,232,214,.6)';ctx.fillRect(X,Y,T,T);ctx.fillStyle=`rgba(${R*0.5|0},${Gc*0.5|0},${B*0.5|0},.85)`;const s=Math.max(0.05,(1-(R+Gc+B)/765)*0.9);for(let a=0;a<2;a++)for(let b=0;b<2;b++){ctx.beginPath();ctx.arc(X+1+a*2,Y+1+b*2,s,0,7);ctx.fill()}continue}
  if(!dark&&tech!=='watercolor')continue;
  if(tech==='pencil'||tech==='charcoal'||tech==='pastel'){for(let i=0;i<(tech==='pencil'?7:12);i++){const g=tech==='pastel'?`rgba(${R},${Gc},${B},.8)`:tech==='pencil'?'rgba(70,70,78,.75)':'rgba(20,18,16,.8)';ctx.fillStyle=g;ctx.fillRect(X+r()*T,Y+r()*T,0.12+r()*0.35,0.1+r()*0.25)}}
  else if(tech==='ink'){ctx.strokeStyle='rgba(90,55,25,.35)';ctx.lineWidth=0.08;for(let i=0;i<4;i++){const sx=X+r()*T,sy=Y+r()*T;ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(sx+(r()-.5)*0.8,sy+(r()-.5)*0.8);ctx.stroke()}}
  else if(tech==='engraving'){ctx.fillStyle='rgba(15,12,10,.55)';ctx.beginPath();ctx.ellipse(X+T/2,Y+T/2,T*0.5,0.2+r()*0.15,0.1,0,7);ctx.fill()}
  else if(tech==='watercolor'){ctx.fillStyle=`rgba(${R-25},${Gc-25},${B-25},.35)`;for(let i=0;i<5;i++){ctx.beginPath();ctx.arc(X+r()*T,Y+r()*T,0.1+r()*0.18,0,7);ctx.fill()}}}
 ctx.restore()}
function pwArea(p,a,v){const lx=v.cx-p.x,ly=v.cy-p.y;if(lx<0||lx>W||ly<0||ly>H)return false;if(a==='all')return true;if(a==='pwdesign')return lx>50&&lx<W-50&&ly>50&&ly<H-50;
 if(a==='edge'){const d=Math.min(lx,ly,W-lx,H-ly);return d>20&&d<70}return false}
function pwObs(p,id){const T=PW_TECH[p.kind.cur.tech],m=(k,d)=>pwMode(p,k,d);switch(id){
 case'paper':return{laid:'Pod światło: gęste linie żeberkowe, co ok. 2,5 cm linie sita i znak wodny – korona z literami „J W”. Papier czerpany.',wove:'Pod światło papier jednolicie chmurkowaty, bez linii sita i bez znaku wodnego – papier maszynowy.',imitation:'Pod światło linie są, ale bardzo równe i bez linii sita; te same linie widać w świetle dziennym – nadrukowane.'}[m('paper',pwPaper(p))];
 case'uvp':return m('uvp','old')==='old'?'W UV papier matowy, żółtobrązowy, z jaśniejszymi plamkami zażółceń (foxing).':'W UV papier świeci jasnoniebiesko – wybielacze optyczne.';
 case'back':return{ok:'Na odwrociu stempel kolekcji „Coll. K.Z.” (owal, wyblakły brązowy tusz) i numer inwentarzowy; ślady dawnego podklejenia na brzegach.',forged:'Stempel „Coll. K.Z.” w świeżym, fioletowym tuszu anilinowym, ostry, bez śladów starzenia.',none:'Odwrocie czyste – brak stempli kolekcji i numerów, choć proweniencja je wymienia.'}[m('back','ok')];
 case'micro':return{hand:{pencil:'Ziarna grafitu na grzbietach papieru, połysk pod kątem; linia zmienia gęstość z naciskiem.',ink:'Tusz wsiąka w papier, brzegi linii postrzępione, na końcach pociągnięć więcej tuszu.',charcoal:'Czarne cząstki węgla na grzbietach ziarna papieru, zagłębienia jasne.',engraving:'Linie zwężają się ostro na końcach (cięcie rylcem), farba wypukła.',watercolor:'Ziarna pigmentu osiadłe w zagłębieniach papieru, ciemniejsze obwódki plam.',pastel:'Luźne cząstki pigmentu na grzbietach ziarna papieru.'}[p.kind.cur.tech],inkjet:'Obraz z kolorowych kropek (cyjan, magenta, żółty, czarny) – druk atramentowy.',screen:'Regularne ziarno rastra w jednakowych odstępach – reprodukcja fotomechaniczna.'}[m('micro','hand')];
 case'relief':return{plate:'Odcisk krawędzi płyty wokół obrazu, linie farby wypukłe.',indent:'Delikatne wgniecenia narzędzia wzdłuż linii.',flat:'Powierzchnia płaska – brak wgnieceń narzędzia'+(p.kind.cur.tech==='engraving'?' i odcisku płyty.':'.'),traced:'Obok linii rysunku puste, równe rowki – ślady rysika przy przenoszeniu przez kalkę.'}[m('relief',p.kind.cur.tech==='engraving'?'plate':'indent')];
 case'line':return m('line','free')==='free'?'Linia szybka i pewna: zmienia grubość, zaczyna się i kończy lekko, bez poprawek.':'Linia wolna, równej grubości, miejscami drżąca, z poprawkami i dostawianiem pióra.';
 case'xrf':return m('xrf','ok')==='ok'?T.matObs:{pencil:'Grafit z polimerowym spoiwem – współczesny ołówek.',ink:'Brak żelaza – współczesny tusz barwnikowy.',charcoal:'Węgiel prasowany ze spoiwem syntetycznym.',engraving:'Farba z sadzy w spoiwie alkidowym (XX w.).',watercolor:'Błękit ftalocyjaninowy (od 1935 r.) i biel tytanowa (od 1921 r.).',pastel:'Biel tytanowa (od 1921 r.) i czerwień chinakrydonowa (od 1958 r.).'}[p.kind.cur.tech];
 case'fade':return m('fade','faded')==='faded'?'Pod brzegiem dawnego passe-partout papier jaśniejszy, barwy mocniejsze niż w oknie oprawy – praca długo wisiała na świetle.':'Brak granicy dawnej oprawy – barwy równe na całym arkuszu.'}}
function pwWhy(p,id){const m=p.m;return({paper:()=>m.paper==='imitation'?'Linie sita nadrukowane – imitacja papieru czerpanego.':'Papier maszynowy zamiast czerpanego.',uvp:()=>'Wybielacze optyczne – papier po 1950 r.',
 back:()=>m.back==='forged'?'Podrobiony stempel kolekcji – świeży tusz anilinowy.':'Brak znaków kolekcji wymienionej w proweniencji.',micro:()=>m.micro==='inkjet'?'Druk atramentowy zamiast rysunku.':'Raster reprodukcji fotomechanicznej.',
 relief:()=>m.relief==='traced'?'Puste rowki po rysiku – przerys przez kalkę.':'Brak wgnieceń narzędzia i odcisku płyty – druk płaski.',line:()=>'Wolna, drżąca linia kopisty.',xrf:()=>'Materiał współczesny, niedostępny w epoce.',fade:()=>'Brak granicy dawnej oprawy – praca nie była wystawiana na światło.'}[id]||(()=>''))()}
function pwKind(id,label,noun,techs,defs,sets,profiles){return{id,label,noun,group:'art',W:PW_W,H:PW_H,wcm:30,hcm:23.5,techs,tilt:false,focusLabel:'Detal',defs,sets,profiles,cur:{tech:techs[0],seed:1,art:{name:'—',life:'—',year:1850},title:PW_TECH[techs[0]].title},
 originals:r=>1,
 newGame(r){const R=REAL_CUR&&REAL_CUR.mode===id?REAL_CUR:REAL.find(e=>e.mode===id&&REALIM[e.slug])||null;
  if(R){const im=REALIM[R.slug],a=im.width/im.height;this.W=a>=1?600:Math.round(560*a);this.H=a>=1?Math.round(600/a):560;this.wcm=R.wcm||Math.round(this.W/20);this.hcm=R.hcm||Math.round(this.H/20);
   this.cur={tech:R.kindTech,seed:1+(r()*1e6|0),art:{name:R.artist,life:R.life,year:R.year},title:R.title,real:R}}
  else{this.W=PW_W;this.H=PW_H;this.wcm=30;this.hcm=23.5;const tech=pick(techs,r);this.cur={tech,seed:1+(r()*1e6|0),art:{name:'—',life:'—',year:1850}};this.cur.title=PW_TECH[tech].title}
  const tech=this.cur.tech;
  kindBatch(this,r);
  if(R&&R.paper==='wove')for(const p of P)if(p.t.paper){delete p.t.paper;delete p.m.paper}/* oryginał też na papierze maszynowym – papier nie jest zdradą */
  if(tech==='engraving'){const extra=P.find(p=>!p.orig&&p.profile==='oldpaper');if(extra&&r()<0.5){extra.orig=true;extra.profile=null;extra.t={};extra.m={}}}},
 view:pwView,live:pwLive,area:pwArea,obs:pwObs,why:pwWhy,focus:p=>[p.x+W*0.35,p.y+H*0.3,W*0.3,H*0.3],
 get intro(){const c=this.cur,T=PW_TECH[c.tech];if(c.real)return`Na stole leżą arkusze: ${c.real.tech} „${c.title}” – ${c.art.name} (${c.art.life}), ${c.art.year}. Jeden to oryginał (reprodukcja dzieła), pozostałe to kopie zrobione przez grę. Sprawdź papier pod światło i w UV, odwrocie, `+(this.id==='water'?'strukturę farby, relief, granicę dawnej oprawy':'strukturę i relief kreski, jej płynność')+` oraz materiał. Na checkliście każdego arkusza zaznacz sygnały fałszerstwa. Wyniki badań, znak wodny i stempel kolekcji są symulowane.`;return`Na stole leżą arkusze: ${T.full.toLowerCase()} „${c.title}” – ${c.art.name} (${c.art.life}), ${c.art.year}. Oryginał na papierze czerpanym, z kolekcji K.Z. Sprawdź papier pod światło i w UV, odwrocie, `+(this.id==='water'?'strukturę farby, relief, granicę dawnej oprawy':'strukturę i relief kreski, jej płynność')+` oraz materiał. Na checkliście każdego arkusza zaznacz sygnały fałszerstwa.`},
 caseText(){const c=this.cur,T=PW_TECH[c.tech];if(c.real){const e=c.real;return`Dzieło prawdziwe: „${e.title}” – ${e.artist} (${e.life}), ${e.year}, ${e.tech}${e.wcm?`, ok. ${fmt(e.hcm)} × ${fmt(e.wcm)} cm`:''}, ${e.museum}. Na stole ${P.length||5} arkuszy: reprodukcja oryginału i kopie zrobione przez grę. Wyniki badań są symulowane.`}return`Sprawa: ${T.full} „${c.title}” – ${c.art.name} (${c.art.life}), ${c.art.year}, ${T.label} na papierze czerpanym, 30 × 23,5 cm, stempel kolekcji K.Z. na odwrociu. Na stole ${P.length||5} arkuszy. (Artyści i dzieła są fikcyjni.)`}}}
registerKind(pwKind('drawing','Rysunki i grafiki','Arkusz',['pencil','ink','charcoal','engraving'],Object.fromEntries(Object.entries(PW_DEF).filter(([k])=>k!=='fade')),PW_SET_DRAW,PW_PROF_DRAW));
registerKind(pwKind('water','Akwarele i pastele','Arkusz',['watercolor','pastel'],Object.fromEntries(Object.entries(PW_DEF).filter(([k])=>k!=='line')),PW_SET_WATER,PW_PROF_WATER));
Object.assign(AREA,{pwdesign:'środek widoku na rysunku',edge:'środek widoku przy brzegu arkusza (dawne passe-partout)'});
