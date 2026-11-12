"use strict";
/* =====================================================================
   PAMIĘĆ EKSPERTA
   ===================================================================== */
const MEM={phase:0,left:0,iv:0,lens:null,reveal:false,base:null,seed:0};
function bboxOf(s){let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;contour(s).forEach(q=>{x0=Math.min(x0,q[0]);y0=Math.min(y0,q[1]);x1=Math.max(x1,q[0]);y1=Math.max(y1,q[1])});return[x0,y0,x1,y1]}
function cloneShape(s){const o={...s};if(s.pts)o.pts=s.pts.map(q=>q.slice());return o}
function xform(s,fn){if(s.t==='rect'){const a=fn([s.x,s.y]),b=fn([s.x+s.w,s.y+s.h]);s.x=Math.min(a[0],b[0]);s.y=Math.min(a[1],b[1]);s.w=Math.abs(b[0]-a[0]);s.h=Math.abs(b[1]-a[1])}
 else if(s.t==='ell'){const c=fn([s.cx,s.cy]),e=fn([s.cx+s.rx,s.cy+s.ry]);s.cx=c[0];s.cy=c[1];s.rx=Math.abs(e[0]-c[0]);s.ry=Math.abs(e[1]-c[1])}else s.pts=s.pts.map(fn)}
/* dzieło prawdziwe: różnice to łaty obrazu (przesunięcie, skala, odcień, zamalowanie, dodatek) */
function realPart(cx,cy){const h=cx<W/3?'lewej':cx>W*2/3?'prawej':'środkowej',v=cy<H/3?'górnej':cy>H*2/3?'dolnej':'środkowej';return h==='środkowej'&&v==='środkowej'?'w środku obrazu':`w ${v} ${h} części`}
function genMutReal(r,used){const im=REALIM[REAL_CUR.slug],sx=im.width/W,sy=im.height/H,cm=pxPerCm();let bx,by,bw,bh,ok=false;
 for(let t=0;t<40&&!ok;t++){bw=W*(0.09+r()*0.07);bh=H*(0.09+r()*0.07);bx=W*0.08+r()*(W*0.84-bw);by=H*0.08+r()*(H*0.84-bh);ok=![...used].some(b=>bx<b[2]+10&&bx+bw>b[0]-10&&by<b[3]+10&&by+bh>b[1]-10)}
 used.add([bx,by,bx+bw,by+bh]);const cx=bx+bw/2,cy=by+bh/2,where=realPart(cx,cy),type=pick(['shift','shift','scale','remove','tint','extra'],r);
 const src=(x,X,Y,Ww,Hh,dx,dy,dw,dh)=>x.drawImage(im,X*sx,Y*sy,Ww*sx,Hh*sy,dx,dy,dw,dh);
 const clipE=(x,f)=>{x.save();x.beginPath();x.ellipse(cx,cy,bw/2,bh/2,0,0,7);x.clip();f();x.restore()};
 if(type==='shift'){const dx=(r()<.5?-1:1)*(4+r()*5),dy=r()<.5?0:(r()<.5?-1:1)*(2+r()*3);
  return{type,box:[bx-9,by-9,bx+bw+9,by+bh+9],draw:x=>clipE(x,()=>src(x,bx-dx,by-dy,bw,bh,bx,by,bw,bh)),desc:`przesunięty fragment ${where} o ok. ${fmt((Math.hypot(dx,dy)/cm).toFixed(1))} cm`}}
 if(type==='scale'){const k=r()<.5?0.85:1.18;return{type,box:[bx,by,bx+bw,by+bh],draw:x=>clipE(x,()=>src(x,cx-bw/2/k,cy-bh/2/k,bw/k,bh/k,bx,by,bw,bh)),desc:`fragment ${where} ${k>1?'powiększony':'pomniejszony'} o ok. ${Math.round(Math.abs(k-1)*100)}%`}}
 if(type==='remove'){const ox=bx+bw<W*0.85?bw:-bw;return{type,box:[bx,by,bx+bw,by+bh],draw:x=>{x.save();x.filter='blur(1.5px)';clipE(x,()=>src(x,bx+ox,by,bw,bh,bx,by,bw,bh));x.restore()},desc:`zamalowany szczegół ${where}`}}
 if(type==='tint'){const col=pick(['rgba(190,40,30,.30)','rgba(40,80,190,.30)','rgba(230,200,40,.32)','rgba(40,140,60,.30)'],r);return{type:'tint',box:[bx,by,bx+bw,by+bh],draw:x=>clipE(x,()=>{x.globalCompositeOperation='color';x.fillStyle=col;x.fillRect(bx,by,bw,bh);x.globalCompositeOperation='source-over'}),desc:`zmieniony odcień fragmentu ${where}`}}
 const ex=cx,ey=cy;return{type:'extra',box:[ex-8,ey-6,ex+8,ey+6],draw:x=>{x.strokeStyle='rgba(30,24,18,.85)';x.lineWidth=1.3;x.beginPath();x.moveTo(ex-5,ey-2);x.quadraticCurveTo(ex-2,ey-4,ex,ey+1);x.quadraticCurveTo(ex+2,ey-4,ex+5,ey-2);x.stroke()},desc:`dodatkowy drobny element ${where}`}}
