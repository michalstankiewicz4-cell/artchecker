"use strict";
/* =====================================================================
   PLANSZA 2D
   ===================================================================== */
function resize(){const dpr=devicePixelRatio||1,r=cv.getBoundingClientRect();cv.width=Math.max(1,r.width*dpr|0);cv.height=Math.max(1,r.height*dpr|0);render()}
function fit(){const r=cv.getBoundingClientRect();const z=Math.min(r.width/BW,r.height/BH)*0.96;vw={z,x:(r.width-BW*z)/2,y:(r.height-BH*z)/2};render();scheduleGates()}
function focusRect(x,y,w,h){const r=cv.getBoundingClientRect();const z=Math.min(24,Math.min(r.width/w,r.height/h)*0.92);vw={z,x:r.width/2-(x+w/2)*z,y:r.height/2-(y+h/2)*z};render();scheduleGates()}
function zoomAt(sx,sy,f){const z=Math.min(24,Math.max(0.12,vw.z*f)),k=z/vw.z;vw.x=sx-(sx-vw.x)*k;vw.y=sy-(sy-vw.y)*k;vw.z=z;render();scheduleGates()}
function viewportWorld(){const r=cv.getBoundingClientRect();return{x0:-vw.x/vw.z,y0:-vw.y/vw.z,x1:(r.width-vw.x)/vw.z,y1:(r.height-vw.y)/vw.z,cx:(r.width/2-vw.x)/vw.z,cy:(r.height/2-vw.y)/vw.z}}
function areaOK(p,area,v){if(p.note)return noteArea(p,area,v);const lx=v.cx-p.x,ly=v.cy-p.y,inP=lx>=0&&lx<=W&&ly>=0&&ly<=H&&!(p.frag&&inPoly(lx,ly,p.frag.missing));
 if(area==='all')return inP;
 if(area==='sig'){const s=C.sig;return lx>s.x-25&&lx<s.x+s.w+25&&ly>s.y-32&&ly<s.y+18}
 if(area==='style'){const[x,y,w,h]=SC.styleRect(C);return lx>=x&&lx<=x+w&&ly>=y&&ly<=y+h}
 if(area==='ground'){if(!p.frag)return false;if(distPath(lx,ly,p.frag.torn)<14)return true;return p.frag.losses.some(l=>Math.hypot(lx-l.cx,ly-l.cy)<l.r+6)}return false}
