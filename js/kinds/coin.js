"use strict";
/* =====================================================================
   MONETY OBIEGOWE – prawdziwe parametry (NBP, rozporządzenie Rady UE 975/98),
   wizerunki rysowane przez grę (uproszczone).
   1 zł (od 2020 r.), 2 zł, 5 zł, 1 € i 2 € (strona wspólna + strona niemiecka).
   Na planszy: awers (lewa) i rewers (prawa); widok „rant” pokazuje rozwinięcie rantu.
   ===================================================================== */
const PPMM=280/25.75;                         // piksele na milimetr (2 € ma promień 140 px)
const CO={R:140,u:1,A:[160,160],B:[480,160]};
const COIN_ALLOY={
 cuni:'Cu 75%, Ni 25% – miedzionikiel (MN25)',
 albr:'Cu ok. 92%, Al ok. 6%, Ni ok. 2% – brązal (CuAl6Ni2)',
 nibr:'Cu 75%, Zn 20%, Ni 5% – mosiądz niklowy (CuZn20Ni5)',
 ste1:'Ni w powłoce, pod nią Cu i Fe – stal powlekana miedzią i niklem',
 e1core:'Cu 75%, Ni 25% na powierzchni, w środku warstwa niklu – rdzeń trójwarstwowy',
 e2core:'Cu 75%, Zn 20%, Ni 5% na powierzchni, w środku warstwa niklu – rdzeń trójwarstwowy'};
/* white/yellow: barwa części; core: promień rdzenia (mm) lub 0 dla monety jednolitej */
const COINS=[
 {id:'pln1',name:'1 złoty',country:'Polska, NBP',D:23.00,g:5.00,core:0,ring:'w',ringA:'ste1',magnet:'strong',edge:'interrupted',years:[2020,2025],obv:'pl',rev:'pl1',
  cat:'stal powlekana miedzią i niklem (od 2020 r.)'},
 {id:'pln2',name:'2 złote',country:'Polska, NBP',D:21.50,g:5.21,core:12,ring:'y',coreC:'w',ringA:'albr',coreA:'cuni',magnet:'none',edge:'plain',years:[2010,2025],obv:'pl',rev:'pl2',
  cat:'pierścień brązal, rdzeń miedzionikiel'},
 {id:'pln5',name:'5 złotych',country:'Polska, NBP',D:24.00,g:6.54,core:16,ring:'w',coreC:'y',ringA:'cuni',coreA:'albr',magnet:'none',edge:'irregular',years:[2010,2025],obv:'pl',rev:'pl5',
  cat:'pierścień miedzionikiel, rdzeń brązal'},
 {id:'eur1',name:'1 euro',country:'Niemcy, strona narodowa',D:23.25,g:7.50,core:16.25,ring:'y',coreC:'w',ringA:'nibr',coreA:'e1core',magnet:'weak',edge:'interrupted',years:[2008,2025],obv:'de',rev:'eu1',
  cat:'pierścień mosiądz niklowy, rdzeń trójwarstwowy z niklem'},
 {id:'eur2',name:'2 euro',country:'Niemcy, strona narodowa',D:25.75,g:8.50,core:18.75,ring:'w',coreC:'y',ringA:'cuni',coreA:'e2core',magnet:'weak',edge:'lettered',years:[2008,2025],obv:'de',rev:'eu2',
  cat:'pierścień miedzionikiel, rdzeń trójwarstwowy z niklem'}];
