"use strict";
/* =====================================================================
   EFEKTY EKRANU GŁÓWNEGO – ziarno, artefakty kompresji JPG (bloki 8×8,
   przesunięcia barw, pasmowanie), zakłócenia podglądu, migotanie paneli,
   paralaksa podglądu. Wyłączane przy prefers-reduced-motion.
   ===================================================================== */
const FX={on:false,raf:0,last:0,blocks:[],next:0,glitchUntil:0,clean:null,drawId:0};
const fxReduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
/* pasmowanie i blokowość tła jak w mocno skompresowanym JPG */
function jpegize(cv){const d=devicePixelRatio||1,w=cv.width,h=cv.height,s=Math.max(2,Math.round(4*d)),sw=Math.ceil(w/s),sh=Math.ceil(h/s),t=mk(sw,sh),tx=t.getContext('2d');
 tx.drawImage(cv,0,0,sw,sh);const id=tx.getImageData(0,0,sw,sh),p=id.data,r=rng(31),B=4;
 for(let by=0;by<sh;by+=B)for(let bx=0;bx<sw;bx+=B){const cr=(r()-.5)*10,cb=(r()-.5)*12;
  for(let y=by;y<Math.min(by+B,sh);y++)for(let x=bx;x<Math.min(bx+B,sw);x++){const i=(y*sw+x)*4;for(let c=0;c<3;c++){const q=c===0?7:c===1?6:5;p[i+c]=Math.round((p[i+c]+(c===0?cr:c===2?cb:0))/q)*q}}}
 tx.putImageData(id,0,0);const x=cv.getContext('2d');x.save();x.setTransform(1,0,0,1,0,0);x.imageSmoothingEnabled=false;x.globalAlpha=.55;x.drawImage(t,0,0,w,h);x.restore()}
function fxResize(){const c=document.getElementById('hfx'),d=Math.min(1,devicePixelRatio||1)*0.5;c.width=innerWidth*d|0;c.height=innerHeight*d|0}
function fxFrame(t){if(!FX.on)return;FX.raf=requestAnimationFrame(fxFrame);if(t-FX.last<80)return;FX.last=t;
 const c=document.getElementById('hfx'),x=c.getContext('2d'),w=c.width,h=c.height;x.clearRect(0,0,w,h);
 /* ziarno */
 const n=Math.round(w*h/90);for(let i=0;i<n;i++){const v=Math.random();x.fillStyle=v<.5?`rgba(120,180,255,${v*.12})`:`rgba(255,255,255,${(v-.5)*.08})`;x.fillRect(Math.random()*w,Math.random()*h,1,1)}
 /* artefakty JPG: klastry bloków 8×8 z przesuniętą barwą */
 if(t>FX.next){FX.next=t+900+Math.random()*2600;const k=1+(Math.random()*3|0);for(let j=0;j<k;j++){const bs=4,cx=Math.random()*w,cy=Math.random()*h,cw=(4+Math.random()*14|0),ch=(2+Math.random()*7|0),hue=pick([190,320,140,40],Math.random);
   FX.blocks.push({cx,cy,cw,ch,bs,hue,until:t+120+Math.random()*380,seed:Math.random()*1e9|0})}
  if(Math.random()<.45)panelFlick();if(Math.random()<.5)stageGlitch(t)}
 FX.blocks=FX.blocks.filter(b=>b.until>t);
 for(const b of FX.blocks){const r=rng(b.seed+(t/160|0));for(let yy=0;yy<b.ch;yy++)for(let xx=0;xx<b.cw;xx++){if(r()<.25)continue;const a=.05+r()*.18;
   x.fillStyle=`hsla(${b.hue+(r()-.5)*40},90%,${45+r()*30}%,${a})`;x.fillRect(b.cx+xx*b.bs,b.cy+yy*b.bs,b.bs,b.bs);if(r()<.15){x.fillStyle=`rgba(255,255,255,${a})`;x.fillRect(b.cx+xx*b.bs,b.cy+yy*b.bs,b.bs,1)}}}
 /* poziome pasy przesunięcia kolorów (chroma bleed) */
 if(Math.random()<.06){const y=Math.random()*h,hh=1+Math.random()*4;x.fillStyle='rgba(255,40,120,.12)';x.fillRect(0,y,w,hh);x.fillStyle='rgba(40,220,255,.12)';x.fillRect(3,y+1,w,hh)}
 if(FX.glitchUntil&&t>FX.glitchUntil){FX.glitchUntil=0;restoreStage()}}
function panelFlick(){const ps=document.querySelectorAll('#home .hp');if(!ps.length)return;const p=ps[Math.random()*ps.length|0];p.classList.remove('flick');void p.offsetWidth;p.classList.add('flick');setTimeout(()=>p.classList.remove('flick'),220)}
/* krótkie zakłócenie podglądu: przesunięte pasy z rozszczepieniem RGB */
function stageGlitch(t){const cv=document.getElementById('hcanvas');if(!cv||!cv.width||FX.glitchUntil)return;
 FX.clean=mk(cv.width,cv.height);FX.clean.getContext('2d').drawImage(cv,0,0);FX.cleanId=FX.drawId;const x=cv.getContext('2d');x.save();x.setTransform(1,0,0,1,0,0);
 const k=2+(Math.random()*4|0);for(let i=0;i<k;i++){const y=Math.random()*cv.height,hh=6+Math.random()*30,dx=(Math.random()-.5)*40;
  x.drawImage(FX.clean,0,y,cv.width,hh,dx,y,cv.width,hh);x.globalCompositeOperation='screen';x.globalAlpha=.35;x.fillStyle='#ff2a6a';x.fillRect(dx-3,y,cv.width,hh*0.5);x.fillStyle='#2ad8ff';x.fillRect(dx+3,y+hh*0.5,cv.width,hh*0.5);x.globalAlpha=1;x.globalCompositeOperation='source-over'}
 x.restore();FX.glitchUntil=t+110+Math.random()*120}
function restoreStage(){const cv=document.getElementById('hcanvas');if(cv&&FX.clean&&FX.cleanId===FX.drawId){const x=cv.getContext('2d');x.save();x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,cv.width,cv.height);x.drawImage(FX.clean,0,0);x.restore()}FX.clean=null}
function startFX(){if(fxReduced()||FX.on)return;FX.on=true;fxResize();FX.raf=requestAnimationFrame(fxFrame)}
function stopFX(){FX.on=false;cancelAnimationFrame(FX.raf);const c=document.getElementById('hfx');if(c)c.getContext('2d').clearRect(0,0,c.width,c.height)}
addEventListener('resize',()=>{if(FX.on)fxResize()});
/* paralaksa podglądu */
document.addEventListener('mousemove',e=>{if(fxReduced())return;const st=document.getElementById('hstage');if(!st||document.getElementById('home').classList.contains('hidden'))return;
 const r=st.getBoundingClientRect(),dx=(e.clientX-r.left)/r.width-.5,dy=(e.clientY-r.top)/r.height-.5,inside=Math.abs(dx)<.7&&Math.abs(dy)<.7;
 document.getElementById('hcanvas').style.transform=inside?`rotateY(${dx*7}deg) rotateX(${-dy*6}deg) scale(1.02)`:'none'});
