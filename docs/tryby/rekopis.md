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
