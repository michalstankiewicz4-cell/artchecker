"use strict";
/* =====================================================================
   DZIEŁA PRAWDZIWE – ładowanie obrazów (js/real/<slug>.js), wybór w liście „Artysta”,
   scena obrazu z prawdziwego dzieła dla trybu „Obrazy – przeprowadź ekspertyzę”.
   Włączane po kolei: REAL_READY.
   ===================================================================== */
const REAL_READY=['stanczyk','babie-lato','melencolia','dlonie','zajac','macierzynstwo'];
const REAL_DEF={paint5:'stanczyk'};/* dzieło wybrane domyślnie po wejściu w tryb */
const REALIM={};let REAL_CUR=null,RESUME_ART=null;
function loadReal(slug){if(REALIM[slug])return Promise.resolve(REALIM[slug]);
 return new Promise((res,rej)=>{const go=()=>{const im=new Image();im.onload=()=>{REALIM[slug]=im;res(im)};im.onerror=rej;im.src=REALIMG[slug]};
  if(window.REALIMG&&REALIMG[slug])return go();const s=document.createElement('script');s.src='js/real/'+slug+'.js';s.onload=go;s.onerror=rej;document.head.appendChild(s)})}
/* „Pamięć eksperta” korzysta z obrazów olejnych; „Zniszczony fragment” – na razie fikcyjne (zaginione) dzieła */
const realFor=mode=>{const m=mode==='memory'?'paint5':mode;return REAL.filter(e=>e.mode===m&&REAL_READY.includes(e.slug))};
/* lista „Artysta”: fikcyjni artyści + dzieła prawdziwe gotowe dla trybu */
/* tryby z dziełami prawdziwymi: tylko dzieła prawdziwe (fikcyjne prace usunięte w 1.29);
   „Zniszczony fragment” i „Pamięć eksperta” nadal korzystają z fikcyjnych artystów (sceny generowane) */
const realMode=mode=>realFor(mode).length>0;
function fillArtist(mode){const el=document.getElementById('artist'),L=realFor(mode),R=realMode(mode),
  def=R?(REAL_DEF[mode]&&REAL_READY.includes(REAL_DEF[mode])?'real:'+REAL_DEF[mode]:'real:*'):'',
  v=RESUME_ART!=null&&RESUME_ART!==''?RESUME_ART:el.dataset.mode===mode?el.value:def;el.dataset.mode=mode;let h='';
 if(R)h=`<option value="real:*">${tr('Losowe dzieło')}</option>`+L.map(e=>`<option value="real:${e.slug}">${e.artist} – „${tr(e.title)}”</option>`).join('');
 else if(mode==='frag'||mode==='memory')h=`<option value="">${tr('Losowy artysta (fikcyjny)')}</option>`+ARTISTS.filter(a=>!a.sup||a.sup==='canvas').map(a=>`<option value="${a.id}">${a.name} – ${tr(({pejzaz:'pejzaż',portret:'portret',martwa:'martwa natura',marina:'marina'})[a.scene])}</option>`).join('');
 RESUME_ART=null;el.innerHTML=h;el.value=[...el.options].some(o=>o.value===v)?v:(el.options[0]?el.options[0].value:'');
 el.style.display=(R||mode==='frag'||mode==='memory')?'':'none'}
async function resolveReal(mode){let v=document.getElementById('artist').value;REAL_CUR=null;if(!v.startsWith('real:')){if(!realMode(mode))return;v='real:*'}
 const L=realFor(mode);const e=v==='real:*'?L[Math.random()*L.length|0]:REAL_BY[v.slice(5)];if(!e||!realFor(mode).includes(e))return;await loadReal(e.slug);REAL_CUR=e}
/* obiekt „artysty” dla prawdziwego obrazu */
function realArtist(e){return{id:'real:'+e.slug,real:e,name:e.artist,life:e.life,title:e.title,year:e.yearNum,yearTxt:e.year,wcm:e.wcm,hcm:e.hcm,sup:e.sup,museum:e.museum,crn:'—',scene:'real',
 ref:`fotografia katalogowa (${e.museum})`,sig:{text:'',corner:'br',color:'#2a1d14',pig:'bone',font:'12px Georgia,serif',slant:0}}}
