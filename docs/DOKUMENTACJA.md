# Dokumentacja techniczna – Human Bot

Wersja dokumentu odpowiada wersji programu **0.9.0**. Obsługę krok po kroku opisuje [INSTRUKCJA.md](INSTRUKCJA.md), a historię zmian [CHANGELOG.md](../CHANGELOG.md).

## 1. Cel

Lokalny program, który wchodzi na wskazaną stronę i wykonuje scenariusz akcji jak człowiek – pisze z ludzkim rytmem, naciska klawisze, klika, przewija, czeka – i przy każdym wejściu ma inny, losowy profil przeglądarki (odcisk). Działa wyłącznie na komputerze użytkownika i nie ma żadnego serwera w internecie.

## 2. Architektura

```
przeglądarka użytkownika ──HTTP/SSE──▶ server.mjs (127.0.0.1:3777)
   (panel: public/)                      │  pętla wejść, raporty
                                         ▼
                                  bot/visit.mjs ──Playwright──▶ Chrome / Chromium ──▶ strona docelowa
                                    │ używa: profiles.mjs, spoof.mjs, human.mjs
                                    ▼
                                  reports/*.csv, *.json
```

- **Node.js ≥ 20**, moduły ES (`"type": "module"`). Jedyna zależność to `playwright`. Serwer działa na samym `node:http`, bez frameworka.
- Bez kompilacji i bez budowania: kod uruchamia się wprost z plików.
- Serwer nasłuchuje tylko na `127.0.0.1`, więc panel jest niedostępny z sieci.

## 3. Pliki

| Plik | Rola |
|---|---|
| `server.mjs` | serwer panelu i API, pętla wejść, przerwy, zapis raportów, zdarzenia na żywo (SSE) |
| `bot/visit.mjs` | przebieg jednego wejścia: uruchomienie przeglądarki, profil, przeglądanie, testy, odczyt wyników |
| `bot/profiles.mjs` | losowanie spójnego profilu, opcje kontekstu Playwrighta, krótki opis profilu |
| `bot/spoof.mjs` | funkcja wstrzykiwana do strony przed jej skryptami (`addInitScript`) |
| `bot/human.mjs` | ruch myszy, kliknięcia, przewijanie, „czytanie” |
| `public/` | panel: `index.html` (Start/Stop na górze, przełącznik dzień/noc, zakładki Plan, Ustawienia i Statystyki, podpowiedzi `title` i znaczki [?] z `data-tip`), `app.js` (edytor scenariusza: dodawanie, kolejność ↑↓ i przeciąganie, powielanie, nagrywanie kombinacji klawiszy, walidacja przed startem, oznaczanie konfliktów z „Bez okna” (`updateConflicts`), motyw w `localStorage` pod kluczem `humanbot-theme`, tryb podglądu poza 127.0.0.1/localhost – bez `/api`, Start nieaktywny), `style.css` (motyw: `:root[data-theme=dark]` albo `prefers-color-scheme`; kolory grup zależnych `dep-a`, `dep-b`; konflikty `.conflict`) |
| `tools/check-version.mjs` | sprawdza zgodność numeru wersji we wszystkich plikach (`npm test`) |
| `tools/build-portable.ps1` | buduje wersję przenośną do `dist/` (sekcja 11) |
| `tools/release-notes.mjs` | opis release'u: instrukcja pobierania + wpis z CHANGELOG dla bieżącej wersji |
| `.github/workflows/release.yml` | automat wydań w GitHub Actions (sekcja 11) |
| `start.bat` | start serwera (Windows); używa `node\node.exe`, jeśli jest (wersja przenośna), inaczej Node.js z systemu i przy pierwszym uruchomieniu `npm install` |
| `pobierz-chromium.bat` | `playwright install chromium` tym samym Node.js co `start.bat` |

## 4. API serwera

