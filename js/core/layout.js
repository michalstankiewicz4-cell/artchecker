"use strict";
/* =====================================================================
   UKŁAD STANOWISKA – zakładki prawego okna, pasek obiektów (dok),
   zwijane zlecenie, liczniki.
   ===================================================================== */
function showTab(id){document.querySelectorAll('#right .tabs button').forEach(b=>b.classList.toggle('on',b.dataset.tab===id));
 document.querySelectorAll('#right .pane').forEach(p=>p.classList.toggle('on',p.id===id))}
document.querySelectorAll('#right .tabs button').forEach(b=>b.onclick=()=>showTab(b.dataset.tab));
document.getElementById('briefx').onclick=()=>document.getElementById('brief').classList.toggle('open');
function objName(p){return MODE==='frag'?'Fragment':(p.kind?p.kind.noun+' ':MODE==='sculpt'?'Rzeźba ':'Obraz ')+p.letter}
function updateDock(){const el=document.getElementById('strip'),nt=TLIST.length;
 const cc=sel&&sel.check?Object.values(sel.check).filter(Boolean).length:0,nn=sel?Object.keys(sel.notes||{}).length:0;
 document.getElementById('bcheck').textContent=cc||'';document.getElementById('bnotes').textContent=nn||'';
 document.getElementById('toolcnt').textContent=sel&&nt?`${objName(sel)}: ${TLIST.filter(t=>sel.notes[t.id]).length}/${nt}`:'';
 if(!P.length||(MODE==='memory'&&MEM.phase===1)){el.innerHTML='';return}
 el.innerHTML=P.map((p,i)=>{const m=p.umark,ic=m==='excl'?'✕':m==='susp'?'?':m==='ok'?'✓':'',nc=p.check?Object.values(p.check).filter(Boolean).length:0,u=nt?TLIST.filter(t=>p.notes[t.id]).length:0;
  return`<button class="chip${sel===p?' on':''}${m?' m-'+m:''}" data-i="${i}" title="${objName(p)}"><b>${MODE==='frag'?'F':p.letter}</b><span>${ic?`<i>${ic}</i>`:''}${nt?`<small>${u}/${nt}</small>`:''}${nc?`<small class="fl">⚑${nc}</small>`:''}</span>${nt?`<em style="width:${Math.round(u/nt*100)}%"></em>`:''}</button>`}).join('');
 el.querySelectorAll('.chip').forEach(b=>b.onclick=()=>{sel=P[+b.dataset.i];document.getElementById('zsel').click();onChange()})}
document.getElementById('zlamp').onclick=()=>{LAMP.on=!LAMP.on;updatePanel();render()};
document.getElementById('board').addEventListener('pointerleave',()=>{LAMP.sx=LAMP.sy=null});
