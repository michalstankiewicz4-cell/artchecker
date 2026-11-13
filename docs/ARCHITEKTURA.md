# Architektura

Gra działa bez kroku budowania: `index.html` ładuje klasyczne skrypty w ustalonej kolejności.
Zmienne najwyższego poziomu (`let`/`const`) są wspólne dla wszystkich skryptów, więc **kolejność `<script>` w `index.html` ma znaczenie**.

```
index.html            szkielet strony, meta SEO/Open Graph, lista skryptów
og-image.jpg, favicon.svg, robots.txt, sitemap.xml – pliki dla wyszukiwarek i udostępniania
css/style.css         wygląd
js/version.js         numer wersji (semver)
js/core/              rdzeń niezależny od trybu
  util.js             losowanie z ziarnem, gradienty, geometria, toast
  state.js            stan gry (MODE, P – obiekty na stole, sel, tool, widok)
  tools.js            definicje narzędzi obrazów i zestawy narzędzi trybów
  panel.js            prawy panel: narzędzie, notatnik, checklista
  board2d.js          plansza 2D: render, zoom/pan, bramki zoomu, warstwa mikrodetali
  layout.js           układ stanowiska: zakładki prawego okna, dok obiektów, zwijane zlecenie
  game.js             oznaczenia, werdykt, nowa partia, przyciski
  home.js             ekran główny: kategorie, podgląd trybu, postęp (localStorage), loader
  homefx.js           efekty menu: ziarno, pasmowanie tła (JPG), paralaksa
  wiki.js             wiki eksperta: artykuły z danych trybów + słowniczek (GLOSS), ilustracje generowane w piaskownicy
js/data/              dane: pigmenty, podobrazia (supports.js – SUP), realart.js – dzieła prawdziwe, wikitexts.js – teksty wiki, wikiimg.js – manifest ilustracji
js/lab/               kod z GameLaboratory: artkit.js (ArtKit)
img/wiki/             gotowe ilustracje wiki (JPG)
tools/                build-wiki-img.py, build-thumbs.py, build-real.py, build-stamps.py, build-manuscript.py, build-models.mjs, probe.sh, real-art.txt, doctor-3d.py
js/real/              dane prawdziwych dzieł i obiektów jako skrypty (REALIMG – obrazy JPEG/PNG w data URL, REALMODEL – skany 3D); ładowane na żądanie
img/real/             źródłowe zdjęcia z Wikimedia Commons (manifest.json z autorem i licencją)
.github/workflows/    fetch-art.yml (dzieła, znaczki, karty rękopisu), fetch-models.yml (skany rzeźb), probe.yml (rozpoznanie źródeł)
js/paint/             silnik obrazów: kształty (scenes.js), widoki (UV, IR, RTG…), obserwacje, próbki; obrazem bazowym jest zawsze dzieło prawdziwe (js/core/real.js)
js/core/kinds.js      rejestr obiektów 2D + wspólne nachylenie i tworzenie partii
js/kinds/             rodzaje obiektów 2D (banknot, moneta, znaczek, rękopis – Manuskrypt Wojnicza, prace na papierze: artworks.js)
js/modes/             tryby gry o własnej mechanice (fragment, pamięć, rzeźby 3D + warianty materiału: marble.js; realsculpt.js – prawdziwe skany 3D)
js/main.js            start – ładowany jako ostatni
docs/                 dokumentacja
```

## Pojęcia
- **Obiekt** (`P[i]`) – rzecz na stole: obraz, banknot, rzeźba… Ma `letter`, `orig` (czy autentyczny), `profile` (metoda fałszerska), `t` (zestaw „zdrad” – które badania go demaskują), `m` (warianty zdrad), `notes` (notatnik), `check` (checklista gracza – obiekt z co najmniej jednym zaznaczonym sygnałem jest uznany za fałszywy, `flagged(p)` w `js/core/game.js`), `umark` (dawne ręczne oznaczenie – przyciski usunięte w 1.21.0, pole zostaje puste).
- **Narzędzie** – definicja z `name`, `view` (widok planszy), `gate` (warunek zapisu obserwacji: zoom, obszar, nachylenie), `hint`.
- **Bramka** – obserwacja zapisuje się dopiero, gdy spełniony jest warunek (np. zoom ≥ ×8 i środek widoku na mikrodruku).
- **Profil** – metoda fałszerska: `core` (zawsze zdradza), `opt` (losowo), opcjonalnie warianty.

