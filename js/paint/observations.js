"use strict";
/* =====================================================================
   OBSERWACJE
   ===================================================================== */
function provHTML(p){const t=p.t,y=ART.year;let li=[];
 if(!t.prov){li=[[y,`namalowany (list artysty, archiwum rodzinne)`],[y+2,`wystawa Towarzystwa Zachęty Sztuk Pięknych, Warszawa, kat. nr ${ART.crn%150+12}`],[y+3,'zakup: kolekcja Ludwika Krasnodębskiego, Warszawa'],[1908,'spadek: Zofia Krasnodębska']];
  if(p.warGap)li.push(['1939–1951','brak dokumentów'],[1951,'wpis do inwentarza kolekcji prywatnej, Kraków']);else li.push(['1939–1945','ukryty w majątku pod Lublinem (relacja rodziny, 1946)']);
  if(p.retouch)li.push([1961,'konserwacja – uzupełnienie ubytków, retusze (protokół pracowni)']);
  li.push([1987,'aukcja, Dom Aukcyjny „Nowy Świat”, poz. 38'],[2026,'zgłoszony do ekspertyzy przez spadkobierców']);
  return`<ul class="tl">${li.map(a=>`<li><b>${a[0]}</b> – ${a[1]}</li>`).join('')}</ul><div class="obs"><b>Katalog raisonné</b> (2004), nr ${ART.crn}: „${ART.title}”, ${SUP[supOf()].abbr}, ${fmt(ART.wcm)} × ${fmt(ART.hcm)} cm, ${supOf()==='canvas'?`płótno lniane ok. ${C.thread} nitek/cm`:supOf()==='wood'?'deska dębowa z trzech desek, parkietaż z 1910 r.':'blacha miedziana kuta, na odwrociu punca płatnerza'}, sygn. ${ART.sig.corner==='br'?'p.d.':'l.d.'} – z fotografią archiwalną.</div>`}
 li=p.m.prov==='attic'?[[2025,'„odnaleziony na strychu kamienicy w Łodzi” (oświadczenie sprzedającego)'],[2026,'oferowany prywatnie, cena wyraźnie poniżej rynkowej']]:[[1998,'zakup na targu staroci w Berlinie (brak dokumentu)'],[2011,'kolekcja prywatna, Wiedeń'],[2026,'oferowany do sprzedaży']];
 return`<ul class="tl">${li.map(a=>`<li><b>${a[0]}</b> – ${a[1]}</li>`).join('')}</ul><div class="obs"><b>Katalog raisonné</b> (2004): brak wpisu. Brak wzmianek w katalogach wystaw.</div>`}
function certHTML(p){const bad=p.t.cert,m=p.m.cert,iss=bad&&m==='issuer',dim=`${fmt(ART.wcm)} × ${fmt(ART.hcm)} cm`;
 const rows=[['Artysta',`${ART.name} (${ART.life})`],['Tytuł',ART.title],['Technika',iss?'—':SUP[supOf()].tech],['Wymiary',bad&&m==='dims'?`${fmt(Math.round(ART.wcm*0.93))} × ${fmt(Math.round(ART.hcm*0.93))} cm`:dim],['Data powstania',iss?'—':ART.year],['Sygnatura',`${ART.sig.corner==='br'?'p.d.':'l.d.'} „${ART.sig.text}”`],['Podstawa',iss?'oględziny':'badania technologiczne, oględziny'+(p.t.prov?'':`, kat. rais. nr ${ART.crn}`)]];
 return`<div class="doc"><h4>CERTYFIKAT AUTENTYCZNOŚCI</h4>${rows.map(r=>`<div class="row"><b>${r[0]}:</b><span>${r[1]}</span></div>`).join('')}<div class="stamp">${iss?'Wystawił: Art-Expert24 s.c. (brak na liście rzeczoznawców)<br>Podpis: nadruk, pieczątka firmowa':'Wystawił: dr hab. Jan Orlicz, rzeczoznawca, Dom Aukcyjny „Nowy Świat”<br>Podpis: odręczny atrament, pieczęć tłoczona'}</div></div><div class="cap">Pomiar obrazu na stole: ${dim}.</div>`}