| Metoda i ścieżka | Opis |
|---|---|
| `GET /` , `/app.js`, `/style.css` | panel |
| `GET /api/info` | `{ name, version }` z `package.json` |
| `GET /api/events` | strumień SSE: `state` (`running`, `total`, `file`), `log` (linia dziennika), `visit` (wynik wejścia) |
| `POST /api/start` | uruchamia serię; treść JSON jak niżej; `409`, gdy seria już trwa; `400` przy złym adresie |
| `POST /api/stop` | przerywa serię (`AbortController`) |
| `GET /api/reports` | lista plików CSV w `reports/` |
| `GET /reports/<plik>` | pobranie raportu |

Treść żądania `POST /api/start`:

```json
{ "url": "https://…", "visits": 5, "delayMin": 5, "delayMax": 20,
  "spoof": { "ua": true, "lang": true, "tz": true, "screen": true, "hw": true, "webgl": true, "canvas": true, "fonts": true, "prefs": true },
  "scenario": [
    { "type": "click", "selector": "#search" },
    { "type": "type", "text": "tekst\nz nową linią", "target": "page" },
    { "type": "keys", "combo": "Control+F", "times": 1, "target": "browser" },
    { "type": "scroll", "dir": "down", "px": 600 },
    { "type": "wait", "min": 1, "max": 3 },
    { "type": "noise" } ],
  "useChrome": true, "headless": false,
  "proxies": "http://user:pass@host:port\nsocks5://host:port" }
```

Ograniczenia: `visits` od 1 do 500, `delayMax ≥ delayMin`, adres musi zaczynać się od `http(s)://`. Scenariusz jest czyszczony (`cleanScenario`):
- maks. 100 akcji, nieznane typy odrzucane; puste `type.text`, `keys.combo` i `click.selector` – pomijane;
- `text` do 20 000 znaków (CRLF → `\n`), `combo` do 60 znaków w nazwach Playwrighta (`Control`, `Alt`, `Shift`, `Meta`, `Enter`, `ArrowLeft`, litery wielkie…; `Plus` → `Equal`), `times` 1–100, `px` 50–20 000, `min`/`max` 0–600 s (`max ≥ min`), `target` = `page` | `browser`;
- `headless` razem z akcją `target: "browser"` daje `400`.

## 5. Profil przeglądarki (`bot/profiles.mjs`)

Każde wejście uruchamia **nową przeglądarkę** i nowy kontekst: bez ciasteczek, pamięci podręcznej i historii. Profil jest losowany po uruchomieniu przeglądarki, bo User-Agent musi znać prawdziwą wersję Chrome'a.

| Grupa | Wartości |
|---|---|
| `ua` | system: Windows (waga 6), macOS (2) lub Linux (1). User-Agent z prawdziwą wersją główną Chrome'a albo o 1 starszą. `navigator.platform` i `userAgentData` (marki, platforma, `getHighEntropyValues`) są zgodne z wylosowanym systemem. |
| `lang` | 14 par język–strefa, np. `pl-PL` + `Europe/Warsaw`. Ustawia `navigator.languages`, `language` i nagłówek `Accept-Language` z wagami q. |
| `tz` | strefa z tej samej pary; bez `lang` losowana osobno |
| `screen` | 10 rozdzielczości (od 1280×800 do 3840×2160). Skalowanie 1–2. Okno ma 75–100% szerokości ekranu i 80–100% (wysokości − 80 px). |
| `hw` | rdzenie: 2, 4, 6, 8, 12 lub 16. Pamięć: 2, 4 lub 8 GB (więcej Chrome i tak nie podaje). |
| `webgl` | producent i model karty w formacie ANGLE, z listy dla wylosowanego systemu |
| `canvas` | ziarno szumu (32 bity) |
| `fonts` | każda z 17 czcionek sprawdzanych przez stronę jest ukrywana z prawdopodobieństwem 30% |
| `prefs` | motyw jasny lub ciemny, ograniczenie animacji (15%), `doNotTrack = "1"` (30%) |

## 6. Wstrzykiwany skrypt (`bot/spoof.mjs`)

Uruchamia się w każdej ramce przed skryptami strony:

