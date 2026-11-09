# Historia zmian

Format: [Keep a Changelog](https://keepachangelog.com/pl/1.1.0/), wersje według [SemVer](https://semver.org/lang/pl/).

## [1.8.0] – 2026-11-09
### Dodano
- **Wiki eksperta** (`js/core/wiki.js`): techniki badawcze, metody fałszerskie i obiekty generowane automatycznie z danych trybów + słowniczek 27 pojęć; wyszukiwarka; dostępna z ekranu głównego i z gry.
- **Loader** przy starcie i przy przygotowywaniu partii (obrazy malowane pędzlem, scena 3D).
- **SEO:** opis i słowa kluczowe, `canonical`, Open Graph i Twitter Card z miniaturą `og-image.jpg` (zrzut ekranu startowego 1200×630), dane strukturalne JSON-LD (`VideoGame`), `robots.txt`, `sitemap.xml`, `favicon.svg`, opis gry dla robotów wyszukiwarek.
- Roadmapa: meble jako nowy rodzaj obiektu.

## [1.7.0] – 2026-11-09
### Dodano
- **Ekran główny** (`js/core/home.js`, styl w `css/style.css`): laboratorium w stylu „szklanych” paneli – kategorie z miniaturami, duży podgląd wybranego trybu generowany silnikiem gry, opis, wybór trybu, lista badań, karty postępu z odhaczaniem ukończonych trybów.
- Przycisk „☰ Menu” w grze – powrót do ekranu głównego.
- Licznik ukończonych ekspertyz i trafnych werdyktów zapisywany lokalnie w przeglądarce.

## [1.6.0] – 2026-11-09
### Dodano
- Tryb **Rzeźby z marmuru** (`js/modes/marble.js`): ślady dłuta, szpicaka i tarnika kontra ścieżki frezu CNC (widoczne z bliska), patyna w zagłębieniach, postarzanie kwasem, UV, waga, pomiar, sygnatura z tyłu cokołu; 4 metody fałszerskie.
- Opis trybu: `docs/tryby/marmur.md`.
### Zmieniono
- Silnik rzeźb 3D obsługuje warianty materiału (`SCULPT_VARIANTS`): brąz i marmur korzystają z tej samej kamery, bramek odległości i kąta oraz sceny.

## [1.5.0] – 2026-11-09
### Dodano
- Tryb **Weryfikacja rękopisów** (`js/kinds/manuscript.js`): atrament (XRF w wybranym wierszu, obwódka żelazowo-galasowa przy dużym zoomie), papier czerpany pod światło, pismo i ductus, pieczęć lakowa, korozja atramentu na odwrociu; 4 metody fałszerskie, w tym dopisek w oryginalnym dokumencie.
- Opis trybu: `docs/tryby/rekopis.md`.
- Bank pomysłów: `docs/POMYSLY.md` (z oznaczeniem, co już jest w grze).

## [1.4.0] – 2026-11-09
### Dodano
- Tryb **Weryfikacja znaczków** (`js/kinds/stamp.js`): ząbkowanie z miarką 2 cm, znak wodny w kąpieli, metoda druku (mikrodetal), guma na odwrociu, przedruk; 4 metody fałszerskie i przeróbki.
- Opis trybu: `docs/tryby/znaczek.md`.
- Roadmapa: datowanie archeologiczne oraz badania warstw malarskich, pigmentów, przemalowań i techniki wykonania (do przemyślenia).

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
