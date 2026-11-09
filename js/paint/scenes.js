"use strict";
/* =====================================================================
   KSZTAŁTY SCEN
   ===================================================================== */
const Sr=(reg,x,y,w,h,fill,o={})=>({t:'rect',reg,x,y,w,h,fill,...o});
const Se=(reg,cx,cy,rx,ry,fill,o={})=>({t:'ell',reg,cx,cy,rx,ry,rot:0,fill,...o});
const Sp=(reg,pts,fill,o={})=>({t:'poly',reg,pts,fill,...o});
const Sl=(pts,stroke,lw,o={})=>({t:'line',pts,stroke,lw,noHit:true,...o});
const Sd=fn=>({t:'deco',fn,noHit:true});
function pathShape(x,s){x.beginPath();if(s.t==='rect')x.rect(s.x,s.y,s.w,s.h);else if(s.t==='ell')x.ellipse(s.cx,s.cy,s.rx,s.ry,s.rot,0,Math.PI*2);else{s.pts.forEach((q,i)=>i?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1]));if(s.t==='poly')x.closePath()}}
function drawShapes(x,L,r){for(const s of L){if(s.hidden)continue;if(s.t==='deco'){s.fn(x,r);continue}pathShape(x,s);
 if(s.t==='line'){x.strokeStyle=s.stroke;x.lineWidth=s.lw;x.lineCap='round';x.lineJoin='round';x.stroke();continue}
 x.fillStyle=typeof s.fill==='function'?s.fill(x):s.fill;x.fill()}}
function hitShape(s,x,y){if(s.t==='rect')return x>=s.x&&x<=s.x+s.w&&y>=s.y&&y<=s.y+s.h;
 if(s.t==='ell'){const dx=(x-s.cx)/s.rx,dy=(y-s.cy)/s.ry;return dx*dx+dy*dy<=1}
 if(s.t==='poly')return inPoly(x,y,s.pts);return false}
function contour(s){if(s.t==='rect')return[[s.x,s.y],[s.x+s.w,s.y],[s.x+s.w,s.y+s.h],[s.x,s.y+s.h]];
 if(s.t==='ell'){const a=[];for(let i=0;i<22;i++){const t=i/22*6.283;a.push([s.cx+Math.cos(t)*s.rx,s.cy+Math.sin(t)*s.ry])}return a}return s.pts}

/* ---------------- PEJZAŻ ---------------- */
function foliage(x,t,r){const cy=t.y-t.s*1.7,cols=['#2c4521','#34522a','#3e5d2c','#4a6a33'];
 for(let i=0;i<10;i++){const a=r()*6.28,d=r()*0.55;x.fillStyle=pick(cols,r);x.beginPath();x.arc(t.x+Math.cos(a)*t.s*d,cy+Math.sin(a)*t.s*d*0.8,t.s*(0.42+r()*0.2),0,7);x.fill()}
 for(let i=0;i<6;i++){x.fillStyle='rgba(135,160,85,.55)';x.beginPath();x.arc(t.x-t.s*(0.2+r()*0.4),cy-t.s*(0.1+r()*0.4),t.s*(0.12+r()*0.12),0,7);x.fill()}}
