# Historia zmian

Format: [Keep a Changelog](https://keepachangelog.com/pl/1.1.0/), wersje według [SemVer](https://semver.org/lang/pl/).

## [1.3.0] – 2026-11-09
### Dodano
- Tryb **Weryfikacja monet** (`js/kinds/coin.js`): waga, średnica, skład stopu (XRF), magnes, rant (rozwinięcie), bicie czy odlew (mikrodetal przy zoomie ≥ ×6), zużycie wypukłości; 4 metody fałszerskie.
- Opis trybu: `docs/tryby/moneta.md`.
### Zmieniono
- `embossFrom` (relief w świetle bocznym) przeniesiony do rdzenia (`js/core/kinds.js`); rodzaj może mieć własny cień na planszy (`shadow`).

## [1.2.0] – 2026-11-09
### Dodano
- Rejestr obiektów 2D (`js/core/kinds.js`): rodzaje „sklasyfikuj każdy” (banknot, w przyszłości moneta, znaczek, rękopis) podpinane jednym plikiem w `js/kinds/`.
- Menu trybów budowane automatycznie, z grupami (Obrazy, Rzeźby 3D, Obiekty) i pozycjami „wkrótce”: Aukcja, Śledztwo, Konserwator.
### Zmieniono
- Banknoty przeniesione do `js/kinds/banknote.js` jako pierwszy rodzaj w rejestrze; nachylenie (`TILT`) jest teraz wspólne dla wszystkich rodzajów.

## [1.1.0] – 2026-11-09
### Zmieniono
- Kod podzielony na pliki i foldery (`css/`, `js/core`, `js/data`, `js/paint`, `js/modes`).
- Numer wersji widoczny w nagłówku gry (`js/version.js`).
### Dodano
- Dokumentacja: `README.md`, `CHANGELOG.md`, `docs/ARCHITEKTURA.md`, `docs/ROADMAPA.md`.

## [1.0.0] – 2026-11-08
### Dodano
- Pierwsza wersja w repozytorium (jeden plik `index.html`): tryby obrazy, fragment, rzeźby 3D, pamięć eksperta, banknoty; checklista fałszerstwa; oznaczanie obiektów; bramki zoomu.
