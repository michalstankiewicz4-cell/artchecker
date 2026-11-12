"use strict";
/* =====================================================================
   JĘZYK (PL / EN)
   Wybór: ?lang=pl|en w adresie > wybór gracza (localStorage 'artchecker.lang') > język przeglądarki
   (polski → PL, każdy inny → EN). Przełącznik PL/EN zapisuje wybór i przeładowuje stronę.
   Teksty: słownik EN (klucz = tekst polski). tr(s) tłumaczy w kodzie, a obserwator DOM
   tłumaczy każdy węzeł tekstowy i atrybut (title, placeholder, label), którego cała treść jest w słowniku.
   Dłuższe bloki HTML mają dwie wersje: data-l="pl" / data-l="en" (CSS ukrywa drugą).
   Kolejne etapy dopisują teksty do słownika EN (np. js/data/i18n-*.js).
   ===================================================================== */
const LANG=(()=>{try{const u=new URLSearchParams(location.search).get('lang');if(u==='pl'||u==='en')return u}catch(e){}
 try{const s=localStorage.getItem('artchecker.lang');if(s==='pl'||s==='en')return s}catch(e){}
 const l=(navigator.languages&&navigator.languages[0])||navigator.language||'';return/^pl\b/i.test(l)?'pl':'en'})();
document.documentElement.lang=LANG;
const EN={};
const tr=s=>LANG==='en'&&s!=null?trText(String(s)):s;
function setLang(l){try{localStorage.setItem('artchecker.lang',l)}catch(e){}const u=new URL(location.href);u.searchParams.delete('lang');location.href=u.toString()}