const COIN_BY=Object.fromEntries(COINS.map(c=>[c.id,c]));
let COIN=COINS[2];
const EDGE_TXT={plain:'gładki',interrupted:'naprzemiennie gładki i ząbkowany',irregular:'ząbkowany nieregularnie (moletowany)',lettered:'drobno ząbkowany z napisem'};
const COIN_PROF={
 cast:{name:'Odlew ze stopu cynku, powlekany',core:['weight','diam','strike'],opt:['edge','wear','xrf'],modes:{weight:'cast',diam:'small',strike:'cast',edge:'cast',wear:'soft',xrf:'cast'}},
 struck:{name:'Podróbka bita w podrobionym stemplu, z niewłaściwego stopu',core:['xrf','edge','wear'],opt:['weight'],modes:{xrf:'struck',edge:'uneven',wear:'tumbled',weight:'struck'}},
 magnet:{name:'Podróbka z metalu o złych własnościach magnetycznych',core:['magnet','xrf','weight'],opt:['edge'],modes:{magnet:'flip',xrf:'magnet',weight:'magnet',edge:'uneven'}},
 mono:{name:'Moneta jednolita udająca bimetaliczną (barwiona powłoka)',bi:true,core:['xrf','strike','weight'],opt:['diam'],modes:{xrf:'mono',strike:'mono',weight:'mono',diam:'big'}},
};
const COIN_DEF={
 weight:{name:'Waga',hint:'Porównaj masę z katalogiem. Prawdziwe monety różnią się od niego najwyżej o kilka setnych grama; inny stop albo rdzeń zmienia masę o dziesiąte części grama.'},
 diam:{name:'Średnica (suwmiarka)',view:'normal',gate:{z:2,area:'coin'},hint:'Przybliż monetę (≥ ×2) i porównaj średnicę z katalogiem. Odlew z formy zdjętej z oryginału jest mniejszy przez skurcz metalu. Skala 1 cm jest w lewym dolnym rogu.'},
 xrf:{name:'Skład stopu (XRF)',view:'normal',probe:'xrf',gate:{z:2},hint:'Przy zoomie ≥ ×2 kliknij monetę – w monecie dwumetalowej osobno pierścień i rdzeń. Porównaj skład z katalogiem; XRF bada powierzchnię, więc zwróć uwagę na metal wykryty pod powłoką.'},
 magnet:{name:'Magnes',view:'normal',probe:'magnet',gate:{z:1},hint:'Kliknij monetę, aby przyłożyć magnes. Monety złotego 2 zł i 5 zł nie są magnetyczne; 1 zł od 2020 r. (stal) jest wyraźnie przyciągana; 1 € i 2 € – słabo (warstwa niklu w rdzeniu).'},
 edge:{name:'Rant',view:'edge',gate:{z:4,area:'edge'},hint:'Widok pokazuje rozwinięcie rantu. Przybliż (≥ ×4) i porównaj z katalogiem: rodzaj rantu, równość ząbków, układ odcinków, napis. Szew formy zdradza odlew.'},
 strike:{name:'Bicie czy odlew (mikroskop)',view:'normal',gate:{z:6,area:'coin'},hint:'Przy zoomie ≥ ×6 obejrzyj pole monety. Moneta bita ma gładkie pole i promieniste linie płynięcia metalu; odlew – wżery i pęcherzyki. W monecie dwumetalowej między rdzeniem a pierścieniem jest wąska szczelina.'},
 wear:{name:'Zużycie wypukłości',view:'raking',gate:{z:3,area:'portrait'},hint:'W świetle bocznym przybliż orła na awersie (≥ ×3). Obieg wyciera najpierw najwyższe punkty (głowa, skrzydła). Równomierne rysy przy ostrych szczytach to sztuczne postarzanie.'},
};
const COIN_SET=[['1. Pomiary',['weight','diam']],['2. Materiał',['xrf','magnet']],['3. Powierzchnia i rant',['edge','strike','wear']]];
/* ---------- odczyty ---------- */
const cMass=(p)=>{const c=COIN,m=p.t.weight?p.m.weight:'ok',k={cast:0.80,struck:1.035,mono:0.975,magnet:c.magnet==='none'?0.92:c.id==='pln1'?1.11:0.97}[m];
 return k?c.g*k:c.g+((p.seed%5)-2)*0.01};
const cDiam=p=>{const d=COIN.D,m=p.t.diam?p.m.diam:'ok';return m==='small'?d-0.25:m==='big'?d+0.2:d};
const C2=n=>fmt(n.toFixed(2));
const isBi=()=>COIN.core>0;
const partCol=part=>part==='core'?COIN.coreC:COIN.ring;
function cXrf(p,part){const c=COIN,m=p.t.xrf?p.m.xrf:'ok',col=partCol(part);
 if(m==='cast')return'Cienka powłoka; pod nią Zn ok. 95%, Al ok. 4% – stop cynkowy (znal).';
 if(m==='struck')return col==='y'?'Cu 63%, Zn 37% – mosiądz zwykły, bez glinu i niklu.':'Cu 62%, Zn 20%, Ni 18% – alpaka (nowe srebro), bez budowy warstwowej.';
 if(m==='mono')return col==='y'?'Cu 63%, Zn 37% – mosiądz.':'Ni w cienkiej powłoce; pod nią Cu 63%, Zn 37% – ten sam mosiądz co w drugiej części monety.';
 if(m==='magnet'){if(c.magnet==='none')return col==='y'?'Cu i Zn w powłoce; pod nią Fe – stal mosiądzowana.':'Ni w powłoce; pod nią Fe – stal niklowana.';
  if(c.id==='pln1')return'Cu 75%, Ni 25% w całym przekroju – miedzionikiel, brak stali.';
  if(part==='core')return'Cu 75%, Ni 25% jednolicie – brak warstwy niklu w rdzeniu.'}
 return COIN_ALLOY[part==='core'?c.coreA:c.ringA]}
