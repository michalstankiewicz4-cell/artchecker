# Pracownia ekspertyz – znajdź oryginał

Przeglądarkowa gra (HTML + JavaScript, bez kroku budowania) o rozpoznawaniu oryginałów i falsyfikatów.

**Zagraj:** https://michalstankiewicz4-cell.github.io/artchecker/

## Tryby
| Tryb | Opis |
|---|---|
| Znajdź oryginał – obrazy | 1 oryginał i 4 kopie, każda wykonana inną metodą fałszerską |
| Zniszczony fragment | czy fragment pochodzi z zaginionego dzieła znanego tylko z opisu |
| Znajdź oryginał – rzeźby z brązu (3D) | brązowe popiersia (Three.js) |
| Znajdź oryginał – rzeźby z marmuru (3D) | dłuto kontra CNC, patyna, kwas – [opis](docs/tryby/marmur.md) |
| Pamięć eksperta | zapamiętaj oryginał przez lupę, potem znajdź minimalne różnice |
| Weryfikacja banknotów | fikcyjna waluta, wszystkie typowe zabezpieczenia |
| Weryfikacja rękopisów | atrament, papier czerpany, ductus, pieczęć, korozja – [opis](docs/tryby/rekopis.md) |
| Weryfikacja znaczków | ząbkowanie, znak wodny, druk, guma, przedruk – [opis](docs/tryby/znaczek.md) |
| Weryfikacja monet | waga, średnica, stop, magnes, rant, bicie czy odlew, zużycie – [opis](docs/tryby/moneta.md) |

Artyści, dzieła i waluta są fikcyjne.

W grze jest ekran główny z postępem oraz **Wiki eksperta** – opisy technik badawczych, metod fałszerskich, obiektów i słowniczek pojęć.

## Uruchomienie lokalne
Otwórz `index.html` w przeglądarce (skrypty są klasyczne, działają też z `file://`).
Tryb 3D pobiera Three.js z CDN (cdnjs), więc wymaga internetu.

## Dokumentacja
- [docs/ARCHITEKTURA.md](docs/ARCHITEKTURA.md) – struktura plików i jak dodać nowy tryb
- [docs/ROADMAPA.md](docs/ROADMAPA.md) – plan rozwoju
- [docs/POMYSLY.md](docs/POMYSLY.md) – bank pomysłów
- [CHANGELOG.md](CHANGELOG.md) – historia wersji

## SEO i udostępnianie
Meta tagi, Open Graph / Twitter Card (miniatura `og-image.jpg` – zrzut ekranu startowego), JSON-LD, `robots.txt`, `sitemap.xml`. Po większej zmianie wyglądu ekranu głównego warto wygenerować nową miniaturę.

## Wersjonowanie
[SemVer](https://semver.org/lang/pl/): numer w `js/version.js` (widoczny w nagłówku gry) + wpis w `CHANGELOG.md` przy każdej zmianie.
