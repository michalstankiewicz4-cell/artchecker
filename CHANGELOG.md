# Historia zmian

Format: [Keep a Changelog](https://keepachangelog.com/pl/1.1.0/), wersje według [SemVer](https://semver.org/lang/pl/).

## [1.11.1] – 2026-11-09
### Poprawione
- Zawieszanie przeglądarki po wejściu do wiki: widok „odwrocie” rękopisu rozmywał każdą kreskę osobno (ok. 60 s pracy przeglądarki). Warstwa korozji jest teraz rysowana raz i rozmywana jednym przebiegiem – dotyczyło to też tego badania w samej grze.
- Ilustracje wiki są teraz gotowymi plikami JPG (`img/wiki/`, generowane skryptem `tools/build-wiki-img.py`), więc wiki otwiera się od razu i nie obciąża przeglądarki.

## [1.11.0] – 2026-11-09
### Dodane
- Wiki: rozbudowane artykuły (`js/data/wikitexts.js`) – wstęp oraz sekcje „Na czym polega”, „Co ujawnia”, „Na co uważać”, „Ciekawostka” dla technik; „Jak powstaje”, „Po czym poznać” dla metod fałszerskich; dłuższe hasła słowniczka i opisy obiektów.
- Wiki: ilustracje do każdego artykułu generowane silnikiem gry – porównanie oryginału z falsyfikatem w danym widoku (UV, IR, RTG, pod światło, światło boczne…), przybliżenia obszarów (sygnatura, ząbkowanie, przedruk itd.), obrazy artystów, rzeźby oraz schematy (widmo XRF, magnes, waga, suwmiarka, dokument, mikroskop).
- Wiki: techniki występujące w kilku trybach połączone w jeden artykuł z sekcją „W grze”; klikalne odnośniki między artykułami.
### Usunięte
- Efekty menu: drgania i aberracja napisów, migotanie paneli, migające bloki JPG i kolorowe paski (zostaje ziarno, pasmowanie tła, pulsowanie ramek i paralaksa).
### Poprawione
- Plansza ponownie dopasowuje widok „Całość”, gdy układ zmieni rozmiar zaraz po starcie partii.

## [1.10.0] – 2026-11-09
### Zmienione
- Cała gra w stylu ekranu głównego (niebieski HUD): górny pasek, okna ze ściętymi rogami, przyciski, plansza i sala 3D w granatach, niebieskie paski przewijania wszędzie.
- Nowy układ stanowiska: okno „Narzędzia” (z licznikiem zbadań wybranego obiektu), pasek „Zlecenie” (zwijany), okno „Stół badawczy” z narożnikami celownika i nazwą widoku w nagłówku.
- Prawe okno z zakładkami: Wynik badania / Checklista / Notatnik (z licznikami); wybór narzędzia przełącza na „Wynik badania”.
### Dodane
- Dok obiektów pod stołem: kafelki A–E ze stanem oznaczenia, liczbą zbadań, flagami checklisty i paskiem postępu; kliknięcie wybiera obiekt i przybliża do niego (`js/core/layout.js`).

## [1.9.1] – 2026-11-09
### Usunięte
- Linie skanowania na ekranie głównym (winieta zostaje).
- Krótkie zakłócenia obrazu w podglądzie trybu.

## [1.9.0] – 2026-11-09
### Dodane
- Efekty ekranu głównego (`js/core/homefx.js`): ziarno, artefakty kompresji JPG (bloki 8×8, przesunięcia barw, pasmowanie tła), pasy przesunięcia kolorów, aberracja chromatyczna napisów, migotanie i pulsowanie obramowań paneli, krótkie zakłócenia podglądu, linie skanowania i winieta, paralaksa podglądu. Wyłączane przy „ogranicz ruch” w systemie.
### Zmienione
- Paski przewijania dopasowane do stylu: złoto-brązowe w grze, niebieskie w menu i wiki.

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