function polyPath(x,pts,ox,oy){pts.forEach((q,i)=>i?x.lineTo(ox+q[0],oy+q[1]):x.moveTo(ox+q[0],oy+q[1]));x.closePath()}
function render(){if(MODE==='sculpt'||!P.length||!ART)return;const dpr=devicePixelRatio||1,v=curView();
 ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#0e0c0a';ctx.fillRect(0,0,cv.width,cv.height);
 ctx.setTransform(dpr*vw.z,0,0,dpr*vw.z,dpr*vw.x,dpr*vw.y);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
 for(const p of P){
  if(p.note){ctx.fillStyle='rgba(0,0,0,.5)';ctx.fillRect(p.x+6,p.y+8,W,H)}
  if(v!=='back'&&!p.frag&&!p.note){ctx.fillStyle=lin(p.x-28,p.y-28,p.x+W+28,p.y+H+28,[[0,'#8a6a2a'],[.5,'#d6b058'],[1,'#6e521e']])(ctx);ctx.fillRect(p.x-28,p.y-28,W+56,H+56);ctx.fillStyle='#4a3712';ctx.fillRect(p.x-6,p.y-6,W+12,H+12)}
  if(p.frag){ctx.fillStyle='#1c1814';ctx.fillRect(p.x-60,p.y-60,W+120,H+120);ctx.save();ctx.beginPath();ctx.rect(p.x,p.y,W,H);polyPath(ctx,p.frag.missing,p.x,p.y);ctx.clip('evenodd')}
  ctx.drawImage(getView(p,v),p.x,p.y,W,H);
  if(p.note&&v==='normal')noteLive(p);
  if(p.frag){ctx.strokeStyle='rgba(35,18,5,.35)';ctx.lineWidth=14;ctx.beginPath();polyPath(ctx,p.frag.torn,p.x,p.y);ctx.stroke();ctx.strokeStyle='rgba(30,14,4,.6)';ctx.lineWidth=5;ctx.stroke();ctx.restore();drawFringe(p)}
  if(['normal','crackview'].includes(v))for(const s of p.samples){ctx.strokeStyle=s.kind==='pigment'?'#ffe066':'#7fd6ff';ctx.lineWidth=Math.max(0.15,1.2/vw.z);ctx.beginPath();ctx.arc(p.x+s.x,p.y+s.y,Math.max(0.6,4/Math.sqrt(vw.z)),0,7);ctx.stroke()}
 }
 drawDetail(v);
 for(const p of P){
  if(p.umark==='excl'){ctx.fillStyle='rgba(0,0,0,.55)';ctx.fillRect(p.x,p.y,W,H);ctx.strokeStyle='rgba(224,88,79,.85)';ctx.lineWidth=10;ctx.beginPath();ctx.moveTo(p.x+30,p.y+30);ctx.lineTo(p.x+W-30,p.y+H-30);ctx.moveTo(p.x+W-30,p.y+30);ctx.lineTo(p.x+30,p.y+H-30);ctx.stroke()}
  const nc=p.check?Object.values(p.check).filter(Boolean).length:0;if(nc&&!(MODE==='memory'&&MEM.phase===1)){ctx.fillStyle='#e0584f';ctx.font='bold 26px system-ui';ctx.fillText('⚑ '+nc,p.x-24,p.y-38)}
  if(p.umark==='ok'){ctx.fillStyle='#76b86f';ctx.beginPath();ctx.arc(p.x+W+28,p.y-28,30,0,7);ctx.fill();ctx.fillStyle='#1d1916';ctx.font='bold 38px Georgia';ctx.textAlign='center';ctx.fillText('✓',p.x+W+28,p.y-14);ctx.textAlign='left'}
  if(p.umark==='susp'){ctx.fillStyle='#f0a030';ctx.beginPath();ctx.arc(p.x+W+28,p.y-28,30,0,7);ctx.fill();ctx.fillStyle='#1d1916';ctx.font='bold 40px Georgia';ctx.textAlign='center';ctx.fillText('?',p.x+W+28,p.y-14);ctx.textAlign='left'}
  if(MODE==='memory'&&MEM.reveal&&p.muts)for(const m of p.muts){const[a,b,c2,d]=m.box;ctx.strokeStyle='#ff3b30';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(p.x+(a+c2)/2,p.y+(b+d)/2,(c2-a)/2+12,(d-b)/2+12,0,0,7);ctx.stroke()}
  if(sel===p){ctx.strokeStyle='#ffd27a';ctx.lineWidth=Math.max(3,3/vw.z);ctx.strokeRect(p.x-36,p.y-36,W+72,H+72)}
  if(!p.frag){ctx.fillStyle=sel===p?'#ffd27a':'#cbb894';ctx.font='bold 34px Georgia,serif';ctx.textAlign='center';ctx.fillText((MODE==='memory'&&MEM.phase===1?'Oryginał':(p.note?'Banknot ':'Obraz ')+p.letter)+(p.umark==='excl'?(MODE==='memory'||p.note?' – falsyfikat':' – wykluczony'):p.umark==='susp'?' – podejrzany':p.umark==='ok'?' – prawdziwy':''),p.x+W/2,p.y+H+72);ctx.textAlign='left'}}
 ctx.setTransform(dpr,0,0,dpr,0,0);
 if(vw.z>=3){const r=cv.getBoundingClientRect(),L=pxPerCm()*vw.z,x0=12,y0=r.height-46;ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(x0-6,y0-20,L+60,32);ctx.fillStyle='#fff';ctx.fillRect(x0,y0,L,3);
  for(let i=0;i<=10;i++)ctx.fillRect(x0+L*i/10-0.5,y0-(i%5?4:8),1,i%5?4:8);ctx.font='11px system-ui';ctx.fillText('1 cm',x0+L+6,y0+4)}
 if(MODE==='memory'&&MEM.lens){const{sx,sy}=MEM.lens,wx=(sx-vw.x)/vw.z,wy=(sy-vw.y)/vw.z,p=P.find(q=>wx>=q.x&&wx<=q.x+W&&wy>=q.y&&wy<=q.y+H);
  if(p){const R=115,src=R/(vw.z*4);ctx.save();ctx.beginPath();ctx.arc(sx,sy,R,0,7);ctx.clip();ctx.fillStyle='#000';ctx.fillRect(sx-R,sy-R,2*R,2*R);
   ctx.drawImage(getView(p,'normal'),(wx-p.x-src)*S,(wy-p.y-src)*S,2*src*S,2*src*S,sx-R,sy-R,2*R,2*R);ctx.restore();
   ctx.strokeStyle='#3a2a10';ctx.lineWidth=10;ctx.beginPath();ctx.arc(sx,sy,R+5,0,7);ctx.stroke();ctx.strokeStyle='#d6b058';ctx.lineWidth=3;ctx.stroke()}}
 document.getElementById('zlv').textContent='×'+(vw.z<1?vw.z.toFixed(2):vw.z.toFixed(1))}