const MAG_TXT={strong:'Moneta wyraźnie przyciągana przez magnes.',weak:'Słabe przyciąganie – rdzeń z warstwą niklu.',none:'Brak przyciągania – metal niemagnetyczny.'};
function cMag(p){const r=COIN.magnet;if(!(p.t.magnet&&p.m.magnet==='flip'))return r;return r==='none'?'strong':'none'}
/* ---------- rysunek (współrzędne dla promienia 140, skalowane przez u) ---------- */
function arcText(x,t,cx,cy,r,a0,font){x.save();x.font=font;x.textAlign='center';let a=a0;for(const ch of t){const da=x.measureText(ch).width/r;a+=da/2;x.save();x.translate(cx+Math.cos(a)*r,cy+Math.sin(a)*r);x.rotate(a+Math.PI/2);x.fillText(ch,0,0);x.restore();a+=da/2}x.restore()}
function arcCenter(x,t,cx,cy,r,font,bottom){x.save();x.font=font;let w=0;for(const ch of t)w+=x.measureText(ch).width;x.restore();
 if(!bottom)return arcText(x,t,cx,cy,r,-Math.PI/2-w/r/2,font);
 x.save();x.font=font;x.textAlign='center';let a=Math.PI/2+w/r/2;for(const ch of t){const da=x.measureText(ch).width/r;a-=da/2;x.save();x.translate(cx+Math.cos(a)*r,cy+Math.sin(a)*r);x.rotate(a-Math.PI/2);x.fillText(ch,0,0);x.restore();a-=da/2}x.restore()}
function star5(x,X,Y,r){x.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,q=i%2?r*0.42:r;x.lineTo(X+Math.cos(a)*q,Y+Math.sin(a)*q)}x.closePath();x.fill()}
function oakLeaf(x,X,Y,a,s){x.save();x.translate(X,Y);x.rotate(a);x.scale(s,s);x.beginPath();x.moveTo(0,-14);
 for(const[px,py]of[[5,-11],[3,-8],[7,-5],[4,-2],[7,2],[4,5],[5,9],[1,10]])x.lineTo(px,py);x.lineTo(0,14);
 for(const[px,py]of[[-1,10],[-5,9],[-4,5],[-7,2],[-4,-2],[-7,-5],[-3,-8],[-5,-11]])x.lineTo(px,py);x.closePath();x.fill();x.stroke();
 x.beginPath();x.moveTo(0,-12);x.lineTo(0,14);x.stroke();x.restore()}
/* orzeł heraldyczny (uproszczony): crown=true – orzeł w koronie (godło RP), false – orzeł federalny */
function eagle(x,s,crown){x.save();x.scale(s,s);
 for(const k of[1,-1]){x.save();x.scale(k,1);x.beginPath();
  for(const[px,py]of[[4,-26],[20,-44],[36,-56],[52,-56],[60,-42],[56,-26],[60,-14],[52,-2],[54,10],[42,16],[38,26],[24,24],[10,8]])x.lineTo(px,py);x.closePath();x.fill();x.stroke();
  for(let i=0;i<5;i++){x.beginPath();x.moveTo(12+i*2,-18+i*6);x.lineTo(40+i*3,-46+i*14);x.stroke()}
  x.beginPath();x.moveTo(8,20);x.lineTo(20,34);x.lineTo(26,32);x.moveTo(20,34);x.lineTo(20,40);x.stroke();x.restore()}
 x.beginPath();x.ellipse(0,0,13,26,0,0,7);x.fill();x.stroke();
 x.beginPath();for(const[px,py]of[[-10,22],[10,22],[18,50],[8,44],[0,54],[-8,44],[-18,50]])x.lineTo(px,py);x.closePath();x.fill();x.stroke();
 x.beginPath();x.ellipse(-3,-34,9,10,0,0,7);x.fill();x.stroke();
 x.beginPath();x.moveTo(-11,-37);x.lineTo(-20,-33);x.lineTo(-11,-30);x.fill();x.stroke();
 if(crown){x.beginPath();x.moveTo(-12,-46);x.lineTo(-12,-56);x.lineTo(-7,-51);x.lineTo(-3,-60);x.lineTo(1,-51);x.lineTo(6,-56);x.lineTo(6,-46);x.closePath();x.fill();x.stroke()}
 x.restore()}