function clouds(r,n,y0,y1){const a=[];for(let k=0;k<n;k++){const cx=W*(0.28+r()*0.66),cy=H*(y0+r()*(y1-y0)),sz=24+r()*26;for(let i=0;i<5;i++)a.push({x:cx+(r()-.5)*sz*2.2,y:cy+(r()-.5)*sz*0.4,rx:sz*(0.5+r()*0.5),ry:sz*(0.24+r()*0.18)})}return a}
const SCENES={};
SCENES.pejzaz={W:640,H:480,bg:'grunt',
 REG:{niebo:{pig:['ultr','pb'],dir:'h',an:'phB'},chmury:{pig:['pb','ochy'],dir:'swirl',an:'tiw'},'góry':{pig:['ultr','pb','ochy'],dir:'h'},grunt:{pig:['ochy','sien','umb'],dir:'diag',an:'hansa'},
  droga:{pig:['ochy','pb'],dir:'diag'},woda:{pig:['prus','pb'],dir:'h',an:'phB'},dom:{pig:['pb','ochr'],dir:'hv',an:'tiw'},dach:{pig:['ochr','umb'],dir:'hv'},'pień':{pig:['umb'],dir:'v'},
  listowie:{pig:['vir','ochy'],dir:'dab',an:'phG'},'postać':{pig:['cyn','pb'],dir:'v',an:'quin'},karnacja:{pig:['pb','ochr','cyn'],dir:'dab'}},
 make(r){const c={ph:r()*6};c.hz=H*(0.42+r()*0.07);
  c.sun={x:W*(0.08+r()*0.1),y:H*(0.08+r()*0.06)};c.clouds=clouds(r,3+Math.floor(r()*2),0.07,0.27);
  c.lake={x:W*(0.2+r()*0.18),y:c.hz+26,rx:115+r()*35,ry:15+r()*6};c.house={x:W*(0.66+r()*0.06),y:c.hz+20,w:64,h:42};c.fig={x:W*(0.44+r()*0.12),y:H*0.86,h:74};
  c.trees=[];for(let i=0;i<4;i++){let x=W*(0.06+(i/4)*0.9+r()*0.06);if(Math.abs(x-c.fig.x)<60)x+=70;if(x>c.house.x-30&&x<c.house.x+100)x=c.house.x-40-r()*20;c.trees.push({x,y:c.hz+48+r()*60,s:22+r()*14})}
  c.trees.sort((a,b)=>a.y-b.y);return c},
 hill:(c,x)=>c.hz-22-14*Math.sin(x*0.012+c.ph)-7*Math.sin(x*0.029+c.ph*2),
 near:(c,x)=>c.hz-6-5*Math.sin(x*0.021+c.ph*3),
 build(c,err){const L=[],an=err==='anatomy',sw=err==='shadow',sc=SCENES.pejzaz;
  L.push(Sr('niebo',0,0,W,c.hz+4,lin(0,0,0,c.hz,[[0,'#58799d'],[.7,'#a7bacb'],[1,'#e2d5b6']])));
  L.push(Sd(x=>{x.fillStyle=rad(c.sun.x,c.sun.y,4,170,[[0,'rgba(255,245,212,.95)'],[1,'rgba(255,245,212,0)']])(x);x.fillRect(0,0,W,c.hz)}));
  for(const e of c.clouds)L.push(Se(null,e.x+3,e.y+5,e.rx,e.ry,'rgba(140,146,162,.35)',{noHit:true}));
  for(const e of c.clouds)L.push(Se('chmury',e.x,e.y,e.rx,e.ry,'rgba(245,241,231,.92)'));
  L.push(Sp('góry',[[0,c.hz+3],...range(0,W,8).map(i=>[i,sc.hill(c,i)]),[W,c.hz+3]],'#84939c',{outline:true}));
  L.push(Sd((x,r)=>{x.strokeStyle='rgba(225,230,235,.35)';x.lineWidth=1.2;for(let i=0;i<W;i+=26){const y=sc.hill(c,i);x.beginPath();x.moveTo(i,y+1);x.lineTo(i+10+r()*10,sc.hill(c,i+14)+3);x.stroke()}}));
  L.push(Sp('góry',[[0,c.hz+3],...range(0,W,8).map(i=>[i,sc.near(c,i)]),[W,c.hz+3]],'#71805a'));
  L.push(Sd(x=>{x.fillStyle=lin(0,c.hz-40,0,c.hz+12,[[0,'rgba(226,220,200,0)'],[.7,'rgba(226,220,200,.38)'],[1,'rgba(226,220,200,.15)']])(x);x.fillRect(0,c.hz-40,W,52)}));
  L.push(Sr('grunt',0,c.hz,W,H-c.hz,lin(0,c.hz,0,H,[[0,'#86904f'],[.5,'#6b6a34'],[1,'#4c4224']])));
  L.push(Sd((x,r)=>{for(let i=0;i<320;i++){const yy=c.hz+Math.pow(r(),1.4)*(H-c.hz),k=(yy-c.hz)/(H-c.hz);x.fillStyle=`hsla(${50+r()*40},${30+r()*20}%,${25+r()*18}%,.35)`;x.beginPath();x.ellipse(r()*W,yy,6+k*40*r(),1+k*4,0,0,7);x.fill()}}));
  const lk=c.lake;L.push(Se('woda',lk.x,lk.y,lk.rx,lk.ry,lin(0,lk.y-lk.ry,0,lk.y+lk.ry,[[0,'#9ab8c6'],[1,'#56798f']]),{outline:true}));
  L.push(Sd((x,r)=>{x.strokeStyle='rgba(235,238,228,.55)';x.lineWidth=1;for(let i=0;i<22;i++){const yy=lk.y+(r()-.5)*lk.ry*1.3,xx=lk.x+(r()-.5)*lk.rx*1.4;x.beginPath();x.moveTo(xx,yy);x.lineTo(xx+8+r()*14,yy);x.stroke()}}));
  L.push(Sd(x=>{x.save();x.beginPath();x.ellipse(lk.x,lk.y,lk.rx,lk.ry,0,0,7);x.clip();x.fillStyle='rgba(225,232,236,.35)';x.fillRect(lk.x-lk.rx,lk.y-lk.ry,lk.rx*2,lk.ry*0.5);x.strokeStyle='rgba(50,60,40,.45)';x.lineWidth=3;x.beginPath();x.ellipse(lk.x,lk.y+1,lk.rx,lk.ry,0,Math.PI*1.05,Math.PI*1.95);x.stroke();x.restore()}));
  const hs=c.house,f=c.fig,pth=[];
  for(let i=0;i<=12;i++)pth.push(quad(i/12,[W*0.4,H],[f.x-14,f.y-34],[hs.x+hs.w*0.44,hs.y+1]));
  for(let i=0;i<=12;i++)pth.push(quad(i/12,[hs.x+hs.w*0.56,hs.y+1],[f.x+34,f.y-22],[W*0.62,H]));
  L.push(Sp('droga',pth,'#a8905c'));
  L.push(Sd((x,r)=>{x.strokeStyle='rgba(70,52,28,.4)';x.lineWidth=1.2;for(let i=0;i<40;i++){const t=r(),q=quad(t,[W*0.4,H],[f.x-14,f.y-34],[hs.x+hs.w*0.44,hs.y+1]),q2=quad(t,[W*0.62,H],[f.x+34,f.y-22],[hs.x+hs.w*0.56,hs.y+1]),u=r(),px=q[0]+(q2[0]-q[0])*u,py=q[1]+(q2[1]-q[1])*u,l=2+t*10;x.beginPath();x.moveTo(px,py);x.lineTo(px+l,py+(r()-.5));x.stroke()}}));
  const x0=hs.x,y0=hs.y,w=hs.w,h=hs.h,d=24,dy=8,rh=30;
  L.push(Sp(null,[[x0+w,y0],[x0+w+d,y0-dy],[x0+w+d+44,y0+3],[x0+w+12,y0+7]],'rgba(25,28,12,.35)',{noHit:true}));
  L.push(Sp('dom',[[x0+w,y0],[x0+w+d,y0-dy],[x0+w+d,y0-dy-h],[x0+w,y0-h]],'#9c8c70',{outline:true}));
  L.push(Sr('dom',x0,y0-h,w,h,'#e4d9c0',{outline:true}));
  L.push(Sp('dach',[[x0-4,y0-h],[x0+w/2,y0-h-rh],[x0+w+4,y0-h]],'#8a4a30',{outline:true}));
  L.push(Sp('dach',[[x0+w/2,y0-h-rh],[x0+w/2+d,y0-h-rh-dy],[x0+w+d+4,y0-h-dy],[x0+w+4,y0-h]],'#64331f'));
  L.push(Sr(null,x0+w*0.66,y0-h-rh*0.9,7,rh*0.55,'#6e4a36',{noHit:true}));L.push(Sd((x,r)=>{for(let i=0;i<6;i++){x.fillStyle=`rgba(225,225,220,${.22-i*.03})`;x.beginPath();x.ellipse(x0+w*0.66+3+i*7,y0-h-rh*0.95-i*9,4+i*2,3+i*1.4,0,0,7);x.fill()}x.strokeStyle='rgba(60,40,25,.5)';x.lineWidth=0.7;for(let k=1;k<5;k++){x.beginPath();x.moveTo(x0+w/2-(w/2+4)*k/5,y0-h-rh+rh*k/5);x.lineTo(x0+w/2+(w/2+4)*k/5,y0-h-rh+rh*k/5);x.stroke()}}));
  L.push(Sr('dom',x0+w*0.42,y0-h*0.55,w*0.16,h*0.55,'#3d2c20'));
  L.push(Sr('dom',x0+w*0.12,y0-h*0.66,w*0.18,h*0.26,'#4a5560'));L.push(Sr('dom',x0+w*0.7,y0-h*0.66,w*0.18,h*0.26,'#4a5560'));
  c.trees.forEach((t,i)=>{const pe=i===0?{dx:26,dy:0}:null;
   L.push(Se(null,t.x+t.s*1.15,t.y+3,t.s*1.45,t.s*0.28,'rgba(25,30,12,.45)',{noHit:true}));
   L.push(Sr('pień',t.x-t.s*0.08,t.y-t.s*1.3,t.s*0.16,t.s*1.3,'#3b2a1a',{outline:true,penti:pe}));
   L.push(Se('listowie',t.x,t.y-t.s*1.7,t.s,t.s*0.85,'',{hidden:true,outline:true,penti:pe}));
   L.push(Sd((x,r)=>foliage(x,t,r)))});
  const X=f.x,Y=f.y,fh=f.h,leg=an?0.3:0.45,headR=an?fh*0.12:fh*0.068,hip=Y-fh*leg,sh=Y-fh*(an?0.7:0.76),dir=sw?-1:1;
  L.push(Sp(null,[[X-4,Y],[X+4,Y],[X+dir*fh*0.78+5,Y+9],[X+dir*fh*0.78-3,Y+11]],'rgba(25,28,12,.5)',{noHit:true}));
  L.push(Sl([[X-3,Y],[X-2,hip]],'#2b2420',3,{outline:true}));L.push(Sl([[X+3,Y],[X+2,hip]],'#2b2420',3,{outline:true}));
  L.push(Sp('postać',[[X-10,hip+4],[X+10,hip+4],[X+7,sh],[X-7,sh]],'#a3302a',{outline:true}));
  L.push(Sp(null,[[X-10,hip+4],[X-2,hip+4],[X-1,sh],[X-7,sh]],'#c84e38',{noHit:true}));
  L.push(Se('karnacja',X,sh-headR,headR,headR,'#d9b08b',{outline:true}));
  L.push(Se(null,X-headR*0.3,sh-headR*1.1,headR*0.45,headR*0.45,'#f0cfa8',{noHit:true}));
  L.push(Se('postać',X,sh-headR*1.65,headR*1.5,headR*0.32,'#2b2420'));
  L.push(Sr('postać',X-headR*0.75,sh-headR*2.5,headR*1.5,headR*0.9,'#2b2420'));
  L.push(Sl([[X+6,sh+3],[X+12,sh+fh*0.24]],'#8a261f',3,{outline:true,irPts:[[X+6,sh+3],[X+17,sh-fh*0.2]]}));
  L.push(Sl([[X+13,sh-6],[X+16,Y+1]],'#4a3420',1.6));
  L.push(Sd((x,r)=>{x.strokeStyle='rgba(40,35,40,.75)';x.lineWidth=1.2;for(let i=0;i<4;i++){const bx=W*(0.55+r()*0.35),by=H*(0.08+r()*0.15),s=3+r()*3;x.beginPath();x.moveTo(bx-s,by-s*0.4);x.quadraticCurveTo(bx-s*0.4,by-s*0.6,bx,by);x.quadraticCurveTo(bx+s*0.4,by-s*0.6,bx+s,by-s*0.4);x.stroke()}
   for(let i=0;i<180;i++){const px=r()*W,py=H-r()*H*0.12,hh=3+r()*9;x.strokeStyle=`hsla(${70+r()*30},${35+r()*20}%,${22+r()*20}%,.7)`;x.lineWidth=0.8;x.beginPath();x.moveTo(px,py);x.quadraticCurveTo(px+(r()-.5)*4,py-hh*0.6,px+(r()-.5)*6,py-hh);x.stroke()}
   for(let i=0;i<26;i++){x.fillStyle=pick(['rgba(240,220,120,.85)','rgba(235,235,230,.85)','rgba(200,80,70,.8)'],r);x.beginPath();x.arc(r()*W,H-r()*H*0.1,1.1+r(),0,7);x.fill()}}));
  return L},
 styleRect:c=>[c.fig.x-80,c.fig.y-c.fig.h-16,160,c.fig.h+32],
 errText:{anatomy:'Głowa postaci wyraźnie za duża względem tułowia, nogi skrócone.',shadow:'Cień postaci pada w lewo, a cienie drzew i domu w prawo.'},
 errWhy:{anatomy:'Błąd anatomiczny – głowa za duża, nogi skrócone.',shadow:'Błąd logiki światła – cień postaci pada w złą stronę.'},
 okText:'Proporcje postaci i kierunek cieni zgodne z dziełem referencyjnym.',
 pentiText:'jedno drzewo pierwotnie w innym miejscu, ramię postaci uniesione',
 compDesc:'Jezioro w lewej części, dom z czerwonym dachem po prawej; na drodze postać w czerwonym płaszczu z laską, w prawidłowych proporcjach. Światło z lewej – wszystkie cienie (drzew, domu, postaci) padają w prawo.',
 hidden:{desc:'zamalowany zarys wiatraka na niebie',draw(x,c,side){const X=side==='r'?W*0.8:W*0.2,Y=c.hz-64;x.fillStyle='rgba(255,255,255,.3)';x.fillRect(X-9,Y,18,60);x.save();x.translate(X,Y);for(let k=0;k<4;k++){x.rotate(Math.PI/2);x.fillRect(-3,-46,6,44)}x.restore()}}
};

