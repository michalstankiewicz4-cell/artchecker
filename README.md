# Pracownia ekspertyz – znajdź oryginał

Przeglądarkowa gra (HTML + JavaScript, bez kroku budowania) o rozpoznawaniu oryginałów i falsyfikatów.

**Zagraj:** https://michalstankiewicz4-cell.github.io/artchecker/

## Tryby
| Tryb | Opis |
|---|---|
| Znajdź oryginał – obrazy | 1 oryginał i 4 kopie, każda wykonana inną metodą fałszerską |
| Zniszczony fragment | czy fragment pochodzi z zaginionego dzieła znanego tylko z opisu |
| Znajdź oryginał – rzeźby 3D | brązowe popiersia (Three.js) |
| Pamięć eksperta | zapamiętaj oryginał przez lupę, potem znajdź minimalne różnice |
| Weryfikacja banknotów | fikcyjna waluta, wszystkie typowe zabezpieczenia |
| Weryfikacja monet | waga, średnica, stop, magnes, rant, bicie czy odlew, zużycie – [opis](docs/tryby/moneta.md) |

Artyści, dzieła i waluta są fikcyjne.

## Uruchomienie lokalne
Otwórz `index.html` w przeglądarce (skrypty są klasyczne, działają też z `file://`).
Tryb 3D pobiera Three.js z CDN (cdnjs), więc wymaga internetu.

## Dokumentacja
- [docs/ARCHITEKTURA.md](docs/ARCHITEKTURA.md) – struktura plików i jak dodać nowy tryb
- [docs/ROADMAPA.md](docs/ROADMAPA.md) – plan rozwoju
- [CHANGELOG.md](CHANGELOG.md) – historia wersji

## Wersjonowanie
[SemVer](https://semver.org/lang/pl/): numer w `js/version.js` (widoczny w nagłówku gry) + wpis w `CHANGELOG.md` przy każdej zmianie.
