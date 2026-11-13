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
 {slug:'uczony',mode:'paint5',artist:'Rembrandt van Rijn',life:'1606–1669',title:'Uczony przy pulpicie',year:'1641',yearNum:1641,tech:'olej na desce dębowej',sup:'wood',wcm:76.4,hcm:105.7,museum:'Zamek Królewski w Warszawie',
  license:'domena publiczna',file:'Rembrandt Scholar at the Lectern.jpg',fig:[0.05,0.26,0.9,0.68],style:[0.34,0.36,0.3,0.24],pig:{bg:['umb','bone','ochy'],fig:['pb','ochy','umb','lake']},sig:'Rembrandt f 1641',sigCorner:'br',
  note:'Commons podaje deskę dębową; analiza konserwatorska Politechniki Warszawskiej (Ochrona Zabytków, 2009) wskazuje drewno topolowe.',
  desc:'Starszy mężczyzna z siwą brodą, w ciemnym berecie, futrzanym płaszczu i ze złotym łańcuchem, siedzi przy rzeźbionym pulpicie i pisze gęsim piórem w otwartej księdze; ciepłe światło pada z lewej na ciemnobrązowe tło.'},
 {slug:'ucieczka',mode:'paint5',artist:'Adam Elsheimer',life:'1578–1610',title:'Ucieczka do Egiptu',year:'1609',yearNum:1609,tech:'olej na blasze miedzianej',sup:'copper',wcm:41.5,hcm:30.6,museum:'Alte Pinakothek, Monachium',
  license:'domena publiczna (PD-Art)',file:'Adam Elsheimer - Die Flucht nach Ägypten (Alte Pinakothek).jpg',fig:[0.42,0.66,0.18,0.3],style:[0.42,0.66,0.2,0.3],pig:{bg:['ultr','bone','umb'],fig:['pb','ochy','cyn']},sig:'',
  desc:'Nocny pejzaż: Święta Rodzina idzie skrajem lasu nad wodą, Józef w czerwonym płaszczu świeci pochodnią ku Dzieciątku; na niebie Droga Mleczna i księżyc odbity w wodzie, z lewej ognisko pasterzy przy bydle.'},
/* „Zniszczony fragment” – dzieła prawdziwe zaginione lub zniszczone, znane z fotografii */
 {slug:'kamieniarze',mode:'frag',artist:'Gustave Courbet',life:'1819–1877',title:'Kamieniarze',year:'1849',yearNum:1849,tech:'olej na płótnie',sup:'canvas',wcm:257,hcm:165,museum:'Gemäldegalerie Alte Meister, Drezno (do 1945 r.)',
  license:'domena publiczna',file:'Gustave Courbet - The Stonebreakers - WGA05457.jpg',fig:[0.3,0.05,0.67,0.9],style:[0.62,0.14,0.24,0.3],pig:{bg:['umb','ochy','sien','pb'],fig:['pb','ochy','umb','bone']},
  sig:'G. Courbet',sigCorner:'bl',lost:true,
  hist:'1849 – namalowany; 1850 – Salon paryski; ok. 1882 – Gemäldegalerie w Dreźnie; luty 1945 – zniszczony razem z ponad 150 innymi obrazami, gdy zbombardowano transport z Drezna do twierdzy Königstein.',
  desc:'Dwóch robotników przy drodze: młody chłopak niesie kosz kamieni, starszy mężczyzna w kapeluszu klęczy i rozbija kamienie młotem. Ciemne zbocze w tle, w prawym dolnym rogu garnek i łyżka.'},
];
const REAL_BY=Object.fromEntries(REAL.map(e=>[e.slug,e]));
const realSrc=e=>'https://commons.wikimedia.org/wiki/File:'+encodeURIComponent(e.file.replace(/ /g,'_'));
const REAL_NOTE='Dzieło prawdziwe z domeny publicznej: prawdziwe są autor, tytuł, data, technika i miejsce przechowywania. Kopie na stole wygenerowała gra, a wyniki badań (UV, IR, RTG, pigmenty, proweniencja, certyfikaty, stemple) są symulowane.';
/* angielskie nazwy (słownik EN z js/core/i18n.js) */
Object.assign(EN,{'Stańczyk':'Stańczyk','Babie lato':'Indian Summer','Żydówka z pomarańczami':'Jewish Woman Selling Oranges','Dziewczynka z chryzantemami':'Girl with Chrysanthemums',
 'Melancholia I':'Melencolia I','Dłonie modlącego się':'Praying Hands','Zając':'Young Hare','Macierzyństwo':'Motherhood',
 'Muzeum Narodowe w Warszawie':'National Museum in Warsaw','Muzeum Narodowe w Krakowie':'National Museum in Kraków','The Metropolitan Museum of Art, Nowy Jork':'The Metropolitan Museum of Art, New York','Albertina, Wiedeń':'Albertina, Vienna',
 'domena publiczna':'public domain','domena publiczna (PD-Art)':'public domain (PD-Art)','CC0 (The Met, Open Access)':'CC0 (The Met, Open Access)'});