/* ---------------- PORTRET ---------------- */
SCENES.portret={W:480,H:600,bg:'tło',
 REG:{'tło':{pig:['umb','bone','sien'],dir:'diag'},'strój':{pig:['ultr','bone'],dir:'v',an:'phB'},'kołnierz':{pig:['pb'],dir:'v',an:'tiw'},broszka:{pig:['au','cyn'],dir:'dab'},
  karnacja:{pig:['pb','ochr','cyn'],dir:'dab',an:'tiw'},'włosy':{pig:['umb','bone'],dir:'swirl'},usta:{pig:['cyn','lake'],dir:'dab',an:'quin'},oczy:{pig:['bone','pb'],dir:'dab'}},
 make(r){return{cx:W*(0.46+r()*0.08),cy:H*(0.33+r()*0.04),fr:54+r()*8,dress:pick(['#23263a','#1d1d22','#24301f'],r)}},
 build(c,err){const L=[],an=err==='anatomy',sw=err==='shadow',{cx,cy,fr}=c,fry=fr*1.3,sh=cy+fry*1.12;
  L.push(Sr('tło',0,0,W,H,rad(W*0.32,H*0.28,10,W*1.05,[[0,'#6e5638'],[1,'#1b130c']])));
  L.push(Sd(x=>{x.fillStyle=rad(cx-fr*0.9,cy-fry*0.6,10,fr*3.2,[[0,'rgba(170,135,90,.35)'],[1,'rgba(170,135,90,0)']])(x);x.fillRect(0,0,W,H)}));
  L.push(Se('włosy',cx+2,cy-fry*0.12,fr*1.22,fry*1.08,'#2e2015',{outline:true,penti:{dx:-16,dy:10}}));
  L.push(Sp('strój',[[cx-W*0.6,H],[cx-W*0.44,sh+80],[cx-fr*1.95,sh+20],[cx-fr*0.55,sh-6],[cx+fr*0.55,sh-6],[cx+fr*1.95,sh+20],[cx+W*0.44,sh+80],[cx+W*0.6,H]],
   lin(cx-fr*2,0,cx+fr*2,0,[[0,'#3a3f58'],[.5,c.dress],[1,'#0e0e14']]),{outline:true}));
  L.push(Sd((x,r)=>{x.lineCap='round';x.filter='blur(4px)';for(let i=0;i<6;i++){const sd=i<3?-1:1,k=i%3,bx=cx+sd*fr*(0.7+k*0.45),top=sh+20+k*25;x.strokeStyle=sd<0?'rgba(150,165,210,.13)':'rgba(0,0,0,.22)';x.lineWidth=9+r()*8;x.beginPath();x.moveTo(bx,top);x.quadraticCurveTo(bx+sd*(20+k*14),(top+H)/2,bx+sd*(40+k*30),H);x.stroke()}x.filter='none';x.fillStyle='rgba(0,0,0,.35)';x.beginPath();x.ellipse(cx,sh+6,fr*0.9,10,0,0,7);x.fill()}));
  L.push(Sp('karnacja',[[cx-fr*0.4,cy+fry*0.55],[cx+fr*0.4,cy+fry*0.55],[cx+fr*0.5,sh+2],[cx-fr*0.5,sh+2]],lin(cx-fr*0.5,0,cx+fr*0.5,0,[[0,'#e2bb95'],[1,'#a67256']])));
  L.push(Sd(x=>{x.fillStyle='rgba(70,35,20,.45)';x.beginPath();x.ellipse(cx+fr*0.12,cy+fry*0.86,fr*0.62,fry*0.2,0,0,7);x.fill()}));
  L.push(Sp('kołnierz',[[cx-fr*0.95,sh-6],[cx-fr*0.55,sh+14],[cx,sh+40],[cx+fr*0.55,sh+14],[cx+fr*0.95,sh-6],[cx+fr*0.5,sh+4],[cx,sh+22],[cx-fr*0.5,sh+4]],'#ece6d7',
   {outline:true,irPts:[[cx-fr*1.35,sh-8],[cx-fr*0.7,sh+24],[cx,sh+58],[cx+fr*0.7,sh+24],[cx+fr*1.35,sh-8]]}));
  L.push(Sd((x,r)=>{x.fillStyle='rgba(255,255,255,.7)';for(let i=0;i<26;i++){const t=i/25,px=cx-fr*0.95+t*fr*1.9,py=sh-6+Math.sin(t*Math.PI)*44;x.beginPath();x.arc(px,py,1.6+r(),0,7);x.fill()}}));
  L.push(Se('broszka',cx,sh+34,8,10,rad(cx-3,sh+30,1,11,[[0,'#ffe9a0'],[.6,'#c8952e'],[1,'#6e4a12']])));
  L.push(Sd(x=>{x.fillStyle='rgba(255,255,240,.95)';x.beginPath();x.arc(cx-3,sh+30,1.6,0,7);x.fill();x.strokeStyle='rgba(110,75,20,.8)';x.lineWidth=1;x.beginPath();x.ellipse(cx,sh+34,8,10,0,0,7);x.stroke()}));
  L.push(Se('karnacja',cx-fr*0.97,cy+(an?fry*0.4:fry*0.04),fr*0.12,fr*0.22,'#c99476'));
  L.push(Se('karnacja',cx,cy,fr,fry,rad(cx-fr*0.45,cy-fry*0.3,4,fr*1.7,[[0,'#f3d4b2'],[.55,'#dcac86'],[1,'#9e6a52']]),{outline:true,penti:{dx:-16,dy:10}}));
  L.push(Sd(x=>{x.save();x.beginPath();x.ellipse(cx,cy,fr,fry,0,0,7);x.clip();x.fillStyle=lin(cx,0,cx+fr,0,[[0,'rgba(80,45,30,0)'],[1,'rgba(80,45,30,.42)']])(x);x.fillRect(cx,cy-fry,fr,fry*2);x.restore()}));
  const hair=[];for(let i=0;i<=16;i++){const t=Math.PI+i/16*Math.PI;hair.push([cx+Math.cos(t)*fr*1.06,cy-fry*0.08+Math.sin(t)*fry*1.02])}
  for(let i=16;i>=0;i--){const t=Math.PI+i/16*Math.PI;hair.push([cx+Math.cos(t)*fr*0.9,cy-fry*0.3+Math.sin(t)*fry*0.42])}
  L.push(Sp('włosy',hair,lin(cx-fr,0,cx+fr,0,[[0,'#4a3424'],[1,'#22170f']])));
  L.push(Sd((x,r)=>{x.lineCap='round';for(let i=0;i<34;i++){const t=Math.PI+0.15+r()*(Math.PI-0.3),rr=0.9+r()*0.15,a0=t-0.25,a1=t+0.25;x.strokeStyle=r()<.6?'rgba(120,88,60,.45)':'rgba(15,10,6,.5)';x.lineWidth=0.8+r()*1.4;x.beginPath();x.ellipse(cx,cy-fry*0.15,fr*rr*1.02,fry*rr*0.95,0,a0,a1);x.stroke()}x.strokeStyle='rgba(20,12,8,.6)';x.lineWidth=1.4;x.beginPath();x.moveTo(cx,cy-fry*1.08);x.quadraticCurveTo(cx-2,cy-fry*0.85,cx+1,cy-fry*0.68);x.stroke()}));
  L.push(Sd(x=>{for(const s of[-1,1]){x.fillStyle='rgba(205,95,80,.16)';x.beginPath();x.ellipse(cx+s*fr*0.5,cy+fry*0.22,fr*0.22,fr*0.14,0,0,7);x.fill()}}));
  const ey=cy-fry*0.1;
  for(const s of[-1,1]){const ex=cx+s*fr*0.4,eyy=ey+(an&&s>0?-11:0),k=(an&&s>0?0.8:1);
   L.push(Se('oczy',ex,eyy,fr*0.17*k,fr*0.075*k,'#efe8dc'));L.push(Se('oczy',ex+1.5,eyy,fr*0.065*k,fr*0.068*k,'#3a2618'));
   L.push(Sd(x=>{const ir=fr*0.065*k;x.save();x.beginPath();x.ellipse(ex,eyy,fr*0.17*k,fr*0.075*k,0,0,7);x.clip();x.fillStyle=rad(ex+1.5,eyy,0,ir,[[0,'#6b4a2e'],[.7,'#4a3020'],[1,'#20140c']])(x);x.beginPath();x.arc(ex+1.5,eyy,ir,0,7);x.fill();x.fillStyle='#0c0806';x.beginPath();x.arc(ex+1.5,eyy,ir*0.42,0,7);x.fill();x.fillStyle='rgba(60,30,20,.35)';x.fillRect(ex-fr*0.2,eyy-fr*0.08*k,fr*0.4,fr*0.035*k);x.restore();x.fillStyle='rgba(255,255,255,.9)';x.beginPath();x.arc(ex+1.5-ir*0.35,eyy-ir*0.35,ir*0.22,0,7);x.fill();x.strokeStyle='rgba(120,70,50,.35)';x.lineWidth=0.8;x.beginPath();x.ellipse(ex,eyy+fr*0.02,fr*0.16*k,fr*0.07*k,0,0.2,Math.PI-0.2);x.stroke()}));
   L.push(Sl([[ex-fr*0.18*k,eyy-2],[ex,eyy-fr*0.1*k],[ex+fr*0.18*k,eyy-2]],'#6b4430',1.4));
   L.push(Sl([[ex-fr*0.2,eyy-fr*0.22],[ex,eyy-fr*0.28],[ex+fr*0.22,eyy-fr*0.22]],'#3a2618',2.2))}
  L.push(Sp('karnacja',[[cx-2,ey+3],[cx-fr*0.1,cy+fry*0.3],[cx+fr*0.13,cy+fry*0.32],[cx+fr*0.04,ey+3]],'#cf9d7c'));
  L.push(Sd(x=>{x.strokeStyle='rgba(255,236,210,.6)';x.lineWidth=2;x.lineCap='round';x.beginPath();x.moveTo(cx-3,ey+6);x.lineTo(cx-fr*0.06,cy+fry*0.24);x.stroke();x.fillStyle='rgba(70,30,20,.55)';for(const d of[-1,1]){x.beginPath();x.ellipse(cx+d*fr*0.07+1,cy+fry*0.33,fr*0.04,fr*0.022,0,0,7);x.fill()}}));
  L.push(Sp(null,sw?[[cx-fr*0.1,cy+fry*0.3],[cx-fr*0.36,cy+fry*0.37],[cx-fr*0.04,cy+fry*0.36]]:[[cx+fr*0.13,cy+fry*0.32],[cx+fr*0.38,cy+fry*0.38],[cx+fr*0.05,cy+fry*0.37]],'rgba(85,45,30,.55)',{noHit:true}));
  L.push(Se('usta',cx+(an?fr*0.16:0),cy+fry*0.53,fr*0.25,fr*0.07,'#a5463c'));
  L.push(Sd(x=>{const mx=cx+(an?fr*0.16:0),my=cy+fry*0.53;x.strokeStyle='rgba(70,20,18,.75)';x.lineWidth=1.3;x.beginPath();x.moveTo(mx-fr*0.25,my);x.quadraticCurveTo(mx,my+fr*0.025,mx+fr*0.25,my);x.stroke();x.fillStyle='rgba(255,210,195,.35)';x.beginPath();x.ellipse(mx-fr*0.03,my+fr*0.04,fr*0.1,fr*0.02,0,0,7);x.fill();x.fillStyle='rgba(90,40,30,.25)';x.beginPath();x.ellipse(mx,my+fr*0.16,fr*0.14,fr*0.04,0,0,7);x.fill()}));
  return L},
 styleRect:c=>[c.cx-c.fr*1.45,c.cy-c.fr*1.56,c.fr*2.9,c.fr*3.0],
 errText:{anatomy:'Oczy na różnych wysokościach, usta przesunięte względem osi twarzy, ucho osadzone za nisko.',shadow:'Cień nosa pada w lewo, choć cała twarz oświetlona jest z lewej (cienie po prawej stronie).'},
 errWhy:{anatomy:'Błąd anatomiczny – asymetria oczu, ust i ucha.',shadow:'Błąd logiki światła – cień nosa po złej stronie.'},
 okText:'Rysy, proporcje twarzy i kierunek światła zgodne z portretem referencyjnym.',
 pentiText:'głowa pierwotnie niżej i bardziej w lewo, kołnierz szerszy',
 compDesc:'Półpostać kobiety w ciemnej sukni z białym koronkowym kołnierzem i złotą broszą. Twarz symetryczna, oczy na jednej wysokości, usta w osi twarzy. Światło z lewej – cień nosa i zacieniony policzek po prawej stronie.',
 hidden:{desc:'zamalowany kapelusz z szerokim rondem',draw(x,c){x.fillStyle='rgba(255,255,255,.27)';x.beginPath();x.ellipse(c.cx,c.cy-c.fr*1.2,c.fr*1.9,c.fr*0.33,0,0,7);x.fill();x.beginPath();x.ellipse(c.cx,c.cy-c.fr*1.55,c.fr*0.95,c.fr*0.5,0,0,7);x.fill()}}
};

