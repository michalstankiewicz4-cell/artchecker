# Weryfikacja rękopisów

Plik: `js/kinds/manuscript.js` · rodzaj w rejestrze: `manuscript`

**Obiekt:** karty Manuskryptu Wojnicza – Beinecke Rare Book & Manuscript Library, Uniwersytet Yale, MS 408 (domena publiczna). Cztery karty do wyboru na liście „Karta” (albo „Losowa karta”): karta z tekstem, dwie karty zielnikowe (kwiaty, roślina) i karta z postaciami. Zdjęcia: Wikimedia Commons („Voynich Manuscript (200)”, „(32)”, „(100)”, „(140)”), pobrane przez `fetch-art.yml` i przycięte skryptem `tools/build-manuscript.py` do `js/real/ms-*.js`.

Prawdziwe dane w katalogu: pergamin cielęcy datowany radiowęglowo na 1404–1438 (Uniwersytet Arizony, 2009), atrament żelazowo-galasowy (C, Fe, S, K, Ca; ślady Cu, Zn), farby: azuryt, czerwona ochra, zieleń miedziowa; karta ok. 23,5 × 16,2 cm. Kopie na stole i wyniki badań symuluje gra.

## Narzędzia
| Narzędzie | Widok | Warunek | Co pokazuje |
|---|---|---|---|
| Pergamin (mikroskop, pod światło) | pod światło | zoom ≥ ×3 | pory po włosach i żyłki kontra włókna papieru |
| Lampa UV | UV | – | stary pergamin (matowy, nierówny), papier z wybielaczami, świeży pergamin, nowszy atrament lub farby |
| Datowanie radiowęglowe (C-14) | – | – | 1404–1438, „bomba węglowa” po 1955 r. albo papier z XX w. |
| Atrament (XRF) | dzienny | kliknięcie w tekst, zoom ≥ ×3 | żelazowo-galasowy, współczesny „na wzór dawnego”, toner |
| Farby ilustracji (XRF) | dzienny | kliknięcie w kolor, zoom ≥ ×3 | azuryt / ochra / zieleń miedziowa kontra pigmenty syntetyczne |
| Pismo i ductus | dzienny + mikrodetal | zoom ≥ ×5 | płynne pismo gęsim piórem, drżące pismo kopisty, raster druku |

## Metody fałszerskie (profile)
| Profil | Zdradzają zawsze | Mogą zdradzać |
|---|---|---|
| Faksymile drukowane na papierze | atrament, pergamin, UV, pismo | C-14 |
| Kopia na współczesnym pergaminie | C-14, UV, pismo | farby, atrament |
| Współczesne fałszerstwo na starym, czystym pergaminie | atrament, pismo, farby (C-14 wychodzi „prawidłowo”) | UV |
| Oryginalna karta z dorobionymi kolorami | farby, UV | – |

## Dokumenty papierowe z pieczęcią lakową
Na liście „Karta” są też dwa dokumenty papierowe (domena publiczna, Wikimedia Commons), przygotowane skryptem `tools/build-manuscript.py` do `js/real/ms-agad.js` (WebP z przezroczystym tłem) i `js/real/ms-nowo.js`:
- **Dokument Rządu Narodowego (1863)** – koperta z czerwoną pieczęcią lakową i karta „Dowody do rachunków Komisarza w Paryżu i Agenta Politycznego we Włoszech i Szwajcarii. J. Ordęga”, Archiwum Główne Akt Dawnych („AGAD (3) Koperta z pieczęcią lakową, Pudło 660-12 s. 8”);
- **Akt sprzedaży domu (Nowogródek, 1902–1911)** – odwrocie ostatniej karty z adnotacją notariusza, pieczątką i pieczęcią lakową na nici („Актовая бумага на продажу недвижимости в г. Новогрудке 5”).

Prawdziwe są opis i zdjęcie; dane o papierze (żeberkowanie i znak wodny w dokumencie z 1863 r., papier z masy drzewnej w akcie z Nowogródka), atramencie i laku są symulowane. Dokument ma własny zestaw narzędzi i metod (`MS_SET_P`, `MS_PROF_P`); `msSetup` przełącza je razem z kartą.

| Narzędzie | Widok | Warunek | Co pokazuje |
|---|---|---|---|
| Papier (pod światło) | pod światło | zoom ≥ ×2 na karcie | żeberkowanie i znak wodny / papier drzewny kontra jednolity papier współczesny |
| Lampa UV (papier) | UV | – | matowy stary papier, wybielacze, świecący lak, ciemniejszy dopisek |
| Patyna i przebarwienia | dzienny | zoom ≥ ×2 na karcie | naturalna, nierówna patyna kontra postarzanie herbatą (zacieki) |
| Atrament na papierze (XRF) | dzienny | kliknięcie w pismo, zoom ≥ ×3 | żelazowo-galasowy, współczesny, toner; dopisek bez żelaza |
| Pismo (mikroskop) | dzienny + mikrodetal | zoom ≥ ×5 | stalówka, drżące pismo kopisty, raster druku |
| Odwrocie (korozja atramentu) | odwrocie | zoom ≥ ×2 | brązowe przebicia pisma kontra czyste odwrocie |
| Jednolitość tekstu (UV) | UV | zoom ≥ ×2 na karcie | dopisek innym atramentem |
| Pieczęć lakowa (mikroskop) | dzienny + mikrodetal | zoom ≥ ×4 na pieczęci | matowy, spękany dawny lak kontra błyszczący współczesny |

| Profil | Zdradzają zawsze | Mogą zdradzać |
|---|---|---|
| Faksymile wydrukowane na nowym papierze | atrament, papier, UV, pismo | pieczęć, odwrocie |
| Kopia na nowym papierze postarzonym herbatą | patyna, papier, odwrocie | UV, atrament, pismo |
| Oryginał z dopiskiem innym atramentem | jednolitość tekstu | atrament, UV |
| Oryginał z podrobioną pieczęcią lakową | pieczęć | UV |
