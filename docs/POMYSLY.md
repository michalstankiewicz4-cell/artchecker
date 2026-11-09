# Bank pomysłów

Pomysły zebrane podczas rozwoju gry. ✅ – już jest w grze, 🟡 – częściowo, ⬜ – jeszcze nie.

## 1. Badania obrazu – dodatkowe mechaniki
| # | Mechanika | Stan | Uwagi |
|---|---|---|---|
| 5 | Badanie światłem UV – retusze, naprawy, różnice w lakierze | ✅ | Lampa UV w trybach obrazów i fragmentu |
| 6 | Obrazowanie w podczerwieni – szkice, kontury, zmiany kompozycji | ✅ | Reflektografia IR, pentimenti |
| 7 | Prześwietlanie rentgenowskie – wcześniejsze kompozycje, konstrukcja | ✅ | RTG: ukryty portret, blejtram, gwoździe |
| 8 | Analiza spękań (krakelury) – porównanie z wzorcami starzenia | 🟡 | Jest krakelura naturalna/sztuczna/brak; brak atlasu wzorców do porównania |
| 9 | Badanie podobrazia – płótno, deska, splot, rama, naprawy | 🟡 | Płótno (gęstość nici, blejtram), deska dębowa (słoje, parkietaż), blacha miedziana (punca, ślady kucia); brak śladów napraw |
| 10 | Mikroskopowa analiza powierzchni – ziarna pigmentu, warstwy | 🟡 | Mikrostruktura przy zoomie ≥ ×5; brak przekroju warstw |

## 2. Ustalanie wieku i autentyczności
| # | Mechanika | Stan | Uwagi |
|---|---|---|---|
| 11 | XRF z mapą składu | 🟡 | Punktowe próbki; brak mapy rozkładu pierwiastków |
| 12 | Analiza podpisu – pismo, farba, położenie, epoka | ✅ | Grafologia, podpis na spękaniach, UV |
| 13 | Badanie lakieru – rodzaj, starzenie, żółknięcie, ingerencje | 🟡 | Werniks w UV; brak osobnego narzędzia lakieru |
| 14 | Analiza spektroskopowa z bazą pigmentów | 🟡 | Spektroskopia pigmentów z datami; brak widm do porównania |
| 15 | Proweniencja – właściciele, wystawy, aukcje, luki | ✅ | Proweniencja i certyfikat |

## 3. Konserwacja i ratowanie dzieł (decyzje gracza)
| # | Mechanika | Stan |
|---|---|---|
| 16 | Ocena stanu zachowania i mapa uszkodzeń | ⬜ |
| 17 | Rekonstrukcja brakujących fragmentów (odróżnić oryginał od rekonstrukcji) | ⬜ |
| 18 | Rozpoznawanie wcześniejszych napraw i ocena ich poprawności | ⬜ |
| 19 | Dokumentacja konserwatorska – zdjęcia, oznaczenia, raport | ⬜ |
| 20 | Kontrola warunków przechowywania – światło, temperatura, wilgotność | ⬜ |

## 4. Śledztwo w sprawie obrazu (misja fabularna)
Obraz wyceniony na 8 mln euro, muzeum podejrzewa falsyfikat. Narzędzia: mikroskop, UV, IR, RTG, analizator pigmentów, katalog dzieł i artystów, dokumentacja historyczna. Gracz odkrywa kolejno:
1. podpis jest oryginalny, ale dodany później,
2. pod farbą jest inna kompozycja,
3. jeden pigment nie pasuje do epoki,
4. płótno pochodzi z innego okresu,
5. to późniejsza kopia na autentycznym starym płótnie,

…i na końcu sporządza ekspertyzę. Stan: ⬜ (większość narzędzi już istnieje – brakuje fabuły etapowej i formularza ekspertyzy).

## 5. Three.js
| Mechanika | Stan |
|---|---|
| Przekrój obrazu 3D – przesuwanie przez warstwy farby, gruntu i podobrazia | ⬜ |
| Tryby obrazowania (normalny, UV, IR, RTG) | 🟡 (2D dla obrazów, 3D dla rzeźb: normalny/UV/RTG) |
| Skanowanie pigmentów kliknięciem | ✅ (2D) |
| Historia obrazu – etapy powstawania, zmian i konserwacji | ⬜ |

## 6. Uniwersalny warsztat badawczy
Ten sam system dla obrazów, rzeźb, monet, banknotów, ceramiki, biżuterii i zabytkowych przedmiotów.
Stan: 🟡 – rejestr obiektów 2D (`js/core/kinds.js`) już obsługuje banknoty, monety, znaczki i rękopisy; ceramika i biżuteria do dodania.

## 7. Z laboratorium sztuki (GameLaboratory)
| Mechanika | Stan |
|---|---|
| Lampa ruchoma (UV, światło boczne, pod światło) | ✅ |
| Lampa ruchoma – podczerwień, rozmiar kręgu | ⬜ (w realizacji) |
| Rysunki i grafiki: ołówek, tusz, węgiel, rytownictwo | ⬜ (w realizacji) |
| Akwarele i pastele | ⬜ (w realizacji) |
| Pozostałe techniki ArtKit: tusz patyczkiem, długopis, flamaster, puentylizm | ⬜ |
| Obraz jako płaszczyzna 3D (mapa normalnych, ruchome światło, rama 3D) | ⬜ (pomysł z laboratorium) |

## 8. Inne
- Meble – nowy rodzaj obiektu (do roadmapy).
- Datowanie archeologiczne (C14, dendrochronologia, termoluminescencja, stratygrafia) – do przemyślenia.
- Badanie warstw malarskich, rozpoznawanie pigmentów, odkrywanie przemalowań, ustalanie techniki – do przemyślenia (pasuje do trybu Konserwator i przekroju 3D).
- Tryb z prawdziwymi dziełami z domeny publicznej (CC0), w zmniejszonym rozmiarze.
