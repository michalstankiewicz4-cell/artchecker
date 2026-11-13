"use strict";
/* =====================================================================
   EKRAN GŁÓWNY – kategorie, podgląd trybu (generowany silnikiem gry), postęp
   Postęp (ukończone tryby) zapisywany lokalnie w przeglądarce (localStorage).
   ===================================================================== */
let CUR='paint5',HCAT=0,HMODE=null;const PREV={};
const SOON=[['auction','Aukcja'],['investigation','Śledztwo'],['conservator','Konserwator']];
function homeCats(){return[
 {title:tr('Badania obrazów'),sub:tr('Poznaj dzieło'),desc:'Zbadaj obrazy nowoczesnymi metodami: UV, podczerwień, RTG, spektroskopia pigmentów, krakelura i mikroskop. Odkryj kopie, przemalowania i ślady historii dzieła.',
  modes:[['paint5','Przeprowadź ekspertyzę – obrazy'],['frag','Zniszczony fragment'],['memory','Pamięć eksperta'],...Object.values(KINDS).filter(k=>k.group==='art').map(k=>[k.id,k.label])]},
 {title:tr('Rzeźby 3D'),sub:tr('Obejdź i przybliż'),desc:'Obracaj kamerę i podchodź blisko: skład stopu, patyna, ślady dłuta i frezu, szwy odlewnicze, sygnatury z tyłu cokołu, UV i RTG.',
  modes:['marble','sculpt'].map(k=>SCULPT_VARIANTS[k]).map(v=>[v.id,(t=>t[0].toUpperCase()+t.slice(1))(v.label.replace('Przeprowadź ekspertyzę – ',''))])},
 {title:tr('Obiekty i dokumenty'),sub:tr('Odkryj prawdę'),desc:'Banknoty, monety, znaczki i rękopisy – każdy ma własne zabezpieczenia, materiały i typowe metody fałszerstw. Na checkliście każdego egzemplarza zaznacz sygnały fałszerstwa – egzemplarz bez sygnałów uznajesz za prawdziwy.',
  modes:Object.values(KINDS).filter(k=>k.group!=='art').map(k=>[k.id,k.label])},
 {title:tr('Wkrótce'),sub:tr('W przygotowaniu'),desc:'Aukcja z budżetem, śledztwo w sprawie fałszerza i praca konserwatora – kolejne tryby są w przygotowaniu.',modes:SOON.map(([id,l])=>[id,l,1])}]}