- **`navigator`**: gettery na `Navigator.prototype` dla `platform`, `languages`, `language`, `hardwareConcurrency`, `deviceMemory` i `doNotTrack`. Dodatkowo `webdriver = false`.
- **`userAgentData`**: obiekt z markami Chromium, Google Chrome i „Not_A Brand”.
- **WebGL**: `getParameter` (WebGL 1 i 2) zwraca podmienione wartości dla `UNMASKED_VENDOR_WEBGL` (37445) i `UNMASKED_RENDERER_WEBGL` (37446).
- **Canvas**: `toDataURL` kopiuje obraz na płótno pomocnicze i zmienia najmłodszy bit w 24 punktach. Ich położenie wyznacza ziarno, więc szum jest stały w obrębie wizyty. Przezroczysty piksel dostaje alfa 1, żeby zmiana była widoczna w danych.
- **Czcionki**: `measureText` sprawdza pierwszą rodzinę w `ctx.font`. Jeśli to czcionka ukryta, mierzy tekst czcionką zapasową. Działa także dla nazw bez cudzysłowów, bo przeglądarka sama zdejmuje cudzysłowy z `font`.

Do tego Playwright ustawia sam: `userAgent`, `locale`, `timezoneId`, `viewport`, `screen`, `deviceScaleFactor`, `colorScheme`, `reducedMotion` oraz `extraHTTPHeaders`. Przeglądarka startuje z flagą `--disable-blink-features=AutomationControlled`.

**Wykrywalność:** podmienione funkcje nie udają kodu natywnego (`Function.prototype.toString`). Niektóre cechy mogą też sobie przeczyć, np. system macOS z czcionkami z Windowsa albo Windows z rendererem SwiftShader w trybie bez okna.

## 7. Ruch i przebieg wejścia

### `bot/human.mjs`
- **`moveTo`**: krzywa Béziera 3. stopnia, której punkty kontrolne są odchylone od prostej o rozkład normalny z σ równym 12% odległości.
  - Czas ruchu to (180 + 110·log₂(1 + d/12)) ms × losowy mnożnik 0,8–1,25, czyli w stylu prawa Fittsa.
  - Krok co 9–14 ms z rozrzutem ±40%, prędkość ease-in-out, drżenie σ = 0,6 px.
  - Przy ruchach dłuższych niż 250 px, z prawdopodobieństwem 30%, kursor przestrzeli cel o 6–18 px, a potem wraca z korektą.
  - Współrzędne są ograniczone do okna.
- **`click`**: odchylenie od celu σ = 3 px, pauza 60–220 ms, przytrzymanie przycisku 50–140 ms.
- **`clickEl`**: najpierw przewija do elementu, potem klika w losowy punkt środkowej części elementu.
- **`scroll`**: porcje kółka po 60–140 px. Z prawdopodobieństwem 15% robi pauzę 0,3–0,9 s, a z prawdopodobieństwem 25% na końcu cofa się o kawałek.
- **`idle`**: drobne ruchy kursora co 0,3–0,9 s.
- **`typeText`**: pisanie znak po znaku.
  - Odstęp przed znakiem: log-normalny, mediana 150 ms, σ = 0,45; ×0,7 dla częstych par liter (lista ok. 35 par polskich i angielskich); ×1,25 po spacji; +150–450 ms po `.,;:!?`; +300–900 ms po nowej linii; +40–120 ms przed wielką literą (Shift); z prawdopodobieństwem 3% dodatkowe 0,5–1,5 s „namysłu”; górny limit 2,5 s.
  - Przytrzymanie klawisza 50–130 ms. Znaki ASCII – `keyboard.press`. Inne (np. `ą`, `Ż`) – bezpośrednio przez CDP `Input.dispatchKeyEvent` (keyDown z `text` + keyUp) z kodem klawisza jak w układzie „polski programisty” (`ą` → `KeyA`, `ź` → `KeyX` itd.), Shift dla wielkich; bez Ctrl/Alt, bo wtedy Chrome traktuje to jak skrót i nie wstawia znaku. Gdy CDP zawiedzie – `keyboard.insertText`.
  - `\n` = Enter, `\t` = Tab. Zwraca `{ chars, ms }`.