trAdd({'Uczony przy pulpicie':'The Scholar at the Lectern','Ucieczka do Egiptu':'The Flight into Egypt','Zamek Królewski w Warszawie':'Royal Castle in Warsaw','Alte Pinakothek, Monachium':'Alte Pinakothek, Munich',
 'olej na desce dębowej':'oil on oak panel','olej na blasze miedzianej':'oil on copper',
 'Commons podaje deskę dębową; analiza konserwatorska Politechniki Warszawskiej (Ochrona Zabytków, 2009) wskazuje drewno topolowe.':'Commons gives an oak panel; a conservation analysis by the Warsaw University of Technology (Ochrona Zabytków, 2009) points to poplar wood.',
 'Starszy mężczyzna w ciemnym berecie i futrzanym płaszczu stoi przy pulpicie z otwartą księgą, z dłońmi opartymi o blat; ciepłe światło pada z lewej. Sygnatura i data „Rembrandt / f 1641”.':'An elderly grey-bearded man in a dark beret, a fur-lined coat and a gold chain sits at a carved lectern, writing with a quill in an open book; warm light falls from the left onto a dark brown background.',
 'Nocny pejzaż: Święta Rodzina przechodzi przez las przy jeziorze, Józef niesie pochodnię; na niebie księżyc odbity w wodzie i Droga Mleczna, z prawej ognisko pasterzy.':'A night landscape: the Holy Family walks along the edge of a wood by the water, Joseph in a red cloak holding a torch towards the Child; in the sky the Milky Way and the moon reflected in the water, on the left a shepherds’ fire beside the cattle.'});
trAdd({'Kamieniarze':'The Stone Breakers','Gemäldegalerie Alte Meister, Drezno (do 1945 r.)':'Gemäldegalerie Alte Meister, Dresden (until 1945)',
 '1849 – namalowany; 1850 – Salon paryski; ok. 1882 – Gemäldegalerie w Dreźnie; luty 1945 – zniszczony razem z ponad 150 innymi obrazami, gdy zbombardowano transport z Drezna do twierdzy Königstein.':'1849 – painted; 1850 – Paris Salon; c. 1882 – Gemäldegalerie in Dresden; February 1945 – destroyed together with over 150 other paintings when a transport from Dresden to the Königstein fortress was bombed.',
 'Dwóch robotników przy drodze: młody chłopak niesie kosz kamieni, starszy mężczyzna w kapeluszu klęczy i rozbija kamienie młotem. Ciemne zbocze w tle, w prawym dolnym rogu garnek i łyżka.':'Two labourers by a road: a young boy carries a basket of stones, an older man in a hat kneels and breaks stones with a hammer. A dark slope in the background, a pot and a spoon in the lower right corner.',
 'ok. {0} × {1} cm':'approx. {0} × {1} cm',
 'Błazen Stańczyk siedzi w fotelu w ciemnej komnacie, w czerwonym stroju; w tle przez otwarte drzwi widać bal na dworze królowej Bony. Na stole list o utracie Smoleńska.':'The jester Stańczyk, dressed in red, sits in an armchair in a dark chamber; through the open door behind him a ball is under way at Queen Bona\'s court. On the table lies a letter about the loss of Smolensk.',
 'Wiejska dziewczyna leży na ściernisku z uniesioną ręką, w której trzyma nitki babiego lata; obok czarny pies. Rozległe pole pod jesiennym niebem.':'A country girl lies on a stubble field, her raised hand holding threads of gossamer; a black dog sits nearby. A vast field under an autumn sky.',
 'Stara przekupka w chustach na głowie i ramionach, z koszem pomarańczy, na tle zamglonej warszawskiej ulicy.':'An old street vendor in shawls over her head and shoulders, with a basket of oranges, against a misty Warsaw street.',
 'Dziewczynka w ciemnej sukience stoi frontalnie, z białymi chryzantemami w dłoniach, na jasnym, szarozielonkawym tle.':'A girl in a dark dress stands facing the viewer, holding white chrysanthemums, against a light grey-green background.',
 'Uskrzydlona postać siedzi zamyślona wśród narzędzi i przyrządów; obok wielościan, kula, drabina i kwadrat magiczny.':'A winged figure sits lost in thought among tools and instruments; nearby are a polyhedron, a sphere, a ladder and a magic square.',
 'Studium złożonych do modlitwy dłoni z rękawami, rysowane pędzlem na niebieskim papierze.':'A study of hands folded in prayer, with sleeves, drawn with a brush on blue paper.',
 'Młody zając przycupnięty na jasnym tle, z każdym włoskiem sierści namalowanym pędzlem; monogram i data artysty u dołu.':'A young hare crouching against a light background, every hair of its fur painted with a brush; the artist\'s monogram and date at the bottom.',
 'Pastel z mocnym konturem i płaskimi plamami barwnymi.':'A pastel with a strong outline and flat patches of colour.',
 'Żona artysty Teofila karmi synka Stasia – pastel z mocnym konturem i płaskimi plamami barwnymi.':'The artist\'s wife Teofila nursing their little son Staś – a pastel with a strong outline and flat patches of colour.'});