function drawFringe(p){const sp=pxPerCm()/p.thread,T=p.frag.torn;ctx.strokeStyle='#cbb68c';
 if(vw.z<2){ctx.lineWidth=2;ctx.beginPath();polyPath(ctx,T,p.x,p.y);ctx.stroke();return}
 let cx=0,cy=0;p.frag.missing.forEach(q=>{cx+=q[0];cy+=q[1]});cx/=p.frag.missing.length;cy/=p.frag.missing.length;ctx.lineWidth=sp*0.35;
 for(let i=1;i<T.length;i++){const a=T[i-1],b=T[i],dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy);let nx=-dy/L,ny=dx/L;const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2;if((cx-mx)*nx+(cy-my)*ny<0){nx=-nx;ny=-ny}
  ctx.beginPath();for(let k=0;k<L;k+=sp){const px=p.x+a[0]+dx*k/L,py=p.y+a[1]+dy*k/L,len=1.5+h1(k+i*97,p.seed%100)*3.5;ctx.moveTo(px,py);ctx.lineTo(px+nx*len,py+ny*len)}ctx.stroke()}}
function drawWeave(p,x0,y0,x1,y1,col){const sp=pxPerCm()/p.thread,sp2=pxPerCm()/(p.thread+1);ctx.strokeStyle=col;
 for(let i=Math.floor((x0-p.x)/sp)-1;i*sp<x1-p.x+sp;i++){const j=p.linen?(h1(i,1)-.5)*sp*0.35:0;ctx.lineWidth=sp*(p.linen?0.25+h1(i,2)*0.3:0.4);ctx.beginPath();ctx.moveTo(p.x+i*sp+j,y0);ctx.lineTo(p.x+i*sp+j,y1);ctx.stroke()}
 for(let i=Math.floor((y0-p.y)/sp2)-1;i*sp2<y1-p.y+sp2;i++){const j=p.linen?(h1(i,3)-.5)*sp2*0.35:0;ctx.lineWidth=sp2*(p.linen?0.25+h1(i,4)*0.3:0.4);ctx.beginPath();ctx.moveTo(x0,p.y+i*sp2+j);ctx.lineTo(x1,p.y+i*sp2+j);ctx.stroke()}}
function drawDetail(view){const z=vw.z;if(z<5)return;const V=viewportWorld();
 for(const p of P){if(p.note)continue;const x0=Math.max(V.x0,p.x),y0=Math.max(V.y0,p.y),x1=Math.min(V.x1,p.x+W),y1=Math.min(V.y1,p.y+H);if(x0>=x1||y0>=y1)continue;
  ctx.save();ctx.beginPath();ctx.rect(p.x,p.y,W,H);if(p.frag)polyPath(ctx,p.frag.missing,p.x,p.y);ctx.clip('evenodd');
  if(view==='back'&&z>=6)drawWeave(p,x0,y0,x1,y1,'rgba(60,42,25,.45)');
  else if(view==='normal'||view==='crackview'){microLayer(p,x0,y0,x1,y1);
   if(p.frag)for(const l of p.frag.losses){if(p.x+l.cx+l.r<x0||p.x+l.cx-l.r>x1||p.y+l.cy+l.r<y0||p.y+l.cy-l.r>y1)continue;ctx.save();ctx.beginPath();polyPath(ctx,l.pts,p.x,p.y);ctx.clip();drawWeave(p,x0,y0,x1,y1,'rgba(110,85,50,.4)');ctx.restore()}
   if(p.t.mark&&z>=6){ctx.font='italic 2.4px Georgia';ctx.fillStyle='rgba(30,18,8,.65)';ctx.fillText(p.markTxt,p.x+p.markPos.x,p.y+p.markPos.y)}}
  ctx.restore()}}