function descItems(){const s=ART.sig,side=P[0].frag.side,ra=side==='r'?'w prawej górnej części':'w lewej górnej części';
 return{back:`Olej na płótnie lnianym, splot płócienny, ok. ${C.thread} nitek/cm; ${PG[C.ground][0].toLowerCase()}.`,
  pigment:'Analiza pigmentów (1965): '+P[0].descRegs.map(k=>`${k} – ${SC.REG[k].pig.map(q=>PG[q][0].toLowerCase()).join(', ')}`).join('; ')+'.',
  uv:`Naturalny werniks żywiczny; retusze z konserwacji w 1958 r. ${ra} obrazu.`,
  crack:'Drobna, nieregularna siatka spękań na całej powierzchni.',
  texture:'Wyraźne impasty w światłach, pociągnięcia pędzla zgodne z formą.',
  sig:`Sygnowany ${s.corner==='br'?'p.d.':'l.d.'}: „${s.text}”.`,
  style:SC.compDesc,
  ir:`Rysunek przygotowawczy węglem; pentimenti: ${SC.pentiText}.`,
  xray:`W RTG widoczny ${SC.hidden.desc}.`,
  micro:'Farba olejna kładziona pędzlem z włosia.'}}
function descHTML(){const d=descItems(),lab={back:'Podobrazie i grunt',pigment:'Pigmenty',uv:'Werniks i stan',crack:'Krakelura',texture:'Faktura',sig:'Sygnatura',style:'Kompozycja',ir:'Reflektografia IR',xray:'RTG',micro:'Technika'};
 return`<div class="doc"><h4>${ART.name.toUpperCase()} – „${ART.title}”</h4><div class="cap" style="color:#5a4a30;text-align:center">Katalog raisonné (2004), nr ${ART.crn} · ${fmt(ART.wcm)} × ${fmt(ART.hcm)} cm · ${ART.year}</div><ul>${Object.keys(lab).map(k=>`<li><b>${lab[k]}:</b> ${d[k]}</li>`).join('')}</ul>
 <div class="stamp">Historia: ${ART.year+2} – wystawa TZSP, Warszawa; 1902–1944 – kolekcja dworska pod Radomiem; 1944 – obraz uszkodzony w pożarze dworu, zaginiony. 2026 – fragment zgłoszony do ekspertyzy.</div></div>`}
