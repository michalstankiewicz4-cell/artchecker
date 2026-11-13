# Weryfikacja monet

Plik: `js/kinds/coin.js` · rodzaj w rejestrze: `coin`

**Obiekty:** prawdziwe monety obiegowe – parametry z NBP i z rozporządzenia Rady (WE) nr 975/98. Wizerunki rysuje gra (uproszczone), bez zdjęć.
Monetę wybiera się na liście „Moneta” (albo „Losowa moneta”). Na stole leży 5 monet (awers i rewers każdej); 1–3 są prawdziwe (dla 1 zł: 2–3).

| Moneta | Średnica | Masa | Stop | Rant | Magnes |
|---|---|---|---|---|---|
| 1 zł (od 2020 r.) | 23,00 mm | 5,00 g | stal powlekana miedzią i niklem | naprzemiennie gładki i ząbkowany | wyraźnie przyciągana |
| 2 zł | 21,50 mm | 5,21 g | pierścień brązal, rdzeń miedzionikiel | gładki | nie |
| 5 zł | 24,00 mm | 6,54 g | pierścień miedzionikiel, rdzeń brązal | ząbkowany nieregularnie | nie |
| 1 € (strona niemiecka) | 23,25 mm | 7,50 g | pierścień mosiądz niklowy, rdzeń trójwarstwowy z niklem | naprzemiennie gładki i ząbkowany | słabo (rdzeń) |
| 2 € (strona niemiecka) | 25,75 mm | 8,50 g | pierścień miedzionikiel, rdzeń trójwarstwowy z niklem | drobno ząbkowany z napisem | słabo (rdzeń) |

## Narzędzia
| Narzędzie | Widok | Warunek | Co pokazuje |
|---|---|---|---|
| Waga | – | – | masa w gramach |
| Średnica (suwmiarka) | dzienny | zoom ≥ ×2 na monecie | średnica w mm |
| Skład stopu (XRF) | dzienny | kliknięcie, zoom ≥ ×2 | skład powierzchni; w monecie dwumetalowej osobno rdzeń i pierścień |
| Magnes | dzienny | kliknięcie | brak, słabe lub wyraźne przyciąganie |
| Rant | rozwinięcie rantu | zoom ≥ ×4 | rodzaj rantu, układ odcinków, napis, szew formy |
| Bicie czy odlew | dzienny + mikrodetal | zoom ≥ ×6 na monecie | linie płynięcia metalu kontra wżery; szczelina między rdzeniem a pierścieniem |
| Zużycie wypukłości | światło boczne | zoom ≥ ×3 na orle | wytarte szczyty kontra równomierne rysy |

## Metody fałszerskie (profile)
| Profil | Zdradzają zawsze | Mogą zdradzać |
|---|---|---|
| Odlew ze stopu cynku, powlekany | waga, średnica, bicie/odlew | rant, zużycie, stop |
| Podróbka bita w podrobionym stemplu, z niewłaściwego stopu | stop, rant, zużycie | waga |
| Podróbka z metalu o złych własnościach magnetycznych | magnes, stop, waga | rant |
| Moneta jednolita udająca bimetaliczną (tylko 2 zł, 5 zł, 1 €, 2 €) | stop, bicie/odlew, waga | średnica |
