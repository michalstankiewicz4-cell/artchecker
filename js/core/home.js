"use strict";
/* =====================================================================
   EKRAN GŁÓWNY – kategorie, podgląd trybu (generowany silnikiem gry), postęp
   Postęp (ukończone tryby) zapisywany lokalnie w przeglądarce (localStorage).
   ===================================================================== */
let CUR='paint5',HCAT=0,HMODE=null;const PREV={};
const SOON=[['auction','Aukcja'],['investigation','Śledztwo'],['conservator','Konserwator']];
function homeCats(){return[
 {title:'Badania obrazów',sub:'Poznaj dzieło',desc:'Zbadaj obrazy nowoczesnymi metodami: UV, podczerwień, RTG, spektroskopia pigmentów, krakelura i mikroskop. Odkryj kopie, przemalowania i ślady historii dzieła.',
  modes:[['paint5','Znajdź oryginał – obrazy'],['frag','Zniszczony fragment'],['memory','Pamięć eksperta'],...Object.values(KINDS).filter(k=>k.group==='art').map(k=>[k.id,k.label])]},
 {title:'Rzeźby 3D',sub:'Obejdź i przybliż',desc:'Obracaj kamerę i podchodź blisko: skład stopu, patyna, ślady dłuta i frezu, szwy odlewnicze, sygnatury z tyłu cokołu, UV i RTG.',
  modes:Object.values(SCULPT_VARIANTS).map(v=>[v.id,(t=>t[0].toUpperCase()+t.slice(1))(v.label.replace('Znajdź oryginał – ',''))])},
 {title:'Obiekty i dokumenty',sub:'Odkryj prawdę',desc:'Banknoty, monety, znaczki i rękopisy – każdy ma własne zabezpieczenia, materiały i typowe metody fałszerstw. Na checkliście każdego egzemplarza zaznacz sygnały fałszerstwa – egzemplarz bez sygnałów uznajesz za prawdziwy.',
  modes:Object.values(KINDS).filter(k=>k.group!=='art').map(k=>[k.id,k.label])},
 {title:'Wkrótce',sub:'W przygotowaniu',desc:'Aukcja z budżetem, śledztwo w sprawie fałszerza i praca konserwatora – kolejne tryby są w przygotowaniu.',modes:SOON.map(([id,l])=>[id,l,1])}]}