function store(){try{return JSON.parse(localStorage.getItem('artchecker.v1')||'{}')}catch(e){return{}}}
function recordDone(ok){try{const s=store();s.done=s.done||{};s.done[CUR]=(s.done[CUR]||0)+1;s.games=(s.games||0)+1;if(ok)s.ok=(s.ok||0)+1;localStorage.setItem('artchecker.v1',JSON.stringify(s))}catch(e){}}
function withSandbox(fn){const sv={MODE,KIND,SV,ART,SC,C,W,H,IW,IH,P,BW,BH,sel,tool};try{return fn()}finally{({MODE,KIND,SV,ART,SC,C,W,H,IW,IH,P,BW,BH,sel,tool}=sv);REFC=null}}
/* złocona, ozdobna rama: profil z kilku listew, perełki i narożne ornamenty */
function giltFrame(x,W0,H0,pad){const band=(i,o,cols)=>{x.fillStyle=lin(0,0,W0,H0,cols)(x);x.beginPath();x.rect(i,i,W0-2*i,H0-2*i);x.rect(o,o,W0-2*o,H0-2*o);x.fill('evenodd')};
 band(0,pad*0.22,[[0,'#7a5a1c'],[.35,'#f3d27a'],[.6,'#a77c2c'],[1,'#5e4312']]);
 band(pad*0.22,pad*0.42,[[0,'#c99a3e'],[.5,'#fff0b5'],[1,'#8a6420']]);
 band(pad*0.42,pad*0.78,[[0,'#6c4c16'],[.3,'#e7c164'],[.55,'#9b7228'],[.8,'#f1d07a'],[1,'#5a3f10']]);
 band(pad*0.78,pad,[[0,'#3a280a'],[1,'#7a5a1c']]);
 x.fillStyle='rgba(255,240,180,.75)';const s=Math.max(2,pad*0.07),bead=(x0,y0,x1,y1)=>{const n=Math.max(4,Math.round(Math.hypot(x1-x0,y1-y0)/(s*3)));for(let k=0;k<=n;k++){x.beginPath();x.arc(x0+(x1-x0)*k/n,y0+(y1-y0)*k/n,s,0,7);x.fill()}};
 const b=pad*0.32;bead(b,b,W0-b,b);bead(b,H0-b,W0-b,H0-b);bead(b,b,b,H0-b);bead(W0-b,b,W0-b,H0-b);
 x.strokeStyle='rgba(60,40,10,.55)';x.lineWidth=Math.max(1,pad*0.04);const m=pad*0.6;for(let k=0;k<Math.max(8,(W0+H0)/(pad*0.9));k++){}
 for(const[cx,cy]of[[pad*0.6,pad*0.6],[W0-pad*0.6,pad*0.6],[pad*0.6,H0-pad*0.6],[W0-pad*0.6,H0-pad*0.6]]){x.fillStyle=rad(cx-pad*0.1,cy-pad*0.1,1,pad*0.5,[[0,'#fff3c4'],[.5,'#d9a845'],[1,'#6e4c14']])(x);x.beginPath();for(let a=0;a<8;a++){const r=a%2?pad*0.22:pad*0.42,t=a*Math.PI/4;x.lineTo(cx+Math.cos(t)*r,cy+Math.sin(t)*r)}x.closePath();x.fill();x.stroke()}
 x.fillStyle='#2a1c06';x.fillRect(pad-3,pad-3,W0-2*pad+6,H0-2*pad+6)}
function frameIt(src,w,h,gilt,post){const pad=gilt?Math.round(Math.max(w,h)*0.075):Math.round(Math.max(w,h)*0.04),c=mk(w+pad*2,h+pad*2),x=c.getContext('2d');
 if(gilt)giltFrame(x,c.width,c.height,pad);
 else{x.shadowColor='rgba(0,0,0,.6)';x.shadowBlur=pad;x.shadowOffsetY=pad/3}
 x.drawImage(src,pad,pad,w,h);x.shadowBlur=0;if(post)post(x,pad);return c}
function bustIllus(marble){const c=mk(420,520),x=c.getContext('2d'),g=marble?[[0,'#ffffff'],[.6,'#e6e1d6'],[1,'#9a958a']]:[[0,'#d9a86a'],[.5,'#8a5a2e'],[1,'#3a2614']];
 x.fillStyle=lin(150,470,270,520,[[0,'#3c342c'],[1,'#1e1914']])(x);x.fillRect(120,440,180,80);
 const R=(cx,cy,r0,r1)=>rad(cx-r1*0.35,cy-r1*0.4,r0,r1*1.3,g)(x);
 x.fillStyle=R(210,425,5,70);x.beginPath();x.ellipse(210,430,70,14,0,0,7);x.fill();x.fillRect(158,400,104,30);
 x.fillStyle=R(210,330,10,140);x.beginPath();x.moveTo(90,410);x.quadraticCurveTo(80,300,150,270);x.lineTo(270,270);x.quadraticCurveTo(340,300,330,410);x.closePath();x.fill();
 x.fillStyle=R(210,240,5,40);x.fillRect(188,215,44,62);x.fillStyle=R(210,165,10,80);x.beginPath();x.ellipse(210,165,62,78,0,0,7);x.fill();
 x.beginPath();x.ellipse(212,92,58,30,0,Math.PI,0);x.fill();x.beginPath();x.arc(210,92,26,0,7);x.fill();
 x.fillStyle=marble?'rgba(120,110,95,.35)':'rgba(60,140,110,.45)';x.beginPath();x.ellipse(185,255,40,8,0,0,7);x.fill();x.beginPath();x.ellipse(250,95,30,10,0.4,0,7);x.fill();return c}