function obs(p,id){if(MODE==='sculpt')return SV.obs(p,id);if(KIND)return KIND.obs(p,id);const t=p.t,m=p.m,F=MODE==='frag';
 switch(id){
 case'uv':if(F){const ra=p.frag.side==='r'?'w prawej górnej części':'w lewej górnej części';return t.uv?(m.uvKind==='fresh'?'Brak fluorescencji starego werniksu – powierzchnia jednolicie ciemnofioletowa; brak śladów retuszy.':`Zielonkawa fluorescencja werniksu, ale ${ra} żadnych retuszy.`):`Zielonkawa fluorescencja starego werniksu; ciemne plamy retuszy ${ra}.`+(sigLater(p)?' Sygnatura ciemna i ostra na tle świecącego werniksu.':'')}
  return(t.uv?'Brak fluorescencji starego werniksu – powierzchnia jednolicie ciemnofioletowa.':'Równomierna, zielonkawo-mleczna fluorescencja starego werniksu.')+(p.retouch?' Kilka ciemnych plam (retusze).':'')+(sigLater(p)&&!t.uv?' Sygnatura ciemna i ostra na tle świecącego werniksu.':'');
 case'back':if(F)return`Grunt widoczny w ubytkach: kolor ${({chalk:'biały',greyOil:'szary',redBole:'czerwony',gessoA:'jaskrawobiały'})[p.ground]} (skład – próbka spektroskopem). Płótno lniane, splot płócienny; gęstość nici policz na skali 1 cm.`;
  if(supOf()==='wood')return(t.back?'Płyta pilśniowa (twarda) z jednolitą, włóknistą strukturą, krawędzie cięte maszynowo, bez słojów i bez ubytków drewna.':'Trzy dębowe deski klejone pionowo, słoje promieniowe, krawędzie fazowane ręcznie; parkietaż z listew; drewno ciemne, z chodnikami kołatka.')+(!t.prov?' Nalepka wystawy TZSP, Warszawa '+(ART.year+2)+'.':' Brak nalepek i oznaczeń.');
  if(supOf()==='copper')return(t.back?'Blacha walcowana, idealnie równa i błyszcząca – magnes jej nie przyciąga, ale barwa jest szara (cynk), bez śladów kucia i bez puncy.':'Blacha miedziana, ciemna, z zielonkawą patyną; ślady młotka i szlifowania; wybita punca płatnerza.')+(!t.prov?' Nalepka wystawy TZSP, Warszawa '+(ART.year+2)+'.':' Brak nalepek i oznaczeń.');
  return t.back?'Płótno przymocowane metalowymi zszywkami; drewno blejtramu jasne, świeże, bez patyny.':'Ręcznie kute gwoździe z rdzawymi obwódkami; drewno blejtramu ciemne, utlenione; kliny w narożnikach.'+(!t.prov?' Nalepka wystawy TZSP, Warszawa '+(ART.year+2)+'.':' Brak nalepek i oznaczeń.');
 case'weave':return p.linen?'Płótno lniane – nici nierównej grubości i nieregularnie rozstawione; policz je na skali 1 cm.':'Płótno bawełniane – nici równe, gęste, maszynowo regularne; policz je na skali 1 cm.';
 case'mark':return`Przy krawędzi obrazu mikroskopijny napis „${p.markTxt}” wkomponowany w farbę – nie pasuje do sygnatury artysty.`;
 case'crack':return{natural:'Nieregularna siatka spękań, pola różnej wielkości, gęstość zmienia się na powierzchni.',artificial:'Bardzo regularna siatka spękań o jednakowych polach, rysy równomiernie ciemne.',none:'Farba bez spękań.'}[crackMode(p)];
 case'texture':return{real:'Impasty w światłach; pociągnięcia pędzla idą za formą (poziomo w niebie i wodzie, krótkie dotknięcia w drobnych formach).',flat:'Powierzchnia płaska, widoczny regularny raster punktów.',mismatch:'Relief obecny, ale wszystkie pociągnięcia biegną ukośnie w jednym kierunku, niezależnie od form.'}[t.texture?m.texture:'real'];
 case'sig':return(crackMode(p)==='none'?'Brak spękań – relacji podpisu z krakelurą nie da się ocenić.':sigLater(p)?'Spękania urywają się na krawędzi podpisu – farba sygnatury leży na rysach.':'Spękania przechodzą przez sygnaturę tak jak przez resztę farby.')+' '+(sigShaky(p)?'Litery o innym nachyleniu niż w podpisach referencyjnych, linie drżące i poprawiane.':'Kształt liter, nachylenie i płynność zgodne z podpisami referencyjnymi.');
 case'style':return t.style?SC.errText[m.style]:(F?'Kompozycja, proporcje i kierunek światła zgodne z opisem.':SC.okText);
 case'prov':return!t.prov?`Ciągła historia od ${ART.year} r., wystawa ${ART.year+2}, wpis w katalogu raisonné nr ${ART.crn}.`+(p.warGap?' Luka w dokumentach 1939–1951.':''):m.prov==='attic'?'Brak historii przed 2025 r. – „odnaleziony na strychu”; brak w katalogu raisonné.':'Historia dopiero od 1998 r.; brak wpisu w katalogu raisonné.';
 case'cert':return!t.cert?'Certyfikat kompletny, wymiary zgodne z pomiarem, wystawiony przez rzeczoznawcę domu aukcyjnego, podpis odręczny.':m.cert==='dims'?'Wymiary w certyfikacie różnią się od zmierzonych o ok. 7%.':'Wystawca: „Art-Expert24 s.c.”; pola technika i data puste; podpis jest nadrukiem.';
 case'xray':if(F)return t.xray?'W RTG brak ukrytych motywów pod warstwą malarską.':`W RTG widoczny ${SC.hidden.desc}.`;
  if(supOf()==='copper')return'Blacha miedziana pochłania promieniowanie – obraz w RTG prawie jednolicie jasny, kompozycji nie widać.';
  if(supOf()==='wood')return(t.xray?'Pod powierzchnią inna kompozycja: owalny portret ułożony w poprzek deski.':'Jasne pola bieli ołowiowej zgodne z kompozycją.')+(t.back?' Podłoże bez słojów – jednolita płyta.':' Widoczne słoje dębu i spoiny trzech desek, listwy parkietażu.');
  return(t.xray?'Pod powierzchnią inna kompozycja: owalny portret ułożony w poprzek płótna.':'Jasne pola bieli ołowiowej zgodne z kompozycją; widoczny blejtram.')+(t.back?' Na krawędziach metalowe zszywki.':' Na krawędziach gwoździe.');
 case'ir':return{real:`Szkic węglem pod farbą; zmiany kompozycji (pentimenti): ${SC.pentiText}.`,grid:'Regularna siatka kwadratów i precyzyjne, jednolite kontury bez poprawek.',none:'Brak rysunku przygotowawczego.'}[irMode(p)];
 }}