/* ---------------- MARTWA NATURA ---------------- */
SCENES.martwa={W:640,H:480,bg:'tło',
 REG:{'tło':{pig:['umb','bone'],dir:'diag'},'stół':{pig:['sien','umb'],dir:'h'},obrus:{pig:['pb'],dir:'v',an:'tiw'},dzban:{pig:['cob','pb'],dir:'v',an:'phB'},misa:{pig:['ochr','pb'],dir:'h'},
  owoce:{pig:['lake','ochy','pb'],dir:'dab',an:'quin'},winogrona:{pig:['lake','ultr'],dir:'dab',an:'diox'},cytryna:{pig:['naples','pb'],dir:'dab',an:'hansa'}},
 make(r){const ty=H*(0.6+r()*0.04);return{ty,jx:W*(0.22+r()*0.06),jw:72,jh:150,bx:W*(0.6+r()*0.05),by:ty-34,brx:88,lx:W*(0.38+r()*0.08),ly:ty+62}},
 build(c,err){const L=[],an=err==='anatomy',sw=err==='shadow',t=an?16:0;
  L.push(Sr('tło',0,0,W,c.ty+20,lin(0,0,W,0,[[0,'#4c3d29'],[1,'#1d170f']])));
  L.push(Sd(x=>{x.fillStyle=rad(W*0.18,H*0.15,10,W*0.7,[[0,'rgba(190,160,110,.35)'],[1,'rgba(190,160,110,0)']])(x);x.fillRect(0,0,W,c.ty+20)}));
  L.push(Sp('stół',[[0,c.ty+t],[W,c.ty-t],[W,H],[0,H]],lin(0,c.ty,0,H,[[0,'#7c5232'],[1,'#3b2414']]),{outline:true}));
  L.push(Sl([[0,c.ty+t],[W,c.ty-t]],'#a8784c',2));
  L.push(Sd((x,r)=>{x.strokeStyle='rgba(30,16,8,.35)';x.lineWidth=1;for(let i=0;i<14;i++){const yy=c.ty+12+r()*(H-c.ty-12);x.beginPath();x.moveTo(W*0.45,yy);x.bezierCurveTo(W*0.6,yy+(r()-.5)*6,W*0.8,yy+(r()-.5)*6,W,yy+(r()-.5)*4);x.stroke()}}));
  L.push(Sp('obrus',[[W*0.04,c.ty+6+t*0.9],[W*0.47,c.ty+4],[W*0.43,H],[W*0.08,H]],lin(W*0.04,0,W*0.47,0,[[0,'#f2ede2'],[1,'#b9b2a2']]),{outline:true}));
  L.push(Sd((x,r)=>{x.strokeStyle='rgba(120,112,100,.4)';x.lineWidth=2;for(let i=0;i<6;i++){const xx=W*(0.09+i*0.06+r()*0.02);x.beginPath();x.moveTo(xx,c.ty+12);x.quadraticCurveTo(xx+(r()-.5)*20,(c.ty+H)/2,xx-6+r()*8,H);x.stroke()}}));
  L.push(Se(null,c.jx+(sw?-1:1)*c.jw*0.9,c.ty+4,c.jw*0.9,9,'rgba(20,12,6,.45)',{noHit:true}));
  L.push(Se(null,c.bx+c.brx*0.5,c.ty+8,c.brx*0.9,10,'rgba(20,12,6,.45)',{noHit:true}));
  L.push(Se(null,c.lx+26,c.ly+10,26,7,'rgba(20,12,6,.45)',{noHit:true}));
  L.push(Sl([[c.jx+c.jw*0.35,c.ty-c.jh*0.86],[c.jx+c.jw*0.78,c.ty-c.jh*0.7],[c.jx+c.jw*0.48,c.ty-c.jh*0.34]],'#3e5367',7,{outline:true}));
  L.push(Sp('dzban',[[c.jx-c.jw*0.2,c.ty-c.jh*0.66],[c.jx+c.jw*0.2,c.ty-c.jh*0.66],[c.jx+c.jw*0.28,c.ty-c.jh],[c.jx-c.jw*0.28,c.ty-c.jh]],lin(c.jx-c.jw*0.3,0,c.jx+c.jw*0.3,0,[[0,'#a9bccd'],[1,'#34485c']]),{outline:true}));
  L.push(Se('dzban',c.jx,c.ty-c.jh*0.33,c.jw*0.52,c.jh*0.36,lin(c.jx-c.jw*0.5,0,c.jx+c.jw*0.5,0,[[0,'#b6c8d6'],[.45,'#6f88a0'],[1,'#26364a']]),{outline:true}));
  L.push(Se('dzban',c.jx,c.ty-c.jh,c.jw*0.28,5,'#22303e'));
  L.push(Se(null,c.jx-c.jw*0.22,c.ty-c.jh*0.42,6,16,'rgba(255,255,255,.55)',{noHit:true}));
  L.push(Sd(x=>{x.fillStyle='rgba(255,255,255,.75)';x.fillRect(c.jx-c.jw*0.3,c.ty-c.jh*0.52,3,9);x.fillRect(c.jx-c.jw*0.25,c.ty-c.jh*0.52,3,9);x.strokeStyle='rgba(220,235,245,.55)';x.lineWidth=1.4;x.beginPath();x.ellipse(c.jx,c.ty-c.jh,c.jw*0.28,5,0,Math.PI,Math.PI*2);x.stroke();x.strokeStyle='rgba(20,28,40,.55)';x.lineWidth=2;x.beginPath();x.ellipse(c.jx,c.ty-c.jh*0.08,c.jw*0.46,6,0,0,Math.PI);x.stroke();
   x.strokeStyle='rgba(25,40,65,.45)';x.lineWidth=2.5;x.beginPath();x.ellipse(c.jx,c.ty-c.jh*0.42,c.jw*0.5,7,0,0.15,Math.PI-0.15);x.stroke()}));
  const ry=an?c.brx*0.52:c.brx*0.2;
  L.push(Se('misa',c.bx,c.by,c.brx,ry,'#5c3b1f',{outline:true}));
  const cols=[['#ffb070','#c0301e','#5e120a'],['#fff0a0','#d8a030','#7a4a10'],['#ff9a80','#b02818','#4e0c06']];
  for(let i=0;i<3;i++){const ax=c.bx-34+i*32,ay=c.by-10-(i===1?10:0),cl=cols[i];L.push(Se('owoce',ax,ay,18,17,rad(ax-6,ay-6,2,22,[[0,cl[0]],[.55,cl[1]],[1,cl[2]]]),{outline:true}))}
  L.push(Sd((x,r)=>{for(let i=0;i<3;i++){const ax=c.bx-34+i*32,ay=c.by-10-(i===1?10:0);x.fillStyle='rgba(255,250,235,.7)';x.beginPath();x.ellipse(ax-6,ay-7,3.2,2.2,-0.6,0,7);x.fill();x.strokeStyle='#3a2410';x.lineWidth=1.6;x.beginPath();x.moveTo(ax,ay-15);x.quadraticCurveTo(ax+2,ay-21,ax+4,ay-23);x.stroke();if(i===1){x.fillStyle='#4f6a2c';x.beginPath();x.ellipse(ax+9,ay-21,7,3,-0.5,0,7);x.fill()}}}));
  for(let i=0;i<10;i++){const gx=c.bx+46+(i%3)*9+(i>5?4:0),gy=c.by-6+Math.floor(i/3)*8;L.push(Se('winogrona',gx,gy,5.5,5.5,rad(gx-2,gy-2,1,7,[[0,'#b08ab0'],[1,'#3a1a40']])))}
  L.push(Sd(x=>{x.fillStyle='rgba(255,255,255,.6)';for(let i=0;i<10;i++){const gx=c.bx+46+(i%3)*9+(i>5?4:0),gy=c.by-6+Math.floor(i/3)*8;x.beginPath();x.arc(gx-2,gy-2,1.1,0,7);x.fill()}x.strokeStyle='#4a3418';x.lineWidth=1.4;x.beginPath();x.moveTo(c.bx+56,c.by-12);x.quadraticCurveTo(c.bx+60,c.by-22,c.bx+66,c.by-24);x.stroke()}));
  const pts=[];for(let k=0;k<=24;k++){const a=k/24*Math.PI;pts.push([c.bx+Math.cos(a)*c.brx,c.by+Math.sin(a)*46])}for(let k=24;k>=0;k--){const a=k/24*Math.PI;pts.push([c.bx+Math.cos(a)*c.brx,c.by+Math.sin(a)*ry])}
  L.push(Sp('misa',pts,lin(c.bx-c.brx,0,c.bx+c.brx,0,[[0,'#e2b47a'],[.5,'#b9844c'],[1,'#5e3a1c']]),{outline:true}));
  L.push(Se('misa',c.bx,c.by+48,c.brx*0.38,6,'#7a5230'));
  L.push(Sd(x=>{x.strokeStyle='rgba(255,230,190,.55)';x.lineWidth=1.6;x.beginPath();x.ellipse(c.bx,c.by,c.brx,ry,0,Math.PI*0.05,Math.PI*0.95);x.stroke();x.strokeStyle='rgba(60,30,12,.6)';x.lineWidth=3;x.beginPath();x.ellipse(c.bx,c.by+18,c.brx*0.93,ry*0.9+6,0,Math.PI*0.08,Math.PI*0.92);x.stroke();x.strokeStyle='rgba(240,210,150,.45)';x.lineWidth=2;x.beginPath();x.ellipse(c.bx,c.by+22,c.brx*0.9,ry*0.9+6,0,Math.PI*0.1,Math.PI*0.9);x.stroke()}));
  L.push(Se('cytryna',c.lx,c.ly,25,16,rad(c.lx-8,c.ly-6,2,28,[[0,'#fff3a8'],[.6,'#e8c440'],[1,'#9a7a14']]),{outline:true,penti:{dx:70,dy:-6}}));
  L.push(Sd((x,r)=>{x.fillStyle='rgba(140,110,20,.35)';for(let i=0;i<40;i++){const a=r()*6.28,d=Math.sqrt(r());x.beginPath();x.arc(c.lx+Math.cos(a)*22*d,c.ly+Math.sin(a)*13*d,0.6,0,7);x.fill()}x.fillStyle='rgba(255,255,230,.7)';x.beginPath();x.ellipse(c.lx-9,c.ly-6,5,2.5,-0.3,0,7);x.fill();x.fillStyle='#8a7a20';x.beginPath();x.ellipse(c.lx+25,c.ly,3,2,0,0,7);x.fill()}));
  return L},
 styleRect:c=>[c.jx-c.jw-10,c.ty-c.jh-14,(c.bx+c.brx+20)-(c.jx-c.jw-10),c.jh+80],
 errText:{anatomy:'Otwór misy pokazany z wysoka, a dno i krawędź stołu z innego punktu widzenia; krawędź stołu przechylona.',shadow:'Cień dzbana pada w lewo, cienie misy i cytryny w prawo.'},
 errWhy:{anatomy:'Błąd perspektywy – sprzeczne punkty widzenia.',shadow:'Błąd logiki światła – cień dzbana po złej stronie.'},
 okText:'Perspektywa naczyń i kierunek cieni zgodne z martwą naturą referencyjną.',
 pentiText:'cytryna pierwotnie dalej w prawo',
 compDesc:'Na stole z białym obrusem: niebieski dzban po lewej, gliniana misa z jabłkami i winogronami po prawej, cytryna z przodu. Spójna perspektywa – krawędź stołu pozioma. Światło z lewej – wszystkie cienie padają w prawo.',
 hidden:{desc:'zamalowany wazon z kwiatami w tle',draw(x,c,side){const X=side==='r'?W*0.84:W*0.16,Y=c.ty-80;x.fillStyle='rgba(255,255,255,.28)';x.beginPath();x.ellipse(X,Y,24,44,0,0,7);x.fill();for(let k=0;k<6;k++){x.beginPath();x.arc(X-30+k*12,Y-66-(k%2)*14,12,0,7);x.fill()}}}
};