function soonIllus(id){const c=mk(420,320),x=c.getContext('2d');x.strokeStyle='#C99539';x.lineWidth=10;x.lineCap='round';x.shadowColor='#F5C66B';x.shadowBlur=24;
 if(id==='auction'){x.save();x.translate(210,150);x.rotate(-0.6);x.strokeRect(-70,-30,140,60);x.beginPath();x.moveTo(0,30);x.lineTo(0,150);x.stroke();x.restore();x.strokeRect(120,250,180,26)}
 else if(id==='investigation'){x.beginPath();x.arc(180,140,80,0,7);x.stroke();x.beginPath();x.moveTo(240,200);x.lineTo(320,280);x.stroke()}
 else{x.beginPath();x.moveTo(110,260);x.lineTo(300,70);x.stroke();x.lineWidth=26;x.beginPath();x.moveTo(110,260);x.lineTo(140,230);x.stroke()}return c}
function preview(id){if(PREV[id])return PREV[id];let c;
 if(SCULPT_VARIANTS[id]){const im=REALIM['thumb-'+id];if(im){c=mk(im.width,im.height);c.getContext('2d').drawImage(im,0,0)}else c=bustIllus(id==='marble')}else if(SOON.some(s=>s[0]===id))c=soonIllus(id);
 else c=withSandbox(()=>{const r=rng(4242+id.length*131);MODE=id;KIND=KINDS[id]||null;
  if(KIND){KIND.newGame(r);const o=P.find(p=>p.orig)||P[0];return frameIt(o.kind.view(o,'normal'),W,H,false)}
  if(id==='frag'){newFrag(r);const o=P[0];return frameIt(getView(o,'normal'),W,H,false,(x,pad)=>{x.save();x.globalCompositeOperation='destination-out';x.beginPath();o.frag.missing.forEach((q,i)=>i?x.lineTo(pad+q[0],pad+q[1]):x.moveTo(pad+q[0],pad+q[1]));x.fill();x.restore()})}
  {const hp=HPREV[id];if(hp&&REALIM[hp]){const im=REALIM[hp],a=im.width/im.height,w=a>=1?680:Math.round(560*a),h=a>=1?Math.round(680/a):560,c=mk(w,h);c.getContext('2d').drawImage(im,0,0,w,h);return frameIt(c,w,h,id==='paint5')}}
  newPaint5(r);const o=P.find(p=>p.orig);const v=getView(o,'normal');
  return frameIt(v,W,H,true,id==='memory'?(x,pad)=>{const cx=pad+W*0.55,cy=pad+H*0.45,R=H*0.22;x.save();x.beginPath();x.arc(cx,cy,R,0,7);x.clip();x.drawImage(v,(W*0.55-R/3)*S,(H*0.45-R/3)*S,R/1.5*S,R/1.5*S,cx-R,cy-R,2*R,2*R);x.restore();x.strokeStyle='#3a2a10';x.lineWidth=14;x.beginPath();x.arc(cx,cy,R+6,0,7);x.stroke();x.strokeStyle='#d6b058';x.lineWidth=4;x.stroke();x.lineWidth=16;x.strokeStyle='#3a2a10';x.beginPath();x.moveTo(cx+R*0.75,cy+R*0.75);x.lineTo(cx+R*1.5,cy+R*1.5);x.stroke()}:null)});
 return PREV[id]=c}