/* --- etap 1: interfejs, ekran startowy, menu --- */
Object.assign(EN,{
 'Pracownia ekspertyz':'Authentication Lab','Laboratorium badań i autentyczności':'Laboratory of analysis and authenticity',
 'Uruchamianie laboratorium…':'Starting the lab…','Przygotowywanie…':'Preparing…','Przygotowywanie stołu ekspertyz…':'Preparing the examination table…','Wczytywanie sceny 3D…':'Loading the 3D scene…',
 'Ekran główny':'Home screen','☰ Menu':'☰ Menu','Tryb':'Mode','Artysta':'Artist','↻ Nowa partia':'↻ New round','📖 Wiki':'📖 Wiki','ℹ O programie':'ℹ About',
 'Narzędzia':'Tools','Zlecenie':'Commission','Zwiń / rozwiń':'Collapse / expand','Stół badawczy':'Examination table','Oddal':'Zoom out','Przybliż':'Zoom in','Nachylenie':'Tilt',
 'Całość':'Fit all','Wybrany':'Selected','Sygnatura':'Signature','Tył cokołu':'Back of plinth','Detal':'Detail','Numer':'Number','Pieczęć':'Seal','Awers':'Obverse','Przedruk':'Overprint',
 'Przełącz: lampa ruchoma (krąg światła za kursorem) albo cały obiekt naraz':'Toggle: moving lamp (a circle of light following the cursor) or the whole object at once',
 '🔦 Lampa ruchoma':'🔦 Moving lamp','💡 Cały obiekt':'💡 Whole object','Nie wybrano obiektu.':'No object selected.',
 'Wynik badania':'Result','Checklista':'Checklist','Notatnik':'Notebook',
 '📖 Wiki eksperta':'📖 Expert wiki','Szukaj: krakelura, XRF, ząbkowanie…':'Search: craquelure, XRF, perforation…','✕ Zamknij':'✕ Close','Zamknij':'Close',
 'Przeciągnij – obracaj · prawy przycisk / Shift – przesuń · kółko / szczypanie – przybliż · kliknij rzeźbę – wybierz':'Drag – rotate · right button / Shift – pan · wheel / pinch – zoom · click a sculpture – select',
 'Kółko myszy / szczypanie – zoom (do ×24) · przeciągnij – przesuń · kliknij obiekt – wybierz · lampa świeci za kursorem (Shift + kółko – wielkość)':'Mouse wheel / pinch – zoom (up to ×24) · drag – pan · click an object – select · the lamp follows the cursor (Shift + wheel – size)',
 'Najedź kursorem – lupa ×4 · kliknij obraz – wybierz':'Hover – ×4 magnifier · click a painting – select',
 'Zakończ ekspertyzę':'Finish examination','Pochodzi z oryginału':'Comes from the original','To nie oryginał':'Not the original','To jest oryginał':'This is the original',
 'Obrazy':'Paintings','Rzeźby 3D':'3D sculptures','Obiekty':'Objects','Wkrótce':'Coming soon',
 'Przeprowadź ekspertyzę – obrazy':'Authenticate – paintings','Przeprowadź ekspertyzę – rzeźby z brązu':'Authenticate – bronze sculptures','Przeprowadź ekspertyzę – rzeźby z marmuru':'Authenticate – marble sculptures',
 'Rzeźby z brązu':'Bronze sculptures','Rzeźby z marmuru':'Marble sculptures',
 'Zniszczony fragment – czy to oryginał?':'Damaged fragment – is it original?','Pamięć eksperta – zapamiętaj oryginał':'Expert memory – remember the original',
 'Zniszczony fragment':'Damaged fragment','Pamięć eksperta':'Expert memory','Rysunki i grafiki':'Drawings and prints','Akwarele i pastele':'Watercolours and pastels',
 'Weryfikacja banknotów':'Banknote verification','Weryfikacja monet':'Coin verification','Weryfikacja znaczków':'Stamp verification','Weryfikacja rękopisów':'Manuscript verification',
 'Aukcja (wkrótce)':'Auction (coming soon)','Śledztwo (wkrótce)':'Investigation (coming soon)','Konserwator (wkrótce)':'Conservator (coming soon)','Aukcja':'Auction','Śledztwo':'Investigation','Konserwator':'Conservator',
 'Badania obrazów':'Painting analysis','Poznaj dzieło':'Get to know the work',
 'Zbadaj obrazy nowoczesnymi metodami: UV, podczerwień, RTG, spektroskopia pigmentów, krakelura i mikroskop. Odkryj kopie, przemalowania i ślady historii dzieła.':'Examine paintings with modern methods: UV, infrared, X-ray, pigment spectroscopy, craquelure and the microscope. Uncover copies, overpainting and traces of a work\'s history.',
 'Obejdź i przybliż':'Walk around and zoom in',
 'Obracaj kamerę i podchodź blisko: skład stopu, patyna, ślady dłuta i frezu, szwy odlewnicze, sygnatury z tyłu cokołu, UV i RTG.':'Orbit the camera and get close: alloy composition, patina, chisel and milling marks, casting seams, signatures on the back of the plinth, UV and X-ray.',
 'Obiekty i dokumenty':'Objects and documents','Odkryj prawdę':'Uncover the truth',
 'Banknoty, monety, znaczki i rękopisy – każdy ma własne zabezpieczenia, materiały i typowe metody fałszerstw. Na checkliście każdego egzemplarza zaznacz sygnały fałszerstwa – egzemplarz bez sygnałów uznajesz za prawdziwy.':'Banknotes, coins, stamps and manuscripts – each has its own security features, materials and typical forgery methods. Tick the forgery signs on each item\'s checklist – an item with no signs counts as genuine.',
 'W przygotowaniu':'In preparation',
 'Aukcja z budżetem, śledztwo w sprawie fałszerza i praca konserwatora – kolejne tryby są w przygotowaniu.':'An auction with a budget, an investigation into a forger and a conservator\'s work – more modes are in preparation.',
 'Ukończone ekspertyzy':'Completed examinations','trafne werdykty':'correct verdicts','Badania w tym trybie:':'Tests in this mode:',
 '▶ Rozpocznij badania':'▶ Start examination','▶ Wkrótce':'▶ Coming soon','▶ Rozpocznij':'▶ Start','✔ Zakończono':'✔ Completed','wkrótce':'coming soon',
 'Losowy artysta (fikcyjny)':'Random artist (fictional)','Losowa praca (fikcyjna)':'Random work (fictional)','Dzieła prawdziwe (domena publiczna)':'Real artworks (public domain)','Losowe dzieło prawdziwe':'Random real artwork',
 'pejzaż':'landscape','portret':'portrait','martwa natura':'still life','marina':'seascape',
 'Przełącz na angielski':'Switch to English','Przełącz na polski':'Switch to Polish',
});