function genMut(r,L,used){if(SC.real)return genMutReal(r,used);const cands=L.map((s,i)=>({s,i})).filter(({s,i})=>['rect','ell','poly'].includes(s.t)&&!s.hidden&&!s.noHit&&s.reg&&!used.has(i)).filter(({s})=>{const b=bboxOf(s),a=(b[2]-b[0])*(b[3]-b[1]);return a>15&&a<12000&&b[0]>-1&&b[2]<W+1&&b[1]>-1&&b[3]<H+1});
 const type=pick(['shift','shift','scale','remove','tint','extra','sig'],r),cm=pxPerCm();
 if(type==='sig'){const txt=ART.sig.text.replace(/(\d)(?!.*\d)/,d=>String((+d+1)%10));return{type,txt,box:[C.sig.x,C.sig.y-16,C.sig.x+C.sig.w,C.sig.y+6],desc:`inna ostatnia cyfra w sygnaturze („${txt}”)`}}
 if(type==='extra'){const sky=!!SC.REG.niebo,bx=40+r()*(W-80),by=sky?18+r()*H*0.22:40+r()*(H-80);return{type,sky,bx,by,box:[bx-7,by-5,bx+7,by+5],desc:sky?'dodatkowy, maleńki ptak na niebie':'dodatkowa drobna plamka farby'}}
 const c=pick(cands,r);used.add(c.i);const b0=bboxOf(c.s);
 if(type==='shift'){const dx=(r()<.5?-1:1)*(4+r()*5),dy=r()<.5?0:(r()<.5?-1:1)*(2+r()*3);return{type,i:c.i,dx,dy,box:[b0[0]+Math.min(0,dx),b0[1]+Math.min(0,dy),b0[2]+Math.max(0,dx),b0[3]+Math.max(0,dy)],desc:`przesunięty element (${c.s.reg}) o ok. ${fmt((Math.hypot(dx,dy)/cm).toFixed(1))} cm`}}
 if(type==='scale'){const k=r()<.5?0.82:1.2,cx=(b0[0]+b0[2])/2,cy=(b0[1]+b0[3])/2,e=Math.max(1,k);return{type,i:c.i,k,cx,cy,box:[cx-(cx-b0[0])*e,cy-(cy-b0[1])*e,cx+(b0[2]-cx)*e,cy+(b0[3]-cy)*e],desc:`element (${c.s.reg}) ${k>1?'powiększony':'pomniejszony'} o ok. ${Math.round(Math.abs(k-1)*100)}%`}}
 if(type==='remove')return{type,i:c.i,box:b0,desc:`brak elementu (${c.s.reg})`};
 const col=pick(['rgba(190,40,30,.38)','rgba(40,80,190,.38)','rgba(230,200,40,.4)','rgba(40,140,60,.38)'],r);return{type:'tint',i:c.i,col,box:b0,desc:`zmieniony odcień elementu (${c.s.reg})`}}
