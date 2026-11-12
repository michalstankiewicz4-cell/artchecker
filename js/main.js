"use strict";
/* =====================================================================
   START – lista trybów w menu i uruchomienie gry (ładowany jako ostatni)
   Nowy rodzaj obiektu 2D pojawia się w menu sam po registerKind().
   ===================================================================== */
const MENU=[
 ['Obrazy',[['paint5','Przeprowadź ekspertyzę – obrazy'],['frag','Zniszczony fragment – czy to oryginał?'],['memory','Pamięć eksperta – zapamiętaj oryginał'],...Object.values(KINDS).filter(k=>k.group==='art').map(k=>[k.id,k.label])]],
 ['Rzeźby 3D',Object.values(SCULPT_VARIANTS).map(v=>[v.id,v.label])],
 ['Obiekty',Object.values(KINDS).filter(k=>k.group!=='art').map(k=>[k.id,k.label])],
 ['Wkrótce',[['auction','Aukcja (wkrótce)',1],['investigation','Śledztwo (wkrótce)',1],['conservator','Konserwator (wkrótce)',1]]],
];
document.getElementById('mode').innerHTML=MENU.map(([g,items])=>`<optgroup label="${g}">${items.map(([id,l,dis])=>`<option value="${id}"${dis?' disabled':''}>${l}</option>`).join('')}</optgroup>`).join('');
document.getElementById('appver').textContent='v'+VERSION;document.getElementById('hver').textContent='· v'+VERSION;
document.getElementById('homebtn').onclick=showHome;
for(const id of['hwiki','gwiki'])document.getElementById(id).onclick=()=>showWiki();
document.getElementById('wclose').onclick=()=>document.getElementById('wiki').classList.add('hidden');
document.getElementById('wq').oninput=()=>{WSEL=0;renderWiki()};
setTimeout(async()=>{if(REAL_DEF.paint5)try{await loadReal(REAL_DEF.paint5)}catch(e){}showHome();setTimeout(hideLoader,120)},30);

const showAbout=()=>{document.getElementById('aboutver').textContent='v'+VERSION;document.getElementById('aboutreal').innerHTML=REAL.map(e=>`<li>${e.artist}, „${e.title}”, ${e.year} – ${e.museum}; licencja: ${e.license}; źródło: <a href="${realSrc(e)}" target="_blank" rel="noopener">Wikimedia Commons</a></li>`).join('');document.getElementById('about').classList.add('show')};
for(const id of['habout','gabout'])document.getElementById(id).onclick=showAbout;
document.getElementById('aboutclose').onclick=()=>document.getElementById('about').classList.remove('show');
document.getElementById('about').onclick=e=>{if(e.target.id==='about')e.target.classList.remove('show')};
{const sc=document.querySelector('#about .abscroll'),upd=()=>sc.classList.toggle('end',sc.scrollTop+sc.clientHeight>=sc.scrollHeight-4);sc.addEventListener('scroll',upd);new ResizeObserver(upd).observe(sc)}