function coinObverse(x,cx,cy,st,yr){const u=CO.u;x.save();x.translate(cx,cy);x.scale(u,u);x.beginPath();x.arc(0,0,133,0,7);x.clip();x.fillStyle=st.fill;x.strokeStyle=st.stroke;x.lineWidth=0.9;
 if(COIN.obv==='pl'){eagle(x,1.25,true);x.fillStyle=st.text;arcCenter(x,'RZECZPOSPOLITA POLSKA',0,0,112,'bold 15px Arial,sans-serif');
  x.font='bold 16px Arial,sans-serif';x.textAlign='center';x.fillText(String(yr),0,108)}
 else{eagle(x,1.05,false);x.fillStyle=st.text;for(let i=0;i<12;i++){const a=-Math.PI/2+i*Math.PI/6;star5(x,Math.cos(a)*118,Math.sin(a)*118,7)}
  x.font='bold 13px Arial,sans-serif';x.textAlign='center';x.fillText(String(yr),0,84);x.fillText('A',-58,58)}
 x.textAlign='left';x.restore()}
function coinReverse(x,cx,cy,st){const u=CO.u,v=COIN.rev;x.save();x.translate(cx,cy);x.scale(u,u);x.beginPath();x.arc(0,0,133,0,7);x.clip();x.fillStyle=st.fill;x.strokeStyle=st.stroke;x.lineWidth=0.9;x.textAlign='center';
 if(v==='pl1'){for(let i=0;i<24;i++){const a=i/24*6.283;oakLeaf(x,Math.cos(a)*104,Math.sin(a)*104,a,0.9)}
  x.fillStyle=st.text;x.font='bold 110px Arial,sans-serif';x.fillText('1',0,30);x.font='bold 22px Arial,sans-serif';x.fillText('ZŁOTY',0,68)}
 else if(v==='pl2'){oakLeaf(x,-112,0,-0.2,1.1);oakLeaf(x,112,0,0.2,1.1);
  x.fillStyle=st.text;x.font='bold 96px Arial,sans-serif';x.fillText('2',0,28);x.font='bold 20px Arial,sans-serif';x.fillText('ZŁOTE',0,62)}
 else if(v==='pl5'){x.lineWidth=1.2;x.beginPath();x.moveTo(-132,0);x.lineTo(-98,0);x.moveTo(98,0);x.lineTo(132,0);x.moveTo(0,-132);x.lineTo(0,-104);x.moveTo(0,104);x.lineTo(0,132);x.stroke();x.lineWidth=0.9;
  for(const a of[-2.4,-0.75,0.75,2.4,Math.PI/2])oakLeaf(x,Math.cos(a)*112,Math.sin(a)*112,a+Math.PI/2,1.0);
  x.fillStyle=st.text;x.font='bold 104px Arial,sans-serif';x.fillText('5',0,30);x.font='bold 17px Arial,sans-serif';x.fillText('ZŁOTYCH',0,62)}
 else{x.lineWidth=1.1;for(let i=0;i<6;i++){const X=14+i*13,h=Math.sqrt(Math.max(0,118*118-X*X))-10;x.beginPath();x.moveTo(X,-h+6);x.lineTo(X,h-6);x.stroke();x.fillStyle=st.text;star5(x,X,-h,5);star5(x,X,h,5)}
  x.fillStyle=st.fill;x.beginPath();for(const[px,py]of[[30,-60],[58,-74],[74,-50],[92,-40],[84,-10],[96,10],[76,26],[60,14],[44,30],[36,6],[22,-14],[38,-30]])x.lineTo(px,py);x.closePath();x.fill();x.stroke();
  x.fillStyle=st.text;x.font='bold 100px Arial,sans-serif';x.fillText(v==='eu1'?'1':'2',-46,30);x.font='bold 20px Arial,sans-serif';x.fillText('EURO',-46,66);x.font='9px Arial,sans-serif';x.fillText('LL',64,64)}
 x.textAlign='left';x.restore()}
const METAL={w:[[0,'#f8f8f6'],[.6,'#d0d1d3'],[1,'#8b8d91']],y:[[0,'#fbefc4'],[.6,'#d9b45c'],[1,'#8f7130']],wd:[[0,'#ebe8de'],[.6,'#bfbcb1'],[1,'#86847b']],yd:[[0,'#e9dcb0'],[.6,'#bba05e'],[1,'#7d6838']]};
function coinBlank(x,cx,cy,p,hm){const R=CO.R,cr=COIN.core*PPMM/2;
 if(hm){x.fillStyle='#808080';x.beginPath();x.arc(cx,cy,R,0,7);x.fill();x.strokeStyle='#e8e8e8';x.lineWidth=8*CO.u;x.beginPath();x.arc(cx,cy,R-4*CO.u,0,7);x.stroke();return}
 const dull=p.t.xrf&&(p.m.xrf==='cast'||p.m.xrf==='struck'),g=(c,X,Y,r)=>rad(X-r*0.35,Y-r*0.35,r*0.05,r*1.15,METAL[c+(dull?'d':'')])(x);
 x.fillStyle=g(COIN.ring,cx,cy,R);x.beginPath();x.arc(cx,cy,R,0,7);x.fill();
 if(cr){x.fillStyle=g(COIN.coreC,cx,cy,cr);x.beginPath();x.arc(cx,cy,cr,0,7);x.fill()}
 x.strokeStyle='rgba(60,60,64,.45)';x.lineWidth=6*CO.u;x.beginPath();x.arc(cx,cy,R-3.5*CO.u,0,7);x.stroke();x.strokeStyle='rgba(255,255,255,.6)';x.lineWidth=1;x.beginPath();x.arc(cx,cy,R-7*CO.u,Math.PI*0.9,Math.PI*1.6);x.stroke()}