/* --- tłumaczenie tekstu: 1) cały tekst, 2) wzorce z {0},{1}… (klucz z miejscami na wartości), 3) frazy od najdłuższych (granica słowa) --- */
let TRX=null;const TRC=new Map();
function trBuild(){const esc=x=>x.replace(/[.*+?^$()|[\]\\]/g,'\\$&').replace(/[{}]/g,'\\$&');const pats=[],phr=[];
 for(const k in EN){if(k.length<3||EN[k]===k)continue;if(/\{\d\}/.test(k)){const parts=k.split(/\{(\d)\}/),ord=[];let re='';parts.forEach((t,i)=>{if(i%2){ord.push(+t);re+='([^:\\n]+?)'}else re+=esc(t)});pats.push([new RegExp((/^\\{/.test(k)?'':'(?<![\\p{L}\\d])')+re+(/\{\d\}$/.test(k)?'$':''),'gu'),EN[k],ord,k.length])}else phr.push(k)}
 pats.sort((a,b)=>b[3]-a[3]);phr.sort((a,b)=>b.length-a.length);
 TRX={pats,phr:phr.length?new RegExp('(?<![\\p{L}\\d])('+phr.map(esc).join('|')+')(?![\\p{L}])','gu'):null};TRC.clear()}
function trText(s){if(LANG!=='en'||!s)return s;const k=s.trim();if(!k||!/[A-Za-ząćęłńóśźżĄĆĘŁŃÓŚŹŻ]/.test(k))return s;if(EN[k])return s.replace(k,EN[k]);
 if(TRC.has(s))return TRC.get(s);if(!TRX)trBuild();let o=s;
 for(const[re,en,ord]of TRX.pats)o=o.replace(re,(...m)=>en.replace(/\{(\d)\}/g,(_,d)=>{const v=m[1+ord.indexOf(+d)];return EN[v]||v}));
 if(TRX.phr)o=o.replace(TRX.phr,m=>EN[m]);if(TRC.size>4000)TRC.clear();TRC.set(s,o);return o}
const trAdd=o=>{Object.assign(EN,o);TRX=null};

/* --- tłumaczenie DOM: węzły tekstowe i atrybuty (wiki – tylko całe teksty, do etapu 3) --- */
function trNode(n,exact){if(LANG!=='en')return;
 if(n.nodeType===3){const t=n.nodeValue;if(exact){const k=t.trim();if(k&&EN[k])n.nodeValue=t.replace(k,EN[k])}else{const o=trText(t);if(o!==t)n.nodeValue=o}return}
 if(n.nodeType!==1)return;const ex=exact||n.id==='wart'||n.id==='wlist'||n.id==='wcats'||n.closest&&n.closest('#wart,#wlist,#wcats');
 for(const a of['title','placeholder','label','alt','aria-label']){const v=n.getAttribute&&n.getAttribute(a);if(v){const o=ex?(EN[v.trim()]||v):trText(v);if(o!==v)n.setAttribute(a,o)}}
 for(const c of n.childNodes)trNode(c,ex)}
const trIn=n=>trNode(n,n.parentElement&&!!n.parentElement.closest('#wart,#wlist,#wcats'));
if(LANG==='en'){const obs=new MutationObserver(ms=>{for(const m of ms){if(m.type==='childList')m.addedNodes.forEach(trIn);else trIn(m.target)}});
 const go=()=>{trNode(document.body);obs.observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['title','placeholder','label','alt','aria-label']})};
 if(document.body)go();else document.addEventListener('DOMContentLoaded',go)}

/* --- przełącznik i dane strony dla wybranego języka --- */
document.addEventListener('DOMContentLoaded',()=>{
 document.querySelectorAll('.langbtn').forEach(b=>{b.textContent=LANG==='pl'?'EN':'PL';b.title=LANG==='pl'?'Przełącz na angielski':'Switch to Polish';b.onclick=()=>setLang(LANG==='pl'?'en':'pl')});
 if(LANG==='pl'){document.title='Pracownia ekspertyz – gra o rozpoznawaniu oryginałów i falsyfikatów';
  const d=document.querySelector('meta[name=description]');if(d)d.content='Darmowa gra przeglądarkowa: zbadaj obrazy, rzeźby 3D, banknoty, monety, znaczki i rękopisy jak ekspert. Lampa UV, podczerwień, RTG, analiza pigmentów, krakelura, XRF – odróżnij oryginał od falsyfikatu.'}});