function microLayer(p,x0,y0,x1,y1){const T=5,mode=microMode(p);ctx.globalAlpha=Math.min(1,(vw.z-5)/3+0.35);
 for(let ty=Math.floor((y0-p.y)/T);ty*T<y1-p.y;ty++)for(let tx=Math.floor((x0-p.x)/T);tx*T<x1-p.x;tx++){
  const r=rng(p.seed^Math.imul(tx,73856093)^Math.imul(ty,19349663)),bx=tx*T,by=ty*T,[R,Gc,B]=pix(p,bx+T/2,by+T/2),X=p.x+bx,Y=p.y+by;
  if(mode==='brush'){const dir=(SC.REG[regionAtP(p,bx+T/2,by+T/2)]||{}).dir,base={h:0,v:1.57,diag:0.3,hv:r()<.5?0:1.57}[dir]??r()*6.28;ctx.lineWidth=0.12;
   for(let k=0;k<3;k++){const a=base+(r()-.5)*0.25,sx=X+r()*T,sy=Y+r()*T,l=2+r()*3;ctx.strokeStyle=`rgba(255,255,255,${.06+r()*.08})`;ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(sx+Math.cos(a)*l,sy+Math.sin(a)*l);ctx.stroke();
    ctx.strokeStyle=`rgba(0,0,0,${.08+r()*.1})`;ctx.beginPath();ctx.moveTo(sx,sy+0.18);ctx.lineTo(sx+Math.cos(a)*l,sy+0.25+Math.sin(a)*l);ctx.stroke()}
   for(let k=0;k<4;k++){const cx=X+r()*T,cy=Y+r()*T,s=0.06+Math.pow(r(),2)*0.35,j=(r()-.5)*70;ctx.fillStyle=`rgb(${R+j+(r()-.5)*14|0},${Gc+j+(r()-.5)*14|0},${B+j+(r()-.5)*14|0})`;ctx.beginPath();for(let q=0;q<5;q++){const a=q/5*6.283+r()*.6,rr=s*(0.5+r()*0.7);q?ctx.lineTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr):ctx.moveTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr)}ctx.fill()}}
  else if(mode==='print'){ctx.fillStyle='rgba(244,241,234,.55)';ctx.fillRect(X,Y,T,T);const w=[1-R/255,1-Gc/255,1-B/255],k=Math.min(...w),pr=[w[0]-k,w[1]-k,w[2]-k,k*1.4],cols=['rgba(0,160,210,.8)','rgba(210,0,120,.8)','rgba(235,210,0,.85)','rgba(20,20,20,.8)'],sum=pr.reduce((a,b)=>a+b,0)+0.001;
   for(let i=0;i<34;i++){let u=r()*sum*1.2,ci=0;while(ci<4&&u>pr[ci]){u-=pr[ci];ci++}if(ci>3)continue;ctx.fillStyle=cols[ci];ctx.beginPath();ctx.arc(X+r()*T,Y+r()*T,0.16,0,7);ctx.fill()}}
  else{ctx.fillStyle='rgba(255,255,255,.07)';ctx.beginPath();ctx.ellipse(X+T/2,Y+T/2,T*0.45,T*0.25,r()*3,0,7);ctx.fill();ctx.fillStyle=`rgb(${R+12},${Gc+12},${B+12})`;for(let i=0;i<10;i++)ctx.fillRect(X+r()*T,Y+r()*T,0.09,0.09)}}
 ctx.globalAlpha=1}
