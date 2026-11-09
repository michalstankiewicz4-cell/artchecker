"use strict";
/* =====================================================================
   EFEKTY EKRANU GŁÓWNEGO – ziarno, pasmowanie tła jak w JPG,
   paralaksa podglądu. Wyłączane przy prefers-reduced-motion.
   ===================================================================== */
const FX={on:false,raf:0,last:0,drawId:0};
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
}
function startFX(){if(fxReduced()||FX.on)return;FX.on=true;fxResize();FX.raf=requestAnimationFrame(fxFrame)}
function stopFX(){FX.on=false;cancelAnimationFrame(FX.raf);const c=document.getElementById('hfx');if(c)c.getContext('2d').clearRect(0,0,c.width,c.height)}
addEventListener('resize',()=>{if(FX.on)fxResize()});
/* paralaksa podglądu */
document.addEventListener('mousemove',e=>{if(fxReduced())return;const st=document.getElementById('hstage');if(!st||document.getElementById('home').classList.contains('hidden'))return;
 const r=st.getBoundingClientRect(),dx=(e.clientX-r.left)/r.width-.5,dy=(e.clientY-r.top)/r.height-.5,inside=Math.abs(dx)<.7&&Math.abs(dy)<.7;
 document.getElementById('hcanvas').style.transform=inside?`rotateY(${dx*7}deg) rotateX(${-dy*6}deg) scale(1.02)`:'none'});