function fitDraw(cv,img,bgGlow){const r=cv.getBoundingClientRect(),d=devicePixelRatio||1;cv.width=Math.max(1,r.width*d|0);cv.height=Math.max(1,r.height*d|0);const x=cv.getContext('2d');x.setTransform(d,0,0,d,0,0);
 if(bgGlow){x.fillStyle=rad(r.width/2,r.height*0.42,10,Math.max(r.width,r.height)*0.6,[[0,'rgba(120,190,255,.28)'],[1,'rgba(0,0,0,0)']])(x);x.fillRect(0,0,r.width,r.height)}
 const k=Math.min(r.width*0.86/img.width,r.height*(bgGlow?0.74:0.92)/img.height),w=img.width*k,h=img.height*k,X=(r.width-w)/2,Y=bgGlow?(r.height-h)*0.38:(r.height-h)/2;
 if(bgGlow){x.fillStyle=rad(r.width/2,Y+h+8,4,w*0.6,[[0,'rgba(0,0,0,.55)'],[1,'rgba(0,0,0,0)']])(x);x.beginPath();x.ellipse(r.width/2,Y+h+8,w*0.55,14,0,0,7);x.fill()}x.drawImage(img,X,Y,w,h)}
function homeBg(){const cv=document.getElementById('homebg'),d=devicePixelRatio||1,w=innerWidth,h=innerHeight;cv.width=w*d;cv.height=h*d;const x=cv.getContext('2d');x.setTransform(d,0,0,d,0,0);const r=rng(7);
 /* sala muzeum: ściany, kolumny, obrazy w ramach, lampy, posągi po bokach, odbicie w posadzce – rozmyte jak tło */
 x.fillStyle=lin(0,0,0,h,[[0,'#262a31'],[.6,'#2d3139'],[1,'#121417']])(x);x.fillRect(0,0,w,h);x.filter='blur(2.5px)';
 const hz=h*0.66;x.fillStyle=lin(0,hz,0,h,[[0,'#3a3530'],[1,'#141414']])(x);x.fillRect(0,hz,w,h-hz);
 for(let i=-6;i<=6;i++){x.strokeStyle='rgba(220,200,170,.05)';x.beginPath();x.moveTo(w/2+i*60,hz);x.lineTo(w/2+i*260,h);x.stroke()}
 for(let i=0;i<9;i++){const fx=w*(0.08+i*0.105)+r()*20,fy=h*(0.28+r()*0.06),fw=40+r()*70,fh=fw*(0.7+r()*0.5);x.fillStyle='rgba(150,110,40,.55)';x.fillRect(fx-4,fy-4,fw+8,fh+8);x.fillStyle=`rgba(${40+r()*60|0},${30+r()*40|0},${30+r()*30|0},.8)`;x.fillRect(fx,fy,fw,fh);
  x.fillStyle=rad(fx+fw/2,fy-30,2,fw,[[0,'rgba(255,230,170,.35)'],[1,'rgba(0,0,0,0)']])(x);x.fillRect(fx-fw,fy-60,fw*3,fh+80)}
 for(const px of[0.03,0.2,0.8,0.97]){const X=w*px,cw=w*0.045;x.fillStyle=lin(X-cw/2,0,X+cw/2,0,[[0,'#1d2026'],[.45,'#6a6f78'],[.55,'#7a8089'],[1,'#1b1e23']])(x);x.fillRect(X-cw/2,0,cw,hz+10);x.fillStyle='rgba(200,190,170,.12)';x.fillRect(X-cw*0.6,hz-6,cw*1.2,16)}
 const statue=(X,s)=>{x.fillStyle=lin(X-40*s,0,X+40*s,0,[[0,'#3a3e45'],[.5,'#cfcbc2'],[1,'#33373d']])(x);x.fillRect(X-28*s,hz-60*s,56*s,60*s);x.beginPath();x.ellipse(X,hz-120*s,30*s,62*s,0,0,7);x.fill();x.beginPath();x.arc(X,hz-200*s,20*s,0,7);x.fill()};statue(w*0.06,1.1);statue(w*0.93,1.2);
 x.strokeStyle='rgba(170,40,40,.6)';x.lineWidth=4;for(const[a,b]of[[0.02,0.16],[0.84,0.98]]){x.beginPath();x.moveTo(w*a,hz+40);x.quadraticCurveTo(w*(a+b)/2,hz+70,w*b,hz+40);x.stroke()}
 for(let i=0;i<5;i++){const X=w*(0.15+i*0.175);x.fillStyle=rad(X,8,2,160,[[0,'rgba(255,240,200,.75)'],[1,'rgba(255,240,200,0)']])(x);x.fillRect(X-200,0,400,220)}
 x.filter='none';x.fillStyle='rgba(12,12,14,.18)';x.fillRect(0,0,w,h);jpegize(cv)}