const coinWear=p=>p.t.wear?p.m.wear:'circ';
function coinHighPoints(x,col){const u=CO.u;[[CO.A[0]-3*u,CO.A[1]-40*u,16],[CO.A[0]-55*u,CO.A[1]-52*u,14],[CO.A[0]+55*u,CO.A[1]-52*u,14],[CO.B[0],CO.B[1]-20*u,22],[CO.B[0],CO.B[1]+50*u,14]].forEach(([X,Y,r])=>{r*=u;x.fillStyle=rad(X,Y,1,r,[[0,col],[1,col.replace(/[\d.]+\)$/,'0)')]])(x);x.beginPath();x.arc(X,Y,r,0,7);x.fill()})}
function coinScratches(x,p,col){const r=rng(p.seed+17);x.strokeStyle=col;x.lineWidth=0.5;for(const[cx,cy]of[CO.A,CO.B])for(let i=0;i<260;i++){const a=r()*6.28,d=r()*CO.R*0.95,X=cx+Math.cos(a)*d,Y=cy+Math.sin(a)*d,b=r()*6.28,l=3+r()*9;x.beginPath();x.moveTo(X,Y);x.lineTo(X+Math.cos(b)*l,Y+Math.sin(b)*l);x.stroke()}}
function coinView(p,v){
 if(v==='normal')return kView(p,v,(x,c)=>{const st={fill:'rgba(255,255,255,.28)',stroke:'rgba(45,40,30,.6)',text:'rgba(45,40,30,.7)'};
  coinBlank(x,...CO.A,p);coinObverse(x,...CO.A,st,COIN.year);coinBlank(x,...CO.B,p);coinReverse(x,...CO.B,st);
  const w=coinWear(p);if(w==='circ')coinHighPoints(x,'rgba(255,255,255,.5)');if(w==='tumbled')coinScratches(x,p,'rgba(70,70,75,.28)');
  if(w==='soft'||(p.t.strike&&p.m.strike==='cast')){const t=mk(IW,IH),tx=t.getContext('2d');tx.filter='blur(2.2px)';tx.drawImage(c,0,0);x.save();x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,IW,IH);x.drawImage(t,0,0);x.restore()}});
 if(v==='raking')return p.views.raking||(p.views.raking=(()=>{const hm=mk(IW,IH),h=hm.getContext('2d');h.scale(S,S);const st={fill:'#ffffff',stroke:'#ffffff',text:'#ffffff'};
  coinBlank(h,...CO.A,p,true);h.globalAlpha=.75;coinObverse(h,...CO.A,st,COIN.year);h.globalAlpha=1;coinBlank(h,...CO.B,p,true);h.globalAlpha=.75;coinReverse(h,...CO.B,st);h.globalAlpha=1;
  const w=coinWear(p);if(w==='circ')coinHighPoints(h,'rgba(150,150,150,.95)');if(w==='tumbled')coinScratches(h,p,'rgba(40,40,40,.55)');
  let src=hm;if(w==='soft'){src=mk(IW,IH);const s2=src.getContext('2d');s2.filter='blur(3px)';s2.drawImage(hm,0,0)}
  const out=embossFrom(src,coinView(p,'normal')),o=out.getContext('2d');o.globalCompositeOperation='destination-in';o.drawImage(coinView(p,'normal'),0,0);return out})());
 if(v==='edge')return kView(p,v,x=>{const m=p.t.edge?p.m.edge:'ok',r=rng(p.seed+23),X0=20,Y0=120,Wd=600,Hd=80,e=COIN.edge;
  x.fillStyle='#cbb894';x.font='13px system-ui';x.fillText('Rozwinięcie rantu (fragment obwodu)',X0,Y0-14);
  const met=COIN.ring==='y'?[[0,'#8f7a45'],[.3,'#f1df9e'],[.7,'#cdb066'],[1,'#7e6a38']]:[[0,'#8e9094'],[.3,'#e9eaec'],[.7,'#c3c5c8'],[1,'#7d7f83']];
  x.fillStyle=lin(0,Y0,0,Y0+Hd,met)(x);x.fillRect(X0,Y0,Wd,Hd);
  const reeds=(a,b,sp,irr)=>{let X=a+2;while(X<b-2){const s=irr?sp*0.6+r()*sp*0.9:sp,d=irr?0.4+r()*0.6:1;x.fillStyle=`rgba(60,62,66,${(m==='cast'?.25:.55)*d})`;x.fillRect(X,Y0+4,s*0.45,Hd-8);x.fillStyle='rgba(255,255,255,.45)';x.fillRect(X+s*0.45,Y0+4,0.6,Hd-8);X+=s;if(irr&&r()<0.04)X+=6+r()*8}};
  const un=m==='uneven';
  if(e==='plain'){if(un){x.strokeStyle='rgba(60,60,60,.45)';x.lineWidth=0.5;for(let i=0;i<160;i++){const X=X0+r()*Wd;x.beginPath();x.moveTo(X,Y0+3);x.lineTo(X+(r()-.5)*6,Y0+Hd-3);x.stroke()}}
   else{x.strokeStyle='rgba(255,255,255,.25)';x.lineWidth=0.4;for(let i=0;i<10;i++){x.beginPath();x.moveTo(X0,Y0+8+i*7);x.lineTo(X0+Wd,Y0+8+i*7);x.stroke()}}}
  else if(e==='interrupted'){const n=un?[0,140,190,330,350,600]:[0,200,400,600];for(let i=0;i<n.length-1;i++)if(i%2===0)reeds(X0+n[i],X0+n[i+1],4,false)}
  else if(e==='irregular'){if(un)reeds(X0,X0+Wd,4,false);else{const seq=[34,10,18,10,52,10,22,10,40,10,14,10];let X=X0;for(let i=0;X<X0+Wd;i++){const w=seq[i%seq.length];if(i%2===0)reeds(X,Math.min(X+w*1.6,X0+Wd),3.2,false);X+=w*1.6}}}
  else{reeds(X0,X0+Wd,un?3.4:2.4,un);x.fillStyle='rgba(235,236,238,.9)';x.fillRect(X0,Y0+Hd/2-11,Wd,22);x.fillStyle='rgba(40,40,44,.85)';x.font='bold 15px Arial,sans-serif';
   x.fillText(un?'EINIGKEIT UND RECHT UND FRIEHEIT  ✶':'EINIGKEIT UND RECHT UND FREIHEIT  ✶',X0+40,Y0+Hd/2+5);if(!un)x.fillText('EINIGKEIT',X0+460,Y0+Hd/2+5)}
  if(m==='cast'){x.strokeStyle='rgba(70,70,74,.85)';x.lineWidth=1.4;x.beginPath();for(let i=0;i<=Wd;i+=6)x.lineTo(X0+i,Y0+Hd/2+(r()-.5)*1.4);x.stroke()}
  x.strokeStyle='#55575b';x.strokeRect(X0,Y0,Wd,Hd)});
 return coinView(p,'normal')}
