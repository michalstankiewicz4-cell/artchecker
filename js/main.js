"use strict";
/* =====================================================================
   START – lista trybów w menu i uruchomienie gry (ładowany jako ostatni)
   Nowy rodzaj obiektu 2D pojawia się w menu sam po registerKind().
   ===================================================================== */
const MENU=[
 ['Obrazy',[['paint5','Znajdź oryginał – obrazy'],['frag','Zniszczony fragment – czy to oryginał?'],['memory','Pamięć eksperta – zapamiętaj oryginał']]],
 ['Rzeźby 3D',Object.values(SCULPT_VARIANTS).map(v=>[v.id,v.label])],
 ['Obiekty',Object.values(KINDS).map(k=>[k.id,k.label])],
 ['Wkrótce',[['auction','Aukcja (wkrótce)',1],['investigation','Śledztwo (wkrótce)',1],['conservator','Konserwator (wkrótce)',1]]],
];
document.getElementById('mode').innerHTML=MENU.map(([g,items])=>`<optgroup label="${g}">${items.map(([id,l,dis])=>`<option value="${id}"${dis?' disabled':''}>${l}</option>`).join('')}</optgroup>`).join('');
document.getElementById('appver').textContent='v'+VERSION;document.getElementById('hver').textContent='· v'+VERSION;
document.getElementById('homebtn').onclick=showHome;
showHome();