### `bot/visit.mjs`
1. Start Chrome'a (`channel: "chrome"`). Jeśli się nie da, start wbudowanego Chromium. Opcjonalnie przez proxy.
2. Losowanie profilu i utworzenie kontekstu z wstrzykiwanym skryptem.
3. `goto` strony i chwila „czytania”.
4. Scenariusz – akcje po kolei (`ACTIONS`), z przerwą 0,2–0,6 s między nimi:
   - `type`: jeśli `document.activeElement` jest polem edycyjnym (input tekstowy, textarea, contenteditable) – pisze w nie, inaczej klika w pierwsze widoczne pole tekstowe; `typeText`; sumuje `typedChars` i `typingMs`;
   - `keys`: `keyboard.press(combo)` × `times` (odstęp 120–380 ms, przytrzymanie 50–130 ms), potem czekanie na `load` (do 10 s);
   - `click`: czeka do 10 s na widoczny element, `clickEl`, potem `load`;
   - `scroll`: `scroll(±px)`; `wait`: `idle(losowo min–max)`;
   - `noise` („Szum”): 3–6 rund: `idle` 1,2–3,5 s; z prawdopodobieństwem 35% najechanie myszą (`moveTo`, bez kliknięcia) na losowy widoczny w oknie `a`, `h1`–`h3` lub `button` i pauza 0,3–0,9 s; potem `scroll` w dół o 250–800 px (15% – w górę o 150–500 px);
   - `target: "browser"` – **jeszcze niepodłączone**: akcja pomijana z wpisem w dzienniku;
   - błąd akcji: pierwszy trafia do `actionError`, każdy do dziennika; wejście idzie dalej. `actionsDone` liczy udane akcje.
5. Zamknięcie przeglądarki. Każdy błąd trafia do pola `error` i nie przerywa serii.

**Niezależność od strony:** bot nie zakłada niczego o stronie docelowej – akcje scenariusza działają na dowolnej stronie (pola tekstowe wykrywa po typie elementu, elementy do kliknięcia wskazuje użytkownik selektorem).

## 8. Raporty

Pliki `reports/wejscia-RRRR-MM-DD-GG-MM-SS.{csv,json}` (czas UTC) są zapisywane po każdym wejściu.

**CSV** (UTF-8 z BOM, separator `;`), kolumny:

| Kolumna | Znaczenie |
|---|---|
| `n`, `start`, `ms` | numer wejścia, czas rozpoczęcia (ISO), czas trwania w ms |
| `error` | błąd lub puste |
| `proxy` | użyte proxy (hasło zamaskowane) |
| `summary` | krótki opis profilu |
| `actions`, `actionsDone`, `actionError` | liczba akcji w scenariuszu, ile się udało, pierwszy błąd akcji |
| `typedChars`, `typingMs`, `cpm` | wpisane znaki (suma ze wszystkich akcji „Pisz tekst”), czas pisania (ms), tempo (znaki/min) |
| `os`, `userAgent`, `languages`, `timezone` | wylosowany system, User-Agent, języki, strefa czasowa |
| `screen`, `scale`, `viewport` | rozdzielczość ekranu, skalowanie, rozmiar okna |
| `cores`, `memoryGB`, `webgl` | rdzenie, pamięć, karta graficzna (WebGL) |
| `canvasSeed`, `hiddenFonts`, `colorScheme` | ziarno szumu canvas, ukryte czcionki, motyw |

Kolumny cech są puste, gdy dana grupa była odznaczona w „Co zmieniać przy każdym wejściu” (przeglądarka miała wtedy swoje prawdziwe wartości).

**JSON**: `{ config, records }`.
- `config` zawiera ustawienia serii i `version` programu.
- Każdy rekord ma dodatkowo pełny `profile` (z ziarnem `seed`) i `browser` (wersję przeglądarki).

## 9. Wersjonowanie