let gateT=0;function scheduleGates(){clearTimeout(gateT);gateT=setTimeout(checkGates2D,140)}
function checkGates2D(){if(MODE==='sculpt')return;const v=viewportWorld(),T=tool&&TB[tool],view=curView();let ch=false;
 for(const p of P){
  if(T&&T.gate&&T.gate.area&&vw.z>=T.gate.z&&tiltOK(T.gate)&&areaOK(p,T.gate.area,v)&&!p.notes[tool]){if(note(p,tool,obs(p,tool))){ch=true;toast(`Zapisano: ${MODE==='frag'?'fragment':(p.note?'banknot ':'obraz ')+p.letter} – ${T.name}`)}}
  if(MODE==='paint5'&&view==='back'&&vw.z>=8&&areaOK(p,'all',v)&&!p.notes.weave){note(p,'weave',obs(p,'weave'));ch=true;toast(`Zapisano: obraz ${p.letter} – gęstość płótna`)}
  if(p.t.mark&&vw.z>=8&&(view==='normal'||view==='crackview')&&!p.notes.mark){const mx=p.x+p.markPos.x,my=p.y+p.markPos.y;if(mx>v.x0&&mx<v.x1&&my>v.y0&&my<v.y1){note(p,'mark',obs(p,'mark'));ch=true;toast(`Odkrycie przy dużym zoomie: obraz ${p.letter} – ukryty napis!`)}}}
 if(ch)onChange();else if(tool)updatePanel()}
const pts=new Map();let drag=null,pinch=null;
cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);pts.set(e.pointerId,{x:e.offsetX,y:e.offsetY});
 if(pts.size===1)drag={sx:e.offsetX,sy:e.offsetY,vx:vw.x,vy:vw.y,moved:false};
 if(pts.size===2){const[a,b]=[...pts.values()];pinch={d:Math.hypot(a.x-b.x,a.y-b.y)};drag=null}});
cv.addEventListener('pointerleave',()=>{if(MODE==='memory'){MEM.lens=null;render()}});
cv.addEventListener('pointermove',e=>{if(MODE==='memory'){MEM.lens={sx:e.offsetX,sy:e.offsetY};render()}if(!pts.has(e.pointerId))return;pts.set(e.pointerId,{x:e.offsetX,y:e.offsetY});
 if(pinch&&pts.size===2&&MODE!=='memory'){const[a,b]=[...pts.values()],d=Math.hypot(a.x-b.x,a.y-b.y);zoomAt((a.x+b.x)/2,(a.y+b.y)/2,d/pinch.d);pinch.d=d;return}
 if(drag){const dx=e.offsetX-drag.sx,dy=e.offsetY-drag.sy;if(Math.abs(dx)+Math.abs(dy)>4){drag.moved=true;cv.classList.add('drag')}if(drag.moved&&MODE!=='memory'){vw.x=drag.vx+dx;vw.y=drag.vy+dy;render();scheduleGates()}}});
const up=e=>{if(!pts.has(e.pointerId))return;pts.delete(e.pointerId);cv.classList.remove('drag');if(drag&&!drag.moved&&pts.size===0)clickAt(e.offsetX,e.offsetY);if(pts.size<2)pinch=null;if(pts.size===0)drag=null};
cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
cv.addEventListener('wheel',e=>{e.preventDefault();if(MODE==='memory')return;zoomAt(e.offsetX,e.offsetY,Math.exp(-e.deltaY*0.0016))},{passive:false});
function clickAt(sx,sy){const wx=(sx-vw.x)/vw.z,wy=(sy-vw.y)/vw.z,p=P.find(q=>wx>=q.x-30&&wx<=q.x+W+30&&wy>=q.y-30&&wy<=q.y+H+80);if(!p)return;sel=p;
 const lx=wx-p.x,ly=wy-p.y,T=tool&&TB[tool];
 if(T&&T.probe==='mag'&&p.note){const inMag=(lx>596&&ly>22&&ly<50)||(lx>194&&lx<214&&ly>236&&ly<336)||(lx>290&&lx<440&&ly>85&&ly<330);
  if(!inMag)toast('Brak sygnału w tym miejscu – przyłóż czujnik do numeru seryjnego lub motywu głównego.');else if(note(p,'mag',obsN(p,'mag')))toast(`Banknot ${p.letter}: ${obsN(p,'mag')}`)}
 else if(T&&T.probe&&lx>=0&&lx<W&&ly>=0&&ly<H&&!(p.frag&&inPoly(lx,ly,p.frag.missing))){if(vw.z<T.gate.z)toast(`Przybliż do ×${fmt(T.gate.z)}, aby ${T.probe==='pigment'?'próbka objęła jeden obszar':'zobaczyć mikrostrukturę'}.`);else sampleAt(p,lx,ly)}
 onChange()}