function coinLive(p){if(vw.z<6)return;const V=viewportWorld(),T=4,m=p.t.strike?p.m.strike:'die',R=CO.R,cr=COIN.core*PPMM/2;
 for(const[cx,cy]of[CO.A,CO.B]){const X0=p.x+cx-R,Y0=p.y+cy-R;if(X0>V.x1||X0+2*R<V.x0||Y0>V.y1||Y0+2*R<V.y0)continue;
  ctx.save();ctx.beginPath();ctx.arc(p.x+cx,p.y+cy,R-8*CO.u,0,7);ctx.clip();
  for(let ty=Math.floor((Math.max(V.y0,Y0)-p.y)/T);ty*T<Math.min(V.y1,Y0+2*R)-p.y;ty++)for(let tx=Math.floor((Math.max(V.x0,X0)-p.x)/T);tx*T<Math.min(V.x1,X0+2*R)-p.x;tx++){
   const r=rng(p.seed^Math.imul(tx,73856093)^Math.imul(ty,19349663)),X=p.x+tx*T,Y=p.y+ty*T;
   if(m==='die'||m==='mono'){const a=Math.atan2(Y+T/2-p.y-cy,X+T/2-p.x-cx);ctx.strokeStyle=`rgba(255,255,255,${.12+r()*.1})`;ctx.lineWidth=0.08;for(let i=0;i<2;i++){const sx=X+r()*T,sy=Y+r()*T;ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(sx+Math.cos(a)*2.5,sy+Math.sin(a)*2.5);ctx.stroke()}}
   else{for(let i=0;i<3;i++){const s=0.08+r()*0.3;ctx.fillStyle='rgba(55,55,58,.55)';ctx.beginPath();ctx.arc(X+r()*T,Y+r()*T,s,0,7);ctx.fill();if(r()<.3){ctx.strokeStyle='rgba(255,255,255,.5)';ctx.lineWidth=0.05;ctx.beginPath();ctx.arc(X+r()*T,Y+r()*T,s*1.4,0,7);ctx.stroke()}}}}
  if(cr){if(m==='mono'){ctx.strokeStyle='rgba(120,110,90,.35)';ctx.lineWidth=0.6;ctx.setLineDash([0.4,0.6]);ctx.beginPath();ctx.arc(p.x+cx,p.y+cy,cr,0,7);ctx.stroke();ctx.setLineDash([])}
   else{ctx.strokeStyle='rgba(25,25,28,.85)';ctx.lineWidth=0.35;ctx.beginPath();ctx.arc(p.x+cx,p.y+cy,cr,0,7);ctx.stroke();ctx.strokeStyle='rgba(255,255,255,.5)';ctx.lineWidth=0.12;ctx.beginPath();ctx.arc(p.x+cx,p.y+cy,cr+0.3,0,7);ctx.stroke()}}
  ctx.restore()}}
