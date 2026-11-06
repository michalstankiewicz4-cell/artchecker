# Historia zmian

Format: [Keep a Changelog](https://keepachangelog.com/pl/1.1.0/), numeracja: [SemVer](https://semver.org/lang/pl/). Najnowsza wersja na górze.

## [0.3.0] – 2026-11-06

### Dodane
- Wersja przenośna dla Windowsa (`webbot-X.Y.Z-windows-portable.zip` w Releases na GitHubie): kod, zależności, Node.js i cała dokumentacja (wszystkie pliki `.md`) w jednym ZIP-ie – rozpakuj i uruchom `start.bat`, bez instalowania czegokolwiek.
- `tools/build-portable.ps1` – budowa tej paczki.
- `pobierz-chromium.bat` – pobranie Chromium, gdy nie ma Google Chrome'a.

### Zmienione
- `start.bat` używa `node\node.exe` z wersji przenośnej, jeśli jest; bez Node.js pokazuje, skąd go wziąć.
- Instrukcja i README: pobieranie z Releases; dokumentacja: sekcja 11 o wydaniach.

## [0.2.0] – 2026-11-06

### Dodane
- Numer wersji w panelu obok nazwy, w konsoli przy starcie i w raporcie JSON (`config.version`); jedynym źródłem jest `package.json` (`GET /api/info`).
- Dokumentacja techniczna `docs/DOKUMENTACJA.md` i instrukcja obsługi `docs/INSTRUKCJA.md`.
- Ta historia zmian.
- `npm test` sprawdza, czy numer wersji zgadza się we wszystkich plikach (`tools/check-version.mjs`).
- Zasady pracy nad projektem w `CLAUDE.md`.

## [0.1.0] – 2026-11-06

### Dodane
- Panel w przeglądarce (`127.0.0.1:3777`) z ustawieniami, tabelą wejść i dziennikiem na żywo.
- Nowa przeglądarka i losowy, spójny profil przy każdym wejściu: system i User-Agent, język ze strefą czasową, ekran, rdzenie i RAM, karta graficzna (WebGL), szum na płótnie, ukrywanie części czcionek, motyw i preferencje.
- Ludzki ruch myszy (krzywe, przyspieszanie, drżenie, przestrzelenia), kliknięcia z przytrzymaniem, przewijanie z przerwami.
- Przeglądanie losowych zakładek, wykonanie testu „Człowiek czy bot” i odcisku przeglądarki na stronie „Cyfrowy odcisk człowieka”, odczyt wyników.
- Proxy z listy, po kolei przy kolejnych wejściach.
- Raporty CSV i JSON w `reports/`, zapisywane po każdym wejściu.
- `start.bat` – instalacja i uruchomienie jednym kliknięciem.