function applyMuts(L0,muts,p){const L=L0.map(cloneShape),add=[];
 for(const m of muts){if(m.draw){add.push(Sd(m.draw));continue}const s=L[m.i];if(m.type==='shift')xform(s,q=>[q[0]+m.dx,q[1]+m.dy]);else if(m.type==='scale')xform(s,q=>[m.cx+(q[0]-m.cx)*m.k,m.cy+(q[1]-m.cy)*m.k]);
  else if(m.type==='remove'){s.hidden=true;s.noHit=true}else if(m.type==='tint')add.push({...cloneShape(s),fill:m.col,noHit:true});
  else if(m.type==='extra')add.push(m.sky?Sl([[m.bx-5,m.by-2],[m.bx,m.by+1],[m.bx+5,m.by-2]],'#3a3530',1.2):Se(null,m.bx,m.by,2.4,2,'rgba(40,30,20,.85)',{noHit:true}));
  else if(m.type==='sig')p.sigText=m.txt}return L.concat(add)}
function newMemory(r){setupScene(r);MEM.seed=(r()*1e9)|0;MEM.reveal=false;MEM.phase=1;MEM.lens=null;
 const o={orig:true,profile:null,t:{},seed:MEM.seed,letter:'O'};basePainting(o,r);o.muts=[];o.x=G;o.y=G;P=[o];BW=W+2*G;BH=H+2*G;
 MEM.left=MEM.time||60;clearInterval(MEM.iv);MEM.iv=setInterval(()=>{MEM.left--;memUI();if(MEM.left<=0)memPhase2(r)},1000);memUI()}
function memPhase2(r){clearInterval(MEM.iv);if(MEM.phase!==1)return;MEM.phase=2;const o=P[0],base=o.shapes,list=[o];
 for(let k=0;k<4;k++){const p={orig:false,profile:null,t:{},seed:MEM.seed,letter:''};basePainting(p,r);p.seed=MEM.seed;const used=new Set(),n=r()<0.4?2:1;p.muts=[];for(let j=0;j<n;j++)p.muts.push(genMut(r,base,used));
  if(p.muts.filter(m=>m.type==='sig').length>1)p.muts.pop();p.shapes=applyMuts(base,p.muts,p);list.push(p)}
 shuffle(list,r);P=list.map((p,i)=>{p.letter='ABCDE'[i];p.umark='';p.x=i<3?G+i*(W+G):G+(W+G)/2+(i-3)*(W+G);p.y=i<3?G:G*2+H;return p});BW=3*W+4*G;BH=2*H+3*G;sel=null;
 fit();memUI();setVerdicts();onChange();toast('Oryginał zniknął. Zaznacz różnice na checkliście i wskaż oryginał.')}
function memUI(){const t=document.getElementById('memtimer'),b=document.getElementById('memready');if(!t)return;
 t.textContent=MEM.phase===1?`${MEM.left} s`:'Faza 2';b.style.display=MEM.phase===1?'':'none'}
function memToolsHTML(){return`<div class="grp"><h3>Pamięć eksperta</h3><p class="hint">Faza 1: oglądaj oryginał przez lupę (najedź kursorem) i zapamiętuj szczegóły. Faza 2: oryginał znika, pojawia się 5 prawie identycznych obrazów – 4 falsyfikaty mają po 1–2 minimalne różnice (przesunięcie, rozmiar, odcień, brakujący lub dodatkowy element, cyfra w sygnaturze).</p>
 <label class="cap">Czas oglądania: <select id="memtime">${[30,60,90,120].map(v=>`<option${v===+(MEM.time||60)?' selected':''}>${v}</option>`).join('')}</select> s</label>
 <div id="memtimer" style="font:600 34px Georgia,serif;color:var(--acc);margin:10px 0"></div><button class="btn primary" id="memready">Jestem gotów</button></div>`}