function store(){try{return JSON.parse(localStorage.getItem('artchecker.v1')||'{}')}catch(e){return{}}}
function recordDone(ok){try{const s=store();s.done=s.done||{};s.done[CUR]=(s.done[CUR]||0)+1;s.games=(s.games||0)+1;if(ok)s.ok=(s.ok||0)+1;localStorage.setItem('artchecker.v1',JSON.stringify(s))}catch(e){}}
function withSandbox(fn){const sv={MODE,KIND,SV,ART,SC,C,W,H,IW,IH,P,BW,BH,sel,tool};try{return fn()}finally{({MODE,KIND,SV,ART,SC,C,W,H,IW,IH,P,BW,BH,sel,tool}=sv);REFC=null}}
function frameIt(src,w,h,gilt,post){const pad=gilt?Math.round(Math.max(w,h)*0.07):Math.round(Math.max(w,h)*0.04),c=mk(w+pad*2,h+pad*2),x=c.getContext('2d');
 if(gilt){x.fillStyle=lin(0,0,c.width,c.height,[[0,'#8a6a2a'],[.5,'#e2bd62'],[1,'#6e521e']])(x);x.fillRect(0,0,c.width,c.height);x.fillStyle='#4a3712';x.fillRect(pad-6,pad-6,w+12,h+12)}
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
function soonIllus(id){const c=mk(420,320),x=c.getContext('2d');x.strokeStyle='#6fd0ff';x.lineWidth=10;x.lineCap='round';x.shadowColor='#3fb0ff';x.shadowBlur=24;
 if(id==='auction'){x.save();x.translate(210,150);x.rotate(-0.6);x.strokeRect(-70,-30,140,60);x.beginPath();x.moveTo(0,30);x.lineTo(0,150);x.stroke();x.restore();x.strokeRect(120,250,180,26)}
 else if(id==='investigation'){x.beginPath();x.arc(180,140,80,0,7);x.stroke();x.beginPath();x.moveTo(240,200);x.lineTo(320,280);x.stroke()}
 else{x.beginPath();x.moveTo(110,260);x.lineTo(300,70);x.stroke();x.lineWidth=26;x.beginPath();x.moveTo(110,260);x.lineTo(140,230);x.stroke()}return c}
function preview(id){if(PREV[id])return PREV[id];let c;
 if(SCULPT_VARIANTS[id])c=bustIllus(id==='marble');else if(SOON.some(s=>s[0]===id))c=soonIllus(id);
 else c=withSandbox(()=>{const r=rng(4242+id.length*131);MODE=id;KIND=KINDS[id]||null;
  if(KIND){KIND.newGame(r);const o=P.find(p=>p.orig)||P[0];return frameIt(o.kind.view(o,'normal'),W,H,false)}
  if(id==='frag'){newFrag(r);const o=P[0];return frameIt(getView(o,'normal'),W,H,false,(x,pad)=>{x.save();x.globalCompositeOperation='destination-out';x.beginPath();o.frag.missing.forEach((q,i)=>i?x.lineTo(pad+q[0],pad+q[1]):x.moveTo(pad+q[0],pad+q[1]));x.fill();x.restore()})}
  if(id==='paint5'&&REAL_DEF.paint5&&REALIM[REAL_DEF.paint5]){const im=REALIM[REAL_DEF.paint5],w=680,h=Math.round(680*im.height/im.width),c=mk(w,h);c.getContext('2d').drawImage(im,0,0,w,h);return frameIt(c,w,h,true)}
  newPaint5(r);const o=P.find(p=>p.orig);const v=getView(o,'normal');
  return frameIt(v,W,H,true,id==='memory'?(x,pad)=>{const cx=pad+W*0.55,cy=pad+H*0.45,R=H*0.22;x.save();x.beginPath();x.arc(cx,cy,R,0,7);x.clip();x.drawImage(v,(W*0.55-R/3)*S,(H*0.45-R/3)*S,R/1.5*S,R/1.5*S,cx-R,cy-R,2*R,2*R);x.restore();x.strokeStyle='#3a2a10';x.lineWidth=14;x.beginPath();x.arc(cx,cy,R+6,0,7);x.stroke();x.strokeStyle='#d6b058';x.lineWidth=4;x.stroke();x.lineWidth=16;x.strokeStyle='#3a2a10';x.beginPath();x.moveTo(cx+R*0.75,cy+R*0.75);x.lineTo(cx+R*1.5,cy+R*1.5);x.stroke()}:null)});
 return PREV[id]=c}
function fitDraw(cv,img,bgGlow){const r=cv.getBoundingClientRect(),d=devicePixelRatio||1;cv.width=Math.max(1,r.width*d|0);cv.height=Math.max(1,r.height*d|0);const x=cv.getContext('2d');x.setTransform(d,0,0,d,0,0);
 if(bgGlow){x.fillStyle=rad(r.width/2,r.height*0.42,10,Math.max(r.width,r.height)*0.6,[[0,'rgba(120,190,255,.28)'],[1,'rgba(0,0,0,0)']])(x);x.fillRect(0,0,r.width,r.height)}
 const k=Math.min(r.width*0.86/img.width,r.height*(bgGlow?0.74:0.92)/img.height),w=img.width*k,h=img.height*k,X=(r.width-w)/2,Y=bgGlow?(r.height-h)*0.38:(r.height-h)/2;
 if(bgGlow){x.fillStyle=rad(r.width/2,Y+h+8,4,w*0.6,[[0,'rgba(0,0,0,.55)'],[1,'rgba(0,0,0,0)']])(x);x.beginPath();x.ellipse(r.width/2,Y+h+8,w*0.55,14,0,0,7);x.fill()}x.drawImage(img,X,Y,w,h)}
function homeBg(){const cv=document.getElementById('homebg'),d=devicePixelRatio||1,w=innerWidth,h=innerHeight;cv.width=w*d;cv.height=h*d;const x=cv.getContext('2d');x.setTransform(d,0,0,d,0,0);const r=rng(7);
 x.fillStyle=lin(0,0,0,h,[[0,'#06142a'],[.55,'#0b2142'],[1,'#030a16']])(x);x.fillRect(0,0,w,h);
 for(let i=0;i<14;i++){const X=r()*w;x.fillStyle=lin(X,0,X+40,0,[[0,'rgba(80,160,255,0)'],[.5,'rgba(80,160,255,.06)'],[1,'rgba(80,160,255,0)']])(x);x.fillRect(X,0,40+r()*40,h*0.62)}
 x.strokeStyle='rgba(90,170,255,.16)';x.lineWidth=1;const hz=h*0.62;for(let i=-20;i<=20;i++){x.beginPath();x.moveTo(w/2+i*30,hz);x.lineTo(w/2+i*170,h);x.stroke()}for(let k=0;k<12;k++){const y=hz+(h-hz)*Math.pow(k/12,1.8);x.beginPath();x.moveTo(0,y);x.lineTo(w,y);x.stroke()}
 for(let i=0;i<60;i++){x.fillStyle=`rgba(${120+r()*80|0},${180+r()*60|0},255,${.04+r()*.1})`;x.beginPath();x.arc(r()*w,r()*h*0.7,4+r()*26,0,7);x.fill()}
 x.strokeStyle='rgba(200,230,255,.35)';x.lineWidth=6;x.shadowColor='#bfe4ff';x.shadowBlur=30;x.beginPath();x.ellipse(w/2,24,170,26,0,0,7);x.stroke();x.shadowBlur=0;jpegize(cv)}
function toolNames(id){let sets,defs;if(KINDS[id]){sets=KINDS[id].sets;defs=KINDS[id].defs}else if(SCULPT_VARIANTS[id]){sets=SCULPT_VARIANTS[id].sets;defs=SCULPT_VARIANTS[id].defs}
 else if(SET[id]&&SET[id].length){sets=SET[id];defs=DEF}else return id==='memory'?['Lupa ×4','Zapamiętywanie','Minimalne różnice','Checklista różnic']:['W przygotowaniu'];
 return sets.flatMap(([,ids])=>ids.map(t=>(id==='frag'&&defs[t].nameF)||defs[t].name))}
function homeCap(id,label){const e=id==='paint5'&&REAL_DEF.paint5&&REALIM[REAL_DEF.paint5]&&REAL_BY[REAL_DEF.paint5];return e?`${label} · ${e.artist}, „${e.title}” (${e.year})`:label}
function renderHome(){const cats=homeCats(),cat=cats[HCAT],done=(store().done)||{};if(!HMODE||!cat.modes.some(m=>m[0]===HMODE))HMODE=(cat.modes.find(m=>!m[2])||cat.modes[0])[0];
 const s=store();document.getElementById('hstat').innerHTML=`<span class="sub">Ukończone ekspertyzy</span><br><b>${s.games||0}</b> <span class="sub">· trafne werdykty: ${s.ok||0}</span>`;
 document.getElementById('hcats').innerHTML=cats.map((c,i)=>`<div class="hp hcat${i===HCAT?' on':''}" data-i="${i}"><canvas></canvas><div><div class="t">${i+1}. ${c.title}</div><div class="s">${c.sub}</div></div><div class="arr">›</div></div>`).join('');
 document.querySelectorAll('.hcat').forEach((el,i)=>{el.onclick=()=>{HCAT=i;HMODE=null;renderHome()};setTimeout(()=>fitDraw(el.querySelector('canvas'),preview(cats[i].modes[0][0]),false),0)});
 const soon=SOON.some(x=>x[0]===HMODE),label=(cat.modes.find(m=>m[0]===HMODE)||[])[1];
 document.getElementById('hdetail').innerHTML=`<h2>${HCAT+1}. ${cat.title}</h2><div class="row"><canvas id="hthumb"></canvas><p>${cat.desc}</p></div>
  <div>${cat.modes.map(([id,l,dis])=>`<div class="hmode${id===HMODE?' on':''}${dis?' dis':''}" data-id="${id}"><span class="dot"></span>${l}${done[id]?`<span class="done">✓ ×${done[id]}</span>`:''}</div>`).join('')}</div>
  <div class="sub">Badania w tym trybie:</div><div class="htools">${toolNames(HMODE).map(t=>`<span>${t}</span>`).join('')}</div>
  <button class="hbtn" id="hstart"${soon?' disabled':''}>▶ ${soon?'Wkrótce':'Rozpocznij badania'}</button>`;
 document.querySelectorAll('.hmode').forEach(el=>{if(!el.classList.contains('dis'))el.onclick=()=>{HMODE=el.dataset.id;renderHome()}});
 document.getElementById('hstart').onclick=()=>startMode(HMODE);
 document.getElementById('hcards').innerHTML=cats.map((c,i)=>{const act=c.modes.filter(m=>!m[2]),n=act.filter(m=>done[m[0]]).length,pct=act.length?Math.round(n/act.length*100):0;
  return`<div class="hp hcard"><h3><span class="num">${i+1}</span>${c.title}</h3><ul>${c.modes.map(([id,l,dis])=>`<li><i class="${done[id]?'y':'n'}">${done[id]?'✔':dis?'…':'○'}</i>${l}</li>`).join('')}</ul>
   <div class="hbar"><div style="width:${pct}%"></div></div><small>${act.length?pct+'%':'wkrótce'}</small>
   <div style="margin-top:8px"><button class="hbtn ghost${pct===100?' ok':''}" data-i="${i}"${act.length?'':' disabled'}>${pct===100?'✔ Zakończono':'▶ Rozpocznij'}</button></div></div>`}).join('');
 document.querySelectorAll('#hcards .hbtn').forEach(b=>b.onclick=()=>{HCAT=+b.dataset.i;HMODE=null;renderHome();window.scrollTo(0,0)});
 setTimeout(()=>{fitDraw(document.getElementById('hthumb'),preview(HMODE),false);FX.drawId++;fitDraw(document.getElementById('hcanvas'),preview(HMODE),true);document.getElementById('hcap').textContent=homeCap(HMODE,label||'')},0)}
function showLoader(t){document.getElementById('ltxt').textContent=t||'Przygotowywanie…';document.getElementById('loader').classList.remove('hidden')}
function hideLoader(){document.getElementById('loader').classList.add('hidden')}
function withLoader(fn,t){showLoader(t);setTimeout(async()=>{try{await fn()}finally{hideLoader()}},40)}
const runNewGame=()=>withLoader(newGame,SCULPT_VARIANTS[document.getElementById('mode').value]?'Wczytywanie sceny 3D…':'Przygotowywanie stołu ekspertyz…');
function startMode(id){if(SOON.some(s=>s[0]===id))return;stopFX();document.getElementById('mode').value=id;document.getElementById('home').classList.add('hidden');runNewGame()}
function showHome(){document.getElementById('home').classList.remove('hidden');homeBg();renderHome();startFX()}
addEventListener('resize',()=>{if(!document.getElementById('home').classList.contains('hidden')){homeBg();renderHome()}});