function whyBad(p,id){if(MODE==='sculpt')return SV.why(p,id);if(KIND)return KIND.why(p,id);const m=p.m,F=MODE==='frag';
 const f={pigment:()=>{const R=SC.REG[m.pigReg],o=R.pig[0];if(MODE==='paint5'&&p.profile==='giclee')return'Wyłącznie współczesne pigmenty organiczne tuszów drukarskich.';
   return m.pigKind==='alt'?`${m.pigReg}: ${PG[ALT[o]||'zn'][0]} zamiast ${PG[o][0].toLowerCase()} z analizy oryginału.`:`${m.pigReg}: ${PG[R.an][0]} – pigment wprowadzony ok. ${PG[R.an][1]} r., po dacie obrazu (${ART.year}).`},
  uv:()=>F?(m.uvKind==='fresh'?'Świeży werniks bez fluorescencji i bez opisanych retuszy z 1958 r.':'Brak retuszy w miejscu wskazanym w opisie.'):'Brak fluorescencji starego werniksu – świeży werniks, niezgodny z wiekiem obrazu.',
  back:()=>F?[m.backKind!=='ground'?`płótno ma ${p.thread} nitek/cm, a w opisie ${C.thread}`:'',m.backKind!=='thread'?`grunt: ${PG[p.ground][0].toLowerCase()} zamiast „${PG[C.ground][0].toLowerCase()}”`:''].filter(Boolean).join('; ').replace(/^./,c=>c.toUpperCase())+'.'
   :supOf()==='wood'?'Płyta pilśniowa zamiast dębowej deski – materiał z XX wieku.':supOf()==='copper'?'Walcowana blacha cynkowa zamiast kutej miedzi – współczesne podobrazie.':`Zszywki, świeże drewno i równe bawełniane płótno (${p.thread} nitek/cm zamiast ${C.thread}) – współczesne podobrazie.`,
  crack:()=>crackMode(p)==='none'?'Brak krakelury – farba zbyt młoda jak na XIX wiek.':'Sztuczna, zbyt regularna krakelura (wypiekana i wcierana pigmentem).',
  texture:()=>m.texture==='flat'?'Płaska powierzchnia z rastrem – wydruk.':'Faktura nie odpowiada kompozycji – nałożona mechanicznie.',
  sig:()=>m.sig==='later'?'Podpis domalowany na wyschniętą, spękaną farbę.':'Podpis niezgodny grafologicznie – kopiowany powoli, drżącą ręką.',
  style:()=>SC.errWhy[m.style],
  prov:()=>m.prov==='attic'?'„Odnaleziony na strychu” – brak historii i wpisu w katalogu raisonné.':'Historia od 1998 r., brak w katalogu raisonné.',
  cert:()=>m.cert==='dims'?'Wymiary w certyfikacie nie zgadzają się z obrazem.':'Certyfikat od podmiotu bez uprawnień, niekompletny, podpis drukowany.',
  xray:()=>F?`Brak motywu widocznego w RTG oryginału (${SC.hidden.desc}).`:(supOf()==='wood'?'Pod spodem inny obraz – użyto starej deski z epoki.':'Pod spodem inny obraz – użyto starego płótna z epoki.'),
  ir:()=>irMode(p)==='grid'?'Siatka do przenoszenia i kontury bez poprawek – kopiowanie, nie tworzenie.':'Brak rysunku przygotowawczego i pentimenti.',
  micro:()=>microMode(p)==='print'?'Raster kolorowych punktów druku atramentowego – to reprodukcja.':'Jednolita, plastyczna warstwa akrylu z przemysłowymi cząstkami – farba współczesna.',
  mark:()=>`Ukryty monogram „${p.markTxt}” – znak fałszerza, widoczny dopiero przy dużym zoomie.`};return f[id]?f[id]():''}
const MICRO_OBS={brush:'bruzdy po włosiu pędzla, cząstki pigmentu nieregularne i różnej wielkości.',print:'regularny raster drobnych punktów w kolorach C, M, Y, K – brak bruzd pędzla.',acryl:'gładka, plastyczna warstwa, jednakowe drobne cząstki, brak bruzd po włosiu.'};
function note(p,id,txt){if(!p||!txt)return false;if(id==='pigment'||id==='micro'||id==='xrf'||id==='ink'){(p.notes[id]=p.notes[id]||[]).push(txt);return true}if(p.notes[id])return false;p.notes[id]=txt;return true}
