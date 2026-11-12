"use strict";
/* =====================================================================
   DZIEŁA PRAWDZIWE (domena publiczna) – obrazy w img/real/ i js/real/
   pobrane z Wikimedia Commons akcją GitHub (tools/real-art.txt).
   Prawdziwe są: autor, tytuł, data, technika, podobrazie, wymiary (przybliżone) i miejsce przechowywania.
   Wszystkie wyniki badań w grze (UV, IR, RTG, pigmenty, proweniencja, certyfikaty, stemple) są SYMULOWANE.
   ===================================================================== */
const REAL=[
 {slug:'stanczyk',mode:'paint5',artist:'Jan Matejko',life:'1838–1893',title:'Stańczyk',year:'1862',yearNum:1862,tech:'olej na płótnie',sup:'canvas',wcm:120,hcm:88,museum:'Muzeum Narodowe w Warszawie',
  license:'domena publiczna',file:'Jan Matejko, Stańczyk.jpg',fig:[0.36,0.3,0.32,0.62],style:[0.4,0.3,0.24,0.32],pig:{bg:['umb','bone','sien'],fig:['cyn','pb','lake']},
  desc:'Błazen Stańczyk siedzi w fotelu w ciemnej komnacie, w czerwonym stroju; w tle przez otwarte drzwi widać bal na dworze królowej Bony. Na stole list o utracie Smoleńska.'},
 {slug:'babie-lato',mode:'paint5',artist:'Józef Chełmoński',life:'1849–1914',title:'Babie lato',year:'1875',yearNum:1875,tech:'olej na płótnie',sup:'canvas',wcm:156.5,hcm:119.7,museum:'Muzeum Narodowe w Warszawie',
  license:'domena publiczna',file:'Józef Chełmoński - Indian summer - Google Art Project.jpg',fig:[0.09,0.26,0.87,0.6],style:[0.55,0.22,0.3,0.42],pig:{bg:['ochy','sien','ultr','pb'],fig:['pb','ochy','umb']},
  desc:'Wiejska dziewczyna leży na ściernisku z uniesioną ręką, w której trzyma nitki babiego lata; obok czarny pies. Rozległe pole pod jesiennym niebem.'},
 {slug:'zydowka-z-pomaranczami',mode:'paint5',artist:'Aleksander Gierymski',life:'1850–1901',title:'Żydówka z pomarańczami',year:'1880–1881',yearNum:1881,tech:'olej na płótnie',sup:'canvas',wcm:55,hcm:66,museum:'Muzeum Narodowe w Warszawie',
  license:'domena publiczna',file:'Aleksander Gierymski, Żydówka z pomarańczami.jpg',fig:[0.15,0.08,0.7,0.88],style:[0.3,0.08,0.4,0.3],pig:{bg:['pb','ultr','ochy'],fig:['ochr','cyn','umb','cadY']},
  desc:'Stara przekupka w chustach na głowie i ramionach, z koszem pomarańczy, na tle zamglonej warszawskiej ulicy.'},
 {slug:'dziewczynka-z-chryzantemami',mode:'paint5',artist:'Olga Boznańska',life:'1865–1940',title:'Dziewczynka z chryzantemami',year:'1894',yearNum:1894,tech:'olej na tekturze',sup:'cardboard',wcm:69,hcm:88.5,museum:'Muzeum Narodowe w Krakowie',
  license:'domena publiczna',file:'Olga Boznańska - Girl with Chrysanthemums - MNK II-b-1032 - National Museum Kraków.jpg',fig:[0.22,0.05,0.56,0.92],style:[0.32,0.05,0.36,0.3],pig:{bg:['pb','ochy','umb'],fig:['bone','pb','ultr']},
  desc:'Dziewczynka w ciemnej sukience stoi frontalnie, z białymi chryzantemami w dłoniach, na jasnym, szarozielonkawym tle.'},
 {slug:'melencolia',mode:'drawing',kindTech:'engraving',artist:'Albrecht Dürer',life:'1471–1528',title:'Melancholia I',year:'1514',yearNum:1514,tech:'miedzioryt na papierze',paper:'laid',wcm:18.8,hcm:24,museum:'The Metropolitan Museum of Art, Nowy Jork',
  license:'CC0 (The Met, Open Access)',file:'Melencolia I MET DP820348.jpg',desc:'Uskrzydlona postać siedzi zamyślona wśród narzędzi i przyrządów; obok wielościan, kula, drabina i kwadrat magiczny.'},
 {slug:'dlonie',mode:'drawing',kindTech:'ink',artist:'Albrecht Dürer',life:'1471–1528',title:'Dłonie modlącego się',year:'1508',yearNum:1508,tech:'pędzel i tusz, biel na niebiesko gruntowanym papierze',paper:'laid',wcm:19.7,hcm:29.1,museum:'Albertina, Wiedeń',
  license:'domena publiczna',file:'Albrecht Dürer - Praying Hands, 1508 - Google Art Project.jpg',desc:'Studium złożonych do modlitwy dłoni z rękawami, rysowane pędzlem na niebieskim papierze.'},
 {slug:'zajac',mode:'water',kindTech:'watercolor',artist:'Albrecht Dürer',life:'1471–1528',title:'Zając',year:'1502',yearNum:1502,tech:'akwarela i gwasz na papierze',paper:'laid',wcm:22.6,hcm:25.1,museum:'Albertina, Wiedeń',
  license:'domena publiczna',file:'Albrecht Dürer - Hare, 1502 - Google Art Project.jpg',desc:'Młody zając przycupnięty na jasnym tle, z każdym włoskiem sierści namalowanym pędzlem; monogram i data artysty u dołu.'},
 {slug:'macierzynstwo',mode:'water',kindTech:'pastel',artist:'Stanisław Wyspiański',life:'1869–1907',title:'Macierzyństwo',year:'1902',yearNum:1902,tech:'pastel na papierze',paper:'wove',wcm:null,hcm:null,museum:'Muzeum Narodowe w Warszawie',
  license:'domena publiczna',file:'Stanisław Wyspiański, Macierzyństwo.jpg',desc:'Żona artysty Teofila karmi synka Stasia – pastel z mocnym konturem i płaskimi plamami barwnymi.'},
];
const REAL_BY=Object.fromEntries(REAL.map(e=>[e.slug,e]));
const realSrc=e=>'https://commons.wikimedia.org/wiki/File:'+encodeURIComponent(e.file.replace(/ /g,'_'));
const REAL_NOTE='Dzieło prawdziwe z domeny publicznej: prawdziwe są autor, tytuł, data, technika i miejsce przechowywania. Kopie na stole wygenerowała gra, a wyniki badań (UV, IR, RTG, pigmenty, proweniencja, certyfikaty, stemple) są symulowane.';