function toolNames(id){let sets,defs;if(KINDS[id]){sets=KINDS[id].sets;defs=KINDS[id].defs}else if(SCULPT_VARIANTS[id]){sets=SCULPT_VARIANTS[id].sets;defs=SCULPT_VARIANTS[id].defs}
 else if(SET[id]&&SET[id].length){sets=SET[id];defs=DEF}else return id==='memory'?['Lupa ×4','Zapamiętywanie','Minimalne różnice','Checklista różnic']:['W przygotowaniu'];
 return sets.flatMap(([,ids])=>ids.map(t=>(id==='frag'&&defs[t].nameF)||defs[t].name))}
/* podgląd trybu na ekranie startowym: dzieło prawdziwe */
const HPREV={paint5:'stanczyk',drawing:'melencolia',water:'zajac'};
const HCAP3={marble:['Antoine-Denis Chaudet','Napoleon','przełom XVIII i XIX w.'],sculpt:['John Quincy Adams Ward','James Garfield','ok. 1883–1887']};
function homeCap(id,label){if(HCAP3[id]&&REALIM['thumb-'+id]){const c=HCAP3[id];return`${tr(label)} <span class="gd">•</span> ${c[0]} „${tr(c[1])}” (${tr(c[2])})`}const e=HPREV[id]&&REALIM[HPREV[id]]&&REAL_BY[HPREV[id]];return e?`${tr(label)} <span class="gd">•</span> ${e.artist} „${tr(e.title)}” (${e.year})`:tr(label)}
function renderHome(){const cats=homeCats(),cat=cats[HCAT],done=(store().done)||{};if(!HMODE||!cat.modes.some(m=>m[0]===HMODE))HMODE=(cat.modes.find(m=>!m[2])||cat.modes[0])[0];
 const s=store();document.getElementById('hstat').innerHTML=`<b>${s.games||0}</b><span class="sub">– ${tr('trafne werdykty')}: ${s.ok||0}</span>`;
 document.getElementById('hcats').innerHTML=cats.map((c,i)=>`<div class="hp hcat${i===HCAT?' on':''}" data-i="${i}"><canvas></canvas><div><div class="t">${i+1}. ${c.title}</div><div class="s">${c.sub}</div></div><div class="arr">›</div></div>`).join('');
 document.querySelectorAll('.hcat').forEach((el,i)=>{el.onclick=()=>{HCAT=i;HMODE=null;renderHome()};setTimeout(()=>fitDraw(el.querySelector('canvas'),preview(cats[i].modes[0][0]),false),0)});
 const soon=SOON.some(x=>x[0]===HMODE),label=(cat.modes.find(m=>m[0]===HMODE)||[])[1];
 document.getElementById('hdetail').innerHTML=`<div class="hscroll"><h2>${HICO}${HCAT+1}. ${cat.title}</h2><div class="row"><canvas id="hthumb"></canvas><p>${cat.desc}</p></div>
  <div>${cat.modes.map(([id,l,dis])=>`<div class="hmode${id===HMODE?' on':''}${dis?' dis':''}" data-id="${id}"><span class="dot"></span>${l}${done[id]?`<span class="done">✓ +${done[id]}</span>`:''}</div>`).join('')}</div>
  <div class="sub hsep">Badania w tym trybie:</div><div class="htools">${toolNames(HMODE).map(t=>`<span>${t}</span>`).join('')}</div></div>
  <button class="hbtn" id="hstart"${soon?' disabled':''}>▶ ${soon?'Wkrótce':'Rozpocznij badania'}</button>`;
 document.querySelectorAll('.hmode').forEach(el=>{if(!el.classList.contains('dis'))el.onclick=()=>{HMODE=el.dataset.id;renderHome()}});
 document.getElementById('hstart').onclick=()=>startMode(HMODE);
 document.getElementById('hcards').innerHTML=cats.map((c,i)=>{const act=c.modes.filter(m=>!m[2]),n=act.filter(m=>done[m[0]]).length,pct=act.length?Math.round(n/act.length*100):0;
  return`<div class="hp hcard"><i class="wm">${HWM[i]||''}</i><h3><span class="num">${i+1}</span>${c.title}</h3><ul>${c.modes.map(([id,l,dis])=>`<li><i class="${done[id]?'y':dis?'s':'n'}">${done[id]?'✔':dis?'…':''}</i>${l}</li>`).join('')}</ul>
   <div class="hbrow"><div class="hbar"><div style="width:${pct}%"></div></div><small>${act.length?pct+'%':'wkrótce'}</small></div>
   <div style="margin-top:8px"><button class="hbtn ghost${pct===100?' ok':''}" data-i="${i}"${act.length?'':' disabled'}>${pct===100?'✔ Zakończono':'▶ Rozpocznij'}</button></div></div>`}).join('');
 document.querySelectorAll('#hcards .hbtn').forEach(b=>b.onclick=()=>{HCAT=+b.dataset.i;HMODE=null;renderHome();window.scrollTo(0,0)});
 setTimeout(()=>{fitDraw(document.getElementById('hthumb'),preview(HMODE),false);FX.drawId++;fitDraw(document.getElementById('hcanvas'),preview(HMODE),true);document.getElementById('hcap').innerHTML=homeCap(HMODE,label||'')},0)}