function coinArea(p,a,v){const lx=v.cx-p.x,ly=v.cy-p.y,R=CO.R,inA=Math.hypot(lx-CO.A[0],ly-CO.A[1])<R,inB=Math.hypot(lx-CO.B[0],ly-CO.B[1])<R;
 if(a==='coin')return inA||inB;if(a==='portrait')return Math.hypot(lx-CO.A[0],ly-CO.A[1])<75*CO.u;if(a==='edge')return lx>20&&lx<620&&ly>110&&ly<210;return false}
function coinPart(lx,ly){const cr=COIN.core*PPMM/2;for(const[cx,cy]of[CO.A,CO.B]){const d=Math.hypot(lx-cx,ly-cy);if(d<=CO.R)return cr&&d<cr?'core':'ring'}return null}
function coinObs(p,id,part){const t=p.t,m=p.m;switch(id){
 case'weight':return`Masa: ${C2(cMass(p))} g.`;
 case'diam':return`Średnica: ${C2(cDiam(p))} mm.`;
 case'xrf':{if(!isBi())return cXrf(p,'ring');if(part)return`${part==='core'?'Rdzeń':'Pierścień'}: ${cXrf(p,part)}`;return`Pierścień: ${cXrf(p,'ring')} Rdzeń: ${cXrf(p,'core')}`}
 case'magnet':return MAG_TXT[cMag(p)];
 case'edge':{const e=COIN.edge,mm=t.edge?m.edge:'ok';if(mm==='cast')return'Ząbki i wzór rantu płytkie i rozmyte; wzdłuż rantu biegnie szew formy.';
  if(mm==='uneven')return{plain:'Rant miał być gładki, a ma nierówne, skośne rysy po obróbce pilnikiem.',interrupted:'Odcinki gładkie i ząbkowane mają różną długość – układ nie jest powtarzalny.',irregular:'Ząbkowanie ciągłe i regularne – brak charakterystycznego układu odcinków.',lettered:'Ząbki nierówne, w napisie błąd: „FRIEHEIT” zamiast „FREIHEIT”.'}[e];
  return{plain:'Rant gładki, bez ząbków.',interrupted:'Rant naprzemiennie gładki i ząbkowany, odcinki równej długości.',irregular:'Rant ząbkowany odcinkami o różnej długości, w stałym układzie – zgodnie z wzorem.',lettered:'Drobne regularne ząbki i wklęsły napis „EINIGKEIT UND RECHT UND FREIHEIT”.'}[e]}
 case'strike':{const s=t.strike?m.strike:'die',bi=isBi();if(s==='cast')return'Drobne wżery i pęcherzyki na polu, zaokrąglone krawędzie liter – ślady odlewu.';
  if(s==='mono')return'Pole gładkie, ślady bicia; między „rdzeniem” a „pierścieniem” brak szczeliny – granica to tylko krawędź powłoki.';
  return bi?'Pole gładkie, promieniste linie płynięcia metalu, ostre krawędzie liter; między rdzeniem a pierścieniem wąska szczelina – dwa osobne krążki.':'Pole gładkie, promieniste linie płynięcia metalu przy obrzeżu, ostre krawędzie liter – ślady bicia.'}
 case'wear':return{circ:'Najwyższe punkty (głowa i skrzydła orła, cyfra nominału) wygładzone, niższe partie z pełnym detalem – zużycie obiegowe.',tumbled:'Drobne rysy rozłożone równomiernie na całej powierzchni, a najwyższe punkty ostre – sztuczne postarzanie.',soft:'Cały detal miękki i rozmyty, także w zagłębieniach – utrata detalu przy odlewaniu.'}[coinWear(p)]}}