## Jak dodać nowy tryb
1. Utwórz plik w `js/modes/` z danymi, profilami, funkcją tworzącą partię i obserwacjami.
2. Dopisz `<script>` w `index.html` przed `js/core/game.js`.
3. Dodaj pozycję w menu trybów i wpis w `CHANGELOG.md`, podbij `js/version.js`.
Menu buduje `js/main.js` (stała `MENU`); rodzaje z rejestru trafiają do grupy „Obiekty” automatycznie.

## Rejestr obiektów 2D
Obiekt, przy którym gracz klasyfikuje każdy egzemplarz (prawdziwy / falsyfikat), dodaje się jednym plikiem w `js/kinds/`:

```js
registerKind({
  id:'coin', label:'Weryfikacja monet', noun:'Moneta',
  W:640, H:320, wcm:12.8,          // rozmiar w jednostkach planszy i szerokość w cm (skala 1 cm)
  tilt:false, focusLabel:'Rant',   // suwak nachylenia; nazwa przycisku przybliżenia
  defs:{...}, sets:[[grupa,[id…]]],// narzędzia (name, view, gate:{z,area,tilt}, probe, hint)
  profiles:{ id:{name, core:[…], opt:[…], modes:{…}} },
  newGame(r){ kindBatch(this, r, p => {/* pola egzemplarza */}) },
  view(p,v)   → canvas IW×IH dla widoku v (użyj kView do buforowania),
  live(p)     → (opcj.) rysowanie na żywo w widoku „normal”, np. przy dużym zoomie,
  area(p,area,v) → czy środek widoku leży w obszarze bramki,
  obs(p,id), why(p,id) → obserwacja i wyjaśnienie zdrady,
  probe(p,lx,ly,id) → (opcj.) kliknięcie sondą, panel(p,id) → (opcj.) HTML w panelu,
  focus(p) → [x,y,w,h] dla przycisku przybliżenia, intro, caseText(),
  originals(r) → (opcj.) liczba oryginałów w partii, group:'art' → (opcj.) tryb w grupie „Obrazy”
});
```
Potem dopisz `<script src="js/kinds/…">` w `index.html` (przed `js/core/game.js`).

## Lampa ruchoma (`js/core/board2d.js`)
Widoki z `LAMPV` (`uv`, `raking`, `trans`, `ir`) rysują się tylko w kręgu za kursorem (`LAMP.R` px na ekranie, Shift + kółko zmienia, zapis `artchecker.lampR` w localStorage); reszta obiektu to widok dzienny przyciemniony kolorem `LAMPV[v].dim`. Przełącznik `LAMP.on` (przycisk „Lampa ruchoma / Cały obiekt”).
Światło boczne liczone jest na żywo z mapy wysokości: `makeRaking` (obrazy) i `embossFrom` (obiekty 2D) zapisują w obiekcie `p._rel` (`relPack`: wysokość i jasność jako `Uint8Array`), a `lampRaking` oświetla piksele kręgu z kierunku lampy. Obiekt bez `p._rel` pokazuje w kręgu gotowy widok.

## Podobrazia obrazów
`SUP` w `js/data/supports.js` (`canvas`, `wood`, `copper`), artysta ma pole `sup` (domyślnie płótno), `supOf()` zwraca podobrazie bieżącej partii. Zależą od niego: odwrocie (`makeBackWood`, `makeBackCopper` z fakturą ArtKit przez `supTex`), RTG (`xraySupport`), teksty obserwacji, katalogu, certyfikatu i zlecenia, nazwy metod (`profName`) i dobór profili (na miedzi bez giclée i starego podobrazia). Fragment i pamięć losują tylko obrazy na płótnie.

## Loader
`withLoader(fn, tekst)` (`js/core/home.js`) – nowa partia (`runNewGame`) i pierwsze przygotowanie widoku badania (`js/core/panel.js`, gdy któryś obiekt nie ma jeszcze widoku w `p.views`).

## Planowane tryby (wkrótce)
Aukcja, Śledztwo i Konserwator są w menu jako nieaktywne. Każdy będzie osobnym plikiem w `js/modes/` – opis w `docs/ROADMAPA.md`.

## Ilustracje wiki
Ilustracje artykułów wiki są gotowymi plikami w `img/wiki/` z manifestem `js/data/wikiimg.js`. Po zmianie wyglądu obiektów lub dodaniu artykułów uruchom `python3 tools/build-wiki-img.py` (playwright + Chrome) – skrypt wygeneruje je silnikiem gry. Artykuł bez pliku generuje ilustrację w przeglądarce w locie.