/* strzałki na scenie: poprzedni / następny tryb w kategorii */
function homeStep(d){const m=homeCats()[HCAT].modes.filter(x=>!x[2]);if(!m.length)return;const i=m.findIndex(x=>x[0]===HMODE);HMODE=m[(i+d+m.length)%m.length][0];renderHome()}
const HICO='<svg class="hico" width="30" height="30" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.8"><path d="M4 15 20 5l16 10H4z"/><path d="M8 17v14M15 17v14M25 17v14M32 17v14M4 34h32"/></svg>';
const HWM=['<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3"><circle cx="26" cy="26" r="16"/><path d="M38 38l18 18"/></svg>',
 '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5"><ellipse cx="32" cy="20" rx="10" ry="13"/><path d="M27 32l-1 5c-9 2-14 8-15 17h42c-1-9-6-15-15-17l-1-5M22 58h20"/></svg>',
 '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="32" cy="32" r="25"/><circle cx="32" cy="32" r="20" stroke-dasharray="2 3"/><path d="M36 17c-6-1-11 3-11 9 0 3-3 5-4 7l3 1-1 4c0 3 3 4 6 3l1 6h8M36 17c5 2 7 7 6 12-1 4-3 6-3 9"/></svg>',
 '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3"><path d="M16 6h32M16 58h32M20 6c0 16 24 16 24 26S20 42 20 58M44 6c0 16-24 16-24 26s24 10 24 26"/></svg>'];
function showLoader(t){document.getElementById('ltxt').textContent=t||'Przygotowywanie…';document.getElementById('loader').classList.remove('hidden')}
function hideLoader(){document.getElementById('loader').classList.add('hidden')}
function withLoader(fn,t){showLoader(t);setTimeout(async()=>{try{await fn()}finally{hideLoader()}},40)}
const runNewGame=()=>withLoader(newGame,SCULPT_VARIANTS[document.getElementById('mode').value]?'Wczytywanie sceny 3D…':'Przygotowywanie stołu ekspertyz…');
function startMode(id){if(SOON.some(s=>s[0]===id))return;stopFX();document.getElementById('mode').value=id;document.getElementById('home').classList.add('hidden');runNewGame()}
function showHome(){document.getElementById('home').classList.remove('hidden');homeBg();renderHome();startFX()}
addEventListener('resize',()=>{if(!document.getElementById('home').classList.contains('hidden')){homeBg();renderHome()}});