/* scena z prawdziwego obrazu: obraz jest warstwą rysunkową, regiony (pigmenty, faktura) są przybliżone */
const REALSC={};
function realScene(e){if(REALSC[e.slug])return REALSC[e.slug];const im=REALIM[e.slug],a=im.width/im.height,W0=a>=1?680:Math.round(600*a),H0=a>=1?Math.round(680/a):600;
 const R=([x,y,w,h])=>[x*W0,y*H0,w*W0,h*H0],[fx,fy,fw,fh]=R(e.fig),st=R(e.style);
 const draw=(x,err)=>{x.drawImage(im,0,0,W0,H0);if(!err)return;const[sx,sy,sw,sh]=st;x.save();x.beginPath();x.rect(sx,sy,sw,sh);x.clip();
  if(err==='anatomy'){const k=1.14;x.drawImage(im,(sx+sw*(1-1/k)/2)/W0*im.width,(sy+sh*(1-1/k)/2)/H0*im.height,sw/k/W0*im.width,sh/k/H0*im.height,sx,sy,sw,sh)}
  else{x.translate(sx*2+sw,0);x.scale(-1,1);x.drawImage(im,sx/W0*im.width,sy/H0*im.height,sw/W0*im.width,sh/H0*im.height,sx,sy,sw,sh)}x.restore()};
 return REALSC[e.slug]={W:W0,H:H0,bg:'tło',real:true,
  REG:{'tło':{pig:e.pig.bg,dir:'diag',an:'tiw'},'postać':{pig:e.pig.fig,dir:'dab',an:'quin'}},
  make:()=>({}),
  build:(c,err)=>[Sd(x=>draw(x,err)),Sr('postać',fx,fy,fw,fh,'',{hidden:true,outline:true,penti:{dx:-10,dy:6}})],
  styleRect:()=>st,
  errText:{anatomy:'W kluczowym fragmencie proporcje różnią się od fotografii katalogowej – detal powiększony i rozciągnięty.',shadow:'Kluczowy fragment jest odbity w poziomie – układ i kierunek światła inne niż na fotografii katalogowej.'},
  errWhy:{anatomy:'Błąd proporcji – kopista powiększył kluczowy detal.',shadow:'Detal odwrócony – kopia z odbitej reprodukcji.'},
  okText:'Kluczowy fragment zgodny z fotografią katalogową dzieła.',
  pentiText:'(symulacja) zarys głównej postaci pierwotnie nieco przesunięty',
  compDesc:e.desc,
  hidden:{desc:'(symulacja) zamalowany owalny portret',draw(x){x.fillStyle='rgba(255,255,255,.27)';x.beginPath();x.ellipse(W0*0.5,H0*0.45,W0*0.22,H0*0.3,0,0,7);x.fill()}}}}
/* podrysowanie pod farbą w IR dla prawdziwego obrazu – krawędzie obrazu (Sobel), u oryginału z drżeniem */
function realEdges(p,x,jit){const src=getView(p,'base').getContext('2d').getImageData(0,0,IW,IH).data,out=x.createImageData(IW,IH),d=out.data,r=rng(p.seed+77),L=i=>src[i]*0.3+src[i+1]*0.59+src[i+2]*0.11;
 for(let y=2;y<IH-2;y+=1)for(let X=2;X<IW-2;X+=1){const i=(y*IW+X)*4,gx=L(i+4)-L(i-4),gy=L(i+IW*4)-L(i-IW*4),g=Math.hypot(gx,gy);if(g<34)continue;
  const o=jit?(Math.min(IH-1,y+((r()-.5)*3|0))*IW+Math.min(IW-1,X+((r()-.5)*3|0)))*4:i;d[o]=25;d[o+1]=25;d[o+2]=25;d[o+3]=Math.min(200,g*1.6)}
 const c=mk(IW,IH);c.getContext('2d').putImageData(out,0,0);x.save();x.setTransform(1,0,0,1,0,0);x.drawImage(c,0,0);x.restore()}
