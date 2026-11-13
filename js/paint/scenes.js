"use strict";
/* =====================================================================
   KSZTAŁTY SCEN (pomocnicze funkcje kształtów dla dzieł prawdziwych i trybu pamięci)
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

/* Sceny fikcyjnych artystów (pejzaż, portret, martwa natura, marina) usunięto w 1.35 – gra korzysta z dzieł prawdziwych. */