## Kod z GameLaboratory
`js/lab/` – kod skopiowany z repozytorium GameLaboratory (laboratorium sztuki i modeli). `artkit.js` to ArtKit (obrazy 2D: techniki, podłoża, formaty, widoki), zamieniony z modułu ES na zwykły skrypt (`window.ArtKit`). Rzeźby 3D to prawdziwe skany (`js/modes/realsculpt.js`, `js/real/model-*.js`, `tools/build-models.mjs`). Logikę zmienia się w laboratorium i kopiuje tutaj ponownie.

## Doktor modeli 3D
`python3 tools/doctor-3d.py /ścieżka/do/GameLaboratory` – sprawdza popiersia 3D doktorem modeli z laboratorium (`tools/doctor/modeldoctor.js`, Three.js r186 z laboratorium). Kończy się kodem 1, gdy są błędy. Po każdej zmianie geometrii rzeźb uruchom go ponownie.

## Prawdziwe dzieła (domena publiczna)
Lista: `tools/real-art.txt` (`slug|nazwa pliku w Wikimedia Commons`). Akcja GitHub `.github/workflows/fetch-art.yml` (uruchamiana ręcznie: Actions → „Pobierz prawdziwe dzieła” → Run workflow) pobiera pliki z Commons, zmniejsza je do 1000 px (JPEG) i zapisuje w `img/real/` z `manifest.json` (autor, data, licencja, źródło). Pobieranie idzie przez GitHub, bo środowisko, w którym powstaje kod, nie ma dostępu do serwerów z obrazami.

Dane dzieł: `js/data/realart.js` (`REAL`). Obsługa w grze: `js/core/real.js` – `REAL_READY` (dzieła już włączone do gry, dodawane po kolei), `fillArtist` (grupa na liście „Artysta”, wartości `real:<slug>`), `resolveReal` (ładuje `js/real/<slug>.js` i obraz, ustawia `REAL_CUR`), `realArtist` i `realScene` (scena z obrazu: oryginał rysuje reprodukcję, zdrady stylu przesuwają lub odbijają fragment `style`, IR rysuje krawędzie jako rysunek przygotowawczy). Wiki tworzy z `REAL_READY` kategorię „Dzieła prawdziwe”.

## Języki (PL / EN)
`js/core/i18n.js` (ładowany zaraz po `version.js`): `LANG` (`?lang=` > `localStorage['artchecker.lang']` > język przeglądarki), słownik `EN` (klucz = tekst polski), `tr(s)` do użycia w kodzie, obserwator DOM, który tłumaczy każdy węzeł tekstowy i atrybut (`title`, `placeholder`, `label`, `alt`) o treści zgodnej z kluczem słownika. Długie bloki HTML (okno „O programie”) mają wersje `data-l="pl"` i `data-l="en"`, CSS pokazuje tę dla `html[lang]`. Słowniki są w `js/i18n/en-*.js` (`trAdd({...})`). `trText` tłumaczy: 1) cały tekst, 2) wzorce – klucz z `{0}`, `{1}` (wartość nie obejmuje dwukropka ani nowej linii, wartość też jest tłumaczona, jeśli jest w słowniku), 3) frazy od najdłuższych z granicą słowa. Nowy tekst w grze: dopisz tłumaczenie do słownika (dla tekstu z wartościami – wzorzec). Tekst rysowany na canvasie przepuść przez `tr()`. Kontrola: test, który przechodzi wszystkie tryby i badania w EN i wypisuje linie z polskimi znakami lub słowami. Przełącznik (`.langbtn`) zapisuje wybór i przeładowuje stronę. Wiki EN: angielskie teksty haseł w `js/i18n/en-wiki-*.js` (`WT_EN`, `GLOSS_EN`, `WGLOSS_EN`, `WOBJ_EN`, `WART_EN`), a `wikiData()` w EN zamienia tytuły i treść przez `tr`/`trHTML`, zostawiając polski tytuł w `key` (obrazy `img/wiki`, linki). SEO: statyczny `<head>` po angielsku, `hreflang` dla `?lang=en` i `?lang=pl`.

## Styl (design system)
„Luxury Museum Laboratory” – zmienne w ostatniej sekcji `css/style.css` (`--c-bg`, `--c-panel`, `--c-steel`, `--c-gold`, `--c-agold`, `--c-brass`, `--c-burg`, `--c-ink`, `--c-mut`, `--c-ok`, `--c-info`, `--shadow-panel`, `--shadow-gold`, `--border-gold`, `--border-steel`, `--metal`, `--glass`, `--gold-grad`). Złoto tylko dla ważnych elementów (aktywna sekcja, główne przyciski `.btn.primary`/`.hbtn.gold`/`#hstart`, ramy obrazów, liczniki). Kolory rysowane na canvasie (stół, scena 3D, ikony wiki) dobierz z tej palety.
