# Pracownia ekspertyz – przeprowadź ekspertyzę

Przeglądarkowa gra (HTML + JavaScript, bez kroku budowania) o rozpoznawaniu oryginałów i falsyfikatów.

**Zagraj:** https://michalstankiewicz4-cell.github.io/artchecker/

## Tryby
| Tryb | Opis |
|---|---|
| Przeprowadź ekspertyzę – obrazy | 1 oryginał i 4 kopie, każda wykonana inną metodą fałszerską; podobrazia: płótno, deska dębowa, blacha miedziana |
| Zniszczony fragment | czy fragment pochodzi z prawdziwego dzieła zniszczonego w czasie wojny (Courbet, „Kamieniarze”), znanego z fotografii i opisu |
| Przeprowadź ekspertyzę – rzeźby z brązu (3D) | prawdziwa statuetka „James Garfield” (J.Q.A. Ward, skan Smithsonian CC0) w Three.js; ocena z checklisty |
| Przeprowadź ekspertyzę – rzeźby z marmuru (3D) | prawdziwe popiersie „Napoleon” (A.-D. Chaudet, skan threedscans); dłuto kontra CNC, patyna, kwas – [opis](docs/tryby/marmur.md) |
| Pamięć eksperta | zapamiętaj oryginał przez lupę, potem znajdź minimalne różnice |
| Rysunki i grafiki | ołówek, tusz, węgiel, miedzioryt – papier, kreska, odcisk płyty, stemple kolekcji – [opis](docs/tryby/papier.md) |
| Akwarele i pastele | papier, pigmenty, struktura farby, granica dawnej oprawy – [opis](docs/tryby/papier.md) |
| Weryfikacja banknotów | fikcyjna waluta, wszystkie typowe zabezpieczenia |
| Weryfikacja rękopisów | atrament, papier czerpany, ductus, pieczęć, korozja – [opis](docs/tryby/rekopis.md) |
| Weryfikacja znaczków | prawdziwe Penny Black (1840) i Polska nr 1 (1860), domena publiczna; ząbkowanie / marginesy, znak wodny, UV, druk, litery, kasownik, guma |
| Weryfikacja monet | prawdziwe 1 zł, 2 zł, 5 zł, 1 € i 2 € (rysowane przez grę); waga, średnica, stop, magnes, rant, bicie czy odlew, zużycie – [opis](docs/tryby/moneta.md) |

Artyści, dzieła i waluta są fikcyjne – poza dziełami prawdziwymi z domeny publicznej (na razie: Jan Matejko, „Stańczyk”; Józef Chełmoński, „Babie lato”; Albrecht Dürer, „Melancholia I”, „Dłonie modlącego się”, „Zając”; Stanisław Wyspiański, „Macierzyństwo”), które można wybrać na liście „Artysta”; ich wyniki badań są symulowane.

**Język:** PL / EN – przycisk na ekranie startowym i pasku gry; domyślnie według języka przeglądarki. Po angielsku jest cała gra (interfejs, ekran startowy, badania, wyniki, zlecenia, podsumowania); także wiki (`js/core/i18n.js`, słowniki `js/i18n/`).

**Autor:** Michał Stankiewicz i Claude – zrobione przy pomocy vibecodingu i laboratorium sztuki (GameLaboratory).

## Co jest w grze
- **Ekran główny** z kategoriami, podglądem trybu i postępem (zapis w przeglądarce).
- **Stanowisko eksperta**: okno narzędzi z licznikiem zbadań, zwijane zlecenie, stół badawczy z przybliżeniem do ×24, dok obiektów (flagi checklisty, postęp); obiekty ocenia się checklistą – egzemplarz z zaznaczonym sygnałem fałszerstwa uznaje się za fałszywy, prawe okno z zakładkami *Wynik badania / Checklista / Notatnik*.
- **Lampa ruchoma**: UV, podczerwień, światło boczne i światło przechodzące świecą w kręgu za kursorem (Shift + kółko – wielkość kręgu); lampa boczna oświetla relief z kierunku lampy.
- **Wiki eksperta** z ilustracjami: techniki badawcze, metody fałszerskie, obiekty i artyści, słowniczek oraz techniki malarskie i podłoża (ArtKit).
- **Loader** przy przygotowywaniu partii i nowych widoków badań.

## Uruchomienie lokalne
Otwórz `index.html` w przeglądarce (skrypty są klasyczne, działają też z `file://`).
Tryb 3D pobiera Three.js z CDN (cdnjs), więc wymaga internetu.

## Dokumentacja
- [docs/ARCHITEKTURA.md](docs/ARCHITEKTURA.md) – struktura plików i jak dodać nowy tryb
- [docs/ROADMAPA.md](docs/ROADMAPA.md) – plan rozwoju
- [docs/POMYSLY.md](docs/POMYSLY.md) – bank pomysłów
- [CHANGELOG.md](CHANGELOG.md) – historia wersji
- opisy trybów: [moneta](docs/tryby/moneta.md), [znaczek](docs/tryby/znaczek.md), [rękopis](docs/tryby/rekopis.md), [marmur](docs/tryby/marmur.md), [obrazy](docs/tryby/obrazy.md)

## Narzędzia (Python + Playwright)
- `python3 tools/build-wiki-img.py` – generuje ilustracje wiki (`img/wiki/`, manifest `js/data/wikiimg.js`).
- `.github/workflows/fetch-models.yml` + `tools/build-models.mjs` – pobierają i upraszczają skany rzeźb do `js/real/model-*.js`.
- `python3 tools/doctor-3d.py /ścieżka/do/GameLaboratory` – sprawdza rzeźby 3D doktorem modeli z GameLaboratory.
- Akcja GitHub „Pobierz prawdziwe dzieła” – pobiera dzieła z domeny publicznej z listy `tools/real-art.txt` do `img/real/`.

## SEO i udostępnianie
Meta tagi, Open Graph / Twitter Card (miniatura `og-image.jpg` – zrzut ekranu startowego), JSON-LD, `robots.txt`, `sitemap.xml`. Po większej zmianie wyglądu ekranu głównego warto wygenerować nową miniaturę.

## Wersjonowanie
[SemVer](https://semver.org/lang/pl/): numer w `js/version.js` (widoczny w nagłówku gry) + wpis w `CHANGELOG.md` przy każdej zmianie.

## Zasoby zewnętrzne
- Rzeźby 3D: „James Garfield” (J.Q.A. Ward) – skan Smithsonian Open Access, CC0; „Napoleon” (A.-D. Chaudet) – skan Olivera Larica (threedscans.com), bez ograniczeń praw autorskich.
- ArtKit i model głowy skopiowane z repozytorium GameLaboratory (`js/lab/`).
