"use strict";
/* =====================================================================
   NARZĘDZIA – DEFINICJE
   ===================================================================== */
const AREA={all:'środek widoku na obrazie',sig:'środek widoku na sygnaturze',style:'środek widoku na kluczowym detalu kompozycji',ground:'środek widoku na ubytku farby lub rozdartej krawędzi'};
const DEF={
 pigment:{name:'Spektroskopia pigmentów',view:'normal',probe:'pigment',gate:{z:3},hint:'Przy zoomie ≥ ×3 kliknij w różne obszary obrazu, żeby pobrać próbkę z jednego miejsca. Porównaj datę wprowadzenia pigmentu z datą obrazu – nowoczesny pigment demaskuje fałszerstwo.',
  hintF:'Przy zoomie ≥ ×3 pobieraj próbki i porównuj je z analizą oryginału z 1965 r. (Opis oryginału). Inny pigment niż w opisie – nawet z epoki – oznacza, że to nie ten obraz. Próbka z ubytku pokazuje skład gruntu.'},
 uv:{name:'Lampa UV',view:'uv',gate:{z:1.2,area:'all'},hint:'Stary werniks świeci w UV zielonkawo-mlecznie. Retusze i wszystko, co nałożono na werniks później, wygląda jak ciemne plamy. Retusz konserwatorski sam w sobie nie oznacza fałszerstwa.',
  hintF:'Opis wymienia retusze z konserwacji z 1958 r. – czy są dokładnie w opisanym miejscu? Brak fluorescencji starego werniksu oznacza świeży werniks.'},
 back:{name:'Podłoże i rama (odwrocie)',view:'back',gate:{z:2,area:'all'},hint:'Sprawdź sposób naciągnięcia płótna, gwoździe, drewno blejtramu i nalepki. Przy zoomie ≥ ×8 policz nici płótna na skali 1 cm i porównaj z katalogiem raisonné.',
  nameF:'Podłoże i grunt (ubytki)',viewF:'normal',gateF:{z:8,area:'ground'},hintF:'Przybliż ubytek farby albo rozdartą krawędź (zoom ≥ ×8). Policz nici na skali 1 cm i porównaj z opisem. Skład gruntu sprawdzisz spektroskopem w ubytku.'},
 crack:{name:'Krakelura',view:'crackview',gate:{z:4,area:'all'},hint:'Widok wzmacnia kontrast spękań – przybliż do ×4. Naturalna krakelura to nieregularna siatka o polach różnej wielkości. Sztuczna (wypiekana, wcierana) bywa zbyt regularna. Brak spękań przy farbie sprzed 150 lat jest podejrzany.'},
 texture:{name:'Faktura (światło boczne)',view:'raking',gate:{z:3,area:'all'},hint:'Światło z boku wydobywa relief farby (zoom ≥ ×3). Ślady pędzla i impasty powinny odpowiadać kompozycji. Wydruk jest płaski, a nałożona „faktura” nie zgadza się z formami.'},
 sig:{name:'Sygnatura',view:'normal',gate:{z:5,area:'sig'},hint:'Przybliż sygnaturę (≥ ×5). Porównaj ją z podpisami referencyjnymi i sprawdź, czy spękania przez nią przechodzą (namalowana na mokro), czy farba podpisu leży na rysach (domalowana później).'},
 style:{name:'Kunszt i styl',view:'normal',gate:{z:2.5,area:'style'},hint:'Wycentruj widok na kluczowym detalu (≥ ×2,5) i porównaj z dziełem referencyjnym: proporcje, perspektywa, logika światła i cieni.',
  nameF:'Kompozycja a opis oryginału',hintF:'Wycentruj widok na kluczowym detalu (≥ ×2,5) i porównaj go z opisem kompozycji w dokumentacji oryginału.'},
 prov:{name:'Proweniencja',view:'normal',hint:'Prześledź historię własności: wystawy, katalog raisonné, transakcje. „Nagle odnalezione” arcydzieło bez historii budzi największe podejrzenia. Pojedyncza luka (np. wojenna) sama nie przesądza.'},
 cert:{name:'Certyfikat autentyczności',view:'normal',hint:'Certyfikat powinien zawierać artystę, tytuł, wymiary, technikę, datę i wiarygodny podpis uznanego rzeczoznawcy. Porównaj dane z pomiarem obrazu.'},
 docs:{name:'Opis oryginału',view:'normal',hint:'Oryginał zaginął w 1944 r. – znamy go tylko z opisu w katalogu i z badań z 1965 r. Każdy punkt opisu da się sprawdzić narzędziami.'},
 xray:{name:'RTG',view:'xray',gate:{z:1.2,area:'all'},hint:'RTG pokazuje warstwy z ciężkimi pierwiastkami (biel ołowiowa), konstrukcję blejtramu i gwoździe – oraz to, co ukryte pod obrazem.',
  hintF:'Opis wymienia zamalowany motyw widoczny w RTG oryginału – czy jest na fragmencie?'},
 ir:{name:'Reflektografia IR',view:'ir',gate:{z:2,area:'all'},hint:'Podczerwień (zoom ≥ ×2) odsłania rysunek przygotowawczy. Autorskie zmiany kompozycji (pentimenti) trudno skopiować. Siatka do przenoszenia i idealne kontury bez poprawek sugerują kopiowanie.',
  hintF:'Porównaj rysunek przygotowawczy i pentimenti z opisem badań IR z 1965 r.'},
 micro:{name:'Topografia mikrostruktury',view:'normal',probe:'micro',gate:{z:5},hint:'Od zoomu ×5 mikrostruktura jest widoczna bezpośrednio na obrazie; kliknięcie zapisuje pomiar. Pędzel zostawia bruzdy i nieregularne cząstki. Druk to raster punktów, akryl – gładka plastyczna warstwa.'},
};
const SET={memory:[],paint5:[['1. Materiały i wiek',['pigment','uv','back','crack','texture']],['2. Sygnatura i styl',['sig','style']],['3. Proweniencja i dokumenty',['prov','cert']],['4. Technologie nieinwazyjne',['xray','ir','micro']]],
 frag:[['1. Materiały i wiek',['pigment','uv','back','crack','texture']],['2. Sygnatura i kompozycja',['sig','style']],['3. Dokumentacja oryginału',['docs']],['4. Technologie nieinwazyjne',['xray','ir','micro']]]};
const EXTRA={weave:'Gęstość płótna (zoom ×8)',mark:'Ukryty znak (zoom ×8)'};
function buildToolDefs(){TB={};TLIST=[];GROUPS=MODE==='sculpt'?SET3:MODE==='notes'?SETN:SET[MODE];const F=MODE==='frag';
 for(const[g,ids]of GROUPS)for(const id of ids){const d=MODE==='sculpt'?DEF3[id]:MODE==='notes'?DEFN[id]:DEF[id];
  const t={id,g,name:F&&d.nameF||d.name,view:F&&d.viewF||d.view,gate:F&&d.gateF||d.gate,gate3:d.gate3,probe:d.probe,hint:F&&d.hintF||d.hint};TB[id]=t;TLIST.push(t)}}
const curView=()=>tool&&TB[tool]?TB[tool].view||'normal':'normal';
