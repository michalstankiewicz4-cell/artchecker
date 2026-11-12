# Pracownia ekspertyz – przeprowadź ekspertyzę

Przeglądarkowa gra (HTML + JavaScript, bez kroku budowania) o rozpoznawaniu oryginałów i falsyfikatów.

**Zagraj:** https://michalstankiewicz4-cell.github.io/artchecker/

## Tryby
| Tryb | Opis |
|---|---|
| Przeprowadź ekspertyzę – obrazy | 1 oryginał i 4 kopie, każda wykonana inną metodą fałszerską; podobrazia: płótno, deska dębowa, blacha miedziana |
| Zniszczony fragment | czy fragment pochodzi z zaginionego dzieła znanego tylko z opisu |
| Przeprowadź ekspertyzę – rzeźby z brązu (3D) | brązowe popiersia (Three.js); ocena z checklisty |
| Przeprowadź ekspertyzę – rzeźby z marmuru (3D) | dłuto kontra CNC, patyna, kwas – [opis](docs/tryby/marmur.md) |
| Pamięć eksperta | zapamiętaj oryginał przez lupę, potem znajdź minimalne różnice |
| Rysunki i grafiki | ołówek, tusz, węgiel, miedzioryt – papier, kreska, odcisk płyty, stemple kolekcji – [opis](docs/tryby/papier.md) |
| Akwarele i pastele | papier, pigmenty, struktura farby, granica dawnej oprawy – [opis](docs/tryby/papier.md) |
| Weryfikacja banknotów | fikcyjna waluta, wszystkie typowe zabezpieczenia |
| Weryfikacja rękopisów | atrament, papier czerpany, ductus, pieczęć, korozja – [opis](docs/tryby/rekopis.md) |
| Weryfikacja znaczków | ząbkowanie, znak wodny, druk, guma, przedruk – [opis](docs/tryby/znaczek.md) |
| Weryfikacja monet | waga, średnica, stop, magnes, rant, bicie czy odlew, zużycie – [opis](docs/tryby/moneta.md) |

Artyści, dzieła i waluta są fikcyjne – poza dziełami prawdziwymi z domeny publicznej (na razie: Jan Matejko, „Stańczyk”; Józef Chełmoński, „Babie lato”; Albrecht Dürer, „Melancholia I”), które można wybrać na liście „Artysta”; ich wyniki badań są symulowane.

**Język:** PL / EN – przycisk na ekranie startowym i pasku gry; domyślnie według języka przeglądarki. Na razie po angielsku jest interfejs, menu, ekran startowy i „O programie” (`js/core/i18n.js`).

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
- `python3 tools/doctor-3d.py /ścieżka/do/GameLaboratory` – sprawdza rzeźby 3D doktorem modeli z GameLaboratory.
- Akcja GitHub „Pobierz prawdziwe dzieła” – pobiera dzieła z domeny publicznej z listy `tools/real-art.txt` do `img/real/`.

## SEO i udostępnianie
Meta tagi, Open Graph / Twitter Card (miniatura `og-image.jpg` – zrzut ekranu startowego), JSON-LD, `robots.txt`, `sitemap.xml`. Po większej zmianie wyglądu ekranu głównego warto wygenerować nową miniaturę.

## Wersjonowanie
[SemVer](https://semver.org/lang/pl/): numer w `js/version.js` (widoczny w nagłówku gry) + wpis w `CHANGELOG.md` przy każdej zmianie.

## Zasoby zewnętrzne
- Głowa popiersi 3D: „Lowpoly face model” – void (https://sketchfab.com/void22), licencja CC BY 4.0, zmienione (przez GameLaboratory i w grze).
- ArtKit i model głowy skopiowane z repozytorium GameLaboratory (`js/lab/`).