- Numeracja według [SemVer](https://semver.org/lang/pl/) `MAJOR.MINOR.PATCH`:
  - **PATCH** dla poprawek;
  - **MINOR** dla nowych funkcji zgodnych wstecz;
  - **MAJOR** dla zmian niezgodnych z wcześniejszymi raportami lub API.
- **Jedno źródło wersji:** pole `version` w `package.json`. Serwer czyta je przy starcie i pokazuje w konsoli, w panelu (`/api/info`) i w `config.version` raportu JSON.
- Ten sam numer musi stać w `README.md`, `docs/DOKUMENTACJA.md`, `docs/INSTRUKCJA.md` i jako najnowszy wpis w `CHANGELOG.md`. Pilnuje tego `npm test` (`tools/check-version.mjs`), który zwraca błąd przy niezgodności.
- Wydania dla innych osób: sekcja 11.
- Release tylko na wyraźną prośbę autora (sekcja 11).
- Każda zmiana: podniesienie wersji, wpis w `CHANGELOG.md`, aktualizacja dokumentów, których zmiana dotyczy, `npm test` i commit z numerem wersji w opisie.

## 10. Testowanie

- `npm test`: zgodność wersji.
- Próba ręczna: `start.bat`, w panelu adres dowolnej strony z wyszukiwarką, scenariusz „Kliknij w element” (pole szukania) → „Pisz tekst” → „Naciśnij klawisze: Enter”, 2 wejścia. Oczekiwane: w dzienniku opis każdej akcji, w tabeli 3/3 akcji i tempo pisania, dwa różne profile i raport w `reports/`.
- Próba bez Chrome'a: odznaczone „Użyj zainstalowanego Chrome'a” i zaznaczone „Bez okna”.

## 11. Wydania (Releases) i wersja przenośna

Podgląd panelu: `.github/workflows/static.yml` przy każdym wypchnięciu na `main` publikuje sam folder `public/` na GitHub Pages (<https://michalstankiewicz4-cell.github.io/webbot/>). Tam panel działa w trybie podglądu – bez serwera, Start nieaktywny; bota uruchamia się tylko lokalnie.


- Wersja przenośna to ZIP `webbot-X.Y.Z-windows-portable.zip` z kodem programu, `node_modules` (`npm install --omit=dev`), całą dokumentacją (wszystkie pliki `.md` z głównego folderu i folder `docs/`) i `node\node.exe` z licencją Node.js (`node\LICENSE`). Nie zawiera przeglądarki: używa zainstalowanego Chrome'a, a bez niego Chromium pobranego przez `pobierz-chromium.bat` (do `%LOCALAPPDATA%\ms-playwright`).
- Budowa na Windowsie z Node.js: `powershell -ExecutionPolicy Bypass -File tools\build-portable.ps1` → `dist\webbot-X.Y.Z-windows-portable.zip` (folder `dist/` nie trafia do repo). Do paczki trafia `node.exe`, którym uruchomiono skrypt.
- **Wydanie automatem (zalecane):** w repozytorium zakładka *Actions* → „Wydanie” → *Run workflow* (gałąź `main`). Automat na Windowsie w chmurze GitHuba:
  1. instaluje Node.js 24 i uruchamia `npm test` (zgodność wersji);
  2. przerywa, jeśli release `vX.Y.Z` dla wersji z `package.json` już istnieje;
  3. buduje paczkę `tools/build-portable.ps1` (z Node.js 24 i jego licencją);
  4. tworzy opis `tools/release-notes.mjs`;
  5. publikuje release `vX.Y.Z` z ZIP-em; tag tworzy GitHub na commicie, z którego zbudowano paczkę.
- **Wydanie ręczne** (bez automatu): `build-portable.ps1` lokalnie, `node tools/release-notes.mjs > opis.md`, a potem na GitHubie *Releases → Draft a new release*, tag `vX.Y.Z`, opis i ZIP.
- Lokalnie tagów nie tworzymy. Release wydajemy **tylko na wyraźną prośbę autora** – nie przy każdej zmianie wersji.