/* ---------------- MARINA ---------------- */
SCENES.marina={W:680,H:440,bg:'morze',
 REG:{niebo:{pig:['ultr','pb','cadY'],dir:'h',an:'phB'},chmury:{pig:['pb','ochy'],dir:'swirl',an:'tiw'},'słońce':{pig:['naples','pb'],dir:'swirl',an:'hansa'},brzeg:{pig:['ultr','ochy'],dir:'h'},
  morze:{pig:['prus','vir','pb'],dir:'h',an:'phB'},'skały':{pig:['umb','sien'],dir:'diag'},statek:{pig:['umb','bone'],dir:'h'},'żagle':{pig:['pb','ochy'],dir:'v',an:'tiw'},flaga:{pig:['cyn'],dir:'v',an:'quin'}},
 make(r){const hz=H*(0.5+r()*0.05);return{hz,sun:{x:W*(0.16+r()*0.12),y:hz-55-r()*40},sx:W*(0.6+r()*0.08),sy:hz+46,clouds:clouds(r,3,0.06,0.3)}},
 build(c,err){const L=[],an=err==='anatomy',sw=err==='shadow';
  L.push(Sr('niebo',0,0,W,c.hz+2,lin(0,0,0,c.hz,[[0,'#56698a'],[.55,'#d4b488'],[1,'#f2d9a4']])));
  L.push(Sd(x=>{x.fillStyle=rad(c.sun.x,c.sun.y,6,220,[[0,'rgba(255,240,200,.95)'],[1,'rgba(255,240,200,0)']])(x);x.fillRect(0,0,W,c.hz)}));
  for(const e of c.clouds)L.push(Se(null,e.x+3,e.y+5,e.rx,e.ry,'rgba(120,110,120,.35)',{noHit:true}));
  for(const e of c.clouds)L.push(Se('chmury',e.x,e.y,e.rx,e.ry,'rgba(242,228,206,.9)'));
  L.push(Se('słońce',c.sun.x,c.sun.y,15,15,'#fff3cc'));
  L.push(Sd(x=>{for(const e of c.clouds){x.fillStyle='rgba(150,120,120,.25)';x.beginPath();x.ellipse(e.x,e.y+e.ry*0.45,e.rx*0.9,e.ry*0.45,0,0,7);x.fill();x.fillStyle='rgba(255,236,200,.35)';x.beginPath();x.ellipse(e.x-e.rx*0.25,e.y-e.ry*0.35,e.rx*0.5,e.ry*0.3,0,0,7);x.fill()}}));
  L.push(Sp('brzeg',[[W*0.6,c.hz+1],[W*0.68,c.hz-10],[W*0.78,c.hz-6],[W*0.88,c.hz-22],[W,c.hz-16],[W,c.hz+1]],'#6b7387',{outline:true}));
  L.push(Sr('morze',0,c.hz,W,H-c.hz,lin(0,c.hz,0,H,[[0,'#8197a0'],[.35,'#4e6974'],[1,'#223741']])));
  const rx=sw?W-c.sun.x:c.sun.x;
  L.push(Sd((x,r)=>{for(let i=0;i<70;i++){const k=r(),yy=c.hz+3+k*k*(H-c.hz-10),wd=(6+k*40)*(0.5+r());x.fillStyle=`rgba(255,236,190,${0.6-k*0.4})`;x.fillRect(rx-wd/2+(r()-.5)*(10+k*30),yy,wd,1+k*1.5)}}));
  L.push(Sd((x,r)=>{for(let i=0;i<280;i++){const k=r(),yy=c.hz+4+k*k*(H-c.hz),xx=r()*W,len=4+k*30;x.strokeStyle=`rgba(220,232,232,${.15+k*.25})`;x.lineWidth=0.6+k*1.6;x.beginPath();x.moveTo(xx,yy);x.quadraticCurveTo(xx+len/2,yy-2-k*3,xx+len,yy);x.stroke()}}));
  L.push(Sp('skały',[[0,H],[0,H*0.7],[W*0.08,H*0.66],[W*0.17,H*0.72],[W*0.24,H*0.82],[W*0.3,H*0.9],[W*0.33,H]],lin(0,H*0.66,W*0.3,H,[[0,'#6a5848'],[1,'#2a2018']]),{outline:true}));
  L.push(Sd((x,r)=>{x.fillStyle='rgba(240,245,245,.6)';for(let i=0;i<60;i++){const t=r(),px=W*0.33*t+r()*10,py=H*(0.66+0.34*t)-4+(r()-.5)*8;x.beginPath();x.arc(px,py,1+r()*3,0,7);x.fill()}}));
  L.push(Sd((x,r)=>{x.strokeStyle='rgba(20,14,10,.55)';x.lineWidth=1.2;for(let i=0;i<9;i++){const sx=r()*W*0.25,sy=H*(0.74+r()*0.22);x.beginPath();x.moveTo(sx,sy);x.lineTo(sx+6+r()*12,sy+4+r()*10);x.stroke()}x.strokeStyle='rgba(210,190,160,.4)';x.lineWidth=2;x.beginPath();x.moveTo(0,H*0.7);x.lineTo(W*0.08,H*0.66);x.lineTo(W*0.17,H*0.72);x.stroke()}));
  const X=c.sx,Y=c.sy,pe={dx:-40,dy:0};
  L.push(Sd((x,r)=>{x.fillStyle='rgba(20,18,16,.45)';for(let i=0;i<10;i++)x.fillRect(X-50+(r()-.5)*8,Y+10+i*3,100-i*6,1.6)}));
  L.push(Sp('statek',[[X-60,Y-10],[X+70,Y-10],[X+55,Y+8],[X-48,Y+8]],'#3a2a1e',{outline:true,penti:pe}));
  L.push(Sd((x,r)=>{x.strokeStyle='rgba(120,90,60,.5)';x.lineWidth=0.8;for(const yy of[Y-5,Y,Y+4]){x.beginPath();x.moveTo(X-55,yy);x.lineTo(X+64,yy);x.stroke()}x.fillStyle='rgba(230,200,140,.8)';for(let i=0;i<5;i++){x.beginPath();x.arc(X-30+i*18,Y-4,1.4,0,7);x.fill()}x.strokeStyle='rgba(240,245,245,.7)';x.lineWidth=1.4;x.beginPath();x.moveTo(X+70,Y-9);x.quadraticCurveTo(X+82,Y+4,X+96,Y+8);x.stroke();x.beginPath();x.moveTo(X-48,Y+8);x.quadraticCurveTo(X-62,Y+12,X-80,Y+13);x.stroke();
   x.fillStyle='rgba(30,22,16,.35)';for(let i=0;i<8;i++)x.fillRect(X-40+(r()-.5)*6+Math.sin(i)*3,Y+12+i*4,80-i*6,1.4)}));
  const m1=t=>[X-20-(an?16:0)*t,Y-10-102*t],m2=t=>[X+26+(an?18:0)*t,Y-10-86*t];
  L.push(Sl([m1(0),m1(1)],'#2a1e14',2.2,{outline:true,penti:pe}));L.push(Sl([m2(0),m2(1)],'#2a1e14',2.2,{outline:true,penti:pe}));
  const add=(p,dx,dy)=>[p[0]+dx,p[1]+dy],sf=lin(X-30,0,X+50,0,[[0,'#f6ecd4'],[1,'#b8ab90']]);
  L.push(Sp('żagle',[m1(.92),add(m1(.92),30,4),add(m1(.62),36,4),m1(.62)],sf,{outline:true,penti:pe}));
  L.push(Sp('żagle',[m1(.56),add(m1(.56),40,4),add(m1(.2),46,6),m1(.2)],sf,{outline:true,penti:pe}));
  L.push(Sp('żagle',[m2(.9),add(m2(.9),26,4),add(m2(.25),34,6),m2(.25)],sf,{outline:true,penti:pe}));
  L.push(Sp('flaga',[m1(1),add(m1(1),14,3),add(m1(1),0,7)],'#b03028'));
  L.push(Sd(x=>{x.strokeStyle='rgba(40,30,20,.55)';x.lineWidth=0.7;x.beginPath();x.moveTo(...m1(1));x.lineTo(X-60,Y-10);x.moveTo(...m1(1));x.lineTo(...m2(1));x.lineTo(X+70,Y-10);x.moveTo(...m2(0.95));x.lineTo(X+95,Y-6);x.stroke();x.strokeStyle='rgba(40,30,20,.45)';for(const t of[0.62,0.2])x.beginPath(),x.moveTo(...m1(t)),x.lineTo(...add(m1(t),40,4)),x.stroke()}));
  L.push(Sd((x,r)=>{x.strokeStyle='rgba(40,40,50,.7)';x.lineWidth=1;for(let i=0;i<5;i++){const bx=W*(0.3+r()*0.5),by=c.hz-60-r()*90,s2=2.5+r()*2.5;x.beginPath();x.moveTo(bx-s2,by-s2*0.4);x.quadraticCurveTo(bx-s2*0.4,by-s2*0.6,bx,by);x.quadraticCurveTo(bx+s2*0.4,by-s2*0.6,bx+s2,by-s2*0.4);x.stroke()}}));
  return L},
 styleRect:c=>[0,c.hz-130,W,H-c.hz+130],
 errText:{anatomy:'Maszty pochylone w przeciwne strony – błąd konstrukcji i perspektywy statku.',shadow:'Pas odbicia słońca na wodzie leży po przeciwnej stronie niż słońce.'},
 errWhy:{anatomy:'Błąd konstrukcji – maszty rozchodzą się na boki.',shadow:'Błąd logiki światła – odbicie słońca nie pod słońcem.'},
 okText:'Konstrukcja statku i odbicie słońca zgodne z mariną referencyjną.',
 pentiText:'statek pierwotnie dalej w lewo',
 compDesc:'Dwumasztowy żaglowiec (maszty pionowe, równoległe) po prawej od środka; skały w lewym dolnym rogu, brzeg na horyzoncie po prawej. Pas odbicia słońca na wodzie dokładnie pod słońcem, po lewej.',
 hidden:{desc:'zamalowany drugi, mały żaglowiec na horyzoncie',draw(x,c,side){const X=side==='r'?W*0.84:W*0.16,Y=c.hz;x.fillStyle='rgba(255,255,255,.3)';x.fillRect(X-18,Y-4,36,6);x.beginPath();x.moveTo(X-4,Y-6);x.lineTo(X-4,Y-40);x.lineTo(X+14,Y-8);x.fill()}}
};