function coinWhy(p,id){const m=p.m,c=COIN;return({weight:()=>`Masa ${C2(cMass(p))} g zamiast ${C2(c.g)} g – inny stop lub rdzeń.`,diam:()=>`Średnica ${C2(cDiam(p))} mm zamiast ${C2(c.D)} mm.`,
 xrf:()=>({cast:'Stop cynkowy pod cienką powłoką – odlew.',struck:'Zwykły mosiądz lub alpaka zamiast stopów z katalogu.',magnet:c.magnet==='none'?'Stal pod powłoką – moneta powinna być niemagnetyczna.':'Brak stali lub warstwy niklu, które ma prawdziwa moneta.',mono:'Rdzeń i pierścień z tego samego mosiądzu, druga barwa to powłoka.'})[m.xrf],
 magnet:()=>c.magnet==='none'?'Przyciąganie przez magnes – stal w monecie, która powinna być niemagnetyczna.':'Brak przyciągania – prawdziwa moneta reaguje na magnes.',
 edge:()=>m.edge==='cast'?'Szew formy na rancie – odlew.':'Rant niezgodny z wzorem z katalogu.',
 strike:()=>m.strike==='cast'?'Wżery i pęcherzyki – moneta odlana, nie bita.':'Brak szczeliny między rdzeniem a pierścieniem – moneta jednolita.',
 wear:()=>m.wear==='tumbled'?'Równomierne rysy przy ostrych szczytach – sztuczne postarzanie.':'Miękki detal w całej monecie – odlew.'}[id]||(()=>''))()}
const coinCat=()=>`${COIN.name} (${COIN.country}), rocznik ${COIN.year}. Katalog: ${COIN.cat}; ${C2(COIN.g)} g; Ø ${C2(COIN.D)} mm; rant ${EDGE_TXT[COIN.edge]}.`;
function coinPick(r){const el=document.getElementById('artist'),v=el.value;COIN=el.dataset.mode!=='coin'?COIN_BY.pln5:COIN_BY[v]||COINS[Math.floor(r()*COINS.length)];
 COIN.year=COIN.years[0]+Math.floor(r()*(COIN.years[1]-COIN.years[0]+1));CO.R=COIN.D*PPMM/2;CO.u=CO.R/140;
 const k=KINDS.coin;k.profiles=Object.fromEntries(Object.entries(COIN_PROF).filter(([,v])=>!v.bi||isBi()))}
registerKind({id:'coin',label:'Weryfikacja monet',noun:'Moneta',W:640,H:320,wcm:640/PPMM/10,hcm:320/PPMM/10,tilt:false,focusLabel:'Awers',
 defs:COIN_DEF,sets:COIN_SET,profiles:COIN_PROF,originals:r=>isBi()?1+Math.floor(r()*3):2+Math.floor(r()*2),
 newGame(r){coinPick(r);kindBatch(this,r)},view:coinView,live:coinLive,area:coinArea,obs:coinObs,why:coinWhy,
 shadow(p){for(const[cx,cy]of[CO.A,CO.B]){ctx.beginPath();ctx.arc(p.x+cx+6,p.y+cy+8,CO.R,0,7);ctx.fill()}},
 focus:p=>[p.x+10,p.y+10,300,300],
 probe(p,lx,ly,id){const part=coinPart(lx,ly);if(!part){toast('Kliknij powierzchnię monety.');return}
  if(id==='xrf'){if(vw.z<2)return toast('Przybliż do ×2, aby przyłożyć głowicę XRF.');const o=coinObs(p,'xrf',isBi()?part:null);note(p,'xrf',o);toast(`Moneta ${p.letter}: ${o}`)}
  if(id==='magnet'&&note(p,'magnet',coinObs(p,'magnet')))toast(`Moneta ${p.letter}: ${coinObs(p,'magnet')}`)},
 panel(p,id){if((id==='xrf'||id==='magnet')&&p.notes[id])return`<div class="obs"><b>Odczyt:</b> ${[].concat(p.notes[id]).join('<br>')}</div>`},
 get intro(){return`Na stole leży 5 monet ${COIN.name} – awers i rewers każdej. Część jest prawdziwa, część fałszywa. Zważ, zmierz, zbadaj stop i magnes, obejrzyj rant, pole pod mikroskopem i zużycie wypukłości. Na checkliście każdej monety zaznacz sygnały fałszerstwa i zakończ ekspertyzę.`},
 caseText:()=>`Weryfikacja monet: ${coinCat()} Wizerunki rysuje gra (uproszczone); parametry są prawdziwe, wyniki badań symulowane.`});
Object.assign(AREA,{coin:'środek widoku na monecie',portrait:'środek widoku na orle (awers)',edge:'środek widoku na rozwinięciu rantu'});
VIEWNAME.edge='rozwinięcie rantu';
